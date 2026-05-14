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
  
  if (provider === 'google') {
    window.location.href = `https://possimon.onrender.com/api/auth/login/google/web`;
  } else {
    // Use /api/auth/login/provider for other OAuth providers
    window.location.href = `${API_BASE_URL}/api/auth/login/${provider}`;
  }
};
