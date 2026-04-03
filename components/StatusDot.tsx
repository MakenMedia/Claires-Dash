'use client';

interface Props {
  status: 'ok' | 'stale' | 'error' | 'unknown';
  label: string;
  lastFetch?: number | null;
}

const DOT_COLORS: Record<string, string> = {
  ok: '#22c55e',
  stale: '#eab308',
  error: '#ef4444',
  unknown: '#64748b',
};

export default function StatusDot({ status, label, lastFetch }: Props) {
  const ago = lastFetch ? Math.round((Date.now() - lastFetch) / 1000) : null;
  const tooltip = lastFetch ? `${label}: last updated ${ago}s ago` : `${label}: no data yet`;
  const dotColor = DOT_COLORS[status] || '#64748b';

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'default' }}
      title={tooltip}
      className="group"
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dotColor,
          display: 'inline-block',
          flexShrink: 0,
        }}
        className={status === 'ok' ? 'pulse' : ''}
      />
      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}
