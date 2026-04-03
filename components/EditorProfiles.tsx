'use client';
import PriorityBadge from './PriorityBadge';

interface EditorTask {
  id: string; name: string; status: string; statusColor: string;
  dueDate: number | null; isOverdue: boolean; isDueToday: boolean;
  priority: string; client: string; folderName: string; listName: string; url: string;
}
interface EditorProfile {
  id: string; name: string; color: string;
  tasks: EditorTask[]; openCount: number; overdueCount: number;
}
interface Props { profiles: EditorProfile[]; fetchedAt: number | null; fetching: boolean; }

export default function EditorProfiles({ profiles, fetchedAt, fetching }: Props) {
  const ago = fetchedAt ? Math.round((Date.now() - fetchedAt) / 60000) : null;
  const totalTasks = profiles.reduce((s, p) => s + p.openCount, 0);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#f9731620' }}>✂️</div>
          Editor Profiles
          <span className="badge">{profiles.length} editors · {totalTasks} tasks</span>
          {fetching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {ago === 0 ? 'just now' : `${ago}m ago`}
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 1, background: 'var(--border)' }}>
        {profiles.map(editor => (
          <div key={editor.id} style={{ background: 'var(--card)', padding: '16px 20px' }}>
            {/* Editor header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: editor.color + '25',
                border: `1px solid ${editor.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: editor.color, flexShrink: 0,
              }}>
                {editor.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{editor.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{editor.openCount} tasks{editor.overdueCount > 0 ? ` · ` : ''}{editor.overdueCount > 0 && <span style={{ color: 'var(--red)', fontWeight: 600 }}>{editor.overdueCount} overdue</span>}</div>
              </div>
            </div>

            {/* Task list */}
            {editor.tasks.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--muted)', padding: '8px 0' }}>No open tasks 🎉</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editor.tasks.map(task => {
                  const due = task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : null;
                  const dueColor = task.isOverdue ? 'var(--red)' : task.isDueToday ? 'var(--orange)' : 'var(--muted)';

                  return (
                    <a key={task.id} href={task.url} target="_blank" rel="noopener noreferrer"
                      className="task-row"
                      style={{ borderLeft: task.isOverdue ? '3px solid var(--red)' : task.isDueToday ? '3px solid var(--orange)' : '3px solid transparent', paddingLeft: 10 }}>
                      <div className="status-dot" style={{ background: task.statusColor }} />
                      <div className="task-info">
                        <div className="task-name">{task.name}</div>
                        <div className="task-meta">
                          <span className="task-list" style={{ color: editor.color, fontWeight: 600 }}>{task.client}</span>
                          {(task.folderName || task.listName) && (
                            <span className="task-list">› {task.listName || task.folderName}</span>
                          )}
                          {due && <span className="task-due" style={{ color: dueColor }}>{task.isOverdue ? '⚠ ' : ''}{due}</span>}
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
