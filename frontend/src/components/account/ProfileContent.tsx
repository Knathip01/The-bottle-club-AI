'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';

interface ProfileContentProps {
  user: any;
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold mb-10">{t('account.profile')}</h1>

      <section className="max-w-2xl">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-8 pb-2 border-b border-stone-100">{t('account.user_info')}</h3>
        
        <form className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-stone-900 mb-2 uppercase tracking-wide">{t('account.member_type')} *</label>
            <input 
              type="text" 
              value={t('account.pending_review')}
              disabled
              className="w-full border border-stone-100 bg-stone-50 p-3 text-xs text-stone-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-2 uppercase tracking-wide">{t('account.first_name')} *</label>
              <input 
                type="text" 
                defaultValue={user?.first_name}
                className="w-full border border-stone-200 p-3 text-xs focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-2 uppercase tracking-wide">{t('account.last_name')} *</label>
              <input 
                type="text" 
                defaultValue={user?.last_name}
                className="w-full border border-stone-200 p-3 text-xs focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-900 mb-2 uppercase tracking-wide">{t('account.phone')} *</label>
            <input 
              type="text" 
              placeholder="EX. 0801235588"
              className="w-full border border-stone-200 p-3 text-xs focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-900 mb-2 uppercase tracking-wide">{t('account.email')} *</label>
            <input 
              type="email" 
              defaultValue={user?.email}
              disabled
              className="w-full border border-stone-100 bg-stone-50 p-3 text-xs text-stone-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-900 mb-2 uppercase tracking-wide">{t('account.gender')}</label>
            <div className="relative">
              <select className="w-full border border-stone-200 p-3 text-xs bg-white appearance-none focus:border-stone-900 focus:outline-none transition-colors">
                <option value="MALE">{t('account.gender_male')}</option>
                <option value="FEMALE">{t('account.gender_female')}</option>
                <option value="OTHER">{t('account.gender_other')}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
              />
              <span className="text-[11px] font-bold text-stone-500 group-hover:text-stone-900 transition-colors uppercase tracking-wide">
                {t('account.change_email')}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
              />
              <span className="text-[11px] font-bold text-stone-500 group-hover:text-stone-900 transition-colors uppercase tracking-wide">
                {t('account.change_password')}
              </span>
            </label>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="bg-black text-white px-16 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
