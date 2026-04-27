import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import CartContent from '@/components/cart/CartContent';

export default function CartPage() {
  const points = 905; // This could be dynamic based on cart total if fetched server-side

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-6">
          HOME / CART
        </div>

        {/* Success Alert (Mock) */}
        <div className="bg-[#f0f9eb] text-[#67c23a] px-4 py-3 text-xs mb-8 flex items-center gap-2 border border-[#e1f3d8]">
          <span className="font-bold">✓</span> ชำระเงินทันทีและรับ <span className="font-bold">{points} POINTS</span> สำหรับคำสั่งซื้อนี้
        </div>

        <CartContent />
      </div>

      <Footer />
    </main>
  );
}
