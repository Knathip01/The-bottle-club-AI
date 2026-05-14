'use client';

import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getSession } from '@/lib/auth-utils';
import AddressForm from '@/components/account/AddressForm';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function AddAddressPage() {
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
        {/* Breadcrumb */}
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          {t('nav.home')} / {t('account.title')}
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <AccountSidebar user={user} activePath="/account/addresses" />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">{t('account.add_new_address')}</h1>

            <AddressForm user={user} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
