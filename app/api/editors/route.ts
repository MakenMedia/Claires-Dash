import { NextResponse } from 'next/server';
import { getCache, setCache, getCacheStale } from '@/lib/cache';
import { EDITORS, CLIENTS } from '@/lib/config';

const TTL = parseInt(process.env.POLL_CLICKUP_MS || '60000');
const TOKEN = process.env.CLICKUP_API_TOKEN!;
const TEAM_ID = process.env.CLICKUP_TEAM_ID!;
const CLOSED_STATUSES = ['complete', 'completed', 'closed', 'done'];

function guessClient(folderName: string, listName: string, spaceName: string): string {
  const haystack = `${folderName} ${listName} ${spaceName}`.toLowerCase();
  for (const c of CLIENTS) {
    if (haystack.includes(c.clickupName.toLowerCase())) return c.name;
  }
  return folderName || listName || spaceName || '—';
}

async function fetchEditors() {
  const headers = { Authorization: TOKEN };
  const now = Date.now();
  const today = new Date(); today.setHours(23, 59, 59, 999);

  const profiles = await Promise.all(EDITORS.map(async (editor) => {
    try {
      const url = `https://api.clickup.com/api/v2/team/${TEAM_ID}/task?assignees[]=${editor.id}&include_closed=false&subtasks=true&page=0`;
      const r = await fetch(url, { headers });
      if (!r.ok) throw new Error(`${r.status}`);
      const json = await r.json();
      const tasks = (json.tasks || [])
        .filter((t: Record<string, unknown>) => {
          const s = ((t.status as Record<string, unknown>)?.status as string || '').toLowerCase();
          return !CLOSED_STATUSES.includes(s);
        })
        .map((t: Record<string, unknown>) => {
          const status = t.status as Record<string, unknown>;
          const priority = t.priority as Record<string, unknown>;
          const list = t.list as Record<string, unknown>;
          const folder = t.folder as Record<string, unknown>;
          const space = t.space as Record<string, unknown>;
          const dueDate = t.due_date ? parseInt(t.due_date as string) : null;
          const folderName = (folder?.name as string) || '';
          const listName = (list?.name as string) || '';
          const spaceName = (space?.name as string) || '';
          return {
            id: t.id as string,
            name: t.name as string,
            status: (status?.status as string) || '',
            statusColor: (status?.color as string) || '#64748b',
            dueDate,
            isOverdue: dueDate ? dueDate < now : false,
            isDueToday: dueDate ? dueDate <= today.getTime() : false,
            priority: (priority?.priority as string) || 'normal',
            client: guessClient(folderName, listName, spaceName),
            folderName,
            listName,
            url: t.url as string,
          };
        });

      // Sort: overdue first, then by due date
      tasks.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.dueDate && b.dueDate) return (a.dueDate as number) - (b.dueDate as number);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });

      return {
        ...editor,
        tasks,
        openCount: tasks.length,
        overdueCount: tasks.filter((t: Record<string, unknown>) => t.isOverdue).length,
      };
    } catch (e) {
      console.error(`[${new Date().toISOString()}] Editor ${editor.name} error:`, (e as Error).message);
      return { ...editor, tasks: [], openCount: 0, overdueCount: 0 };
    }
  }));

  return { profiles, fetchedAt: Date.now() };
}

let fetchPromise: Promise<Record<string, unknown>> | null = null;

export async function GET() {
  const cached = getCache<Record<string, unknown>>('editors');
  if (cached) return NextResponse.json({ ...cached.data, fromCache: true });

  const stale = getCacheStale<Record<string, unknown>>('editors');

  if (!fetchPromise) {
    fetchPromise = fetchEditors()
      .then(data => { setCache('editors', data, TTL); fetchPromise = null; return data; })
      .catch(e => { console.error(`[${new Date().toISOString()}] Editors error:`, (e as Error).message); fetchPromise = null; throw e; });
  }

  if (stale) return NextResponse.json({ ...stale.data, fromCache: true, stale: true });

  try {
    const data = await fetchPromise!;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ profiles: [], error: (e as Error).message });
  }
}
