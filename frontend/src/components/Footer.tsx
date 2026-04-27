import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-stone-950 via-stone-900 to-black text-stone-300 pt-16">

      {/* ================= TOP SECTION ================= */}
      <div className="container mx-auto px-6 lg:px-12 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                🍷
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                The Bottle Club
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed">
              ร้านไวน์และเครื่องดื่มระดับพรีเมียม คัดสรรจากทั่วโลก พร้อมส่งถึงบ้านคุณ
            </p>
          </div>

          {/* MENU */}
          <div>
            <h4 className="text-white font-semibold mb-5 border-l-2 border-amber-500 pl-3">
              หมวดหมู่
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-amber-400">ไวน์แดง</Link></li>
              <li><Link href="#" className="hover:text-amber-400">ไวน์ขาว</Link></li>
              <li><Link href="#" className="hover:text-amber-400">สปาร์คกลิ้ง</Link></li>
              <li><Link href="#" className="hover:text-amber-400">ของขวัญ</Link></li>
            </ul>
          </div>

          {/* SERVICE */}
          <div>
            <h4 className="text-white font-semibold mb-5 border-l-2 border-amber-500 pl-3">
              บริการลูกค้า
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-amber-400">วิธีสั่งซื้อ</Link></li>
              <li><Link href="#" className="hover:text-amber-400">ติดตามสินค้า</Link></li>
              <li><Link href="#" className="hover:text-amber-400">คืนสินค้า</Link></li>
              <li><Link href="#" className="hover:text-amber-400">FAQ</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-5 border-l-2 border-amber-500 pl-3">
              ติดต่อ
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>📞 02-xxx-xxxx</li>
              <li>📧 whatsup@thebottle.club</li>
              <li>💬 LINE: @bottleclub</li>
              <li>🕐 10:00–21:00 ทุกวัน</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= SHIPPING + PAYMENT ================= */}
      <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-stone-800">

        {/* SHIPPING */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-stone-500 tracking-widest">
            DELIVERY BY
          </span>

          <Image
            src="/logos/dhl.png"
            alt="DHL"
            width={60}
            height={24}
            className="opacity-80 hover:opacity-100"
          />
          <Image
            src="/logos/lalamove.png"
            alt="Lalamove"
            width={90}
            height={24}
            className="opacity-80 hover:opacity-100"
          />
        </div>

        {/* PAYMENT */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-stone-500 tracking-widest">
            PAYMENT
          </span>

          <Image src="/payments/visa.png" alt="visa" width={50} height={20} />
          <Image src="/payments/mastercard.png" alt="mc" width={50} height={20} />
          <Image src="/payments/jcb.png" alt="jcb" width={40} height={20} />
          <Image src="/payments/shopeepay.png" alt="shopee" width={60} height={20} />
          <Image src="/payments/promptpay.png" alt="promptpay" width={60} height={20} />
        </div>
      </div>

    </footer>
  );
}