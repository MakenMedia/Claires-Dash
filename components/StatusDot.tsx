'use client';

interface Props {
  status: 'ok' | 'stale' | 'error' | 'unknown';
  label: string;
  lastFetch?: number | null;
}

export default function StatusDot({ status, label, lastFetch }: Props) {
  const colors = { ok: 'bg-green-500', stale: 'bg-yellow-400', error: 'bg-red-500', unknown: 'bg-gray-500' };
  const ago = lastFetch ? Math.round((Date.now() - lastFetch) / 1000) : null;
  const tooltip = lastFetch ? `${label}: last updated ${ago}s ago` : `${label}: no data yet`;
  return (
    <div className="relative group flex items-center gap-1.5 cursor-default">
      <div className={`w-2 h-2 rounded-full ${colors[status]} ${status === 'ok' ? 'pulse' : ''}`} />
      <span className="text-xs text-[#64748b]">{label}</span>
      <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-[#21243a] border border-[#2a2d3e] rounded text-xs text-[#e2e8f0] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {tooltip}
      </div>
    </div>
  );
}
