'use client';
import SectionHeader from './SectionHeader';
import { CLIENTS } from '@/lib/config';

interface Props { fetchedAt: number | null; fetching: boolean; }

export default function EditedVideos({ fetchedAt, fetching }: Props) {
  const totalNeeded = CLIENTS.reduce((s, c) => s + c.needed, 0);

  return (
    <div className="px-8 py-6 border-b border-[#2a2d3e]">
      <SectionHeader title="Edited Videos" badge={`${totalNeeded} posts/wk`} lastFetch={fetchedAt} fetching={fetching} />
      <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden">
        <div className="grid text-xs font-bold text-[#64748b] uppercase px-5 py-3 border-b border-[#2a2d3e]"
          style={{ gridTemplateColumns: '1fr 80px 110px 110px 110px 110px 100px' }}>
          <span>Client</span><span className="text-center">Needed</span>
          <span className="text-center">Shorts ↑</span><span className="text-center">Shorts Needed</span>
          <span className="text-center">LF ↑</span><span className="text-center">LF Needed</span>
          <span className="text-center">Total Ready</span>
        </div>
        {CLIENTS.map((client, i) => {
          // Values editable via localStorage
          const getVal = (key: string) => {
            if (typeof window === 'undefined') return 0;
            return parseInt(localStorage.getItem(`ev_${client.name}_${key}`) || '0');
          };
          const shortsUp = getVal('shortsUp');
          const shortsNeeded = getVal('shortsNeeded') || Math.ceil(client.needed * 0.7);
          const lfUp = getVal('lfUp');
          const lfNeeded = getVal('lfNeeded') || Math.floor(client.needed * 0.3);
          const totalReady = shortsUp + lfUp;
          const readyColor = totalReady >= client.needed ? '#22c55e' : totalReady > 0 ? '#f97316' : client.needed > 0 ? '#ef4444' : '#64748b';
          return (
            <div key={client.name}
              className={`grid items-center px-5 py-3 text-sm ${i < CLIENTS.length - 1 ? 'border-b border-[#2a2d3e]' : ''} hover:bg-[#21243a] transition-colors`}
              style={{ gridTemplateColumns: '1fr 80px 110px 110px 110px 110px 100px' }}>
              <span className="font-semibold text-[#e2e8f0]">{client.name}</span>
              <span className="text-center text-[#64748b]">{client.needed}</span>
              <span className="text-center text-[#e2e8f0]">{shortsUp}</span>
              <span className="text-center text-[#64748b]">{shortsNeeded}</span>
              <span className="text-center text-[#e2e8f0]">{lfUp}</span>
              <span className="text-center text-[#64748b]">{lfNeeded}</span>
              <span className="text-center font-bold" style={{ color: readyColor }}>{totalReady}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
