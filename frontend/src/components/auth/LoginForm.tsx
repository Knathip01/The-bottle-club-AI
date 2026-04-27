'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/app/actions/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const result = await login({ email, password });
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Clear cart on successful login to ensure new user starts fresh
      localStorage.removeItem('cart');
    }
  };

  return (
    <div className="bg-white p-8 w-full max-w-md shadow-sm border border-stone-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">เข้าสู่ระบบ</h1>
        <p className="text-stone-500 text-sm">
          NEW TO WINE NOW? <Link href="/register" className="text-stone-900 underline font-medium">สมัครสมาชิกใหม่</Link>
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="WINE@GMAIL.COM"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-stone-500 placeholder-stone-300 uppercase"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-[#111] text-white py-4 text-sm font-bold tracking-wider hover:bg-black transition-colors mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <div className="text-center mt-4 mb-8">
        <Link href="#" className="text-sm text-stone-500 underline hover:text-stone-900">
          ลืมรหัสผ่าน
        </Link>
      </div>

      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-stone-200 w-full absolute"></div>
        <span className="bg-white px-4 text-xs text-stone-400 relative z-10">หรือดำเนินการต่อด้วย</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="flex items-center justify-center bg-[#3b5998] text-white py-2 px-4 text-xs font-medium hover:bg-[#324b82] transition-colors">
          <span className="mr-2 font-bold font-serif text-sm">f</span> FACEBOOK
        </button>
        <button className="flex items-center justify-center bg-[#00b900] text-white py-2 px-4 text-xs font-medium hover:bg-[#009900] transition-colors">
          <span className="mr-2 font-bold font-serif text-sm">L</span> LINE
        </button>
        <button className="flex items-center justify-center bg-[#4285f4] text-white py-2 px-4 text-xs font-medium hover:bg-[#3367d6] transition-colors">
          <span className="mr-2 font-bold font-serif text-sm">G</span> GOOGLE
        </button>
      </div>
    </div>
  );
}
