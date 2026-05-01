import { createClient } from '@/utils/supabase/client';

/**
 * Client-side function to handle social login redirection using Supabase
 */
export async function loginWithProvider(provider: 'facebook' | 'line' | 'google') {
  const supabase = createClient();
  
  // Dynamic origin for callback URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectTo = `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectTo,
    },
  });

  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
    // Fallback to external API if Supabase fails
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';
    window.location.href = `${API_BASE_URL}/login/${provider}`;
    return;
  }

  if (data.url) {
    window.location.href = data.url;
  }
}
