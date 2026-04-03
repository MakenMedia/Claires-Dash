'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import StatusDot from '@/components/StatusDot';
import StatsBar from '@/components/StatsBar';
import ThisWeek from '@/components/ThisWeek';
import DailyPriority from '@/components/DailyPriority';
import OpenTasks from '@/components/OpenTasks';
import EditedVideos from '@/components/EditedVideos';
import ClientTaskBoards from '@/components/ClientTaskBoards';
import FrameioFolders from '@/components/FrameioFolders';
import { CLIENTS } from '@/lib/config';

const POLL_CLICKUP = parseInt(process.env.NEXT_PUBLIC_POLL_CLICKUP_MS || '60000');
const POLL_CALENDAR = parseInt(process.env.NEXT_PUBLIC_POLL_CALENDAR_MS || '300000');
const POLL_FRAMEIO = parseInt(process.env.NEXT_PUBLIC_POLL_FRAMEIO_MS || '600000');

interface Task {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  dueDate: number | null;
  isOverdue: boolean;
  isDueToday: boolean;
  priority: string;
  listName: string;
  folderName: string;
  assignees: { id: string; name: string; color?: string; initials?: string }[];
  url: string;
}

interface TaskBoard {
  client: string;
  tasks: Task[];
  openCount: number;
  overdueCount: number;
}

interface ClickUpData {
  openTasks: Task[];
  overdueTasks: Task[];
  dueTodayTasks: Task[];
  clientBoards: TaskBoard[];
  stats: { open: number; overdue: number };
  fetchedAt: number;
}

interface CalEvent {
  id: string;
  title?: string;
  summary?: string;
  start: string;
  end: string;
  allDay?: boolean;
}

interface CalendarData { events: CalEvent[]; fetchedAt: number; }

interface FrameFolder { client: string; frameLink: string | null; }
interface FrameioData { folders: FrameFolder[]; fetchedAt: number; }

export default function Home() {
  const [clickup, setClickup] = useState<ClickUpData | null>(null);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [frameio, setFrameio] = useState<FrameioData | null>(null);
  const [fetchingClickup, setFetchingClickup] = useState(false);
  const [fetchingCal, setFetchingCal] = useState(false);
  const [fetchingFrameio, setFetchingFrameio] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const failCount = useRef(0);

  const fetchClickup = useCallback(async () => {
    setFetchingClickup(true);
    try {
      const r = await fetch('/api/clickup');
      if (!r.ok) throw new Error(`${r.status}`);
      setClickup(await r.json());
      failCount.current = 0;
      setIsPaused(false);
    } catch {
      failCount.current++;
      if (failCount.current >= 3) setIsPaused(true);
    } finally { setFetchingClickup(false); }
  }, []);

  const fetchCalendar = useCallback(async () => {
    setFetchingCal(true);
    try {
      const r = await fetch('/api/calendar');
      if (r.ok) setCalendar(await r.json());
    } catch { /* ignore */ } finally { setFetchingCal(false); }
  }, []);

  const fetchFrameio = useCallback(async () => {
    setFetchingFrameio(true);
    try {
      const r = await fetch('/api/frameio');
      if (r.ok) setFrameio(await r.json());
    } catch { /* ignore */ } finally { setFetchingFrameio(false); }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchClickup(), fetchCalendar(), fetchFrameio()]);
    setRefreshing(false);
  }, [fetchClickup, fetchCalendar, fetchFrameio]);

  // Initial load
  useEffect(() => { refreshAll(); }, [refreshAll]);

  // Polling
  useEffect(() => {
    const t1 = setInterval(() => { if (!isPaused) fetchClickup(); }, POLL_CLICKUP);
    const t2 = setInterval(() => fetchCalendar(), POLL_CALENDAR);
    const t3 = setInterval(() => fetchFrameio(), POLL_FRAMEIO);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, [fetchClickup, fetchCalendar, fetchFrameio, isPaused]);

  // Tab refocus
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') refreshAll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshAll]);

  const totalNeeded = CLIENTS.reduce((s, c) => s + c.needed, 0);
  const stats = {
    open: clickup?.stats.open || 0,
    overdue: clickup?.stats.overdue || 0,
    totalNeeded,
    totalReady: 0,
  };

  const clickupStatus: 'ok' | 'stale' | 'error' | 'unknown' =
    clickup ? (fetchingClickup ? 'stale' : 'ok') : 'unknown';

  return (
    <div className="min-h-screen" style={{ background: '#0f1117' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2a2d3e]" style={{ background: '#1a1d27' }}>
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Maken Media" className="h-10 w-auto" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-lg font-bold text-[#e2e8f0]">Dashboard <span className="text-[#64748b] font-normal text-sm ml-1">— Claire</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748b]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <button onClick={refreshAll} disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#5b6af0]/15 border border-[#5b6af0]/30 text-[#5b6af0] rounded-lg text-sm font-semibold hover:bg-[#5b6af0]/25 transition-colors disabled:opacity-50">
              {refreshing ? <span className="w-3.5 h-3.5 border-2 border-[#5b6af0] border-t-transparent rounded-full animate-spin" /> : '↻'} Refresh
            </button>
          </div>
        </div>
        <div className="flex items-center gap-5 px-8 pb-3">
          <StatusDot status={clickupStatus} label="ClickUp" lastFetch={clickup?.fetchedAt} />
          <StatusDot status={calendar ? 'ok' : 'unknown'} label="Calendar" lastFetch={calendar?.fetchedAt} />
          <StatusDot status="unknown" label="GHL" lastFetch={null} />
          <StatusDot status={frameio ? 'ok' : 'unknown'} label="Frame.io" lastFetch={frameio?.fetchedAt} />
        </div>
      </header>

      {isPaused && (
        <div className="bg-red-500/15 border-b border-red-500/30 px-8 py-2 text-sm text-red-400 text-center">
          Connection lost — retrying…
        </div>
      )}

      <StatsBar stats={stats} />
      <ThisWeek events={calendar?.events || []} fetchedAt={calendar?.fetchedAt || null} fetching={fetchingCal} />
      <DailyPriority tasks={clickup?.dueTodayTasks || []} fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
      <OpenTasks tasks={clickup?.openTasks || []} fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
      <EditedVideos fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
      <ClientTaskBoards boards={clickup?.clientBoards || []} fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
      <FrameioFolders folders={frameio?.folders || CLIENTS.map(c => ({ client: c.name, frameLink: c.frameLink }))} fetchedAt={frameio?.fetchedAt || null} fetching={fetchingFrameio} />
    </div>
  );
}
