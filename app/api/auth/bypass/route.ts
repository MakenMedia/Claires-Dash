import { NextRequest, NextResponse } from 'next/server';
import { USERS, signToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const expected = process.env.CLAIRE_BYPASS_KEY;
  const provided = req.nextUrl.searchParams.get('key');
  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: 'invalid key' }, { status: 401 });
  }
  const sam = USERS.find(u => u.id === 'sam');
  if (!sam) return NextResponse.json({ error: 'user not found' }, { status: 500 });

  const token = await signToken(sam);
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('mm_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
