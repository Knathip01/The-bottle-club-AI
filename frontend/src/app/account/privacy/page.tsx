'use client';

import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function PrivacySettingsPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Session handling logic here if needed
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          {t('common.home')} / {t('account.title').toUpperCase()}
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <AccountSidebar user={user} activePath="/account/privacy" />

          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">{t('account.privacy_title')}</h1>

            <section className="max-w-3xl">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 pb-2 border-b border-stone-100">{t('account.delete_account')}</h3>
              
              <div className="bg-stone-50 p-8 border border-stone-100">
                <p className="text-[11px] text-stone-600 font-medium uppercase leading-relaxed mb-6 tracking-tight">
                  {t('account.delete_account_desc')}
                  <br /><br />
                  <span className="text-red-700 font-bold">{t('account.delete_account_warning')}</span>
                </p>

                <form className="space-y-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-0.5 w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
                    />
                    <span className="text-[11px] font-bold text-stone-700 group-hover:text-stone-900 transition-colors">
                      {t('account.delete_account_confirm')}
                    </span>
                  </label>

                  <button 
                    type="submit"
                    className="bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
                  >
                    {t('account.submit_request')}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
