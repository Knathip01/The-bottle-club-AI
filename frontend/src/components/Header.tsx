'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, MapPin, User, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface HeaderProps {
  user?: any;
}

export default function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('cart');
    await logout();
  };

  return (
    <>
      {/* Top Black Bar */}
    

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
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <input 
                type="text" 
                placeholder="SEARCH ENTIRE STORE HERE..." 
                className="w-full border border-stone-300 rounded-full py-2.5 px-6 text-xs text-stone-600 focus:outline-none focus:border-stone-500"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600">
                <Search size={18} />
              </button>
            </div>

            {/* Auth & Cart */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:flex items-center gap-4 text-sm font-bold text-stone-800">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/account" className="flex items-center gap-2 group">
                      <User size={18} className="text-stone-500 group-hover:text-stone-900 transition-colors" />
                      <span className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors">{user.email}</span>
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
                    <Link href="/register" className="hover:underline underline-offset-4">สมัครสมาชิก</Link>
                    <Link href="/login" className="hover:underline underline-offset-4 text-stone-500">เข้าสู่ระบบ</Link>
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
            <Link href="/" className="hover:text-black">ไวน์</Link>
            <Link href="#" className="hover:text-black">อุปกรณ์</Link>
            <Link href="#" className="hover:text-black">ตู้แช่ไวน์</Link>
            <Link href="#products" className="hover:text-black">สินค้าแนะนำ</Link>
            <Link href="#" className="hover:text-black">แบรนด์</Link>
            <Link href="#" className="hover:text-black">บทความ</Link>
          </nav>
        </div>

        {/* Mobile Navigation & Search */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white p-4">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="SEARCH..." 
                className="w-full border border-stone-300 rounded-full py-2 px-4 text-sm focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            </div>
            <nav className="flex flex-col space-y-4 font-bold text-sm">
              <Link href="/register">สมัครสมาชิก</Link>
              <Link href="/login" className="text-stone-500">เข้าสู่ระบบ</Link>
              <hr />
              <Link href="/">ไวน์</Link>
              <Link href="#">อุปกรณ์</Link>
              <Link href="#">ตู้แช่ไวน์</Link>
              <Link href="#products">สินค้าแนะนำ</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
