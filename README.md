# ⚡ Physics Force Lab
เว็บนวัตกรรมการเรียนรู้ฟิสิกส์ระดับมัธยมศึกษาตอนปลาย เน้น “แรงทางไฟฟ้าและแรงแม่เหล็ก”

## ความสามารถ
- เนื้อหา: กฎของคูลอมบ์, สนามไฟฟ้า, แรงแม่เหล็กต่อประจุ, แรงบนลวดมีกระแส, แรงลอเรนซ์
- Interactive Video จาก YouTube
- คำถามแทรกระหว่างวิดีโอ (checkpoint)
- Quiz และ XP/Level
- Solo Challenge
- Multiplayer Battle 2–10 คน ผ่าน WebSocket + Room Code
- บันทึก XP/ผลการฝึกใน localStorage
- Responsive สำหรับมือถือ/คอมพิวเตอร์

## ใช้บน GitHub Codespaces (แนะนำ)
โปรเจกต์นี้ตั้งค่าให้ Codespaces เป็นสภาพแวดล้อมหลัก โดยเซิร์ฟเวอร์จะ bind ที่ `0.0.0.0` และใช้พอร์ต `5500` ซึ่งถูก forward อัตโนมัติจาก `.devcontainer/devcontainer.json`

```bash
npm install
npm run dev
```

จากแท็บ **Ports** ให้เปิด `5500` ด้วย **Open in Browser** แล้วใช้ URL ที่ GitHub สร้างให้เป็น URL หลัก ห้ามใช้ `localhost` เมื่อต้องการให้เพื่อนเข้าจากอุปกรณ์อื่น

เมื่อสร้างห้องแข่งขัน ระบบจะสร้าง QR จาก URL ของ forwarded port ปัจจุบันโดยอัตโนมัติ ผู้เล่นสามารถสแกน QR หรือเปิด URL แล้วกรอกชื่อเพื่อเข้าห้องได้ การเชื่อมต่อเกมใช้ WebSocket ที่ `/ws` และจะเปลี่ยนเป็น `wss://` อัตโนมัติเมื่อ Codespaces เปิดผ่าน HTTPS

ถ้าพอร์ตถูกตั้งเป็น Private ให้เปลี่ยนเป็น **Public** ในแท็บ Ports ก่อนแชร์ QR ให้ผู้เล่นภายนอก Codespace

## Deploy สำหรับใช้งานจริง
แนะนำ **Render Web Service** เพราะเกมใช้ Node server และ WebSocket จึงไม่เหมาะกับ GitHub Pages แบบ static

1. Push repository ขึ้น GitHub
2. ใน Render เลือก **New > Blueprint** แล้วเลือก repository นี้
3. Render จะอ่าน `render.yaml` และใช้ `npm install && npm run build` กับ `npm start` อัตโนมัติ
4. ใช้ URL ของ Render เป็นลิงก์หลักสำหรับแชร์และสร้าง QR ห้องแข่งขัน

ห้องแข่งขันเก็บใน memory ของ service ดังนั้นไม่ควร deploy แบบหลาย instance หากต้องการให้ผู้เล่นอยู่ในห้องเดียวกัน

## Build
```bash
npm run build
```

## YouTube
วิดีโอถูกฝังด้วย YouTube iframe และใช้วิดีโอสาธารณะตัวอย่าง:
- Coulomb's Law - The Organic Chemistry Tutor
- Magnetic Force on a Current Carrying Wire - The Organic Chemistry Tutor

หากต้องการเปลี่ยนวิดีโอ ให้แก้ `src/data.js` ตรง `youtube:"VIDEO_ID"` และแก้เวลาใน `checkpoints`

## Multiplayer
เกมหลายคนต้องรัน Node server เพราะใช้ WebSocket:
- เปิด Codespace เดียวเป็นเครื่อง host
- `npm run dev`
- เปิด forwarded URL จากแท็บ Ports
- ผู้เล่นสร้างห้อง → กดแสดง QR Code → ให้คนอื่นสแกนและ Join
- รองรับสูงสุด 10 คนในโค้ดตัวอย่าง

## หมายเหตุ
เวอร์ชันนี้เป็นฐานพร้อมพัฒนา ไม่ใช่ระบบบัญชีโรงเรียนแบบ production:
- ข้อมูลผู้เรียนเก็บใน browser localStorage
- ห้องเกมอยู่ใน memory ของ Node server และหายเมื่อ server restart
- หากใช้จริงในโรงเรียน ควรเพิ่มฐานข้อมูล เช่น PostgreSQL/Supabase/Firebase และระบบ login/teacher dashboard
- ก่อนใช้เป็นสื่อการสอนจริง ควรตรวจสอบความเหมาะสมของเนื้อหาและวิดีโอกับหลักสูตรของสถานศึกษา

## โครงสร้าง
```text
physics-force-lab/
├── .devcontainer/devcontainer.json
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── server/index.js
└── src/
    ├── main.js
    ├── data.js
    └── style.css
```
