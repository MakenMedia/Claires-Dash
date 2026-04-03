'use client';
interface Stats { open: number; overdue: number; totalNeeded: number; totalReady: number; }
interface Props { stats: Stats; }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Open Tasks', value: stats.open, color: '#5b6af0' },
    { label: 'Overdue', value: stats.overdue, color: '#ef4444' },
    { label: 'Total Needed', value: stats.totalNeeded, color: stats.totalNeeded > 0 ? '#ef4444' : '#22c55e' },
    { label: 'Total Ready', value: stats.totalReady, color: stats.totalReady >= stats.totalNeeded ? '#22c55e' : '#f97316' },
  ];
  return (
    <div className="stats-bar">
      {items.map(item => (
        <div key={item.label} className="stat">
          <span className="stat-dot" style={{ background: item.color }} />
          <div>
            <div className="stat-val">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
