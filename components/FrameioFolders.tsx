'use client';
import SectionHeader from './SectionHeader';

interface Folder { client: string; frameLink: string | null; }
interface Props { folders: Folder[]; fetchedAt: number | null; fetching: boolean; }

export default function FrameioFolders({ folders, fetchedAt, fetching }: Props) {
  return (
    <div className="px-8 py-6 border-b border-[#2a2d3e]">
      <SectionHeader title="Frame.io Client Folders" lastFetch={fetchedAt} fetching={fetching} />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {folders.map(f => (
          <div key={f.client} className="flex-shrink-0 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-4 w-44 hover:border-[#5b6af0] transition-colors">
            <div className="font-bold text-sm text-[#e2e8f0] mb-2">{f.client}</div>
            {f.frameLink ? (
              <a href={f.frameLink} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#5b6af0] hover:underline font-medium flex items-center gap-1">
                🎬 Open Folder
              </a>
            ) : (
              <span className="text-xs text-[#64748b]">No folder yet</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
