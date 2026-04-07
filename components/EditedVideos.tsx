'use client';
import { useState, useEffect, useCallback } from 'react';
import { CLIENTS } from '@/lib/config';

const SAM_API = 'https://dashboard.maken.media/api/deliverables';

interface DeliverableRow { shorts?: number; longform?: number; ready?: number; readylongform?: number; }
type DeliverableStore = Record<string, DeliverableRow>;

interface Props { fetchedAt: number | null; fetching: boolean; }

export default function EditedVideos({ fetchedAt, fetching }: Props) {
  const [data, setData] = useState<DeliverableStore>({});
  const [saving, setSaving] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const r = await fetch(SAM_API);
      if (r.ok) setData(await r.json());
    } catch { /* use defaults */ }
  }, []);

  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 30000);
    return () => clearInterval(t);
  }, [loadData]);

  const handleChange = async (clientName: string, field: string, value: number) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      [clientName]: { ...prev[clientName], [field]: value },
    }));
    setSaving(clientName + field);
    try {
      await fetch(SAM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: clientName, field, value }),
      });
    } catch { /* ignore */ } finally { setSaving(null); }
  };

  const totalNeeded = CLIENTS.reduce((s, c) => s + c.needed, 0);
  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  const totalReady = CLIENTS.reduce((s, c) => {
    const d = data[c.name];
    return s + (d?.ready || 0) + (d?.readylongform || 0);
  }, 0);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#22c55e20' }}>🎬</div>
          Edited Videos
          <span className="badge">{totalNeeded} posts/wk</span>
          {(fetching || saving) && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>{totalReady} ready</span>
          {fetchedAt && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{ago === 0 ? 'just now' : `${ago}m ago`}</span>}
        </div>
      </div>
      <div className="deliverables-table">
        <div className="deliverables-header" style={{ gridTemplateColumns: '1fr 70px 110px 100px 90px' }}>
          <span className="del-client">Client</span>
          <span>Needed</span>
          <span>Ready Shorts</span>
          <span>Ready LF</span>
          <span>Total Ready</span>
        </div>
        {CLIENTS.map(client => {
          const d = data[client.name] || {};
          const ready = d.ready || 0;
          const readylongform = d.readylongform || 0;
          const totalReady = ready + readylongform;
          // "Needed" is dynamic: shorts+longform from Sam's dashboard (KV), falling back to config default
          const dynamicNeeded = (d.shorts ?? client.needed) + (d.longform ?? 0);
          const readyColor = totalReady >= dynamicNeeded ? 'var(--green)' : totalReady > 0 ? 'var(--orange)' : dynamicNeeded > 0 ? 'var(--red)' : 'var(--muted)';

          return (
            <div key={client.name} className="deliverables-row" style={{ gridTemplateColumns: '1fr 70px 110px 100px 90px' }}>
              <span className="del-client">{client.name}</span>
              <span className="del-col" style={{ color: 'var(--muted)', fontSize: 13 }}>{dynamicNeeded}</span>
              <span className="del-col">
                <input className="del-input" type="number" min="0"
                  value={ready}
                  onChange={e => handleChange(client.name, 'ready', Math.max(0, parseInt(e.target.value) || 0))} />
              </span>
              <span className="del-col">
                <input className="del-input" type="number" min="0"
                  value={readylongform}
                  onChange={e => handleChange(client.name, 'readylongform', Math.max(0, parseInt(e.target.value) || 0))} />
              </span>
              <span className="del-col del-total" style={{ color: readyColor, fontSize: 15, fontWeight: 800 }}>{totalReady}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
