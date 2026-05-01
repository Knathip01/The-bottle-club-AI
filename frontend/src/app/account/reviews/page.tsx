import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getSession } from '@/lib/auth-utils';
import { AlertCircle } from 'lucide-react';

export default async function ReviewsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          HOME / MY ACCOUNT
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <AccountSidebar user={user} activePath="/account/reviews" />

          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">ความเห็นเกี่ยวกับสินค้า</h1>

            <div className="bg-[#fff9e6] border border-[#ffeb99] p-4 flex items-center gap-3">
              <AlertCircle size={18} className="text-[#b38f00]" />
              <span className="text-xs font-bold text-[#665200]">ไม่พบรีวิวของคุณ</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
