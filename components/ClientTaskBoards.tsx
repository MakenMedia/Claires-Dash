'use client';

interface Task {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  dueDate: number | null;
  isOverdue: boolean;
  priority: string;
  url: string;
}
interface TaskBoard { client: string; tasks: Task[]; openCount: number; overdueCount: number; }
interface Props { boards: TaskBoard[]; fetchedAt: number | null; fetching: boolean; }

function priorityStyle(p: string): { background: string; color: string } {
  const lp = (p || '').toLowerCase();
  if (lp === 'urgent') return { background: '#ef444420', color: '#ef4444' };
  if (lp === 'high')   return { background: '#f9731620', color: '#f97316' };
  if (lp === 'normal') return { background: '#64748b20', color: '#94a3b8' };
  if (lp === 'low')    return { background: '#38bdf820', color: '#38bdf8' };
  return { background: 'transparent', color: 'var(--muted)' };
}

export default function ClientTaskBoards({ boards, fetchedAt, fetching }: Props) {
  const totalTasks = boards.reduce((s, b) => s + b.openCount, 0);
  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#38bdf820' }}>📋</div>
          Client Task Boards
          <span className="badge">{boards.length} clients · {totalTasks} tasks</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      <div className="clients-grid">
        {boards.map(board => (
          <div
            key={board.client}
            className="client-card"
            style={board.overdueCount > 0 ? { borderLeft: '3px solid var(--red)' } : {}}
          >
            <div className="client-card-header">
              <span className="client-card-name">{board.client}</span>
              <div className="client-card-meta">
                {board.overdueCount > 0 && (
                  <span className="client-overdue">{board.overdueCount} overdue</span>
                )}
                <span className="client-total">{board.openCount} tasks</span>
              </div>
            </div>
            <div className="client-tasks">
              {board.tasks.length === 0 ? (
                <div className="client-no-tasks">No open tasks 🎉</div>
              ) : board.tasks.slice(0, 5).map(t => {
                const due = t.dueDate
                  ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : null;
                const ps = priorityStyle(t.priority);
                return (
                  <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="client-task-row">
                    <span className="status-dot" style={{ background: t.statusColor, marginTop: 0 }} />
                    <span className="client-task-name">{t.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {t.priority && (
                        <span className="priority-chip" style={ps}>{t.priority}</span>
                      )}
                      {due && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: t.isOverdue ? 'var(--red)' : 'var(--muted)' }}>
                          {due}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
              {board.tasks.length > 5 && (
                <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--muted)' }}>
                  +{board.tasks.length - 5} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
