import "./style.css";
import {lessons,videos,quiz} from "./data.js";

function stored(key,fallback){
 try{return localStorage.getItem(key)??fallback}catch{return fallback}
}
function storedJson(key,fallback){
 try{const value=JSON.parse(stored(key,""));return Array.isArray(value)?value:fallback}catch{return fallback}
}

const state={page:"home",name:stored("pf-name",""),xp:Number(stored("pf-xp",0))||0,scores:storedJson("pf-scores",[]),room:null,playerId:null,ws:null,pending:[],video:null,videoTimer:null};
const $=s=>document.querySelector(s);
const save=()=>{localStorage.setItem("pf-name",state.name);localStorage.setItem("pf-xp",state.xp);localStorage.setItem("pf-scores",JSON.stringify(state.scores))};
const level=()=>Math.floor(state.xp/300)+1;
function nav(page){state.page=page;render()}
function addXP(n){state.xp+=n;save();}

function render(){
 document.querySelector("#app").innerHTML=`
 <header class="top"><div class="brand" onclick="window.go('home')"><span>⚡</span><div><b>Physics Force Lab</b><small>แรงทางไฟฟ้า × แรงแม่เหล็ก</small></div></div>
 <nav>${["home","lessons","videos","quiz","games","progress"].map((p,i)=>`<button class="${state.page===p?'active':''}" onclick="window.go('${p}')">${["หน้าหลัก","บทเรียน","วิดีโอ","แบบทดสอบ","เกม","พัฒนาการ"][i]}</button>`).join("")}</nav>
 <div class="profile">${state.name?`👤 ${esc(state.name)} · Lv.${level()}`:""}</div></header>
 <main>${pages[state.page]()}</main>`;
 bind();
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
window.go=nav;

const pages={
home:()=>`<section class="hero"><div><span class="eyebrow">HIGH SCHOOL PHYSICS • INTERACTIVE LAB</span><h1>เข้าใจ “แรง” ด้วยการเรียน<br><em>ดู → คิด → ทดลอง → แข่งขัน</em></h1><p>สื่อการเรียนรู้เรื่องแรงทางไฟฟ้าและแรงแม่เหล็กสำหรับระดับมัธยมศึกษาตอนปลาย พร้อมวิดีโอ YouTube แบบมีคำถามแทรก และเกมเดี่ยว/แข่งขันหลายคน</p><div class="actions"><button class="primary" onclick="window.go('lessons')">เริ่มเรียนรู้ →</button><button class="ghost" onclick="window.go('games')">เข้าสู่สนามแข่ง</button></div></div><div class="orb"><div>⚡</div><span>F = k|q₁q₂|/r²</span><span>F = |q|vB sinθ</span></div></section>
<section class="grid3"><article class="card"><b>📚 5 บทเรียน</b><p>ตั้งแต่กฎของคูลอมบ์ถึงแรงลอเรนซ์</p></article><article class="card"><b>🎥 Interactive Video</b><p>หยุดวิดีโอแล้วตอบคำถามตามเวลา</p></article><article class="card"><b>🎮 Multiplayer</b><p>เล่นคนเดียว 2 คน หรือห้องแข่งขันสูงสุด 10 คน</p></article></section>
<section class="welcome card"><h2>ก่อนเริ่มเรียน</h2><p>ใส่ชื่อเพื่อให้ระบบบันทึก XP และผลการฝึกบนเครื่องนี้</p><div class="row"><input id="studentName" placeholder="ชื่อเล่น/ชื่อผู้เรียน" value="${esc(state.name)}"><button class="primary" id="saveName">บันทึกชื่อ</button></div></section>`,

lessons:()=>`<div class="pagehead"><span class="eyebrow">LESSON</span><h1>บทเรียนแรงทางไฟฟ้าและแรงแม่เหล็ก</h1><p>เนื้อหาแบบสั้น กระชับ พร้อมสูตรและจุดที่ต้องระวัง</p></div><div class="lesson-grid">${lessons.map(l=>`<article class="lesson card" onclick="window.openLesson('${l.id}')"><div class="icon">${l.icon}</div><span>${l.tag}</span><h2>${l.title}</h2><p>${l.summary}</p><code>${l.formula}</code><button class="ghost">เรียนบทนี้ →</button></article>`).join("")}</div>`,

videos:()=>`<div class="pagehead"><span class="eyebrow">WATCH & THINK</span><h1>วิดีโอแบบมีคำถามแทรก</h1><p>วิดีโอฝังจาก YouTube และมีจุดหยุดเพื่อให้ผู้เรียนคิดก่อนดูต่อ</p></div><div class="video-grid">${videos.map(v=>`<article class="card video-card"><div class="thumb"><img src="https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg"><button onclick="window.playVideo('${v.id}')">▶</button></div><span>${v.topic}</span><h2>${v.title}</h2><p>${v.description}</p><button class="primary" onclick="window.playVideo('${v.id}')">เริ่ม Interactive Video</button></article>`).join("")}</div>`,

quiz:()=>`<div class="pagehead"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h1>แบบทดสอบฟิสิกส์</h1><p>ตอบให้ครบ รับ XP และดูคำอธิบายหลังส่ง</p></div><div id="quizBox" class="card quizbox"></div>`,

games:()=>`<div class="pagehead"><span class="eyebrow">GAME CENTER / PHYSICS ARENA</span><h1>สนามแข่งขันแรง</h1><p>ตอบให้ไว ตอบให้ถูก และพาตัวเองไปถึงเส้นชัยก่อนคู่แข่ง</p></div><div class="game-modes"><article class="mode card"><div class="mode-icon">🎯</div><span class="mode-label">เล่นคนเดียว</span><h2>Solo Race</h2><p>อ่านคู่มือก่อนเริ่ม ตอบ 8 ข้อ แข่งกับ AI และสะสม XP</p><button class="primary" onclick="window.startSolo()">ดูคู่มือและเริ่มเล่น</button></article><article class="mode card multiplayer-mode"><div class="mode-icon">⚔️</div><span class="mode-label">เล่นกับเพื่อน</span><h2>Live Battle</h2><p>สร้างห้องแล้วแชร์ QR หรือใช้รหัสห้อง ให้ผู้เล่นเข้ามาแข่งพร้อมกัน</p><div class="row"><input id="roomName" placeholder="ชื่อผู้เล่น" value="${esc(state.name)}"><button class="primary" id="createRoom">สร้างห้อง</button></div><div class="row"><input id="joinCode" placeholder="ROOM CODE"><button class="ghost" id="joinRoom">เข้าห้อง</button></div></article></div><div class="card game-guide"><div><span class="eyebrow">HOW TO PLAY</span><h2>คู่มือการแข่งขัน</h2></div><div class="guide-steps"><span><b>01</b> สร้างห้องหรือสแกน QR</span><span><b>02</b> กด “ฉันพร้อม” เมื่อทุกคนเข้าครบ</span><span><b>03</b> ตอบให้ถูกและเร็วเพื่อคว้าอันดับหนึ่ง</span></div></div><div id="gameArea"></div>`,

progress:()=>`<div class="pagehead"><span class="eyebrow">MY PROGRESS</span><h1>พัฒนาการของฉัน</h1></div><div class="stats"><div class="stat card"><b>Level</b><strong>${level()}</strong></div><div class="stat card"><b>XP</b><strong>${state.xp}</strong></div><div class="stat card"><b>ทำแบบทดสอบ</b><strong>${state.scores.length}</strong></div></div><div class="card"><h2>ประวัติการทำแบบทดสอบ</h2>${state.scores.length?state.scores.slice().reverse().map(s=>`<div class="history"><span>${s.topic}</span><b>${s.score}/${s.total}</b><small>${new Date(s.date).toLocaleString("th-TH")}</small></div>`).join(""):"ยังไม่มีข้อมูล ลองทำแบบทดสอบก่อน"}</div>`
};

window.openLesson=id=>{
 const l=lessons.find(x=>x.id===id);
 document.querySelector("#app").innerHTML=`<header class="top"><div class="brand" onclick="window.go('lessons')">← กลับบทเรียน</div></header><main><section class="lesson-detail card"><span>${l.tag}</span><h1>${l.icon} ${l.title}</h1><p class="lead">${l.summary}</p><div class="formula">${l.formula}</div><h2>ประเด็นสำคัญ</h2><ul>${l.points.map(x=>`<li>${x}</li>`).join("")}</ul><div class="callout">💡 ลองถามตัวเอง: ถ้าเปลี่ยนตัวแปรหนึ่งตัวในสูตร ขนาดและทิศของแรงจะเปลี่ยนอย่างไร?</div><button class="primary" onclick="window.go('quiz')">ไปฝึกทำโจทย์ →</button></section></main>`;
 renderQuiz();
};

function renderQuiz(){
 const box=$("#quizBox"); if(!box)return;
 box.innerHTML=quiz.map((q,i)=>`<div class="q"><b>${i+1}. ${q.q}</b><div class="choices">${q.a.map((a,j)=>`<label><input type="radio" name="q${q.id}" value="${j}"> ${a}</label>`).join("")}</div><div id="fb${q.id}"></div></div>`).join("")+`<button class="primary" id="submitQuiz">ส่งคำตอบ</button>`;
 $("#submitQuiz").onclick=()=>{
   let score=0; quiz.forEach(q=>{const v=document.querySelector(`input[name=q${q.id}]:checked`);const ok=v&&+v.value===q.correct;if(ok)score++;$("#fb"+q.id).innerHTML=`<div class="${ok?'ok':'bad'}">${ok?'✓ ถูกต้อง':'✗ ลองทบทวนเรื่องนี้'}</div>`});
   addXP(score*30); state.scores.push({topic:"แรงไฟฟ้าและแรงแม่เหล็ก",score,total:quiz.length,date:Date.now()});save();
   $("#submitQuiz").textContent=`ได้ ${score}/${quiz.length} • +${score*30} XP`;
 };
}

window.playVideo=id=>{
 const v=videos.find(x=>x.id===id); state.video=v;
 const modal=document.createElement("div"); modal.className="modal"; modal.id="videoModal";
 modal.innerHTML=`<div class="modalbox"><button class="close" onclick="document.querySelector('#videoModal').remove()">×</button><h2>${v.title}</h2><div class="player"><iframe id="yt" src="https://www.youtube.com/embed/${v.youtube}?enablejsapi=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><div id="videoQuestions"></div></div>`;
 document.body.append(modal);
 window.onYouTubeIframeAPIReady=()=>{};
 if(!document.querySelector("#ytapi")){const s=document.createElement("script");s.id="ytapi";s.src="https://www.youtube.com/iframe_api";document.head.append(s);}
 setTimeout(()=>window.startVideoPolling(),1500);
};
window.startVideoPolling=()=>{
 const iframe=$("#yt"); if(!iframe)return;
 window.postYT=(func,args=[])=>iframe.contentWindow.postMessage(JSON.stringify({event:"command",func,args}),"*");
 state.videoTimer=setInterval(()=>{
   if(!$("#yt")){clearInterval(state.videoTimer);return}
   // The YouTube IFrame API can be initialized by adding ?enablejsapi=1; questions are also clickable below.
 },1000);
 const area=$("#videoQuestions"); area.innerHTML=`<div class="checkpoint"><b>🧠 จุดคิดระหว่างวิดีโอ</b>${state.video.checkpoints.map((c,i)=>`<button class="checkpointBtn" onclick="window.showVQ(${i})">คำถามที่ ${i+1} • นาที ${Math.floor(c.time/60)}:${String(c.time%60).padStart(2,"0")}</button>`).join("")}</div>`;
};
window.showVQ=i=>{
 const c=state.video.checkpoints[i], area=$("#videoQuestions");
 area.innerHTML=`<div class="vquestion"><small>PAUSE & THINK</small><h3>${c.q}</h3>${c.choices.map((x,j)=>`<button onclick="window.answerVQ(${i},${j})">${x}</button>`).join("")}</div>`;
};
window.answerVQ=(i,j)=>{
 const c=state.video.checkpoints[i],ok=j===c.answer;addXP(ok?25:5);
 $("#videoQuestions").innerHTML=`<div class="${ok?'ok big':'bad big'}">${ok?'✓ ถูกต้อง +25 XP':'✗ ยังไม่ถูก +5 XP'}<p>${ok?'ลองอธิบายเหตุผลด้วยตัวเองก่อนดูต่อ':'Hint: กลับไปดูช่วงก่อนหน้าและสังเกตความสัมพันธ์ของตัวแปร'}</p><button class="primary" onclick="window.startVideoPolling()">ดูคำถามต่อ</button></div>`;
};

window.startSolo=()=>{
 const area=$("#gameArea");
 area.innerHTML=`<div class="card guide"><span class="eyebrow">ก่อนเริ่มการแข่งขัน</span><h2>คู่มือ Solo Race</h2><div class="guide-grid"><div><b>1. ตอบให้ถูก</b><p>คำตอบที่ถูกจะพาคุณเดินหน้า 2 ช่อง และได้รับ +20 XP</p></div><div><b>2. แข่งให้ครบ 8 รอบ</b><p>คำตอบผิดจะไม่ขยับ ส่วน AI จะขยับทุกตาเพื่อไล่ตามคุณ</p></div><div><b>3. ไปถึงเส้นชัยก่อน</b><p>ดูแถบความคืบหน้าเพื่อวางแผน ใครสะสมระยะทางได้มากกว่าหลังรอบสุดท้ายเป็นผู้ชนะ</p></div></div><div class="callout">เป้าหมาย: ทำคะแนนให้ได้มากที่สุดและพาตัวละครไปถึง FINISH</div><button class="primary" onclick="window.beginSolo()">เข้าเส้นสตาร์ต →</button></div>`;
};

window.beginSolo=()=>{
 const qs=[...quiz,...quiz].sort(()=>Math.random()-.5).slice(0,8);let i=0,score=0,player=0,ai=0,locked=false;
 const track=(value,icon)=>`<div class="race-track"><span class="runner" style="left:${Math.min(value,8)/8*92}%">${icon}</span><span class="finish">FINISH</span></div>`;
 const draw=()=>{locked=false;const q=qs[i];$("#gameArea").innerHTML=`<div class="card solo"><div class="race-head"><div><span class="eyebrow">SOLO RACE</span><h2>รอบ ${i+1}/8</h2></div><strong>${score} ถูก</strong></div><div class="race-status"><span>คุณ ${player}/8</span><span>AI ${ai}/8</span></div>${track(player,"🏃")}${track(ai,"🤖")}<h2>${q.q}</h2><div class="choices">${q.a.map((a,j)=>`<button class="answerBtn" onclick="window.soloAnswer(${j})">${a}</button>`).join("")}</div><div id="soloFb"></div></div>`};
 window.soloAnswer=j=>{if(locked)return;locked=true;const q=qs[i],ok=j===q.correct;if(ok){score++;player+=2;addXP(20)}ai+=Math.random()>.35?1:2;$("#soloFb").innerHTML=`<div class="${ok?'ok':'bad'}">${ok?'✓ ถูกต้อง! คุณขยับ 2 ช่อง และได้รับ +20 XP':'✗ ยังไม่ถูก คุณยังอยู่ที่เดิม'}</div>`;setTimeout(()=>{i++;i<qs.length&&player<8&&ai<8?draw():$("#gameArea").innerHTML=`<div class="card result race-result"><span class="eyebrow">RACE COMPLETE</span><h2>${player>=ai?'🏆 คุณเข้าเส้นชัยก่อน!':'🤖 AI เข้าเส้นชัยก่อน'}</h2>${track(player,"🏃")}${track(ai,"🤖")}<strong>${score}/8 คำตอบถูก</strong><p>ได้รับ ${score*20} XP • ระยะทางของคุณ ${Math.min(player,8)}/8</p><button class="primary" onclick="window.go('games')">แข่งอีกครั้ง</button></div>`},650)};
 draw();
};

function connectWS(){
 if(state.ws&&(state.ws.readyState===WebSocket.OPEN||state.ws.readyState===WebSocket.CONNECTING))return;
 const proto=location.protocol==="https:"?"wss":"ws";
 state.ws=new WebSocket(`${proto}://${location.host}/ws`);
 state.ws.onopen=()=>{const queue=state.pending.splice(0);queue.forEach(message=>state.ws.send(JSON.stringify(message)))};
 state.ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==="joined"){state.playerId=m.playerId;state.room=m.room;showRoom()} if(m.type==="room"){state.room=m.room;showRoom()} if(m.type==="error")alert(m.message)};
 state.ws.onerror=()=>{const area=$("#gameArea");if(area)area.innerHTML=`<div class="card connection-error"><h2>เชื่อมต่อ Live Battle ไม่สำเร็จ</h2><p>ตรวจว่า server กำลังทำงานบนพอร์ต 5500 และเปิด URL จากแท็บ Ports ของ Codespaces</p><button class="ghost" onclick="window.go('games')">กลับไปลองใหม่</button></div>`};
}
function send(o){connectWS();state.pending.push(o);if(state.ws.readyState===WebSocket.OPEN){const queue=state.pending.splice(0);queue.forEach(message=>state.ws.send(JSON.stringify(message)))}}
function showRoom(){
 const r=state.room;if(!r)return;
 const shareUrl=`${location.origin}${location.pathname}?room=${encodeURIComponent(r.code)}`;
 $("#gameArea").innerHTML=`<div class="card lobby"><div class="room-layout"><div><span class="eyebrow">LIVE ROOM</span><div class="roomcode">${r.code}</div><p>สแกน QR หรือพิมพ์รหัสนี้เพื่อเข้าห้อง</p><button class="ghost" onclick="window.showRoomQR('${r.code}')">แสดง QR Code</button></div><div class="room-qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}" alt="QR สำหรับเข้าห้อง ${r.code}"><small>QR สำหรับเข้าห้อง</small></div></div><div class="players">${r.players.map(p=>`<div><span>👤 ${esc(p.name)}</span><b>${p.score}</b><small>${p.ready?"พร้อม":"รอ"}</small></div>`).join("")}</div>${r.status==="lobby"?`<button class="primary" id="readyBtn">ฉันพร้อม</button>`:`${r.status==="playing"?`<div class="battle"><small>รอบ ${r.round+1}/${r.totalRounds} • ตอบเร็วได้เปรียบ</small><h2>${r.question?.text||"รอคำถาม..."}</h2><div class="choices">${(r.question?.choices||[]).map((x,j)=>`<button class="answerBtn" onclick="window.battleAnswer(${j})">${x}</button>`).join("")}</div></div>`:`<div class="result"><h2>🏆 จบการแข่งขัน</h2>${[...r.players].sort((a,b)=>b.score-a.score).map((p,i)=>`<div class="history"><b>#${i+1} ${esc(p.name)}</b><span>${p.score} คะแนน</span></div>`).join("")}</div>`}`}`;
 const rb=$("#readyBtn");if(rb)rb.onclick=()=>send({type:"ready",ready:true});
}
window.showRoomQR=code=>{const url=`${location.origin}${location.pathname}?room=${encodeURIComponent(code)}`;const modal=document.createElement("div");modal.className="modal";modal.id="qrModal";modal.innerHTML=`<div class="modalbox qr-modal"><button class="close" onclick="document.querySelector('#qrModal').remove()">×</button><span class="eyebrow">SCAN TO JOIN</span><h2>เข้าห้อง ${code}</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(url)}" alt="QR สำหรับเข้าห้อง ${code}"><p>ให้เพื่อนสแกนด้วยกล้องโทรศัพท์ แล้วกรอกชื่อเพื่อเข้าร่วม</p></div>`;document.body.append(modal)};
window.battleAnswer=j=>send({type:"answer",choice:j});
function bind(){
 const sn=$("#saveName");if(sn)sn.onclick=()=>{state.name=$("#studentName").value.trim()||"นักเรียน";save();render()};
 if(state.page==="quiz")renderQuiz();
 const cr=$("#createRoom");if(cr)cr.onclick=()=>{state.name=$("#roomName").value.trim()||"Player 1";save();send({type:"create",name:state.name})};
 const jr=$("#joinRoom");if(jr)jr.onclick=()=>{state.name=$("#roomName").value.trim()||"Player";save();send({type:"join",name:state.name,code:$("#joinCode").value.trim()})};
 const roomFromUrl=new URLSearchParams(location.search).get("room");if(roomFromUrl&&$("#joinCode"))$("#joinCode").value=roomFromUrl;
}
render();