import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getSession } from '@/lib/auth-utils';
import ProfileContent from '@/components/account/ProfileContent';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-12">
          <AccountSidebar user={user} activePath="/account/profile" />
          <ProfileContent user={user} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
