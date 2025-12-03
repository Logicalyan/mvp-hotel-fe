// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const hotelId = request.cookies.get("hotel_id")?.value;

  // PUBLIC ROUTES →
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // PROTECTED ROUTES →
  const protectedRoutes = ['/dashboard', '/hotel', '/admin', '/home'];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Already Authenticated → Block public pages
  if (isPublicRoute && token) {
    url.pathname = getDefaultRoute(role, hotelId);
    return NextResponse.redirect(url);
  }

  // Not Authenticated → Redirect to login
  if (isProtectedRoute && !token) {
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // ROLE-BASED PROTECTION →
  if (role === 'customer') {
    if (pathname.startsWith('/dashboard') ||
        pathname.startsWith('/hotel') ||
        pathname.startsWith('/admin')
    ) {
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
  }

  if (role === 'hotel') {
    // hotel must have an ID
    if (!hotelId) {
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }

    // Prevent accessing other hotel's dashboard
    const hotelPathId = pathname.match(/\/hotel\/dashboard\/(\d+)/)?.[1];
    if (hotelPathId && hotelPathId !== hotelId) {
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
  }

  // ADMIN protection
  if (pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Default route after login
function getDefaultRoute(role, hotelId) {
  return {
    admin: '/dashboard',
    hotel: `/hotel/dashboard/${hotelId}`,
    customer: '/home',
  }[role] || '/login';
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/home',
    '/dashboard/:path*',
    '/hotel/:path*',
    '/admin/:path*',
  ],
};
