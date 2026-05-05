# Project1-ThebottleClub

โครงการร้านค้าออนไลน์สำหรับเครื่องดื่ม (Wine & Spirits) พัฒนาด้วย Next.js (Frontend) และ Express.js (Backend) โดยใช้ฐานข้อมูล PostgreSQL และเชื่อมต่อกับ External API

## 🌟 ฟีเจอร์ที่พัฒนาแล้ว (Implemented Features)

### 🔐 ระบบสมาชิกและความปลอดภัย (Authentication & Security)
- **ระบบ Login / Register**: เชื่อมต่อกับ External API และมีระบบสำรองใน Local Database
- **JWT Session**: จัดการ Session ผ่าน Cookie ด้วย jose (Sign/Verify)
- **Middleware Protection**: ป้องกันการเข้าถึงหน้าสมาชิกโดยไม่ได้รับอนุญาต
- **Members-Only Barrier**: ระบบบล็อกเนื้อหาเฉพาะสมาชิก

### 👤 การจัดการบัญชี (Account Management)
- **Profile Page**: แก้ไขข้อมูลส่วนตัว
- **Address Book**: จัดการที่อยู่สำหรับการจัดส่ง
- **Order History**: ประวัติการสั่งซื้อ (บันทึกใน Local Database)
- **Points System**: ระบบคะแนนสะสม
- **Review System**: ระบบรีวิวสินค้า

### 🛒 ระบบการซื้อขาย (E-commerce Core)
- **Product Catalog**: แสดงสินค้าแยกหมวดหมู่ (Red, White, Rose, Sparkling)
- **Search System**: ค้นหาสินค้าแบบ Real-time
- **Shopping Cart**: ระบบตะกร้าสินค้าแบบ Client-side persistence
- **Checkout Process**: ระบบชำระเงินที่รองรับที่อยู่และการเลือกช่องทางชำระเงิน
- **Stripe Integration**: ระบบชำระเงินผ่าน Stripe (รองรับ Card และ PromptPay)

### 🎨 UI/UX & Localization
- **Multi-language Support**: รองรับภาษาไทยและอังกฤษผ่าน Context API
- **Responsive Design**: รองรับการใช้งานทั้ง Mobile และ Desktop
- **AI Chat Support**: ระบบแชทช่วยเหลือเบื้องต้น

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (pg pool)
- **Authentication**: JWT & External API
- **Payments**: Stripe

---

## 🚀 วิธีการติดตั้ง (Installation)

### 1. โคลนโปรเจกต์
```bash
git clone https://github.com/artisan-digital-asia/Project1-ThebottleClub.git
cd Project1-ThebottleClub
```

### 2. ตั้งค่า Frontend
```bash
cd frontend
npm install
```
สร้างไฟล์ `.env.local` ในโฟลเดอร์ `frontend`:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=https://possimon.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```
รัน Frontend:
```bash
npm run dev
```

### 3. ตั้งค่า Backend (สำหรับ Stripe Checkout)
```bash
cd ../backend
npm install
```
สร้างไฟล์ `.env` ในโฟลเดอร์ `backend`:
```env
PORT=3001
STRIPE_SECRET_KEY=your_stripe_secret_key
```
รัน Backend:
```bash
npm run dev
```

### 4. การเตรียมฐานข้อมูล
รันคำสั่งใน `database_init.sql` ใน PostgreSQL Database ของคุณเพื่อสร้างตาราง `users` และ `orders`

---

## 📁 โครงสร้างโฟลเดอร์
- `/frontend`: Next.js App (UI, Actions, Components, API Routes)
- `/backend`: Express Server (Stripe Integration, Webhooks)
- `/database_init.sql`: ไฟล์สำหรับสร้าง Schema ในฐานข้อมูล PostgreSQL
