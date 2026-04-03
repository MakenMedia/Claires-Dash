'use client';
import SectionHeader from './SectionHeader';
import PriorityBadge from './PriorityBadge';
import AssigneeChip from './AssigneeChip';

interface Task { id: string; name: string; status: string; statusColor: string; dueDate: number | null; isOverdue: boolean; priority: string; listName: string; folderName: string; assignees: { id: string; name: string; color?: string; initials?: string }[]; url: string; }
interface Props { tasks: Task[]; fetchedAt: number | null; fetching: boolean; }

export default function OpenTasks({ tasks, fetchedAt, fetching }: Props) {
  const sorted = [...tasks].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="px-8 py-6 border-b border-[#2a2d3e]">
      <SectionHeader title="Open Tasks" badge={`${tasks.length} tasks`} lastFetch={fetchedAt} fetching={fetching} />
      <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden">
        {sorted.length === 0 ? (
          <div className="text-[#64748b] text-sm p-6">No open tasks 🎉</div>
        ) : sorted.map((task, i) => {
          const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
          return (
            <a key={task.id} href={task.url} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-4 px-5 py-3 hover:bg-[#21243a] transition-colors ${i < sorted.length - 1 ? 'border-b border-[#2a2d3e]' : ''}`}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: task.statusColor }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#e2e8f0] truncate">{task.name}</div>
                <div className="text-xs text-[#64748b]">{[task.folderName, task.listName].filter(Boolean).join(' › ')}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <PriorityBadge priority={task.priority} />
                {due && <span className={`text-xs font-semibold ${task.isOverdue ? 'text-red-400' : 'text-[#64748b]'}`}>{due}</span>}
                <div className="flex gap-1">{task.assignees.slice(0, 3).map(a => <AssigneeChip key={a.id} assignee={a} />)}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
