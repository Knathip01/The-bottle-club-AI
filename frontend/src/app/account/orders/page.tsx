import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Package } from 'lucide-react';

export default async function OrdersPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  // Fetch all orders
  let orders = [];
  try {
    const res = await fetch('https://possimon.onrender.com/orders', {
      next: { revalidate: 0 }, // Always fetch fresh orders
    });
    if (res.ok) {
      const allOrders = await res.json();
      // Filter orders for the current user
      // Note: user.id might be a string in Supabase, but the API expects an integer. 
      // We'll compare using loose equality or Number() just in case.
      orders = allOrders.filter((order: any) => Number(order.user_id) === Number(user.id));
      
      // Sort by created_at descending (newest first)
      orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }

  return (
    <main className="min-h-screen flex flex-col bg-stone-50">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          HOME / MY ACCOUNT / ORDERS
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar user={user} activePath="/account/orders" />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-8">คำสั่งซื้อ</h1>

            <div className="bg-white border border-stone-200 p-6 mb-8">
              {orders.length === 0 ? (
                <div className="bg-[#fcf8e3] text-[#8a6d3b] p-4 text-sm flex items-center gap-3">
                  <span className="font-bold text-lg">⚠</span> คุณไม่มีประวัติการสั่งซื้อ
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border border-stone-200 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <Package className="text-stone-400" size={20} />
                          <h3 className="font-bold text-sm">Order #{order.id}</h3>
                        </div>
                        <span className="text-xs bg-stone-100 px-3 py-1 rounded-full text-stone-600 font-medium uppercase">
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-stone-400 text-xs mb-1">วันที่สั่งซื้อ</p>
                          <p className="font-medium text-stone-800">
                            {new Date(order.created_at).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-stone-400 text-xs mb-1">ยอดรวม</p>
                          <p className="font-bold text-[#a11a1a]">฿{order.total_price?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 text-xs mb-1">วิธีชำระเงิน</p>
                          <p className="font-medium text-stone-800 uppercase">{order.payment_method}</p>
                        </div>
                        <div className="flex items-end justify-end">
                          <button className="text-xs font-bold text-stone-600 border border-stone-300 px-4 py-2 hover:bg-stone-50 transition-colors">
                            ดูรายละเอียด
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
