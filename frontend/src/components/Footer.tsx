'use client';

import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MessageCircle, Phone, Wine } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-stone-950 via-stone-900 to-black text-stone-300 pt-16">
      <div className="container mx-auto px-6 lg:px-12 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Wine className="h-4 w-4 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                The Bottle Club
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed">
              {t('footer.brand_desc')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 border-l-2 border-amber-500 pl-3">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-amber-400">{t('footer.red_wine')}</Link></li>
              <li><Link href="#" className="hover:text-amber-400">{t('footer.white_wine')}</Link></li>
              <li><Link href="#" className="hover:text-amber-400">{t('footer.sparkling')}</Link></li>
              <li><Link href="#" className="hover:text-amber-400">{t('footer.gifts')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 border-l-2 border-amber-500 pl-3">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-amber-400">{t('footer.how_to_order')}</Link></li>
              <li><Link href="#" className="hover:text-amber-400">{t('footer.tracking')}</Link></li>
              <li><Link href="#" className="hover:text-amber-400">{t('footer.returns')}</Link></li>
              <li><Link href="#" className="hover:text-amber-400">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 border-l-2 border-amber-500 pl-3">
              {t('footer.contact_title')}
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-pink-400" />
                <span>093 578 6466</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-stone-300" />
                <span>whatsup@thebottle.club</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-stone-300" />
                <span>LINE: @bottleclub</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-stone-300" />
                <span>10:00-21:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-stone-800">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-stone-500 tracking-widest">
            {t('footer.delivery_by')}
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

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-stone-500 tracking-widest">
            {t('footer.payment')}
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
