import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-6">
          HOME / CHECKOUT
        </div>

        <CheckoutForm user={session.user} />
      </div>

      <Footer />
    </main>
  );
}
