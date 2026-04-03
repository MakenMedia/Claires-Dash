'use client';
import SectionHeader from './SectionHeader';
import PriorityBadge from './PriorityBadge';

interface Task { id: string; name: string; status: string; statusColor: string; dueDate: number | null; isOverdue: boolean; priority: string; url: string; }
interface TaskBoard { client: string; tasks: Task[]; openCount: number; overdueCount: number; }
interface Props { boards: TaskBoard[]; fetchedAt: number | null; fetching: boolean; }

export default function ClientTaskBoards({ boards, fetchedAt, fetching }: Props) {
  const totalTasks = boards.reduce((s, b) => s + b.openCount, 0);
  return (
    <div className="px-8 py-6 border-b border-[#2a2d3e]">
      <SectionHeader title="Client Task Boards" badge={`${boards.length} clients · ${totalTasks} tasks`} lastFetch={fetchedAt} fetching={fetching} />
      <div className="grid grid-cols-2 gap-4">
        {boards.map(board => (
          <div key={board.client}
            className="bg-[#1a1d27] border rounded-xl overflow-hidden"
            style={{ borderColor: board.overdueCount > 0 ? '#ef4444' : '#2a2d3e', borderLeftWidth: board.overdueCount > 0 ? '3px' : '1px' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3e]">
              <span className="font-bold text-sm text-[#e2e8f0]">{board.client}</span>
              <div className="flex items-center gap-2">
                {board.overdueCount > 0 && <span className="text-xs font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">{board.overdueCount} overdue</span>}
                <span className="text-xs text-[#64748b]">{board.openCount} tasks</span>
              </div>
            </div>
            <div className="divide-y divide-[#2a2d3e]">
              {board.tasks.length === 0 ? (
                <div className="px-4 py-4 text-sm text-[#64748b]">No open tasks 🎉</div>
              ) : board.tasks.slice(0, 5).map((t) => {
                const due = t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
                return (
                  <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#21243a] transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.statusColor }} />
                    <span className="flex-1 text-sm text-[#e2e8f0] truncate">{t.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={t.priority} />
                      {due && <span className={`text-xs ${t.isOverdue ? 'text-red-400 font-semibold' : 'text-[#64748b]'}`}>{due}</span>}
                    </div>
                  </a>
                );
              })}
              {board.tasks.length > 5 && (
                <div className="px-4 py-2 text-xs text-[#64748b]">+{board.tasks.length - 5} more</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
