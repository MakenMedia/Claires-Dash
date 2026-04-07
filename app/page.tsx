'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import StatusDot from '@/components/StatusDot';
import StatsBar from '@/components/StatsBar';
import ThisWeek from '@/components/ThisWeek';
import DailyPriority from '@/components/DailyPriority';
import EditedVideos from '@/components/EditedVideos';
import ClientTaskBoards from '@/components/ClientTaskBoards';
import FrameioFolders from '@/components/FrameioFolders';
import EditorProfiles from '@/components/EditorProfiles';
import SopSection from '@/components/SopSection';
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
  const [editors, setEditors] = useState<{profiles: any[]; fetchedAt: number} | null>(null);
  const [deliverables, setDeliverables] = useState<Record<string, { shorts?: number; longform?: number; ready?: number; readylongform?: number }>>({});
  const [fetchingClickup, setFetchingClickup] = useState(false);
  const [fetchingCal, setFetchingCal] = useState(false);
  const [fetchingFrameio, setFetchingFrameio] = useState(false);
  const [fetchingEditors, setFetchingEditors] = useState(false);
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

  const fetchDeliverables = useCallback(async () => {
    try {
      const r = await fetch('https://dashboard.maken.media/api/deliverables', { cache: 'no-store' });
      if (r.ok) setDeliverables(await r.json());
    } catch { /* ignore */ }
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

  const fetchEditors = useCallback(async () => {
    setFetchingEditors(true);
    try {
      const r = await fetch('/api/editors');
      if (r.ok) setEditors(await r.json());
    } catch { /* ignore */ } finally { setFetchingEditors(false); }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchClickup(), fetchCalendar(), fetchFrameio(), fetchEditors(), fetchDeliverables()]);
    setRefreshing(false);
  }, [fetchClickup, fetchCalendar, fetchFrameio, fetchEditors, fetchDeliverables]);

  // Initial load
  useEffect(() => { refreshAll(); }, [refreshAll]);

  // Polling
  useEffect(() => {
    const t1 = setInterval(() => { if (!isPaused) fetchClickup(); }, POLL_CLICKUP);
    const t2 = setInterval(() => fetchCalendar(), POLL_CALENDAR);
    const t3 = setInterval(() => fetchFrameio(), POLL_FRAMEIO);
    const t4 = setInterval(() => fetchDeliverables(), 30000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); };
  }, [fetchClickup, fetchCalendar, fetchFrameio, fetchDeliverables, isPaused]);

  // Tab refocus
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') refreshAll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshAll]);

  const totalNeeded = CLIENTS.reduce((s, c) => {
    const d = deliverables[c.name];
    return s + ((d?.shorts ?? c.needed) + (d?.longform ?? 0));
  }, 0);
  const totalReady = CLIENTS.reduce((s, c) => {
    const d = deliverables[c.name];
    return s + (d?.ready ?? 0) + (d?.readylongform ?? 0);
  }, 0);
  const stats = {
    open: clickup?.stats.open || 0,
    overdue: clickup?.stats.overdue || 0,
    totalNeeded,
    totalReady,
  };

  const clickupStatus: 'ok' | 'stale' | 'error' | 'unknown' =
    clickup ? (fetchingClickup ? 'stale' : 'ok') : 'unknown';

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Header */}
      <header>
        <div className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Maken Media" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          Dashboard <span>— Claire</span>
        </div>
        <div className="header-right">
          <span className="date">{dateStr}</span>
          <button
            className={`refresh-btn${refreshing ? ' spinning' : ''}`}
            onClick={refreshAll}
            disabled={refreshing}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Refresh
          </button>
          <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
            style={{ background: 'transparent', border: '1px solid #252a38', borderRadius: 8, color: '#64748b', padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Status dots row */}
      <div className="status-row">
        <StatusDot status={clickupStatus} label="ClickUp" lastFetch={clickup?.fetchedAt} />
        <StatusDot status={calendar ? 'ok' : 'unknown'} label="Calendar" lastFetch={calendar?.fetchedAt} />
        <StatusDot status="unknown" label="GHL" lastFetch={null} />
        <StatusDot status={frameio ? 'ok' : 'unknown'} label="Frame.io" lastFetch={frameio?.fetchedAt} />
        {fetchingClickup && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Syncing…</span>}
      </div>

      {isPaused && (
        <div style={{ background: '#ef444420', borderBottom: '1px solid #ef444440', padding: '8px 32px', fontSize: 13, color: 'var(--red)', textAlign: 'center' }}>
          Connection lost — retrying…
        </div>
      )}

      {/* Stats bar */}
      <StatsBar stats={stats} />

      {/* Main content */}
      <div className="main-content">
        <ThisWeek events={calendar?.events || []} fetchedAt={calendar?.fetchedAt || null} fetching={fetchingCal} />
        <DailyPriority tasks={clickup?.dueTodayTasks || []} fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
        <EditedVideos fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
        <ClientTaskBoards boards={clickup?.clientBoards || []} fetchedAt={clickup?.fetchedAt || null} fetching={fetchingClickup} />
        <FrameioFolders folders={frameio?.folders || CLIENTS.map(c => ({ client: c.name, frameLink: c.frameLink }))} fetchedAt={frameio?.fetchedAt || null} fetching={fetchingFrameio} />
        <EditorProfiles profiles={editors?.profiles || []} fetchedAt={editors?.fetchedAt || null} fetching={fetchingEditors} />
        <SopSection />
      </div>
    </>
  );
}
