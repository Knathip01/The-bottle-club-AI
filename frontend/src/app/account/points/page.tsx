import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getSession } from '@/lib/auth-utils';
import { Award } from 'lucide-react';

export default async function RewardPointsPage() {
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
          <AccountSidebar user={user} activePath="/account/points" />

          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">คะแนนสะสมของฉัน</h1>

            {/* Points Summary Header */}
            <div className="relative bg-gradient-to-r from-red-400 to-red-200 rounded-3xl p-10 text-white mb-12 flex flex-col items-center justify-center overflow-hidden">
              <div className="text-center z-10">
                <span className="text-4xl font-bold block mb-1">0</span>
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">Available Points</span>
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
                <h3 className="text-xs font-bold uppercase tracking-wider mb-6 border-b border-stone-100 pb-2">How to earn points</h3>
                <div className="text-xs text-stone-600 leading-relaxed space-y-4">
                  <p>Points will be added to your reward balance after you take certain activities. For example, every time you make a purchase you will earn points based on the price of products purchased.</p>
                  <p className="font-bold text-stone-800 italic">- Each ฿10.00 spent for your order will earn 1 Point .</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-6 border-b border-stone-100 pb-2">How to spend points</h3>
                <div className="text-xs text-stone-600 leading-relaxed space-y-4">
                  <p>You can use points in your reward balance as discount for your future purchases at our store. Please note that redeeming to cash is not allowed.</p>
                  <p className="font-bold text-stone-800 italic">- Each 10 Points can be redeemed for ฿1.00.</p>
                </div>
              </section>

              <section className="md:col-span-2 bg-stone-50/50 p-8 border border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-6">How your points can be managed</h3>
                <ul className="text-xs text-stone-500 space-y-4 list-disc pl-4">
                  <li>Reach 10 Points to start using your balance for your purchase.</li>
                  <li>A transaction will expire after 365 days since its creating date.</li>
                  <li>View transaction history to follow when the transaction expires.</li>
                  <li>Discount by reward point is maximised at 50% of each order.</li>
                </ul>
                <div className="mt-6 p-4 bg-white border border-stone-200 text-[10px] text-stone-400 italic">
                  Example: your order is 5,000 THB You can use up to 25,000 point to discount 2,500 THB for this order. 
                  If you use more than 50% of your order, the system will decrease it to 50% automatically
                </div>
              </section>
            </div>

            {/* Transaction History */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-6 pb-2 border-b border-stone-100">ประวัติการทำธุรกรรม</h3>
              <div className="text-[11px] text-stone-400 py-4 italic">
                ไม่มีรายการ
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
