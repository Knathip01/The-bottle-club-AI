'use client';

import { useState } from 'react';
import type { ComponentType } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { addCartItem } from '@/lib/cart';
import { useLanguage } from '@/context/LanguageContext';
import { GlassWater, ShieldCheck, Sparkles, Star, Wine } from 'lucide-react';

type ProductGridProps = {
  products: Product[];
};

type FilterId = 'all' | 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';

export default function ProductGrid({ products }: ProductGridProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [checkoutProductId, setCheckoutProductId] = useState<number | null>(null);
  const { language, t } = useLanguage();

  function getProductCategory(product: Product): string {
    if (product.color === 'red') return 'red';
    if (product.color === 'white') return 'white';
    if (product.color === 'rose') return 'rose';
    return 'other';
  }

  function getSubType(product: Product) {
    return `${product.sub_type || ''} ${product.type || ''}`.toLowerCase();
  }

  function matchesSparkling(product: Product) {
    const subType = getSubType(product);
    return ['sparkling', 'champagne', 'prosecco', 'cava', 'brut'].some((term) => subType.includes(term));
  }

  function matchesDessert(product: Product) {
    const subType = getSubType(product);
    return ['dessert', 'ice wine', 'late harvest', 'sauternes', 'moscato', 'tokaji'].some((term) => subType.includes(term));
  }

  function matchesFortified(product: Product) {
    const subType = getSubType(product);
    return ['fortified', 'port', 'sherry', 'madeira', 'marsala', 'vermouth'].some((term) => subType.includes(term));
  }

  const sectionCopy = {
    winesTitle: t('products.wines_title'),
    winesSubtitle: t('products.wines_subtitle'),
    recommendedTitle: t('nav.recommended'),
    recommendedSubtitle: t('products.recommended_subtitle'),
  };

  const filters: {
    id: FilterId;
    label: string;
    icon: ComponentType<{ className?: string }>;
    image: string;
    accent: string;
    glow: string;
  }[] = [
    {
      id: 'red',
      label: t('products.filter.red'),
      icon: Wine,
      image: '/images/wine_red.png',
      accent: 'from-neutral-50 to-stone-100',
      glow: 'bg-stone-900/6',
    },
    {
      id: 'white',
      label: t('products.filter.white'),
      icon: GlassWater,
      image: '/images/wine_white.png',
      accent: 'from-amber-50 to-yellow-100',
      glow: 'bg-amber-500/10',
    },
    {
      id: 'rose',
      label: t('products.filter.rose'),
      icon: Sparkles,
      image: '/images/wine_rose.png',
      accent: 'from-rose-50 to-pink-100',
      glow: 'bg-rose-500/10',
    },
    {
      id: 'sparkling',
      label: t('products.filter.sparkling'),
      icon: Star,
      image: '/images/wine_sparkling.png',
      accent: 'from-stone-50 to-slate-100',
      glow: 'bg-slate-500/10',
    },
    {
      id: 'dessert',
      label: t('products.filter.dessert'),
      icon: GlassWater,
      image: '/images/wine_rose.png',
      accent: 'from-orange-50 to-amber-100',
      glow: 'bg-orange-500/10',
    },
    {
      id: 'fortified',
      label: t('products.filter.fortified'),
      icon: ShieldCheck,
      image: '/images/wine_red.png',
      accent: 'from-zinc-50 to-stone-200',
      glow: 'bg-zinc-500/10',
    },
  ];

  function getProductPalette(product: Product) {
    const category = getProductCategory(product);

    if (category === 'red') {
      return {
        panel: 'from-red-100 via-rose-50 to-red-200',
        badge: 'bg-red-800 text-white',
        chip: 'bg-white/80 text-red-700 ring-1 ring-red-200',
        halo: 'bg-red-800/15 text-red-900',
        label: t('products.red_wine_label'),
      };
    }

    if (category === 'white') {
      return {
        panel: 'from-amber-50 via-white to-yellow-100',
        badge: 'bg-amber-600 text-white',
        chip: 'bg-white/80 text-amber-700 ring-1 ring-amber-200',
        halo: 'bg-amber-500/15 text-amber-900',
        label: t('products.white_wine_label'),
      };
    }

    if (category === 'rose') {
      return {
        panel: 'from-pink-100 via-rose-50 to-pink-200',
        badge: 'bg-pink-600 text-white',
        chip: 'bg-white/80 text-pink-700 ring-1 ring-pink-200',
        halo: 'bg-pink-500/15 text-pink-900',
        label: t('products.rose_wine_label'),
      };
    }

    return {
      panel: 'from-stone-100 via-white to-stone-200',
      badge: 'bg-stone-900 text-white',
      chip: 'bg-white/80 text-stone-700 ring-1 ring-stone-200',
      halo: 'bg-stone-900/10 text-stone-900',
      label: t('products.wine_label'),
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

    if (filter === 'sparkling') return matchesSparkling(product);
    if (filter === 'dessert') return matchesDessert(product);
    if (filter === 'fortified') return matchesFortified(product);

    return getProductCategory(product) === filter;
  });

  const featuredProducts = [...products]
    .sort((a, b) => {
      const stockScore = b.stock - a.stock;
      if (stockScore !== 0) return stockScore;
      return b.price - a.price;
    })
    .slice(0, 8);

  const visibleProducts = filter === 'all' ? featuredProducts : filteredProducts;

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
    <section className="bg-stone-50 py-12 md:py-20" id="products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 rounded-[2rem] border border-white/80 bg-white/90 px-4 py-8 shadow-2xl shadow-stone-950/8 backdrop-blur-xl md:-mt-24 md:px-8 md:py-12" id="wine-categories">
          <div className="mb-7 text-center">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#a11a1a]">{t('products.browse_style')}</p>
            <h2 className="text-3xl font-black tracking-normal text-stone-950 md:text-5xl">
              {sectionCopy.winesTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-500 md:text-base">
              {sectionCopy.winesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {filters.map((item) => {
              const Icon = item.icon;
              const isActive = filter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter((current) => (current === item.id ? 'all' : item.id))}
                  className={`group flex min-h-40 flex-col items-center justify-between rounded-3xl border p-4 text-center transition-all active:scale-[0.98] ${
                    isActive
                      ? 'border-stone-950 bg-stone-950 text-white shadow-xl shadow-stone-950/15'
                      : 'border-stone-100 bg-stone-50/80 text-stone-800 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div
                    className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${item.accent} transition duration-300 group-hover:scale-[1.03]`}
                  >
                    <div className={`absolute inset-4 rounded-full ${item.glow}`} />
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={78}
                      height={100}
                      className="relative h-20 w-auto object-contain drop-shadow-md transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/85 p-1.5 shadow-sm">
                      <Icon className="h-3.5 w-3.5 text-stone-700" />
                    </span>
                  </div>
                  <span
                    className={`mt-3 text-sm font-extrabold uppercase tracking-[0.14em] transition ${
                      isActive ? 'text-white' : 'text-stone-700 group-hover:text-stone-900'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 mt-12 text-center md:mb-10 md:mt-16">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#a11a1a]">{t('products.private_picks')}</p>
          <h3 className="text-3xl font-black tracking-normal text-stone-950 md:text-5xl">
            {sectionCopy.recommendedTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-500 md:text-base">
            {sectionCopy.recommendedSubtitle}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-8 py-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              {t('products.api_unavailable')}
            </p>
            <h3 className="mt-4 text-2xl font-serif font-bold text-stone-900">
              {t('products.load_error_title')}
            </h3>
            <p className="mt-3 text-stone-600">
              {t('products.load_error_desc')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {visibleProducts.map((product) => {
              const palette = getProductPalette(product);

              return (
                <div
                  key={product.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white shadow-sm shadow-stone-950/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-950/10"
                >
                  <div
                    className={`relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-gradient-to-br p-6 sm:aspect-[4/5] ${palette.panel}`}
                  >
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStockTone(product.stock)}`}
                    >
                      {t('products.in_stock')}: {product.stock}
                    </span>
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${palette.chip}`}
                    >
                      {palette.label}
                    </span>
                    
                    <div className="relative transition-transform duration-700 ease-out group-hover:scale-105">
                      <Image
                        src={`/images/wine_${product.color || 'red'}.png`}
                        alt={product.name}
                        width={150}
                        height={260}
                        className="h-44 w-auto object-contain drop-shadow-xl sm:h-52"
                      />
                      <div className="absolute -bottom-2 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/10 blur-md" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-3">
                      <div className="mb-1 flex items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          {product.sub_type || t('products.classic')}
                        </span>
                      </div>
                      <h3 className="min-h-14 text-lg font-extrabold leading-tight text-stone-950 transition-colors line-clamp-2 group-hover:text-primary">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">
                            {t('products.price_label')}
                          </span>
                          <strong className="text-xl font-bold text-stone-900">
                            {formatPrice(product.price)}
                          </strong>
                        </div>
                        <button
                          onClick={() => handleCheckout(product)}
                          disabled={checkoutProductId === product.id}
                          className="min-h-12 rounded-full bg-stone-950 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-primary active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-400"
                        >
                          {checkoutProductId === product.id ? '...' : t('products.select')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {products.length > 0 && visibleProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center text-stone-500 font-medium">
            {t('products.not_found')}
          </div>
        ) : null}
      </div>
    </section>
  );
}
