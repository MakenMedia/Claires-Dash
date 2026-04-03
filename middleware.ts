import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and auth API through
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow health check
  if (pathname === '/api/health') return NextResponse.next();

  const token = req.cookies.get('mm_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
};
