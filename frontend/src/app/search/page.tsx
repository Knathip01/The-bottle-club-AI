import SearchProductList from '@/components/SearchProductList';
import { getProducts } from '@/lib/products';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const sp = await searchParams;
  const query = sp.q || '';
  const products = await getProducts(query);

  return (
    <main className="min-h-screen flex flex-col bg-stone-50/50">
      <MainHeader />
      
      <div className="flex-1 container mx-auto px-4 lg:px-8 py-12 max-w-5xl">
        <div className="mb-12">
          <p className="text-sm font-bold text-[#a11a1a] uppercase tracking-widest mb-2">Search Results</p>
          <h1 className="text-4xl font-serif font-bold text-stone-900">
            {products.length} products found for "{query}"
          </h1>
        </div>

        {products.length > 0 ? (
          <SearchProductList products={products} />
        ) : (
          <div className="py-20 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <p className="text-stone-500 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
