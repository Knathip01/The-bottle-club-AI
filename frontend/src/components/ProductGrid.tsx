'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products';

type ProductGridProps = {
  products: Product[];
};

type FilterId = 'all' | 'drink' | 'snack' | 'budget';

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'drink', label: 'เครื่องดื่ม' },
  { id: 'snack', label: 'ขนม' },
  { id: 'budget', label: 'ไม่เกิน ฿15' },
];

function getProductCategory(product: Product): 'drink' | 'snack' {
  return /snack/i.test(product.name) ? 'snack' : 'drink';
}

function getProductPalette(product: Product) {
  const category = getProductCategory(product);

  if (category === 'snack') {
    return {
      panel: 'from-orange-100 via-amber-50 to-yellow-100',
      badge: 'bg-orange-500 text-white',
      chip: 'bg-white/80 text-orange-700 ring-1 ring-orange-200',
      halo: 'bg-orange-500/15 text-orange-900',
      label: 'Snack',
    };
  }

  if (/water/i.test(product.name)) {
    return {
      panel: 'from-sky-100 via-cyan-50 to-blue-100',
      badge: 'bg-sky-600 text-white',
      chip: 'bg-white/80 text-sky-700 ring-1 ring-sky-200',
      halo: 'bg-sky-500/15 text-sky-900',
      label: 'Water',
    };
  }

  return {
    panel: 'from-rose-100 via-white to-red-100',
    badge: 'bg-stone-900 text-white',
    chip: 'bg-white/80 text-stone-700 ring-1 ring-stone-200',
    halo: 'bg-stone-900/10 text-stone-900',
    label: 'Soft drink',
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

  if (stock < 50) {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-emerald-100 text-emerald-700';
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [checkoutProductId, setCheckoutProductId] = useState<number | null>(null);

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'budget') {
      return product.price <= 15;
    }

    return getProductCategory(product) === filter;
  });

  const handleCheckout = (product: Product) => {
    // Save to localStorage to simulate a cart
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: 'https://images.vivino.com/thumbs/L-8X9f8zSC6-gBq-vXw-yA_pb_x600.png', // Placeholder image
    };
    
    localStorage.setItem('cart', JSON.stringify([cartItem]));
    
    // Redirect to cart page
    window.location.href = '/cart';
  };

  return (
    <section className="py-20" id="products">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 font-medium uppercase tracking-widest text-primary">
            Live Products API
          </p>
          <h2 className="mb-4 text-4xl font-serif font-bold">สินค้าแนะนำ</h2>
          <p className="mx-auto max-w-2xl text-stone-500">
            ดึงข้อมูลตรงจาก API ที่ possimon.onrender.com/products แล้วแสดงราคาและสต็อกล่าสุดบนหน้าแรก
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2 md:gap-4">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                filter === item.id
                  ? 'bg-primary text-white shadow-md'
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
              API unavailable
            </p>
            <h3 className="mt-4 text-2xl font-serif font-bold text-stone-900">
              ยังโหลดรายการสินค้าไม่ได้
            </h3>
            <p className="mt-3 text-stone-600">
              API ภายนอกอาจกำลัง cold start หรือไม่พร้อมใช้งาน ลองรีเฟรชหน้าอีกครั้งในอีกสักครู่
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const palette = getProductPalette(product);

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div
                    className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br p-8 ${palette.panel}`}
                  >
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${getStockTone(product.stock)}`}
                    >
                      Stock {product.stock}
                    </span>
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${palette.chip}`}
                    >
                      {palette.label}
                    </span>
                    <div
                      className={`flex h-28 w-28 items-center justify-center rounded-full text-5xl font-black shadow-lg transition-transform duration-500 group-hover:scale-110 ${palette.halo}`}
                    >
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold leading-tight text-stone-900">
                        {product.name}
                      </h3>
                      <div
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${palette.badge}`}
                      >
                        #{product.id}
                      </div>
                    </div>

                    <p className="mb-1 text-sm text-stone-500">
                      {getProductCategory(product) === 'snack' ? 'หมวดขนม' : 'หมวดเครื่องดื่ม'}
                    </p>
                    <p className="mb-4 text-sm text-stone-500">
                      พร้อมขาย {product.stock.toLocaleString('th-TH')} ชิ้น
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-4">
                      <strong className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </strong>
                      <button
                        onClick={() => handleCheckout(product)}
                        disabled={checkoutProductId === product.id}
                        className="min-w-[112px] rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-stone-400"
                      >
                        {checkoutProductId === product.id ? 'Loading...' : 'Checkout'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {products.length > 0 && filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-5 text-center text-stone-600">
            ยังไม่มีสินค้าที่ตรงกับตัวกรองนี้
          </div>
        ) : null}
      </div>
    </section>
  );
}
