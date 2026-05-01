'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/products';
import { addCartItem } from '@/lib/cart';
import { useLanguage } from '@/context/LanguageContext';

type ProductGridProps = {
  products: Product[];
};

type FilterId = 'all' | 'red' | 'white' | 'rose' | 'premium';

export default function ProductGrid({ products }: ProductGridProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [checkoutProductId, setCheckoutProductId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filters: { id: FilterId; label: string }[] = [
    { id: 'all', label: mounted ? t('products.filter.all') : 'All' },
    { id: 'red', label: mounted ? t('products.filter.red') : 'Red' },
    { id: 'white', label: mounted ? t('products.filter.white') : 'White' },
    { id: 'rose', label: mounted ? t('products.filter.rose') : 'Rose' },
    { id: 'premium', label: mounted ? t('products.filter.premium') : 'Premium' },
  ];

  function getProductCategory(product: Product): string {
    if (product.color === 'red') return 'red';
    if (product.color === 'white') return 'white';
    if (product.color === 'rose') return 'rose';
    return 'other';
  }

  function getProductPalette(product: Product) {
    const category = getProductCategory(product);

    if (category === 'red') {
      return {
        panel: 'from-red-100 via-rose-50 to-red-200',
        badge: 'bg-red-800 text-white',
        chip: 'bg-white/80 text-red-700 ring-1 ring-red-200',
        halo: 'bg-red-800/15 text-red-900',
        label: mounted ? t('products.red_wine_label') : 'Red Wine',
      };
    }

    if (category === 'white') {
      return {
        panel: 'from-amber-50 via-white to-yellow-100',
        badge: 'bg-amber-600 text-white',
        chip: 'bg-white/80 text-amber-700 ring-1 ring-amber-200',
        halo: 'bg-amber-500/15 text-amber-900',
        label: mounted ? t('products.white_wine_label') : 'White Wine',
      };
    }

    if (category === 'rose') {
      return {
        panel: 'from-pink-100 via-rose-50 to-pink-200',
        badge: 'bg-pink-600 text-white',
        chip: 'bg-white/80 text-pink-700 ring-1 ring-pink-200',
        halo: 'bg-pink-500/15 text-pink-900',
        label: mounted ? t('products.rose_wine_label') : 'Rose Wine',
      };
    }

    return {
      panel: 'from-stone-100 via-white to-stone-200',
      badge: 'bg-stone-900 text-white',
      chip: 'bg-white/80 text-stone-700 ring-1 ring-stone-200',
      halo: 'bg-stone-900/10 text-stone-900',
      label: mounted ? t('products.wine_label') : 'Wine',
    };
  }

  function formatPrice(price: number) {
    return price.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function getStockTone(stock: number) {
    if (stock <= 0) {
      return 'bg-red-100 text-red-700';
    }

    if (stock < 20) {
      return 'bg-amber-100 text-amber-700';
    }

    return 'bg-emerald-100 text-emerald-700';
  }

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'premium') {
      return product.price >= 3000;
    }

    return getProductCategory(product) === filter;
  });

  const handleCheckout = (product: Product) => {
    setCheckoutProductId(product.id);

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: `/images/wine_${product.color || 'red'}.png`,
    };

    addCartItem(cartItem);

    setTimeout(() => {
      window.location.href = '/cart';
    }, 500);
  };

  return (
    <section className="py-20" id="products">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-serif font-bold">{mounted ? t('products.title') : 'Our Collection'}</h2>
          <p className="mx-auto max-w-2xl text-stone-500">
            {mounted ? t('products.subtitle') : 'Finest wines from around the world'}
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2 md:gap-4">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                filter === item.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-8 py-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              {mounted ? t('products.api_unavailable') : 'API Unavailable'}
            </p>
            <h3 className="mt-4 text-2xl font-serif font-bold text-stone-900">
              {mounted ? t('products.load_error_title') : 'Failed to Load'}
            </h3>
            <p className="mt-3 text-stone-600">
              {mounted ? t('products.load_error_desc') : 'Something went wrong.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const palette = getProductPalette(product);

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm transition-shadow hover:shadow-xl flex flex-col h-full"
                >
                  <div
                    className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-gradient-to-br p-8 ${palette.panel}`}
                  >
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStockTone(product.stock)}`}
                    >
                      {mounted ? t('products.in_stock') : 'Stock'}: {product.stock}
                    </span>
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${palette.chip}`}
                    >
                      {mounted ? palette.label : ''}
                    </span>
                    
                    {/* Wine Bottle Placeholder Styling */}
                    <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                      <div className={`w-16 h-48 rounded-t-full rounded-b-lg shadow-2xl ${palette.badge} opacity-90 relative z-10 overflow-hidden`}>
                        <div className="absolute top-1/4 left-0 right-0 h-12 bg-white/20"></div>
                        <div className="absolute top-1/2 left-0 right-0 h-1 w-full bg-black/10"></div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/10 blur-md rounded-full"></div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-1">
                         <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{product.sub_type || (mounted ? t('products.classic') : 'Classic')}</span>
                      </div>
                      <h3 className="text-lg font-bold leading-tight text-stone-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between border-t border-stone-50 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{mounted ? t('products.price_label') : 'Price'}</span>
                          <strong className="text-xl font-bold text-stone-900">
                            {formatPrice(product.price)}
                          </strong>
                        </div>
                        <button
                          onClick={() => handleCheckout(product)}
                          disabled={checkoutProductId === product.id}
                          className="rounded-xl bg-stone-900 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-primary active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-400 shadow-sm"
                        >
                          {checkoutProductId === product.id ? '...' : (mounted ? t('products.select') : 'Select')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {products.length > 0 && filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center text-stone-500 font-medium">
            {mounted ? t('products.not_found') : 'No products found'}
          </div>
        ) : null}
      </div>
    </section>
  );
}
