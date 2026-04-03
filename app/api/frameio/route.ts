import { NextResponse } from 'next/server';
import { CLIENTS } from '@/lib/config';
import { getCache, setCache, getCacheStale } from '@/lib/cache';

const TTL = parseInt(process.env.POLL_FRAMEIO_MS || '600000');

interface FrameioData {
  folders: { client: string; frameLink: string | null }[];
  fetchedAt: number;
}

export async function GET() {
  const cached = getCache<FrameioData>('frameio');
  if (cached) return NextResponse.json({ ...cached.data, fromCache: true });

  const stale = getCacheStale<FrameioData>('frameio');

  const folders = CLIENTS.map(c => ({
    client: c.name,
    frameLink: c.frameLink,
  }));

  const data: FrameioData = { folders, fetchedAt: Date.now() };
  setCache('frameio', data, TTL);

  if (stale) return NextResponse.json({ ...stale.data, fromCache: true, stale: true });
  return NextResponse.json(data);
}
