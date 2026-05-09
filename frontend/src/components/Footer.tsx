'use client';

import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MessageCircle, Phone, Wine, Send, ArrowUpRight, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { clearAllCaches } from "@/utils/cache";

export default function Footer() {
  const { t, language } = useLanguage();

  const handleClearCache = () => {
    if (confirm(t('footer.clear_cache_confirm'))) {
      clearAllCaches();
      window.location.reload();
    }
  };

  return (
    <footer className="relative bg-stone-950 text-stone-400 pt-24 overflow-hidden">
      {/* Visual Foundation - Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-[#a11a1a]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container relative mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 pb-20 border-b border-white/5">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="inline-flex items-center gap-5 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#a11a1a] to-amber-500 rounded-full blur-md opacity-20 group-hover:opacity-60 transition-all duration-700"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                  <Wine className="h-7 w-7 text-[#a11a1a]" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-serif font-black tracking-tighter text-white uppercase leading-none">
                  The Bottle Club
                </span>
                <span className="text-[10px] font-black tracking-[0.4em] text-[#a11a1a] uppercase mt-1">
                  Est. 2025 Premium Selections
                </span>
              </div>
            </Link>

            <p className="text-stone-500 text-sm leading-loose max-w-sm">
              {t('footer.brand_desc')}. {t('footer.tagline')}.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
                <MessageCircle size={18} className="text-stone-400 group-hover:text-green-400 transition-colors" />
              </div>
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
                <Send size={18} className="text-stone-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
                <Phone size={18} className="text-stone-400 group-hover:text-[#a11a1a] transition-colors" />
              </div>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">
              {t('footer.categories')}
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: t('footer.red_wine'), href: '#' },
                { label: t('footer.white_wine'), href: '#' },
                { label: t('footer.sparkling'), href: '#' },
                { label: t('footer.gifts'), href: '#' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm hover:text-white transition-all duration-300">
                    <span className="w-0 group-hover:w-2 h-px bg-[#a11a1a] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">
              {t('footer.services')}
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: t('footer.how_to_order'), href: '#' },
                { label: t('footer.tracking'), href: '#' },
                { label: t('footer.returns'), href: '#' },
                { label: t('footer.faq'), href: '#' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm hover:text-white transition-all duration-300">
                    <span className="w-0 group-hover:w-2 h-px bg-[#a11a1a] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">
                {t('footer.newsletter_title')}
              </h4>
              <p className="text-sm text-stone-500">{t('footer.newsletter_desc')}</p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder={t('footer.newsletter_placeholder')} 
                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#a11a1a]/40 focus:bg-white/10 transition-all"
                />
                <button className="p-4 bg-[#a11a1a] text-white rounded-2xl hover:bg-[#8e1515] transition-all shadow-lg shadow-[#a11a1a]/20 group active:scale-95">
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>

            <div className="p-8 bg-gradient-to-br from-stone-900/50 to-stone-950/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-5 group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#a11a1a]/10 transition-colors">
                  <Phone size={18} className="text-[#a11a1a]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest leading-none mb-1">{t('footer.direct_line')}</span>
                  <span className="text-sm text-white font-medium">093 578 6466</span>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#a11a1a]/10 transition-colors">
                  <Mail size={18} className="text-[#a11a1a]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest leading-none mb-1">{t('footer.inquiry')}</span>
                  <span className="text-sm text-white font-medium">whatsup@thebottle.club</span>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#a11a1a]/10 transition-colors">
                  <Clock3 size={18} className="text-[#a11a1a]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest leading-none mb-1">{t('footer.store_hours')}</span>
                  <span className="text-sm text-white font-medium">08:00 - 00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners & Footer Bottom */}
        <div className="py-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 flex-wrap justify-center">
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-[0.4em] w-full lg:w-auto text-center lg:text-left mb-4 lg:mb-0">Delivery Partners</span>
            <Image src="/logos/dhl.png" alt="DHL" width={60} height={24} className="h-6 w-auto object-contain" />
            <Image src="/logos/Lalamove.png" alt="Lalamove" width={90} height={24} className="h-6 w-auto object-contain" />
          </div>

          <button 
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl hover:bg-[#a11a1a]/10 hover:border-[#a11a1a]/20 transition-all group"
          >
            <RefreshCw size={14} className="text-stone-600 group-hover:text-[#a11a1a] transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-stone-600 group-hover:text-[#a11a1a]">Clear Cache & Sync</span>
          </button>

          <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 flex-wrap justify-center">
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-[0.4em] w-full lg:w-auto text-center lg:text-left mb-4 lg:mb-0">Secure Checkout</span>
            <Image src="/payments/visa.png" alt="Visa" width={40} height={20} className="h-4 w-auto object-contain" />
            <Image src="/payments/mastercard.png" alt="Mastercard" width={40} height={20} className="h-4 w-auto object-contain" />
            <Image src="/payments/jcb.png" alt="JCB" width={35} height={20} className="h-4 w-auto object-contain" />
            <Image src="/payments/promptpay.png" alt="PromptPay" width={55} height={20} className="h-4 w-auto object-contain" />
            <Image src="/payments/shopeepay.png" alt="ShopeePay" width={55} height={20} className="h-4 w-auto object-contain" />
          </div>
        </div>

        {/* Cache Control & Copyright */}
     
      </div>
    </footer>
  );
}
