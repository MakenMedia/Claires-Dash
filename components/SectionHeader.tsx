interface Props {
  title: string;
  badge?: string | number;
  badgeColor?: string;
  lastFetch?: number | null;
  fetching?: boolean;
}

export default function SectionHeader({ title, badge, badgeColor = 'bg-[#5b6af0]', lastFetch, fetching }: Props) {
  const ago = lastFetch ? Math.round((Date.now() - lastFetch) / 60000) : null;
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-[#e2e8f0]">{title}</h2>
        {badge !== undefined && (
          <span className={`${badgeColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>{badge}</span>
        )}
        {fetching && <div className="w-3 h-3 border-2 border-[#5b6af0] border-t-transparent rounded-full animate-spin" />}
      </div>
      {lastFetch && (
        <span className={`text-xs text-[#64748b] ${fetching ? 'pulse' : ''}`}>
          {ago === 0 ? 'just now' : `${ago}m ago`}
        </span>
      )}
    </div>
  );
}
