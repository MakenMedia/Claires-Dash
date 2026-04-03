interface Assignee { id: string; name: string; color?: string; initials?: string; }
export default function AssigneeChip({ assignee }: { assignee: Assignee }) {
  const bg = assignee.color || '#5b6af0';
  const initials = assignee.initials || assignee.name?.slice(0, 2).toUpperCase() || '??';
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold" style={{ background: bg }} title={assignee.name}>
      {initials}
    </span>
  );
}
