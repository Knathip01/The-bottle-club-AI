'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Facebook } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { loginWithProvider } from '@/lib/auth-client';

export default function MembersOnlyBarrier() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During hydration (initial client render), render nothing or a skeleton 
  // that matches the server's structure to avoid mismatch.
  // Actually, to fix the specific text mismatch, we can just render the 
  // server-default text (Thai) if not mounted.
  
  const title = mounted ? t('products.members_only_title') : 'สินค้าเฉพาะสมาชิก';
  const desc = mounted ? t('products.members_only_desc') : 'กรุณาเข้าสู่ระบบเพื่อเรียกดูรายการสินค้าพรีเมียมและรับสิทธิพิเศษสำหรับสมาชิก The Bottle Club เท่านั้น';
  const loginText = mounted ? t('auth.login') : 'เข้าสู่ระบบ';
  const registerText = mounted ? t('auth.register') : 'สมัครสมาชิก';

  return (
    <section className="py-24 bg-stone-50" id="products">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm border border-stone-100 mb-8">
            <Lock className="w-8 h-8 text-stone-400" />
          </div>
          <h2 className="text-4xl font-serif font-bold mb-4 text-stone-900">
            {title}
          </h2>
          <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto">
            {desc}
          </p>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
              <Link 
                href="/login" 
                className="w-full sm:w-auto flex-1 bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95 text-center"
              >
                {loginText}
              </Link>
              <Link 
                href="/register" 
                className="w-full sm:w-auto flex-1 bg-white text-stone-900 border border-stone-200 px-10 py-4 rounded-full font-bold hover:bg-stone-50 transition-all active:scale-95 text-center"
              >
                {registerText}
              </Link>
            </div>

            <div className="relative flex items-center justify-center w-full max-w-md my-4">
              <div className="border-t border-stone-200 w-full absolute"></div>
              <span className="bg-stone-50 px-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 relative z-10">
                {mounted ? t('auth.or_continue_with') : 'หรือเข้าสู่ระบบด้วย'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
              <button 
                onClick={() => loginWithProvider('facebook')}
                className="flex items-center justify-center bg-[#1877F2] text-white p-3 rounded-xl hover:bg-[#166fe5] transition-all active:scale-95 shadow-sm"
              >
                <div className="w-5 h-5 bg-white text-[#1877F2] flex items-center justify-center rounded-sm font-bold font-serif text-[12px] mr-2">f</div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Facebook</span>
              </button>
              <button 
                onClick={() => loginWithProvider('line')}
                className="flex items-center justify-center bg-[#06C755] text-white p-3 rounded-xl hover:bg-[#05b34c] transition-all active:scale-95 shadow-sm"
              >
                <div className="w-5 h-5 bg-white text-[#06C755] flex items-center justify-center rounded-sm font-bold font-serif text-[12px] mr-2">L</div>
                <span className="text-[10px] font-bold uppercase tracking-wider">LINE</span>
              </button>
              <button 
                onClick={() => loginWithProvider('google')}
                className="flex items-center justify-center bg-white border border-stone-200 text-stone-600 p-3 rounded-xl hover:bg-stone-50 transition-all active:scale-95 shadow-sm"
              >
                <div className="w-5 h-5 bg-[#EA4335] text-white flex items-center justify-center rounded-sm font-bold font-serif text-[12px] mr-2">G</div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
