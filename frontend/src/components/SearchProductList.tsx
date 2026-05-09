'use client';

import React, { useState } from 'react';
import { addCartItem } from '@/lib/cart';
import type { Product } from '@/lib/products';
import { ShoppingCart, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SearchProductListProps {
  products: Product[];
}

export default function SearchProductList({ products }: SearchProductListProps) {
  const { t } = useLanguage();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const getMockRating = (id: number) => {
    const rating = (3.5 + (id % 15) / 10).toFixed(1);
    const reviews = 100 + (id * 17) % 900;
    return { rating, reviews };
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    });
  };

  const getCountryName = (code?: string) => {
    return code?.toUpperCase() || '...';
  };

  const handleSelectProduct = (product: Product) => {
    setLoadingId(product.id);

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: `/images/wine_${product.color || 'red'}.png`,
    };

    try {
      addCartItem(cartItem);

      setTimeout(() => {
        window.location.href = '/cart';
      }, 300);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {products.map((product) => {
        const { rating, reviews } = getMockRating(product.id);
        const wineColor = product.color || 'red';
        const countryCode = product.countryCode?.toLowerCase() || 'fr';

        return (
          <div
            key={product.id}
            className="group flex flex-col gap-8 overflow-hidden rounded-3xl border border-stone-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row"
          >
            <div
              className="relative flex h-64 w-full flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-stone-50 p-4 md:w-48"
              onClick={() => handleSelectProduct(product)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-stone-200/30" />

              <div className="relative transition-transform duration-500 group-hover:scale-110">
                <div
                  className={`relative h-40 w-10 overflow-hidden rounded-b-md rounded-t-full shadow-lg ${
                    wineColor === 'red'
                      ? 'bg-red-900'
                      : wineColor === 'white'
                        ? 'bg-amber-100'
                        : wineColor === 'rose'
                          ? 'bg-pink-300'
                          : 'bg-stone-800'
                  }`}
                >
                  <div className="absolute left-0 right-0 top-4 h-8 bg-white/20" />
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-black/10" />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center">
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {product.type || t('search.wine_type')} - {product.sub_type || t('products.classic')}
                </span>
              </div>
              <h2
                className="mb-1 cursor-pointer font-serif text-2xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-[#a11a1a]"
                onClick={() => handleSelectProduct(product)}
              >
                {product.name}
              </h2>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex h-3.5 w-5 shrink-0 overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
                  <img
                    src={`https://flagcdn.com/w40/${countryCode}.png`}
                    alt={countryCode}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-stone-500">
                  {product.region ? `${product.region}, ` : ''}
                  {getCountryName(product.countryCode)}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center border-t border-stone-100 pt-6 md:w-48 md:items-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div className="mb-6 text-center md:text-right">
                <div className="mb-1 flex items-center justify-center gap-2 md:justify-end">
                  <span className="text-3xl font-bold text-stone-900">{rating}</span>
                  <div className="flex flex-col">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= Math.floor(Number(rating)) ? 'fill-red-500 text-red-500' : 'text-stone-300'}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">
                      ({reviews} {t('search.ratings')})
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="mb-2 text-center md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {t('search.avg_price')}
                  </span>
                </div>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008967] py-4 text-lg font-bold text-white shadow-lg transition-colors active:scale-95 hover:bg-[#007054] disabled:opacity-70"
                  onClick={() => handleSelectProduct(product)}
                  disabled={loadingId === product.id}
                >
                  {loadingId === product.id ? (
                    <span className="animate-pulse">{t('search.loading')}</span>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      {formatPrice(product.price)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
