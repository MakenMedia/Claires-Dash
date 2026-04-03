export default function PriorityBadge({ priority }: { priority: string }) {
  const p = (priority || '').toLowerCase();
  if (p === 'urgent') return <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">URGENT</span>;
  if (p === 'high') return <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">HIGH</span>;
  if (p === 'normal') return <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">NORMAL</span>;
  if (p === 'low') return <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">LOW</span>;
  return null;
}
