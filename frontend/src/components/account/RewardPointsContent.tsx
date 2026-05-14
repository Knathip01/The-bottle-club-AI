'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function RewardPointsContent() {
  const { t } = useLanguage();

  return (
    <div className="flex-1">
      <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
        {t('common.home')} / {t('account.title').toUpperCase()}
      </div>

      <h1 className="text-xl font-bold mb-10">{t('account.points_title')}</h1>

      {/* Points Summary Header */}
      <div className="relative bg-gradient-to-r from-red-400 to-red-200 rounded-3xl p-10 text-white mb-12 flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center z-10">
          <span className="text-4xl font-bold block mb-1">0</span>
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">{t('account.points_available')}</span>
        </div>
        
        {/* Decorative logo on the right */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
          <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center text-2xl font-serif italic">
            wn
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-16">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-6 border-b border-stone-100 pb-2">{t('account.points_earn_title')}</h3>
          <div className="text-xs text-stone-600 leading-relaxed space-y-4">
            <p>{t('account.points_earn_desc')}</p>
            <p className="font-bold text-stone-800 italic">{t('account.points_earn_rate')}</p>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-6 border-b border-stone-100 pb-2">{t('account.points_spend_title')}</h3>
          <div className="text-xs text-stone-600 leading-relaxed space-y-4">
            <p>{t('account.points_spend_desc')}</p>
            <p className="font-bold text-stone-800 italic">{t('account.points_spend_rate')}</p>
          </div>
        </section>

        <section className="md:col-span-2 bg-stone-50/50 p-8 border border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-6">{t('account.points_manage_title')}</h3>
          <ul className="text-xs text-stone-500 space-y-4 list-disc pl-4">
            <li>{t('account.points_manage_rule1')}</li>
            <li>{t('account.points_manage_rule2')}</li>
            <li>{t('account.points_manage_rule3')}</li>
            <li>{t('account.points_manage_rule4')}</li>
          </ul>
          <div className="mt-6 p-4 bg-white border border-stone-200 text-[10px] text-stone-400 italic">
            {t('account.points_example')}
          </div>
        </section>
      </div>

      {/* Transaction History */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-6 pb-2 border-b border-stone-100">{t('account.points_history_title')}</h3>
        <div className="text-[11px] text-stone-400 py-4 italic">
          {t('account.points_no_history')}
        </div>
      </section>
    </div>
  );
}
