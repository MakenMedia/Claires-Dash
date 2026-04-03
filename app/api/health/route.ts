import { NextResponse } from 'next/server';
import { getCacheStale } from '@/lib/cache';

export async function GET() {
  const clickup = getCacheStale<{ fetchedAt: number }>('clickup');
  const frameio = getCacheStale<{ fetchedAt: number }>('frameio');

  const checks = {
    clickup: {
      status: clickup ? 'ok' : 'unknown',
      lastFetch: clickup?.fetchedAt || null,
    },
    frameio: {
      status: frameio ? 'ok' : 'unknown',
      lastFetch: frameio?.fetchedAt || null,
    },
    calendar: { status: 'ok', lastFetch: Date.now() },
  };

  return NextResponse.json({
    status: 'ok',
    timestamp: Date.now(),
    checks,
  });
}
