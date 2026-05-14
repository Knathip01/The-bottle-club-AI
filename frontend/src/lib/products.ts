export type Product = {
  id: number;
  name: string;
  price: number;
  color?: string;
  stock: number;
  sub_type?: string;
  type?: string;
  countryCode?: string;
  region?: string;
};

/**
 * Fetch wines/products from API
 */
export async function getProducts(query?: string, token?: string): Promise<Product[]> {
  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://possimon.onrender.com';

    // ✅ CORRECT ENDPOINT
    const url = `${API_BASE_URL}/api/wines/wines`;

    console.log('FETCH URL =', url);

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }
    });

    // Handle HTTP errors
    if (!response.ok) {
      console.error(
        `API response error: ${response.status} ${response.statusText}`
      );

      return [];
    }

    // Parse JSON
    const rawData = await response.json();

    console.log('API DATA =', rawData);

    // Ensure response is array
    if (!Array.isArray(rawData)) {
      console.error('API returned non-array data:', rawData);

      return [];
    }

    // Country code mapping
    const countryMap: Record<string, string> = {
      US: 'us',
      France: 'fr',
      Italy: 'it',
      Spain: 'es',
      Australia: 'au',
      Chile: 'cl',
      Argentina: 'ar',
      'South Africa': 'za',
      Germany: 'de',
      Portugal: 'pt',
      'New Zealand': 'nz',
      Thailand: 'th'
    };

    // Transform API response
    let products: Product[] = rawData.map((item: any) => {
      const wineType = item.wine_type || '';
      let color = 'red';

      const lowerType = wineType.toLowerCase();

      if (
        lowerType.includes('white') ||
        lowerType.includes('chardonnay') ||
        lowerType.includes('sauvignon blanc')
      ) {
        color = 'white';
      } else if (
        lowerType.includes('rose') ||
        lowerType.includes('rosé')
      ) {
        color = 'rose';
      } else {
        color = 'red';
      }

      return {
        id: item.id ?? 0,
        name: item.name ?? 'Unknown Wine',
        price: item.price ?? 0,
        stock: item.stock ?? 0,
        color,
        type: item.type || 'wine',
        sub_type: item.wine_type || 'Classic',
        region: item.region?.name || '',
        countryCode:
          countryMap[item.country?.name] ||
          item.country?.name?.toLowerCase() ||
          'fr'
      };
    });

    // Search filtering
    if (query && query.trim() !== '') {
      const lowerQuery = query.toLowerCase();

      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(lowerQuery) ||
          p.type?.toLowerCase().includes(lowerQuery) ||
          p.sub_type?.toLowerCase().includes(lowerQuery) ||
          p.region?.toLowerCase().includes(lowerQuery)
      );
    }

    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);

    return [];
  }
}