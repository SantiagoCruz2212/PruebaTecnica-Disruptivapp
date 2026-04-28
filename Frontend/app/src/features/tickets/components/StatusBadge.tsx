import type { TicketStatus } from '../../../shared/dtos/ticket.dto';

const config: Record<TicketStatus, { label: string; dot: string; bg: string; text: string }> = {
  pending:     { label: 'Pending',     dot: 'bg-slate-400',  bg: 'bg-slate-100',  text: 'text-slate-600' },
  in_progress: { label: 'In Progress', dot: 'bg-blue-600',   bg: 'bg-blue-50',    text: 'text-blue-700'  },
  resolved:    { label: 'Resolved',    dot: 'bg-green-600',  bg: 'bg-green-50',   text: 'text-green-700' },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mr-2`} />
      {c.label}
    </span>
  );
}
