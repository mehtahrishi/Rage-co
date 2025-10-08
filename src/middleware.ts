import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that require admin authentication
const protectedPaths = ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/customers'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the requested path requires admin authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    // For client-side checks, we'll rely on localStorage
    // Server-side middleware has limited access to localStorage, so we'll handle this in the layout component
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};