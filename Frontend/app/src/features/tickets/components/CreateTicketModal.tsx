import { useState } from 'react';
import Modal from '../../../shared/components/Modal/Modal';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { useUsers } from '../hooks/useUsers';
import { useSession } from '../../../shared/context/SessionContext';
import type { CreateTicketDto, TicketPriority } from '../../../shared/dtos/ticket.dto';

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm: Omit<CreateTicketDto, 'createdBy'> = {
  title: '',
  description: '',
  priority: 'medium',
  assignedTo: '',
};

export default function CreateTicketModal({ open, onClose }: CreateTicketModalProps) {
  const session = useSession();
  const [form, setForm] = useState(initialForm);
  const { create, loading } = useCreateTicket(() => { setForm(initialForm); onClose(); });
  const { users, loading: loadingUsers } = useUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dto: CreateTicketDto = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      createdBy: session.id,
      ...(form.assignedTo ? { assignedTo: form.assignedTo } : {}),
    };
    create(dto);
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <Modal open={open} onClose={onClose} title="New Support Request">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Title *</label>
          <input
            required
            maxLength={200}
            value={form.title}
            onChange={(e) => field('title', e.target.value)}
            placeholder="Describe the issue briefly..."
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Description *</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => field('description', e.target.value)}
            placeholder="Provide full details about the request..."
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => field('priority', e.target.value as TicketPriority)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Assign To <span className="text-slate-400 normal-case font-normal">(optional)</span>
          </label>
          <select
            value={form.assignedTo}
            onChange={(e) => field('assignedTo', e.target.value)}
            disabled={loadingUsers}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">— Unassigned —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          {loadingUsers && (
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
              Loading users...
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
