import type { TicketPriority } from '../../../shared/dtos/ticket.dto';

const config: Record<TicketPriority, { label: string; className: string }> = {
  high:   { label: 'High',   className: 'text-red-600 font-bold uppercase tracking-wide text-xs' },
  medium: { label: 'Medium', className: 'text-slate-500 font-bold uppercase tracking-wide text-xs' },
  low:    { label: 'Low',    className: 'text-slate-400 font-bold uppercase tracking-wide text-xs' },
};

export default function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const c = config[priority];
  return <span className={c.className}>{c.label}</span>;
}
