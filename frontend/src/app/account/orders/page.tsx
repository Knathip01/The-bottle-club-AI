import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { query } from '@/lib/db';
import OrdersContent from '@/components/account/OrdersContent';

export default async function OrdersPage() {
  const session = await getSession();
  const { user } = (session as any) || {};
  
  if (!user) {
    redirect('/login');
  }

  // Fetch all orders from both API and local DB
  let orders: any[] = [];
  
  // 1. Fetch from Render API
  let apiOrders: any[] = [];
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';
    const token = session?.user?.access_token;
    
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      headers,
      next: { revalidate: 0 },
    });
    
    if (res.ok) {
      const allOrders = await res.json();
      if (Array.isArray(allOrders)) {
        apiOrders = allOrders.map((order: any) => ({
          ...order,
          // Handle schema: OrderOut might have total_price
          total_price: order.total_price || order.total_amount || 0,
          payment_method: order.payment_method || 'API'
        }));
      }
    } else {
      console.error('API response not OK:', res.status);
    }
  } catch (error) {
    console.error('Failed to fetch orders from API:', error);
  }

  // 2. Fetch from Local Database (Fallback/Historical)
  let localOrders: any[] = [];
  try {
    const userId = user.id || user.user_id;
    if (userId) {
      const result = await query('SELECT * FROM orders WHERE user_id::text = $1::text', [userId]);
      localOrders = result.rows.map(order => ({
        ...order,
        total_price: Number(order.total_amount),
        payment_method: 'Stripe/Local',
        created_at: order.created_at?.toISOString ? order.created_at.toISOString() : (order.created_at || new Date().toISOString())
      }));
    }
  } catch (error) {
    console.error('Failed to fetch orders from local DB:', error);
  }

  // Combine and remove duplicates (by ID if both sources have the same order)
  const combined = [...apiOrders, ...localOrders];
  const uniqueOrders = Array.from(new Map(combined.map(item => [item.id, item])).values());
  
  orders = uniqueOrders;
  orders.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });

  return (
    <main className="min-h-screen flex flex-col bg-stone-50">
      <MainHeader />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar user={user} activePath="/account/orders" />
          <OrdersContent initialOrders={orders} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
