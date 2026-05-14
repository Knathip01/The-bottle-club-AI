import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import PrivacyContent from '@/components/account/PrivacyContent';

export default async function PrivacySettingsPage() {
  const session = await getSession();
  const { user } = (session as any) || {};

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-12">
          <AccountSidebar user={user} activePath="/account/privacy" />
          <PrivacyContent />
        </div>
      </div>
      <Footer />
    </main>
  );
}
