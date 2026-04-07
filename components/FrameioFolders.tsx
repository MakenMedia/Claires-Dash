'use client';
import { CLIENTS } from '@/lib/config';

interface Folder { client: string; frameLink: string | null; }
interface Props { folders: Folder[]; fetchedAt: number | null; fetching: boolean; }

export default function FrameioFolders({ folders, fetchedAt, fetching }: Props) {
  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#22c55e20' }}>🗂</div>
          Frame.io Client Folders
          <span className="badge">{folders.length} clients</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      <div className="framelink-grid">
        {folders.map(f => {
          const cfg = CLIENTS.find(c => c.name === f.client);
          const research = cfg?.marketResearch || null;
          return (
            <div key={f.client} className="framelink-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="framelink-name">{f.client}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {f.frameLink ? (
                  <a href={f.frameLink} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--green)', textDecoration: 'none', padding: '6px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
                    🎬 Frame.io
                  </a>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--text-faint)', padding: '6px 10px' }}>No Frame folder</span>
                )}
                {research ? (
                  <a href={research} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#38bdf8', textDecoration: 'none', padding: '6px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8 }}>
                    📊 Market Research
                  </a>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--text-faint)', padding: '6px 10px' }}>No research yet</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
