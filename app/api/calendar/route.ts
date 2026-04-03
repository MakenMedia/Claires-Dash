import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Try to read calendar-data.json from maken-dashboard
    const calPath = path.join('/Users/admin/maken-dashboard/public/calendar-data.json');
    if (fs.existsSync(calPath)) {
      const data = JSON.parse(fs.readFileSync(calPath, 'utf8'));
      return NextResponse.json({ events: data.events || [], fetchedAt: Date.now() });
    }
    return NextResponse.json({ events: [], fetchedAt: Date.now() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error(`[${new Date().toISOString()}] Calendar error:`, msg);
    return NextResponse.json({ events: [], fetchedAt: Date.now() });
  }
}
