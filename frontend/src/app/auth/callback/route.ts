import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { login as setAuthSession } from '@/lib/auth-utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/account'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // Set the local session using the user data from Supabase
      const user = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.email?.split('@')[0], // Fallback username
        first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
        last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        provider: data.user.app_metadata.provider
      }
      
      await setAuthSession(user)
      
      // Use the incoming request URL to construct the base for redirection
      const requestUrl = new URL(request.url)
      
      // If next is a relative path, construct it relative to the request's origin
      const redirectUrl = new URL(next, requestUrl.origin)
      
      // Handle the forwarded host if present (common on Vercel and other proxies)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
      
      if (forwardedHost) {
        redirectUrl.protocol = forwardedProto
        redirectUrl.host = forwardedHost
      }

      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  // Use request.url for the error redirect as well
  const requestUrl = new URL(request.url)
  const errorUrl = new URL('/login?error=auth_failed', requestUrl.origin)
  return NextResponse.redirect(errorUrl.toString())
}
