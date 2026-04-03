'use client';

interface Task {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  dueDate: number | null;
  isOverdue: boolean;
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

export default function DailyPriority({ tasks, fetchedAt, fetching }: Props) {
  const sorted = [...tasks].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return (a.dueDate || 0) - (b.dueDate || 0);
  });

  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#ef444420' }}>🔥</div>
          Daily Priority — Overdue &amp; Due Today
          <span className="badge">{sorted.length}</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      {sorted.length === 0 ? (
        <div className="empty">Nothing due today 🎉</div>
      ) : (
        <div className="priority-grid">
          {sorted.map(task => {
            const due = task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : null;
            const cls = task.isOverdue ? 'priority-item overdue' : 'priority-item today';
            const ps = priorityStyle(task.priority);
            return (
              <a key={task.id} href={task.url} target="_blank" rel="noopener noreferrer" className={cls}>
                <div className="priority-item-name">{task.name}</div>
                <div className="priority-item-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {[task.folderName, task.listName].filter(Boolean).join(' › ')}
                    </span>
                    {due && (
                      <span className={`task-due ${task.isOverdue ? 'overdue' : 'today'}`}>{due}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
      )}
    </div>
  );
}
