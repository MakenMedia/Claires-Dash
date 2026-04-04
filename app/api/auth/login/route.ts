import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { USERS, PASSWORD_HASH, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, PASSWORD_HASH);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await signToken(user);

  const res = NextResponse.json({ ok: true, redirectTo: user.redirectTo, name: user.name });
  res.cookies.set('mm_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.maken.media' : undefined,
  });
  return res;
}
