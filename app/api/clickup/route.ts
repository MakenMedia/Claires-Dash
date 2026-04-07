import { NextResponse } from 'next/server';
import { getCache, setCache, getCacheStale } from '@/lib/cache';
import { CLAIRE_CLICKUP_ID, CLIENTS } from '@/lib/config';

const TTL = parseInt(process.env.POLL_CLICKUP_MS || '60000');
const TOKEN = process.env.CLICKUP_API_TOKEN!;
const TEAM_ID = process.env.CLICKUP_TEAM_ID!;

interface MappedTask {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  dueDate: number | null;
  isOverdue: boolean;
  isDueToday: boolean;
  priority: string;
  priorityColor: string;
  listName: string;
  folderName: string;
  spaceName: string;
  assignees: { id: string; name: string; color: string; initials: string }[];
  url: string;
}

interface ClickUpResult {
  openTasks: MappedTask[];
  overdueTasks: MappedTask[];
  dueTodayTasks: MappedTask[];
  clientBoards: {
    client: string;
    tasks: MappedTask[];
    openCount: number;
    overdueCount: number;
  }[];
  stats: { open: number; overdue: number };
  fetchedAt: number;
}

async function fetchTeamTasks(headers: Record<string, string>, assigneeId?: string): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  for (let page = 0; page < 5; page++) {
    const assigneeParam = assigneeId ? `&assignees[]=${assigneeId}` : '';
    const url = `https://api.clickup.com/api/v2/team/${TEAM_ID}/task?include_closed=false&subtasks=true&page=${page}${assigneeParam}`;
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`ClickUp ${r.status}`);
    const json = await r.json();
    const pageTasks: Record<string, unknown>[] = json.tasks || [];
    all.push(...pageTasks);
    if (pageTasks.length < 100) break;
  }
  return all;
}

async function fetchClickUp(): Promise<ClickUpResult> {
  const headers = { Authorization: TOKEN };

  // Fetch in parallel: Claire's assigned tasks + ALL team tasks (for client boards)
  const [claireTasks, allTeamTasks] = await Promise.all([
    fetchTeamTasks(headers, CLAIRE_CLICKUP_ID),
    fetchTeamTasks(headers),
  ]);
  const tasks = claireTasks;

  const now = Date.now();
  const today = new Date(); today.setHours(23, 59, 59, 999);

  const CLOSED_STATUSES = ['complete', 'completed', 'closed', 'done'];

  const mapped: MappedTask[] = tasks
  .filter(t => {
    const s = ((t.status as Record<string, unknown>)?.status as string || '').toLowerCase();
    return !CLOSED_STATUSES.includes(s);
  })
  .map((t) => {
    const status = t.status as Record<string, unknown> | undefined;
    const priority = t.priority as Record<string, unknown> | undefined;
    const list = t.list as Record<string, unknown> | undefined;
    const folder = t.folder as Record<string, unknown> | undefined;
    const space = t.space as Record<string, unknown> | undefined;
    const assignees = (t.assignees as Record<string, unknown>[]) || [];
    const dueDate = t.due_date ? parseInt(t.due_date as string) : null;

    return {
      id: t.id as string,
      name: t.name as string,
      status: (status?.status as string) || '',
      statusColor: (status?.color as string) || '#64748b',
      dueDate,
      isOverdue: dueDate ? dueDate < now : false,
      isDueToday: dueDate ? dueDate <= today.getTime() : false,
      priority: (priority?.priority as string) || 'normal',
      priorityColor: (priority?.color as string) || '#64748b',
      listName: (list?.name as string) || '',
      folderName: (folder?.name as string) || '',
      spaceName: (space?.name as string) || '',
      assignees: assignees.map((a) => ({
        id: a.id as string,
        name: a.username as string,
        color: a.color as string,
        initials: a.initials as string,
      })),
      url: t.url as string,
    };
  });

  // dedupe by id (subtasks can appear twice)
  const seen = new Set<string>();
  const deduped = mapped.filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });

  // Map ALL team tasks (unfiltered) for client boards
  const allMapped: MappedTask[] = allTeamTasks
    .filter(t => {
      const s = ((t.status as Record<string, unknown>)?.status as string || '').toLowerCase();
      return !CLOSED_STATUSES.includes(s);
    })
    .map((t) => {
      const status = t.status as Record<string, unknown> | undefined;
      const priority = t.priority as Record<string, unknown> | undefined;
      const list = t.list as Record<string, unknown> | undefined;
      const folder = t.folder as Record<string, unknown> | undefined;
      const space = t.space as Record<string, unknown> | undefined;
      const assignees = (t.assignees as Record<string, unknown>[]) || [];
      const dueDate = t.due_date ? parseInt(t.due_date as string) : null;
      return {
        id: t.id as string,
        name: t.name as string,
        status: (status?.status as string) || '',
        statusColor: (status?.color as string) || '#64748b',
        dueDate,
        isOverdue: dueDate ? dueDate < now : false,
        isDueToday: dueDate ? dueDate <= today.getTime() : false,
        priority: (priority?.priority as string) || 'normal',
        priorityColor: (priority?.color as string) || '#64748b',
        listName: (list?.name as string) || '',
        folderName: (folder?.name as string) || '',
        spaceName: (space?.name as string) || '',
        assignees: assignees.map((a) => ({
          id: a.id as string,
          name: a.username as string,
          color: a.color as string,
          initials: a.initials as string,
        })),
        url: t.url as string,
      };
    });
  const allSeen = new Set<string>();
  const allDeduped = allMapped.filter(t => { if (allSeen.has(t.id)) return false; allSeen.add(t.id); return true; });

  const clientBoards = CLIENTS.map(client => {
    const clientTasks = allDeduped.filter(t =>
      t.folderName?.toLowerCase().includes(client.clickupName.toLowerCase()) ||
      t.listName?.toLowerCase().includes(client.clickupName.toLowerCase()) ||
      t.spaceName?.toLowerCase().includes(client.clickupName.toLowerCase())
    );
    return {
      client: client.name,
      tasks: clientTasks,
      openCount: clientTasks.length,
      overdueCount: clientTasks.filter(t => t.isOverdue).length,
    };
  });

  const overdueTasks = deduped.filter(t => t.isOverdue);
  const dueTodayTasks = deduped.filter(t => t.isDueToday);

  return {
    openTasks: deduped,
    overdueTasks,
    dueTodayTasks,
    clientBoards,
    stats: {
      open: deduped.length,
      overdue: overdueTasks.length,
    },
    fetchedAt: Date.now(),
  };
}

let fetchPromise: Promise<ClickUpResult> | null = null;

export async function GET() {
  const cached = getCache<ClickUpResult>('clickup');
  if (cached) {
    return NextResponse.json({ ...cached.data, fromCache: true });
  }

  const stale = getCacheStale<ClickUpResult>('clickup');

  if (!fetchPromise) {
    fetchPromise = fetchClickUp()
      .then(data => {
        setCache('clickup', data, TTL);
        fetchPromise = null;
        return data;
      })
      .catch(e => {
        console.error(`[${new Date().toISOString()}] ClickUp error:`, e.message);
        fetchPromise = null;
        throw e;
      });
  }

  if (stale) {
    return NextResponse.json({ ...stale.data, fromCache: true, stale: true });
  }

  try {
    const data = await fetchPromise;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
