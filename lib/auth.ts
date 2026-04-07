import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'maken-media-secret-2026');

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'sam' | 'claire';
  redirectTo: string;
}

export const USERS: UserSession[] = [
  {
    id: 'sam',
    email: 'sam@makenmedia.co',
    name: 'Sam',
    role: 'sam',
    redirectTo: 'https://dashboard.maken.media',
  },
  {
    id: 'claire',
    email: '1clairearlandis@gmail.com',
    name: 'Claire',
    role: 'claire',
    redirectTo: 'https://claires-dash.vercel.app',
  },
];

// Hashed "Makenmedia2?" — same for both users
export const PASSWORD_HASH = '$2b$10$fhyjp/nCnPm5HfX3OzZboOpIhNJPrxIBtPR1HedyKBRnICNunplSC';

export async function signToken(user: UserSession): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, name: user.name, role: user.role, redirectTo: user.redirectTo })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}
