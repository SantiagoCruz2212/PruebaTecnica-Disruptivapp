import { useState } from 'react';
import Modal from '../../../shared/components/Modal/Modal';
import { useAssignTicket } from '../hooks/useAssignTicket';
import { useSession } from '../../../shared/context/SessionContext';
import type { TicketDto } from '../../../shared/dtos/ticket.dto';

interface Props {
  ticket: TicketDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignModal({ ticket, onClose, onSuccess }: Props) {
  const session = useSession();
  const [assignedTo, setAssignedTo] = useState('');
  const { assign, loading } = useAssignTicket(() => { setAssignedTo(''); onSuccess(); onClose(); });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !assignedTo.trim()) return;
    assign(ticket.id, { assignedTo: assignedTo.trim(), changedBy: session.id });
  };

  return (
    <Modal open={!!ticket} onClose={onClose} title="Assign Responsible">
      {ticket && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Request</p>
            <p className="text-sm font-bold text-slate-900">{ticket.title}</p>
            {ticket.assignedTo && (
              <p className="text-xs text-slate-400 mt-0.5">
                Currently: <span className="font-semibold text-slate-600">{ticket.assignedTo.name}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">User UUID *</label>
            <input
              required
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. a0000000-0000-0000-0000-000000000002"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-400">
              An email notification will be sent to the assigned user automatically.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60">
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
