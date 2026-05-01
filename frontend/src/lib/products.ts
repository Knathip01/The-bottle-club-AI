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
 * Fetches products from the external wine API.
 * Supports optional filtering by search query.
 */
export async function getProducts(query?: string): Promise<Product[]> {
  try {
    // Updated API endpoint for wine products
    const url = 'https://possimon.onrender.com/wines';
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`API response error: ${response.status} ${response.statusText}`);
      return [];
    }

    const rawData = await response.json();

    // Ensure we always return an array
    if (!Array.isArray(rawData)) {
      console.error('API returned non-array data:', rawData);
      return [];
    }

    // Map the new API structure to our Product type
    let products: Product[] = rawData.map((item: any) => {
      const wineType = item.wine_type || '';
      let color = 'red'; // default
      
      if (wineType.toLowerCase().includes('white') || wineType.toLowerCase().includes('chardonnay') || wineType.toLowerCase().includes('sauvignon blanc')) {
        color = 'white';
      } else if (wineType.toLowerCase().includes('rose') || wineType.toLowerCase().includes('rosé')) {
        color = 'rose';
      } else if (wineType.toLowerCase().includes('red') || wineType.toLowerCase().includes('cabernet') || wineType.toLowerCase().includes('pinot noir') || wineType.toLowerCase().includes('shiraz') || wineType.toLowerCase().includes('merlot')) {
        color = 'red';
      }

      // Simple mapping for country codes if needed by SearchProductList
      const countryMap: Record<string, string> = {
        'US': 'us',
        'France': 'fr',
        'Italy': 'it',
        'Spain': 'es',
        'Australia': 'au',
        'Chile': 'cl',
        'Argentina': 'ar',
        'South Africa': 'za',
        'Germany': 'de',
        'Portugal': 'pt',
        'New Zealand': 'nz',
        'Thailand': 'th'
      };

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        color: color,
        type: item.type || 'wine',
        sub_type: item.wine_type || 'Classic',
        region: item.region?.name,
        countryCode: countryMap[item.country?.name] || item.country?.name?.toLowerCase() || 'fr'
      };
    });

    // Filter by query if provided
    if (query && query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(lowerQuery)) || 
        (p.type && p.type.toLowerCase().includes(lowerQuery)) ||
        (p.sub_type && p.sub_type.toLowerCase().includes(lowerQuery)) ||
        (p.region && p.region.toLowerCase().includes(lowerQuery))
      );
    }

    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}
