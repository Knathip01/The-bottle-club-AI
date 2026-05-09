'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, User, LogOut, ChevronDown, MapPin, Wine, Sparkles, Grape, MapPinned, ShieldCheck, BadgePercent } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  user?: {
    email?: string | null;
  };
}

const languages = [
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
] as const;

export default function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('cart');
    await logout();
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];
  const desktopNavItems = [
    { href: '#wine-categories', label: t('nav.wine'), icon: Wine },
    { href: '#products', label: t('nav.pairings'), icon: Sparkles },
    { href: '#wine-categories', label: t('nav.grapes'), icon: Grape },
    { href: '#products', label: t('nav.regions'), icon: MapPinned },
    { href: '#products', label: t('nav.premium'), icon: BadgePercent },
    { href: '#products', label: t('nav.wineries'), icon: ShieldCheck, badge: 'New' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/60 bg-white/86 shadow-sm shadow-stone-950/5 backdrop-blur-2xl">
      <div className="container mx-auto px-3 sm:px-5 lg:px-12">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between gap-3 md:h-20 md:gap-8 md:border-b md:border-stone-100/60">
          {/* Mobile menu button */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-all active:scale-95 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>

          {/* Logo */}
          <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#a11a1a] to-rose-400 opacity-0 blur-md transition-all duration-700 group-hover:opacity-20" />
              <Image
                src="/logos/Thebottleclub.jpg"
                alt="The Bottle Club"
                width={48}
                height={48}
                className="relative h-10 w-10 rounded-full border-2 border-white object-cover shadow-lg transition-transform duration-700 ease-out group-hover:scale-105 md:h-12 md:w-12"
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate bg-gradient-to-br from-stone-950 via-stone-800 to-stone-500 bg-clip-text text-base font-black uppercase tracking-tight text-transparent sm:text-xl">
                The Bottle Club
              </span>
              <span className="-mt-0.5 hidden text-[8px] font-black uppercase tracking-[0.3em] text-[#a11a1a] opacity-80 sm:block">Premium Selections</span>
            </div>
          </Link>

          {/* Search Bar & Address */}
          <div className="hidden lg:flex flex-1 items-center gap-8 max-w-2xl">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=179/1+ถนนพระปกเกล้า+ตำบลศรีภูมิ+อำเภอเมืองเชียงใหม่+จังหวัดเชียงใหม่+50200"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-2.5 bg-stone-50/40 hover:bg-white border border-stone-100 hover:border-stone-200 rounded-3xl transition-all duration-500 group shadow-sm hover:shadow-xl"
            >
              <div className="relative p-2 bg-white rounded-xl shadow-inner group-hover:shadow-none transition-all">
                <MapPin size={16} className="text-[#a11a1a]" />
              </div>
              <div className="flex flex-col border-l border-stone-200 pl-4">
                <span className="text-[10px] leading-tight font-black text-stone-800 uppercase tracking-wider">Chiang Mai</span>
                <span className="text-[9px] text-stone-400 font-medium tracking-tight">179/1 Phrapokklao Rd...</span>
              </div>
            </a>

            <form onSubmit={handleSearch} className="flex-1 relative group">
              <input 
                type="text" 
                placeholder={t('search.placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50/40 border border-stone-100 rounded-3xl py-3 px-8 text-[11px] font-medium text-stone-600 focus:outline-none focus:bg-white focus:border-[#a11a1a]/20 focus:ring-[6px] focus:ring-[#a11a1a]/5 transition-all duration-700 placeholder:text-stone-300 shadow-sm"
              />
              <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 text-stone-300 group-focus-within:text-[#a11a1a] hover:bg-stone-50 rounded-xl transition-all duration-500">
                <Search size={16} strokeWidth={3} />
              </button>
            </form>
          </div>

          {/* Auth, Language & Cart */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 hover:bg-stone-50 transition-all px-3 py-2.5 rounded-2xl group border border-transparent hover:border-stone-100"
                >
                  <span className="text-xl leading-none">
                    {currentLang.flag}
                  </span>
                  <ChevronDown size={10} strokeWidth={3} className={`transition-transform duration-500 text-stone-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-3 w-20 bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/50 rounded-3xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-300 ring-1 ring-black/5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-center px-4 py-3 hover:bg-[#a11a1a]/5 transition-colors ${
                          language === lang.code ? 'bg-[#a11a1a]/5' : ''
                        }`}
                      >
                        <span className="text-2xl leading-none">
                          {lang.flag}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-stone-200/40 mx-2"></div>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/account" className="flex items-center gap-3 group p-2 pr-4 hover:bg-stone-50 rounded-2xl transition-all border border-transparent hover:border-stone-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                      <User size={16} strokeWidth={2.5} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                    </div>
                    <span className="text-stone-600 font-black text-[10px] uppercase tracking-widest group-hover:text-stone-900 transition-colors max-w-[80px] truncate">{user.email}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    title="Logout"
                  >
                    <LogOut size={18} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link href="/login" className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-all">{t('auth.login')}</Link>
                  <Link href="/register" className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] bg-stone-900 text-white rounded-2xl hover:bg-[#a11a1a] transition-all shadow-lg hover:shadow-[#a11a1a]/20 active:scale-95">{t('auth.register')}</Link>
                </div>
              )}
            </div>
            
            <Link href="/cart" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-950 shadow-sm transition-all active:scale-95 md:h-12 md:w-12 md:hover:bg-stone-50" aria-label="Cart">
              <ShoppingBag size={21} strokeWidth={2.5} />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#a11a1a] text-[8px] font-black text-white shadow-lg transition-transform group-hover:scale-110">
                0
              </span>
            </Link>
          </div>
        </div>

        <nav className="hidden h-14 items-center justify-center gap-5 overflow-x-auto text-sm md:flex lg:gap-8">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-2.5 whitespace-nowrap text-stone-800 transition-colors hover:text-[#a11a1a]"
              >
                <Icon size={17} strokeWidth={1.9} className="text-stone-700 transition-colors group-hover:text-[#a11a1a]" />
                <span className="text-[0.98rem] font-medium">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-[#f4c84c] px-3 py-1 text-[11px] font-semibold text-stone-900">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation & Search */}
      {isMobileMenuOpen && (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-stone-100/70 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-10 duration-500 ease-out md:hidden">
          <a 
            href="https://www.google.com/maps/search/?api=1&query=179/1+ถนนพระปกเกล้า+ตำบลศรีภูมิ+อำเภอเมืองเชียงใหม่+จังหวัดเชียงใหม่+50200"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 flex items-center gap-4 rounded-3xl border border-stone-100 bg-stone-50 p-4 shadow-inner transition-all active:scale-95"
          >
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <MapPin size={24} className="text-[#a11a1a]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-wider text-stone-800">Chiang Mai</span>
              <span className="text-xs text-stone-500 font-medium opacity-70">179/1 Phrapokklao Rd...</span>
            </div>
          </a>

          <form onSubmit={handleSearch} className="relative mb-6">
            <input 
              type="text" 
              placeholder={t('search.placeholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-14 w-full rounded-full border border-stone-200 bg-stone-50/80 px-6 pr-14 text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-8 focus:ring-[#a11a1a]/5"
            />
            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300">
              <Search size={20} strokeWidth={3} />
            </button>
          </form>
          
          <nav className="flex flex-col gap-3">
            <Link href="#wine-categories" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between rounded-3xl bg-stone-50 p-4 transition-all active:scale-95">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-white rounded-2xl shadow-md group-active:shadow-none transition-all">
                  <Wine size={24} strokeWidth={2.5} className="text-[#a11a1a]" />
                </div>
                  <span className="text-sm font-black uppercase tracking-[0.18em] text-stone-700">Wines</span>
              </div>
              <ChevronDown size={20} strokeWidth={3} className="-rotate-90 text-stone-200" />
            </Link>

            <Link href="#products" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between rounded-3xl bg-stone-50 p-4 transition-all active:scale-95">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-white rounded-2xl shadow-md group-active:shadow-none transition-all">
                  <Sparkles size={24} strokeWidth={2.5} className="text-[#a11a1a]" />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.18em] text-stone-700">{language === 'th' ? 'แนะนำ' : t('nav.recommended')}</span>
              </div>
              <ChevronDown size={20} strokeWidth={3} className="-rotate-90 text-stone-200" />
            </Link>
            
            <div className="mt-4 border-t border-stone-100/70 pt-6">
              <p className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.32em] text-stone-400">World Languages</p>
              <div className="grid grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center rounded-xl border p-2 transition-all ${
                      language === lang.code 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105' 
                        : 'bg-white text-stone-500 border-stone-100 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xl leading-none">
                      {lang.flag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div className="grid grid-cols-2 gap-3 pt-6">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex min-h-14 items-center justify-center rounded-2xl bg-stone-100 px-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-stone-600 transition-all active:scale-95">
                  {t('auth.login')}
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex min-h-14 items-center justify-center rounded-2xl bg-stone-950 px-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-xl transition-all active:scale-95">
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
