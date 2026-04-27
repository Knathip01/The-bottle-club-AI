import { Suspense } from 'react';
import MainHeader from '@/components/MainHeader';
import Hero from '@/components/Hero';
import ProductGridSection from '@/components/ProductGridSection';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1">
        <Hero />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGridSection />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
