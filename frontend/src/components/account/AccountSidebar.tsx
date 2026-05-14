'use client';

import Link from 'next/link';
import { User, CreditCard, UserCircle, MapPin, ClipboardList, Heart, ShieldCheck, Star, Award, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';

interface AccountSidebarProps {
  user: any;
  activePath?: string;
}

export default function AccountSidebar({ user, activePath = '/account' }: AccountSidebarProps) {
  const { t } = useLanguage();
  
  const handleLogout = async () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('access_token');
    await logout();
  };

  const menuItems = [
    { name: t('account.title'), icon: UserCircle, href: '/account', active: activePath === '/account' },
    { name: t('account.payment_confirm'), icon: CreditCard, href: '#' },
    { name: t('account.profile'), icon: User, href: '/account/profile', active: activePath === '/account/profile' },
    { name: t('account.addresses'), icon: MapPin, href: '/account/addresses', active: activePath === '/account/addresses' },
    { name: t('account.orders'), icon: ClipboardList, href: '/account/orders', active: activePath === '/account/orders' },
    { name: t('account.favorites'), icon: Heart, href: '#' },
    { name: t('account.privacy'), icon: ShieldCheck, href: '/account/privacy', active: activePath === '/account/privacy' },
    { name: t('account.reviews'), icon: Star, href: '/account/reviews', active: activePath === '/account/reviews' },
    { name: t('account.points'), icon: Award, href: '/account/points', active: activePath === '/account/points' },
  ];

  return (
    <div className="w-full md:w-64 flex flex-col gap-6">
      {/* User Profile Card */}
      <div className="bg-[#f5f3ef] p-6 text-center flex flex-col items-center border border-stone-200">
        <div className="w-20 h-20 bg-stone-300 rounded-full flex items-center justify-center mb-4 overflow-hidden">
          <User size={48} className="text-stone-500" />
        </div>
        <h2 className="font-bold text-sm uppercase tracking-wider mb-1">
          {user?.first_name} {user?.last_name}
        </h2>
        <p className="text-stone-500 text-[10px] uppercase mb-4">{user?.email}</p>
        
        <button className="bg-[#fbbf24] hover:bg-[#f59e0b] transition-colors px-6 py-2 rounded-full text-[11px] font-bold flex items-center gap-2">
          <span className="bg-black/20 p-1 rounded-full"><Award size={12} /></span>
          {t('account.your_points')}: 0
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white border border-stone-100 flex flex-col overflow-hidden">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-4 text-xs font-medium border-l-4 transition-colors ${
              item.active 
                ? 'bg-stone-50 border-stone-900 text-stone-900' 
                : 'border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <item.icon size={16} />
            {item.name}
          </Link>
        ))}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 text-xs font-medium border-l-4 border-transparent text-stone-500 hover:bg-stone-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          {t('account.logout')}
        </button>
      </nav>
    </div>
  );
}
