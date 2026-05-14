'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { loginWithProvider } from '@/lib/auth-client';
import { AlertCircle, ArrowRight, Loader2, Mail, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await login({ email, password });
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      localStorage.removeItem('cart');
      if (result?.token) {
        localStorage.setItem('access_token', result.token);
      }

      router.push('/account');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth.error_unexpected'));
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[460px] py-12">
      {/* 2026 Ultra-Modern Aura Background */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-stone-300/30 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 rounded-full blur-[150px]"></div>

      <div className="relative group">
        {/* The Glass Container with Noise Texture */}
        <div className="relative bg-white/40 backdrop-blur-[40px] p-8 sm:p-12 w-full shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-white/60 rounded-[3rem] transition-all duration-700 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.18)] overflow-hidden">
          
          {/* Subtle Noise/Grain Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(41, 37, 36, 0.7) 1px, transparent 0)',
              backgroundSize: '12px 12px',
            }}
          ></div>

          {/* Top Branding Section */}
          <div className="relative flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-white rounded-[2.2rem] flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-700 ease-out overflow-hidden border border-stone-100">
                <Image 
                  src="/logos/Thebottleclub1.jpg" 
                  alt="The Bottle Club Logo" 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-stone-50">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight text-center mb-3">
              {t('auth.login_title')}
            </h1>
            <div className="h-1 w-12 bg-primary/30 rounded-full mb-4"></div>
            <p className="text-stone-500 text-sm font-medium tracking-wide uppercase">
              {t('auth.no_account')} <Link href="/register" className="text-primary font-black hover:text-primary-hover transition-colors border-b-2 border-primary/20 hover:border-primary">{t('auth.register_title')}</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="relative space-y-7">
            {error && (
              <div className="bg-red-50/40 backdrop-blur-md border border-red-100 text-red-800 px-6 py-4 rounded-[1.5rem] animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2.5">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 ml-5">
                {t('auth.email')}
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-300 group-focus-within/input:text-primary transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@winenow.club"
                  className="w-full bg-white/50 border border-stone-200/40 pl-16 pr-6 py-5 text-stone-900 text-base rounded-[1.8rem] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-white transition-all placeholder-stone-300 shadow-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-5">
                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                  {t('auth.password')}
                </label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors">
                  {t('auth.forgot_password')}
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-300 group-focus-within/input:text-primary transition-colors" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="************"
                  className="w-full bg-white/50 border border-stone-200/40 pl-16 pr-6 py-5 text-stone-900 text-base rounded-[1.8rem] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-white transition-all placeholder-stone-300 shadow-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center px-5">
              <label className="flex items-center cursor-pointer group/check">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 border-2 rounded-xl transition-all duration-500 flex items-center justify-center ${rememberMe ? 'bg-primary border-primary rotate-0 scale-110 shadow-lg shadow-primary/20' : 'border-stone-200 bg-white rotate-[-15deg]'}`}>
                    {rememberMe && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <span className="ml-4 text-xs font-bold text-stone-500 uppercase tracking-widest group-hover/check:text-stone-900 transition-colors">Stay Signed In</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`group relative w-full h-[72px] bg-stone-950 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-[2rem] overflow-hidden transition-all active:scale-[0.97] shadow-2xl hover:shadow-primary/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#4a0000] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
              
              <span className={`relative flex items-center justify-center gap-4 transition-all duration-500 ${loading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                {t('auth.login')}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                </div>
              </span>
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white/80" />
                </div>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-12">
            <div className="border-t border-stone-200/50 w-full absolute"></div>
            <span className="bg-white/60 backdrop-blur-md px-6 text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 relative z-10">Premium Security</span>
          </div>

          <div className="grid grid-cols-2 gap-5 relative">
            <button 
              onClick={() => loginWithProvider('line')}
              className="flex items-center justify-center gap-3 bg-white/60 border border-white/80 p-5 rounded-[1.8rem] hover:bg-[#06C755] hover:text-white transition-all duration-700 group shadow-md hover:shadow-xl hover:shadow-[#06C755]/30 active:scale-95 border-b-4 border-stone-100 hover:border-[#06C755]"
            >
              <div className="w-7 h-7 bg-[#06C755] rounded-xl flex items-center justify-center group-hover:bg-white transition-all duration-500 group-hover:rotate-[360deg]">
                <span className="text-white group-hover:text-[#06C755] font-black text-xs">L</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Line</span>
            </button>

            <button 
              onClick={() => loginWithProvider('google')}
              className="flex items-center justify-center gap-3 bg-white/60 border border-white/80 p-5 rounded-[1.8rem] hover:bg-stone-50 transition-all duration-700 shadow-md hover:shadow-xl active:scale-95 border-b-4 border-stone-100 hover:border-stone-200"
            >
              <div className="group-hover:scale-125 transition-transform duration-500">
                <svg width="22" height="22" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957a9.023 9.023 0 000 8.088l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.443 2.017.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">Google</span>
            </button>
          </div>
        </div>

        {/* Floating Accent Detail */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center animate-bounce duration-[3s]">
          <div className="w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
