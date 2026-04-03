'use client';
interface Stats { open: number; overdue: number; totalNeeded: number; totalReady: number; }
interface Props { stats: Stats; }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Open Tasks', value: stats.open, color: '#38bdf8' },
    { label: 'Overdue', value: stats.overdue, color: '#ef4444' },
    { label: 'Total Needed', value: stats.totalNeeded, color: stats.totalNeeded > 0 ? '#f97316' : '#22c55e' },
    { label: 'Total Ready', value: stats.totalReady, color: stats.totalReady >= stats.totalNeeded ? '#22c55e' : '#f97316' },
  ];
  return (
    <div className="flex gap-8 px-8 py-5 border-b border-[#2a2d3e] flex-wrap">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
          <div>
            <div className="text-2xl font-black" style={{ color: item.color }}>{item.value}</div>
            <div className="text-xs text-[#64748b]">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
