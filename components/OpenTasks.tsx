'use client';

interface Task {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  dueDate: number | null;
  isOverdue: boolean;
  isDueToday?: boolean;
  priority: string;
  listName: string;
  folderName: string;
  assignees: { id: string; name: string; color?: string; initials?: string }[];
  url: string;
}
interface Props { tasks: Task[]; fetchedAt: number | null; fetching: boolean; }

function priorityStyle(p: string): { background: string; color: string } {
  const lp = (p || '').toLowerCase();
  if (lp === 'urgent') return { background: '#ef444420', color: '#ef4444' };
  if (lp === 'high')   return { background: '#f9731620', color: '#f97316' };
  if (lp === 'normal') return { background: '#64748b20', color: '#94a3b8' };
  if (lp === 'low')    return { background: '#38bdf820', color: '#38bdf8' };
  return { background: 'transparent', color: 'var(--muted)' };
}

export default function OpenTasks({ tasks, fetchedAt, fetching }: Props) {
  const sorted = [...tasks].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#5b6af020' }}>✅</div>
          Open Tasks
          <span className="badge">{tasks.length} tasks</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      <div className="card-body">
        {sorted.length === 0 ? (
          <div className="empty">No open tasks 🎉</div>
        ) : sorted.map(task => {
          const due = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : null;
          const dueClass = task.isOverdue ? 'task-due overdue' : task.isDueToday ? 'task-due today' : 'task-due upcoming';
          const ps = priorityStyle(task.priority);
          return (
            <a key={task.id} href={task.url} target="_blank" rel="noopener noreferrer" className="task-row">
              <span className="status-dot" style={{ background: task.statusColor }} />
              <div className="task-info">
                <div className="task-name">{task.name}</div>
                <div className="task-meta">
                  <span className="task-list">
                    {[task.folderName, task.listName].filter(Boolean).join(' › ')}
                  </span>
                  {due && <span className={dueClass}>{due}</span>}
                  {task.priority && (
                    <span className="priority-chip" style={ps}>{task.priority}</span>
                  )}
                  <div className="assignee-chips">
                    {task.assignees.slice(0, 3).map(a => (
                      <span key={a.id} className="chip" title={a.name}>
                        {a.initials || a.name?.slice(0, 2).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
