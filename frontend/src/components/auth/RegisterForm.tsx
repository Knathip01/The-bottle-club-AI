'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/app/actions/auth';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 shadow-sm border border-stone-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">สร้างบัญชีใหม่</h1>
        <p className="text-stone-500 text-sm">
          หากคุณมีบัญชีอยู่แล้ว คลิก <Link href="/login" className="text-stone-900 underline font-medium">เข้าสู่ระบบ</Link>
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6 max-w-xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            ชื่อ <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="WINENOW"
            className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-500 placeholder-stone-300 uppercase"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            นามสกุล <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="ASIA"
            className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-500 placeholder-stone-300 uppercase"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="WINENOW@GMAIL.COM"
            className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-500 placeholder-stone-300 uppercase"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            รหัสผ่าน <span className="text-red-500">*</span>
          </label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="กรุณากรอกรหัสผ่าน"
            className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-500 placeholder-stone-300"
            required
            disabled={loading}
          />
          <p className="text-[11px] text-stone-500 mt-1">
            รหัสผ่านควรมีความยาว 8 ตัวอักษรขึ้นไป ประกอบด้วย ตัวอักษรภาษาอังกฤษพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข ยังไม่มีรหัสผ่าน
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
          </label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="กรุณากรอกรหัสผ่านอีกครั้ง"
            className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-500 placeholder-stone-300"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-[#111] text-white py-4 text-sm font-bold tracking-wider hover:bg-black transition-colors mt-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
        </button>
        
        <p className="text-center text-xs text-stone-500 mt-4">
          โดยการลงทะเบียนหมายความว่าคุณยอมรับใน <Link href="#" className="underline">ข้อกำหนดและเงื่อนไข</Link> และรับทราบถึง <Link href="#" className="underline">นโยบายความเป็นส่วนตัว</Link>
        </p>

        <div className="relative flex items-center justify-center mt-10 mb-6">
          <span className="bg-white px-4 text-xs text-stone-400 relative z-10">OR CONTINUE WITH</span>
        </div>

        <div className="flex justify-center gap-4">
          <button className="flex items-center justify-center bg-[#3b5998] text-white py-2 px-6 text-xs font-medium hover:bg-[#324b82] transition-colors min-w-[120px]">
            <span className="mr-2 font-bold font-serif text-sm">f</span> FACEBOOK
          </button>
          <button className="flex items-center justify-center bg-[#00b900] text-white py-2 px-6 text-xs font-medium hover:bg-[#009900] transition-colors min-w-[120px]">
            <span className="mr-2 font-bold font-serif text-sm">L</span> LINE
          </button>
          <button className="flex items-center justify-center bg-[#4285f4] text-white py-2 px-6 text-xs font-medium hover:bg-[#3367d6] transition-colors min-w-[120px]">
            <span className="mr-2 font-bold font-serif text-sm">G</span> GOOGLE
          </button>
        </div>
      </form>
    </div>
  );
}
