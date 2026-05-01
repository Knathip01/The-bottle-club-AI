export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const CART_EVENT_NAME = 'cart:updated';

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.image === 'string'
  );
}

export function mergeCartItems(items: unknown[]): CartItem[] {
  const merged = new Map<number, CartItem>();

  for (const value of items) {
    if (!isCartItem(value)) {
      continue;
    }

    const existing = merged.get(value.id);
    if (existing) {
      existing.quantity += Math.max(1, value.quantity);
      continue;
    }

    merged.set(value.id, {
      ...value,
      quantity: Math.max(1, value.quantity),
    });
  }

  return Array.from(merged.values());
}

let cachedCart: CartItem[] = [];
let lastRaw: string | null = '';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem('cart') || '';
    
    if (raw === lastRaw) {
      return cachedCart;
    }

    lastRaw = raw;

    if (!raw) {
      cachedCart = [];
      return cachedCart;
    }

    const parsed: unknown = JSON.parse(raw);
    cachedCart = Array.isArray(parsed) ? mergeCartItems(parsed) : [];
    return cachedCart;
  } catch (error) {
    console.error('Failed to read cart data:', error);
    localStorage.removeItem('cart');
    cachedCart = [];
    lastRaw = '';
    return cachedCart;
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(mergeCartItems(items)));
  window.dispatchEvent(new Event(CART_EVENT_NAME));
}

export function addCartItem(item: CartItem): CartItem[] {
  const currentItems = readCart();
  const nextItems = mergeCartItems([...currentItems, item]);
  writeCart(nextItems);
  return nextItems;
}

export function subscribeCart(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();

  window.addEventListener(CART_EVENT_NAME, handleChange);
  window.addEventListener('storage', handleChange);

  return () => {
    window.removeEventListener(CART_EVENT_NAME, handleChange);
    window.removeEventListener('storage', handleChange);
  };
}
