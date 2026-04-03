'use client';

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
          const shortUrl = f.frameLink ? f.frameLink.replace('https://', '') : null;
          if (f.frameLink) {
            return (
              <a
                key={f.client}
                href={f.frameLink}
                target="_blank"
                rel="noopener noreferrer"
                className="framelink-card"
              >
                <div className="framelink-name">{f.client}</div>
                <div className="framelink-url">{shortUrl}</div>
              </a>
            );
          }
          return (
            <div key={f.client} className="framelink-card framelink-empty">
              <div className="framelink-name">{f.client}</div>
              <div className="framelink-url">No folder yet</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
