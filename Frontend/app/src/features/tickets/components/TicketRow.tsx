import type { TicketDto } from '../../../shared/dtos/ticket.dto';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface TicketRowProps {
  ticket: TicketDto;
  onChangeStatus: (ticket: TicketDto) => void;
  onAssign: (ticket: TicketDto) => void;
}

export default function TicketRow({ ticket, onChangeStatus, onAssign }: TicketRowProps) {
  const date = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 mb-0.5">{ticket.title}</span>
          <span className="text-xs text-slate-400 font-mono">{ticket.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </td>
      <td className="px-6 py-5"><StatusBadge status={ticket.status} /></td>
      <td className="px-6 py-5"><PriorityBadge priority={ticket.priority} /></td>
      <td className="px-6 py-5">
        {ticket.assignedTo ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
              {ticket.assignedTo.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm text-slate-600">{ticket.assignedTo.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
            </div>
            <span className="text-sm text-slate-400 italic">Unassigned</span>
          </div>
        )}
      </td>
      <td className="px-6 py-5">
        <span className="text-sm text-slate-500">{date}</span>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onChangeStatus(ticket)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
            title="Change Status"
          >
            <span className="material-symbols-outlined text-[20px]">sync_alt</span>
          </button>
          <button
            onClick={() => onAssign(ticket)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
            title="Assign Responsible"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
