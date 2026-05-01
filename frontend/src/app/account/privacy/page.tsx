import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getSession } from '@/lib/auth-utils';

export default async function PrivacySettingsPage() {
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
          <AccountSidebar user={user} activePath="/account/privacy" />

          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">ตั้งค่าความเป็นส่วนตัว</h1>

            <section className="max-w-3xl">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 pb-2 border-b border-stone-100">Delete Account</h3>
              
              <div className="bg-stone-50 p-8 border border-stone-100">
                <p className="text-[11px] text-stone-600 font-medium uppercase leading-relaxed mb-6 tracking-tight">
                  Request to remove your account, together with all your personal data, will be processed by our staff. 
                  Deleting your account will remove all the purchase history, discounts, orders, invoices and all other 
                  information that might be related to your account or your purchases.
                  <br /><br />
                  <span className="text-red-700 font-bold">All your orders and similar information will be lost.</span>
                  <br />
                  You will not be able to restore access to your account after we approve your removal request.
                </p>

                <form className="space-y-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-0.5 w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
                    />
                    <span className="text-[11px] font-bold text-stone-700 group-hover:text-stone-900 transition-colors">
                      ฉันเข้าใจและต้องการลบบัญชีของฉัน
                    </span>
                  </label>

                  <button 
                    type="submit"
                    className="bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
                  >
                    ส่งคำขอ
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
