'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/app/actions/auth';
import { loginWithProvider } from '@/lib/auth-client';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await login({ email, password });
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Clear cart on successful login to ensure new user starts fresh
        localStorage.removeItem('cart');
      }
    } catch (err) {
      setError(t('auth.error_unexpected'));
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 rounded-xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold mb-3 text-stone-900 tracking-tight">{t('auth.login_title')}</h1>
        <p className="text-stone-500 text-sm font-medium">
          {t('auth.no_account')} <Link href="/register" className="text-stone-900 underline decoration-2 underline-offset-4 hover:text-stone-700 transition-colors">{t('auth.register_title')}</Link>
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 text-sm rounded-r-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold mb-0.5">{t('auth.error_title')}</p>
                <p className="text-red-600 opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
            {t('auth.email')} <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
            {t('auth.password')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Link href="#" className="text-xs text-stone-400 font-medium hover:text-stone-900 transition-colors">
            {t('auth.forgot_password')}
          </Link>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`group relative w-full bg-stone-900 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg overflow-hidden transition-all hover:bg-black active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className={`flex items-center justify-center transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {t('auth.login')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-8">
        <div className="border-t border-stone-100 w-full absolute"></div>
        <span className="bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 relative z-10">{t('auth.or_continue_with')}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button 
          onClick={() => loginWithProvider('facebook')}
          className="flex items-center justify-center bg-[#1877F2] text-white p-3 rounded-lg hover:bg-[#166fe5] transition-all group shadow-sm active:scale-[0.98]"
        >
          <div className="w-5 h-5 bg-white text-[#1877F2] flex items-center justify-center rounded-sm font-bold font-serif text-[12px] mr-2">f</div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Facebook</span>
        </button>
        <button 
          onClick={() => loginWithProvider('line')}
          className="flex items-center justify-center bg-[#06C755] text-white p-3 rounded-lg hover:bg-[#05b34c] transition-all group shadow-sm active:scale-[0.98]"
        >
          <div className="w-5 h-5 bg-white text-[#06C755] flex items-center justify-center rounded-sm font-bold font-serif text-[12px] mr-2">L</div>
          <span className="text-[10px] font-bold uppercase tracking-wider">LINE</span>
        </button>
        <button 
          onClick={() => loginWithProvider('google')}
          className="flex items-center justify-center bg-white border border-stone-200 text-stone-600 p-3 rounded-lg hover:bg-stone-50 transition-all group shadow-sm active:scale-[0.98]"
        >
          <div className="w-5 h-5 bg-[#EA4335] text-white flex items-center justify-center rounded-sm font-bold font-serif text-[12px] mr-2">G</div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Google</span>
        </button>
      </div>
    </div>
  );
}
