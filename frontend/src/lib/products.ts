export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

const PRODUCTS_API_URL = 'https://possimon.onrender.com/products';

function normalizeNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeProduct(value: unknown): Product | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const product = value as Record<string, unknown>;
  const id = normalizeNumber(product.id);
  const price = normalizeNumber(product.price);
  const stock = normalizeNumber(product.stock);
  const name = typeof product.name === 'string' ? product.name.trim() : '';

  if (id === null || price === null || stock === null || !name) {
    return null;
  }

  return {
    id,
    name,
    price,
    stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(PRODUCTS_API_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Products API returned ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      console.error('Products API did not return an array:', data);
      return [];
    }

    return data
      .map(normalizeProduct)
      .filter((product): product is Product => product !== null);
  } catch (error) {
    console.error('Failed to fetch products from external API:', error);
    return [];
  }
}
