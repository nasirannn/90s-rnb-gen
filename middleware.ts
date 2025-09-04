import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if needed
  await supabase.auth.getSession()

  // Protect /studio route - temporarily disabled for debugging
  // if (req.nextUrl.pathname.startsWith('/studio')) {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()
    
  //   console.log('Studio access attempt:', {
  //     pathname: req.nextUrl.pathname,
  //     hasSession: !!session,
  //     userId: session?.user?.id,
  //     userEmail: session?.user?.email,
  //     cookies: req.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  //   })
    
  //   if (!session) {
  //     return NextResponse.redirect(new URL('/', req.url))
  //   }
  // }

  return response
}

export const config = {
  matcher: ['/studio(.*)']
}
