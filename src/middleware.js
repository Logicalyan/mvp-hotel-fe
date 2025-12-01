// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const hotelId = request.cookies.get('hotel_id')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL(getDefaultRoute(role, hotelId), request.url));
  }

  // ❌ Customer tidak boleh mengunjungi dashboard mana pun
  if (role === 'customer') {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/hotel/dashboard')) {
      console.log('🚫 Customer mencoba akses dashboard');
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // Hotel staff rules
  if (token && role === 'hotel') {
    if (!hotelId) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    const hotelIdFromPath = pathname.match(/\/dashboard\/hotels\/(\d+)/)?.[1];
    if (hotelIdFromPath && hotelIdFromPath !== hotelId) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Admin area protection
  if (token && role) {
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

function getDefaultRoute(role, hotelId) {
  const roleRoutes = {
    'admin': '/admin/dashboard',
    'hotel': `/hotel/dashboard/${hotelId}`,
    'customer': '/home',
  };
  return roleRoutes[role];
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
