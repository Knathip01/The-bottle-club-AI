'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/app/actions/auth';
import { loginWithProvider } from '@/lib/auth-client';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.error_mismatch'));
      return;
    }

    setLoading(true);
    try {
      // Send username as email to maintain compatibility with backend
      const result = await register({
        ...formData,
        username: formData.email
      });
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError(t('auth.error_unexpected'));
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 rounded-2xl transition-all duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold mb-3 text-stone-900 tracking-tight">{t('auth.register_title')}</h1>
        <p className="text-stone-500 text-sm font-medium">
          {t('auth.have_account')} <Link href="/login" className="text-stone-900 underline decoration-2 underline-offset-4 hover:text-stone-700 transition-colors">{t('auth.login_title')}</Link>
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6 max-w-xl mx-auto">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 text-sm rounded-r-xl animate-in fade-in slide-in-from-top-2 duration-300 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold mb-0.5">{t('auth.error_title')}</p>
                <p className="text-red-600 opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
              {t('auth.first_name')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
              {t('auth.last_name')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
            {t('auth.email')} <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
            {t('auth.phone')} <span className="text-red-500">*</span>
          </label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08X-XXX-XXXX"
            className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
              {t('auth.password')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
              {t('auth.confirm_password')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-stone-200 bg-stone-50/50 p-3.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all placeholder-stone-300"
              required
              disabled={loading}
            />
          </div>
        </div>

        <p className="text-[10px] text-stone-400 mt-2 leading-relaxed px-1">
          {t('auth.password_hint')}
        </p>

        <button 
          type="submit"
          disabled={loading}
          className={`group relative w-full bg-stone-900 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg overflow-hidden transition-all hover:bg-black active:scale-[0.98] mt-8 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className={`flex items-center justify-center transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {t('auth.register')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </button>
        
        <p className="text-center text-[10px] text-stone-400 mt-6">
          {t('auth.register_terms')}
        </p>

        <div className="relative flex items-center justify-center my-10">
          <div className="border-t border-stone-100 w-full absolute"></div>
          <span className="bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 relative z-10">{t('auth.or_continue_with')}</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* LINE - Modern gradient style */}
          <button 
            type="button"
            onClick={() => loginWithProvider('line')}
            className="relative flex items-center justify-center bg-[#06C755]/10 border border-[#06C755]/20 text-[#06C755] p-3 rounded-2xl hover:bg-[#06C755] hover:text-white transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-[#06C755]/20 hover:shadow-xl active:scale-[0.96]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#06C755]/0 via-[#06C755]/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="w-6 h-6 bg-[#06C755] text-white flex items-center justify-center rounded-xl font-black text-[14px] mr-2 shadow-sm group-hover:bg-white group-hover:text-[#06C755] transition-colors duration-300">L</div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] z-10">LINE</span>
          </button>

          {/* Google - Premium minimalist style */}
          <button 
            type="button"
            onClick={() => loginWithProvider('google')}
            className="relative flex items-center justify-center bg-white border border-stone-200 text-stone-600 p-3 rounded-2xl hover:border-stone-400 hover:text-stone-900 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-stone-200/50 hover:shadow-xl active:scale-[0.96]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-100/0 via-stone-100/0 to-stone-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="w-6 h-6 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform duration-500">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957a9.023 9.023 0 000 8.088l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.443 2.017.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] z-10">Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}
