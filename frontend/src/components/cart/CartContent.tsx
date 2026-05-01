'use client';

import { useSyncExternalStore } from 'react';
import type { CartItem } from '@/lib/cart';
import { readCart, subscribeCart, writeCart } from '@/lib/cart';
import Link from 'next/link';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CartContent() {
  const items = useSyncExternalStore(subscribeCart, readCart, () => [] as CartItem[]);
  const { t } = useLanguage();

  const updateQuantity = (id: number, delta: number) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    writeCart(newItems);
  };

  const removeItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    writeCart(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal;
  const points = Math.floor(subtotal / 10);
  const priceBeforeTax = subtotal - tax;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Cart Items Table */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-stone-100 p-2"><Trash2 size={20} className="text-stone-400" /></span>
          <h1 className="text-lg font-bold">{t('cart.title')}</h1>
          <span className="text-stone-400 text-sm">{items.length} {t('cart.items')}</span>
        </div>

        <div className="border-t border-stone-100">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-stone-500 mb-6">{t('cart.empty')}</p>
              <Link href="/" className="px-8 py-3 bg-stone-900 text-white text-xs font-bold uppercase hover:bg-black transition-colors">
                {t('hero.cta_all')}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-8 border-b border-stone-100 flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-24 h-32 flex-shrink-0 bg-stone-50 flex items-center justify-center p-2">
                  <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-stone-800 leading-relaxed mb-1 uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-stone-400 text-xs mb-4">฿{item.price.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-900 uppercase">
                      <Heart size={14} /> {t('cart.favorite')}
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-900 uppercase"
                    >
                      <Trash2 size={14} /> {t('cart.remove')}
                    </button>
                  </div>
                </div>

                {/* Quantity & Subtotal */}
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center border border-stone-200">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-stone-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-stone-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="font-bold text-sm">฿{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-8 flex justify-between">
            <button 
              onClick={() => {
                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('cart:updated'));
              }}
              className="px-8 py-3 border border-stone-900 text-xs font-bold uppercase hover:bg-stone-50 transition-colors"
            >
              {t('cart.clear')}
            </button>
            <button className="px-8 py-3 border border-stone-900 text-xs font-bold uppercase hover:bg-stone-50 transition-colors">
              {t('cart.update')}
            </button>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      <div className="w-full lg:w-[380px]">
        {/* Promo Code Section */}
        <div className="bg-[#f5f5f5] p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎫</span>
            <span className="text-xs font-bold uppercase">{t('cart.promo_code')}</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={t('cart.promo_placeholder')} 
              className="flex-1 border border-stone-300 p-2.5 text-xs focus:outline-none"
            />
            <button className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase hover:bg-stone-800 transition-colors">
              {t('cart.apply')}
            </button>
          </div>
        </div>

        {/* Total Summary Section */}
        <div className="bg-[#f5f5f5] p-6">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500 font-medium uppercase">{t('cart.subtotal')}</span>
              <span className="font-bold">฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500 font-medium uppercase">{t('cart.points')}</span>
              <span className="text-stone-800 font-bold">{points} POINTS</span>
            </div>
            <div className="flex justify-between items-center text-xs bg-stone-200/50 p-2 -mx-2">
              <span className="text-stone-500 font-medium uppercase">{t('cart.pretax')}</span>
              <span className="font-bold">฿{priceBeforeTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500 font-medium uppercase">{t('cart.tax')}</span>
              <span className="font-bold">฿{tax.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs font-bold uppercase">{t('cart.total')}</span>
              <span className="text-lg font-bold">฿{total.toLocaleString()}</span>
            </div>
          </div>

          <Link 
            href="/checkout"
            className="block w-full bg-[#a11a1a] text-white text-center py-4 text-sm font-bold uppercase hover:bg-red-800 transition-colors"
          >
            {t('cart.checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
}
