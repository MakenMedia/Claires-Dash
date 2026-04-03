import { NextResponse } from 'next/server';
import { getCache, setCache, getCacheStale } from '@/lib/cache';

const TTL = parseInt(process.env.POLL_CALENDAR_MS || '300000');
const TOKEN = process.env.CLICKUP_API_TOKEN!;
const TEAM_ID = process.env.CLICKUP_TEAM_ID!;

async function fetchCalendarTasks() {
  const headers = { Authorization: TOKEN };
  const now = Date.now();
  const thirtyDays = now + 30 * 24 * 60 * 60 * 1000;

  const url = `https://api.clickup.com/api/v2/team/${TEAM_ID}/task?due_date_gt=${now}&due_date_lt=${thirtyDays}&include_closed=false&subtasks=true&page=0`;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`ClickUp ${r.status}`);
  const json = await r.json();
  const tasks = json.tasks || [];

  const events = tasks.map((t: Record<string, any>) => {
    const due = parseInt(t.due_date);
    const d = new Date(due);
    return {
      id: t.id,
      title: t.name,
      summary: t.name,
      start: d.toISOString().slice(0, 10),
      end: d.toISOString().slice(0, 10),
      allDay: true,
      dueMs: due,
      listName: t.list?.name || '',
      folderName: t.folder?.name || '',
      assignees: (t.assignees || []).map((a: Record<string, any>) => a.username),
      url: t.url,
      isOverdue: due < now,
    };
  });

  events.sort((a: Record<string, any>, b: Record<string, any>) => a.dueMs - b.dueMs);
  return { events, fetchedAt: Date.now() };
}

let fetchPromise: Promise<Record<string, any>> | null = null;

export async function GET() {
  const cached = getCache<Record<string, unknown>>('calendar');
  if (cached) return NextResponse.json({ ...cached.data, fromCache: true });

  const stale = getCacheStale<Record<string, unknown>>('calendar');

  if (!fetchPromise) {
    fetchPromise = fetchCalendarTasks()
      .then(data => { setCache('calendar', data, TTL); fetchPromise = null; return data; })
      .catch(e => { console.error(`[${new Date().toISOString()}] Calendar error:`, (e as Error).message); fetchPromise = null; throw e; });
  }

  if (stale) return NextResponse.json({ ...stale.data, fromCache: true, stale: true });

  try {
    const data = await fetchPromise!;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ events: [], error: (e as Error).message });
  }
}
