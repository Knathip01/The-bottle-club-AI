/**
 * Cache Utility for the Bottle Club
 * Provides methods to clear various client-side caches to prevent bugs and ensure fresh data.
 */

export const clearAllCaches = () => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear LocalStorage (keeping essential items if needed)
    // For now, clear all except maybe language preference if we want to persist it
    const lang = localStorage.getItem('language');
    localStorage.clear();
    if (lang) localStorage.setItem('language', lang);

    // 2. Clear SessionStorage
    sessionStorage.clear();

    // 3. Clear Cookies (basic clearing of non-essential cookies)
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // 4. Register Service Worker clearing if applicable
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }

    console.log('All caches cleared successfully.');
    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
};

/**
 * Hook or function to clear Next.js client-side router cache if needed
 * Note: This usually requires router.refresh() from next/navigation
 */
