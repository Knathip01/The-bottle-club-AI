import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products';
import { getSession } from '@/lib/auth-utils';
import MembersOnlyBarrier from './MembersOnlyBarrier';

export default async function ProductGridSection() {
  const session = await getSession();
  
  if (!session) {
    return <MembersOnlyBarrier />;
  }

  const products = await getProducts();

  return <ProductGrid products={products} />;
}
