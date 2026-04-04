import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('mm_token', '', { maxAge: 0, path: '/' });
  res.cookies.set('mm_token', '', { maxAge: 0, path: '/', domain: '.maken.media' });
  return res;
}

export async function GET() {
  const res = NextResponse.redirect('https://login.maken.media/login');
  res.cookies.set('mm_token', '', { maxAge: 0, path: '/' });
  res.cookies.set('mm_token', '', { maxAge: 0, path: '/', domain: '.maken.media' });
  return res;
}
