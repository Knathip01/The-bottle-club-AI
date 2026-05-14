'use client';

import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getSession } from '@/lib/auth-utils';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          {t('nav.home')} / {t('account.title')}
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <AccountSidebar user={user} activePath="/account/reviews" />

          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">{t('account.reviews_title')}</h1>

            <div className="bg-[#fff9e6] border border-[#ffeb99] p-4 flex items-center gap-3">
              <AlertCircle size={18} className="text-[#b38f00]" />
              <span className="text-xs font-bold text-[#665200]">{t('account.no_reviews')}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
