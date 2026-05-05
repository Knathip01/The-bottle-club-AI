'use client';

/**
 * Client-side authentication utilities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';

/**
 * Redirects the user to the provider's OAuth login page
 * @param provider - 'facebook', 'line', or 'google'
 */
export const loginWithProvider = (provider: string) => {
  console.log(`Logging in with ${provider}...`);
  
  // Use /login/provider for all OAuth providers (facebook, line, google)
  window.location.href = `${API_BASE_URL}/login/${provider}`;
};
