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

## ใช้บน GitHub Codespaces
Vite รองรับการรัน development server และ build สำหรับ production โดยใช้ `npm run dev` / `npm run build` ตามเอกสารทางการของ Vite

```bash
npm install
npm run dev
```

ใน Codespaces ให้เปิดพอร์ต `5173` ที่ระบบ Forward Port ให้อัตโนมัติ หรือใช้ Ports > Open in Browser

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
- เปิด Codespace/เครื่องเดียว
- `npm run dev`
- แชร์ URL ของ forwarded port ให้ผู้เล่น
- ผู้เล่นสร้างห้อง → ส่ง Room Code → คนอื่น Join
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
