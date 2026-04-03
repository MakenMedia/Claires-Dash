'use client';
import SectionHeader from './SectionHeader';

interface CalEvent { id: string; title?: string; summary?: string; start: string; end: string; allDay?: boolean; }
interface Props { events: CalEvent[]; fetchedAt: number | null; fetching: boolean; }

export default function ThisWeek({ events, fetchedAt, fetching }: Props) {
  const days: { label: string; date: string; dayEvents: CalEvent[] }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayEvents = events.filter(e => (e.start || '').slice(0, 10) === dateStr);
    days.push({ label, date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), dayEvents });
  }

  return (
    <div className="px-8 py-6 border-b border-[#2a2d3e]">
      <SectionHeader title="This Week" badge={`${events.length} events`} badgeColor="bg-[#5b6af0]" lastFetch={fetchedAt} fetching={fetching} />
      <div className="grid grid-cols-7 gap-3">
        {days.map(({ label, date, dayEvents }) => (
          <div key={date} className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-3 min-h-[100px]">
            <div className="text-xs font-bold text-[#64748b] mb-1">{label}</div>
            <div className="text-sm font-semibold text-[#e2e8f0] mb-2">{date}</div>
            {dayEvents.length === 0 ? null : dayEvents.map(e => {
              const t = e.allDay ? null : new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return (
                <div key={e.id} className="text-xs bg-[#5b6af0]/15 border border-[#5b6af0]/30 rounded p-1 mb-1">
                  {t && <div className="text-[#5b6af0] font-semibold">{t}</div>}
                  <div className="text-[#e2e8f0] leading-snug">{e.summary || e.title}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
