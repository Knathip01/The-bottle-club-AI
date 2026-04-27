import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products';

export default async function ProductGridSection() {
  const products = await getProducts();

  return <ProductGrid products={products} />;
}
