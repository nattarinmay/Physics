import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const rooms = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/api/health", (_, res) => res.json({ok:true, rooms: rooms.size}));

function code() {
  return randomBytes(3).toString("hex").toUpperCase();
}
function publicRoom(r) {
  return {code:r.code, host:r.host, players:[...r.players.values()].map(p=>({id:p.id,name:p.name,score:p.score,ready:p.ready})), question:r.question, round:r.round, totalRounds:r.totalRounds, started:r.started, status:r.status};
}
function broadcast(r) {
  const msg = JSON.stringify({type:"room", room:publicRoom(r)});
  for (const p of r.players.values()) if (p.ws.readyState===1) p.ws.send(msg);
}
function questionFor(r) {
  const q = r.questions[r.round % r.questions.length];
  r.question = {id:q.id,text:q.text,choices:q.choices,topic:q.topic,time:15};
}
function nextRound(r) {
  r.answers = new Map();
  r.round++;
  if (r.round >= r.totalRounds) {
    r.status = "finished";
    r.started = false;
    return;
  }
  questionFor(r);
}

wss.on("connection", ws => {
  let player = null, room = null;
  ws.on("message", raw => {
    let m;
    try { m = JSON.parse(raw); } catch { return; }

    if (m.type === "create") {
      let c; do c=code(); while(rooms.has(c));
      room = {code:c, host:null, players:new Map(), round:0,totalRounds:8,started:false,status:"lobby",answers:new Map(),
        questions:QUESTIONS};
      player = {id:randomBytes(4).toString("hex"),name:String(m.name||"Player 1").slice(0,24),score:0,ready:false,ws};
      room.host=player.id; room.players.set(player.id,player); rooms.set(c,room);
      ws.send(JSON.stringify({type:"joined",playerId:player.id,room:publicRoom(room)})); broadcast(room);
    }

    if (m.type === "join") {
      room=rooms.get(String(m.code||"").toUpperCase());
      if (!room || room.players.size>=10) return ws.send(JSON.stringify({type:"error",message:"ไม่พบห้องหรือห้องเต็ม"}));
      player={id:randomBytes(4).toString("hex"),name:String(m.name||"Player").slice(0,24),score:0,ready:false,ws};
      room.players.set(player.id,player);
      ws.send(JSON.stringify({type:"joined",playerId:player.id,room:publicRoom(room)})); broadcast(room);
    }

    if (m.type === "ready" && room && player) {
      player.ready=!!m.ready;
      const all=[...room.players.values()];
      if (all.length>=2 && all.every(p=>p.ready)) {
        room.started=true; room.status="playing"; room.round=0; room.answers=new Map(); questionFor(room);
      }
      broadcast(room);
    }

    if (m.type === "answer" && room && player && room.started) {
      if (room.answers.has(player.id)) return;
      const q=room.questions[room.round % room.questions.length];
      const correct = Number(m.choice)===q.answer;
      room.answers.set(player.id,{correct,at:Date.now()});
      if (correct) player.score += 100 + Math.max(0, 50 - Math.floor((Date.now() - (room.startedAt||Date.now()))/1000)*5);
      const needed=Math.min(2,room.players.size);
      if (room.answers.size>=needed) setTimeout(()=>{ if(room.status==="playing"){ nextRound(room); broadcast(room); }},700);
      broadcast(room);
    }

    if (m.type==="leave" && room && player) {
      room.players.delete(player.id); broadcast(room);
      if(room.players.size===0) rooms.delete(room.code);
    }
  });
  ws.on("close",()=>{ if(room&&player){room.players.delete(player.id); broadcast(room); if(room.players.size===0)rooms.delete(room.code);} });
});

const QUESTIONS = [
  {id:"e1",topic:"แรงไฟฟ้า",text:"ประจุ +2 μC และ +3 μC อยู่ห่างกัน 0.30 m แรงระหว่างประจุเป็นอย่างไร?",choices:["ดูดเข้าหากัน","ผลักออกจากกัน","ไม่มีแรง","ขึ้นกับมวล"],answer:1},
  {id:"e2",topic:"แรงไฟฟ้า",text:"ถ้าเพิ่มระยะห่างระหว่างประจุเป็น 2 เท่า ขนาดแรงคูลอมบ์จะเป็นเท่าใดของเดิม?",choices:["2 เท่า","1/2 เท่า","1/4 เท่า","4 เท่า"],answer:2},
  {id:"e3",topic:"สนามไฟฟ้า",text:"สนามไฟฟ้า ณ จุดหนึ่งมีทิศเดียวกับแรงบนประจุชนิดใด?",choices:["ประจุบวกทดสอบ","ประจุลบทดสอบ","ทุกประจุ","ไม่มีทิศ"],answer:0},
  {id:"m1",topic:"แรงแม่เหล็ก",text:"ประจุบวกเคลื่อนที่ขนานกับสนามแม่เหล็ก B แรงแม่เหล็กมีขนาดเท่าใด?",choices:["มากที่สุด","เป็นศูนย์","เท่ากับ qB","เท่ากับ B/q"],answer:1},
  {id:"m2",topic:"แรงแม่เหล็ก",text:"สูตรขนาดแรงแม่เหล็กบนประจุเคลื่อนที่คือข้อใด?",choices:["F=qE","F=kq₁q₂/r²","F=qvB sinθ","F=mg"],answer:2},
  {id:"m3",topic:"แรงแม่เหล็ก",text:"ลวดมีกระแส I ตั้งฉากกับสนาม B แรงแม่เหล็กบนลวดมีขนาดเท่าใด?",choices:["IL/B","BIL","BI/L","I/B L"],answer:1},
  {id:"mix1",topic:"ประยุกต์",text:"อนุภาคมีประจุลบเคลื่อนที่เข้าสู่สนามแม่เหล็ก ทิศแรงหาได้จากอะไร?",choices:["กฎมือขวาแล้วกลับทิศสำหรับประจุลบ","กฎของโอห์ม","กฎมือซ้ายเสมอ","ใช้เฉพาะขนาด v"],answer:0},
  {id:"mix2",topic:"ประยุกต์",text:"แรงแม่เหล็กจะมากที่สุดเมื่อมุมระหว่าง v และ B เป็นเท่าใด?",choices:["0°","30°","60°","90°"],answer:3}
];

const port = process.env.PORT || 5173;
server.listen(port, "0.0.0.0", () => console.log(`Physics Force Lab running on ${port}`));