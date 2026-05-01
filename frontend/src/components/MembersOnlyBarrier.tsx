'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95 text-center"
            >
              {loginText}
            </Link>
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-white text-stone-900 border border-stone-200 px-10 py-4 rounded-full font-bold hover:bg-stone-50 transition-all active:scale-95 text-center"
            >
              {registerText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
