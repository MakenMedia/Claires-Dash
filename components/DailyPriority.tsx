'use client';
import SectionHeader from './SectionHeader';
import PriorityBadge from './PriorityBadge';
import AssigneeChip from './AssigneeChip';

interface Task { id: string; name: string; status: string; statusColor: string; dueDate: number | null; isOverdue: boolean; priority: string; listName: string; folderName: string; assignees: { id: string; name: string; color?: string; initials?: string }[]; url: string; }
interface Props { tasks: Task[]; fetchedAt: number | null; fetching: boolean; }

export default function DailyPriority({ tasks, fetchedAt, fetching }: Props) {
  const sorted = [...tasks].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return (a.dueDate || 0) - (b.dueDate || 0);
  });

  return (
    <div className="px-8 py-6 border-b border-[#2a2d3e]">
      <SectionHeader title="Daily Priority" badge={sorted.length} badgeColor={sorted.length > 0 ? 'bg-red-500' : 'bg-green-500'} lastFetch={fetchedAt} fetching={fetching} />
      {sorted.length === 0 ? (
        <div className="text-[#64748b] text-sm py-4">Nothing due today 🎉</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sorted.map(task => {
            const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
            return (
              <a key={task.id} href={task.url} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 w-64 bg-[#1a1d27] border rounded-xl p-4 flex flex-col gap-2 hover:border-[#5b6af0] transition-colors"
                style={{ borderColor: task.isOverdue ? '#ef4444' : '#2a2d3e' }}>
                <div className="text-sm font-semibold text-[#e2e8f0] leading-snug">{task.name}</div>
                <div className="text-xs text-[#64748b]">{task.folderName || task.listName}</div>
                <div className="flex items-center gap-2 flex-wrap mt-auto">
                  {due && <span className={`text-xs font-semibold ${task.isOverdue ? 'text-red-400' : 'text-[#64748b]'}`}>{task.isOverdue ? '⚠ ' : ''}{due}</span>}
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="flex gap-1">
                  {task.assignees.map(a => <AssigneeChip key={a.id} assignee={a} />)}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
