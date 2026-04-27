import { type NextRequest } from 'next/server'
import { updateSession as updateSupabaseSession } from '@/utils/supabase/middleware'
import { updateSession as updateCustomSession } from '@/lib/auth-utils'

export default async function proxy(request: NextRequest) {
  // 1. Update Supabase Session first
  const response = await updateSupabaseSession(request)
  
  // 2. Update Custom JWT Session
  const customResponse = await updateCustomSession(request)
  
  if (customResponse) {
    // Copy cookies from customResponse to the final response
    customResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        expires: cookie.expires,
        sameSite: cookie.sameSite,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
      })
    })
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
