import { useState } from 'react';
import Modal from '../../../shared/components/Modal/Modal';
import { useUpdateStatus } from '../hooks/useUpdateStatus';
import { useSession } from '../../../shared/context/SessionContext';
import type { TicketDto, TicketStatus } from '../../../shared/dtos/ticket.dto';

interface Props {
  ticket: TicketDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export default function ChangeStatusModal({ ticket, onClose, onSuccess }: Props) {
  const session = useSession();
  const [status, setStatus] = useState<TicketStatus>('in_progress');
  const { updateStatus, loading } = useUpdateStatus(() => { onSuccess(); onClose(); });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    updateStatus(ticket.id, { status, changedBy: session.id });
  };

  return (
    <Modal open={!!ticket} onClose={onClose} title="Change Status">
      {ticket && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Request</p>
            <p className="text-sm font-bold text-slate-900">{ticket.title}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Current: <span className="font-semibold">{ticket.status}</span></p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} disabled={o.value === ticket.status}>
                  {o.label}{o.value === ticket.status ? ' (current)' : ''}
                </option>
              ))}
            </select>
            {ticket.status === 'resolved' && (
              <p className="text-xs text-red-600 mt-1">This ticket is already resolved and cannot be modified.</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || ticket.status === 'resolved'}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60">
              {loading ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
