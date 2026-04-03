'use client';

interface CalEvent { id: string; title?: string; summary?: string; start: string; end: string; allDay?: boolean; }
interface Props { events: CalEvent[]; fetchedAt: number | null; fetching: boolean; }

export default function ThisWeek({ events, fetchedAt, fetching }: Props) {
  const today = new Date();
  const days: { label: string; dateNum: string; dateStr: string; isToday: boolean; dayEvents: CalEvent[] }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dateNum = d.getDate().toString();
    const dayEvents = events.filter(e => (e.start || '').slice(0, 10) === dateStr);
    days.push({ label, dateNum, dateStr, isToday: i === 0, dayEvents });
  }

  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#5b6af020' }}>📅</div>
          This Week
          <span className="badge">{events.length} events</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div className="cal-week">
          {days.map(({ label, dateNum, isToday, dayEvents }) => (
            <div key={label + dateNum} className={`cal-day${isToday ? ' today' : ''}`}>
              <div className="cal-day-header">
                <span className="cal-day-name">{label}</span>
                <span className="cal-day-num">{dateNum}</span>
              </div>
              <div className="cal-events">
                {dayEvents.length === 0
                  ? <div className="cal-empty">—</div>
                  : dayEvents.map(e => {
                      const t = e.allDay ? null : (() => {
                        try { return new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
                        catch { return null; }
                      })();
                      return (
                        <div key={e.id} className="cal-event" title={e.summary || e.title}>
                          {t && <span className="cal-event-time">{t}</span>}
                          {e.summary || e.title}
                        </div>
                      );
                    })
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
