'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { setSessionFromToken } from '@/app/actions/auth';

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // 1. Store in localStorage as requested by the user
      localStorage.setItem('access_token', token);
      console.log('Login สำเร็จ! เก็บ Token เรียบร้อย');
      
      // 2. Sync with server session
      const syncSession = async () => {
        try {
          await setSessionFromToken(token);
          
          // 3. Redirect after successful sync
          const timer = setTimeout(() => {
            router.push('/account');
            router.refresh();
          }, 1000);
          
          return () => clearTimeout(timer);
        } catch (err) {
          console.error('Failed to sync session:', err);
          // Fallback redirect even if sync fails (local token is still there)
          router.push('/account');
        }
      };

      syncSession();
    } else {
      console.error('ไม่พบ Token ใน URL');
      router.push('/login?error=no_token');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-500" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-stone-900">เข้าสู่ระบบสำเร็จ</h1>
        <p className="text-stone-500 font-medium">กำลังพานายไปยังหน้าบัญชีผู้ใช้...</p>
      </div>
      <Loader2 className="w-8 h-8 animate-spin text-primary mt-4" />
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <h2 className="text-xl font-bold">กำลังตรวจสอบสิทธิ์...</h2>
        </div>
      }>
        <AuthSuccessContent />
      </Suspense>
    </div>
  );
}
