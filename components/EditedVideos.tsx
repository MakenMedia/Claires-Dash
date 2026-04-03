'use client';
import { CLIENTS } from '@/lib/config';

interface Props { fetchedAt: number | null; fetching: boolean; }

export default function EditedVideos({ fetchedAt, fetching }: Props) {
  const totalNeeded = CLIENTS.reduce((s, c) => s + c.needed, 0);
  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#22c55e20' }}>🎬</div>
          Edited Videos
          <span className="badge">{totalNeeded} posts/wk</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      <div className="deliverables-table">
        <div className="deliverables-header">
          <span className="del-client">Client</span>
          <span>Needed</span>
          <span>Shorts ↑</span>
          <span>Shorts Needed</span>
          <span></span>
          <span>LF ↑</span>
          <span>LF Needed</span>
          <span>Total Ready</span>
        </div>
        {CLIENTS.map(client => {
          const getVal = (key: string) => {
            if (typeof window === 'undefined') return 0;
            return parseInt(localStorage.getItem(`ev_${client.name}_${key}`) || '0');
          };
          const shortsUp = getVal('shortsUp');
          const shortsNeeded = getVal('shortsNeeded') || Math.ceil(client.needed * 0.7);
          const lfUp = getVal('lfUp');
          const lfNeeded = getVal('lfNeeded') || Math.floor(client.needed * 0.3);
          const totalReady = shortsUp + lfUp;
          const readyColor = totalReady >= client.needed ? 'var(--green)' : totalReady > 0 ? 'var(--orange)' : client.needed > 0 ? 'var(--red)' : 'var(--muted)';

          return (
            <div key={client.name} className="deliverables-row">
              <span className="del-client">{client.name}</span>
              <span className="del-col" style={{ color: 'var(--muted)' }}>{client.needed}</span>
              <span className="del-col">{shortsUp}</span>
              <span className="del-col" style={{ color: 'var(--muted)' }}>{shortsNeeded}</span>
              <div className="del-divider" />
              <span className="del-col">{lfUp}</span>
              <span className="del-col" style={{ color: 'var(--muted)' }}>{lfNeeded}</span>
              <span className="del-col del-total" style={{ color: readyColor }}>{totalReady}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
