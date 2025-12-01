// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const hotelId = request.cookies.get('hotel_id')?.value;
  const { pathname } = request.nextUrl;

  // 🔍 Debug logging (hapus di production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Middleware Check:', {
      path: pathname,
      hasToken: !!token,
      role: role,
      roleType: typeof role, 
      hotelId: hotelId || 'none',
    });
  }
  
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    console.log('❌ No token, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicRoute) {
    console.log('✅ Has token, redirecting to dashboard');
    return NextResponse.redirect(new URL(getDefaultRoute(role, hotelId), request.url));
  }

  if (token && role === 'hotel') {

    // Hotel staff harus punya hotel_id
    if (!hotelId) {
      console.log('🚫 Hotel staff without hotel_id');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Hotel staff cuma bisa akses hotel mereka sendiri
    const hotelIdFromPath = pathname.match(/\/dashboard\/hotels\/(\d+)/)?.[1];
    if (hotelIdFromPath && hotelIdFromPath !== hotelId) {
      console.log('🚫 Hotel staff accessing different hotel');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (token && role) {
    if (pathname.startsWith('/admin') && role !== 'admin') {
      console.log('🚫 Unauthorized access attempt to admin area');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  console.log('✅ Access granted');
  return NextResponse.next();
}

function getDefaultRoute(role, hotelId) {
  const roleRoutes = {
    'admin': '/admin/dashboard',
    'hotel': `/hotel/dashboard/${hotelId}`,
    'customer': '/home',
  };
  return roleRoutes[role] || '/dashboard';
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',],
};