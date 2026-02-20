import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database, Profile } from '@/types/Database'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // if logged in user tries to visit login page → redirect to dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // no user → redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // get profile and check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single<Pick<Profile, 'role' | 'status'>>()

  // no profile row found → redirect to login
  if (!profile) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // not super_admin → redirect to unauthorized
  if (profile.role !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // suspended → redirect to login
  if (profile.status === 'suspended') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ]
}
