'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, User, LogOut, ChevronDown, Globe } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  user?: any;
}

const languages = [
  { code: 'th', name: 'Thai', flag: 'https://flagcdn.com/w40/th.png' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'fr', name: 'French', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'zh', name: 'Chinese', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'ja', name: 'Japanese', flag: 'https://flagcdn.com/w40/jp.png' },
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>


      <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Main Header */}
          <div className="flex h-24 items-center justify-between gap-4 md:gap-8 border-b border-stone-100">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-stone-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="https://scontent.fcnx3-1.fna.fbcdn.net/v/t39.30808-6/556861286_25169899605941128_4149678781583050450_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=u56-UTUBzDQQ7kNvwFXulQ0&_nc_oc=Adq6pFbRXd80nWfPyWjNTFPJSH_O2PwFuu9tFAjrKzpg4321TepLzG9Iu8y_O7ZD0XrS7jHOJSxCpAZpGSmaUp-X&_nc_zt=23&_nc_ht=scontent.fcnx3-1.fna&_nc_gid=dCTvkxPhjaK8kXn3i-LQhA&_nc_ss=7b2a8&oh=00_Af2StMlzOvdKzoMiXfCWFGaD_W7ex_pg5xcUqkC65AbvNw&oe=69F40B29"
                alt="logo"
                className="h-10 w-10 rounded-full object-cover border border-gray-300"
              />
              <span className="text-xl font-bold">The Bottle Club</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
              <input 
                type="text" 
                placeholder={t('search.placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-stone-300 rounded-full py-2.5 px-6 text-xs text-stone-600 focus:outline-none focus:border-stone-500"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600">
                <Search size={18} />
              </button>
            </form>

            {/* Auth, Language & Cart */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:flex items-center gap-4 text-sm font-bold text-stone-800">
                {/* Language Switcher moved here */}
                <div className="relative">
                  <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-1.5 hover:text-stone-500 transition-colors py-2"
                  >
                    <img src={currentLang.flag} alt={language} className="w-5 h-3.5 object-cover rounded-sm border border-stone-200" />
                    <span className="text-[11px] uppercase tracking-wider font-bold">{language}</span>
                    <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangOpen && (
                    <div className="absolute top-full right-0 mt-1 w-32 bg-white text-stone-900 shadow-xl border border-stone-100 rounded-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[10px] font-bold hover:bg-stone-50 transition-colors flex items-center gap-2 ${
                            language === lang.code ? 'bg-stone-50 text-stone-900' : 'text-stone-500'
                          }`}
                        >
                          <img src={lang.flag} alt={lang.name} className="w-4 h-3 object-cover rounded-sm border border-stone-100" />
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-4 w-px bg-stone-200 mx-1"></div>

                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/account" className="flex items-center gap-2 group">
                      <User size={18} className="text-stone-500 group-hover:text-stone-900 transition-colors" />
                      <span className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors max-w-[120px] truncate">{user.email}</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-1 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/register" className="hover:underline underline-offset-4">{t('auth.register')}</Link>
                    <Link href="/login" className="hover:underline underline-offset-4 text-stone-500">{t('auth.login')}</Link>
                  </>
                )}
              </div>
              <Link href="/cart" className="p-2 text-stone-800 relative flex items-center gap-2" aria-label="Cart">
                <ShoppingBag size={24} strokeWidth={1.5} />
                <span className="hidden md:inline font-bold text-sm">0</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center h-12 gap-8 text-sm font-bold text-stone-700">
            <Link href="/" className="hover:text-black">{t('nav.wine')}</Link>
            <Link href="#" className="hover:text-black">{t('nav.accessories')}</Link>
            <Link href="#" className="hover:text-black">{t('nav.coolers')}</Link>
            <Link href="#products" className="hover:text-black">{t('nav.recommended')}</Link>
            <Link href="#" className="hover:text-black">{t('nav.brands')}</Link>
            <Link href="#" className="hover:text-black">{t('nav.articles')}</Link>
          </nav>
        </div>

        {/* Mobile Navigation & Search */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white p-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            <form onSubmit={handleSearch} className="relative mb-6">
              <input 
                type="text" 
                placeholder={t('search.placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-stone-300 rounded-full py-2.5 px-4 text-sm focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                <Search size={16} />
              </button>
            </form>
            <nav className="flex flex-col space-y-6 font-bold text-sm">
              {!user && (
                <>
                  <Link href="/register" className="text-stone-900">{t('auth.register')}</Link>
                  <Link href="/login" className="text-stone-500">{t('auth.login')}</Link>
                  <hr className="border-stone-100" />
                </>
              )}
              <Link href="/">{t('nav.wine')}</Link>
              <Link href="#">{t('nav.accessories')}</Link>
              <Link href="#">{t('nav.coolers')}</Link>
              <Link href="#products">{t('nav.recommended')}</Link>
              <Link href="#">{t('nav.brands')}</Link>
              <Link href="#">{t('nav.articles')}</Link>
              
              <hr className="border-stone-100" />
              <div className="pt-2">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-4">Select Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                        language === lang.code 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={lang.flag} alt={lang.name} className="w-5 h-3.5 object-cover rounded-sm" />
                        <span>{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
