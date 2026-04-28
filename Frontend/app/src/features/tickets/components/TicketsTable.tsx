import type { PaginatedTicketsDto, TicketDto, TicketPriority, TicketStatus } from '../../../shared/dtos/ticket.dto';
import TicketRow from './TicketRow';

interface TicketsTableProps {
  data: PaginatedTicketsDto | null;
  loading: boolean;
  currentStatus?: TicketStatus;
  currentPriority?: TicketPriority;
  onStatusFilter: (s: TicketStatus | undefined) => void;
  onPriorityFilter: (p: TicketPriority | undefined) => void;
  onPageChange: (p: number) => void;
  onChangeStatus: (t: TicketDto) => void;
  onAssign: (t: TicketDto) => void;
}

const STATUS_OPTIONS: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const PRIORITY_OPTIONS: { value: TicketPriority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function TicketsTable({
  data, loading, currentStatus, currentPriority,
  onStatusFilter, onPriorityFilter, onPageChange,
  onChangeStatus, onAssign,
}: TicketsTableProps) {
  const total = data?.total ?? 0;
  const page  = data?.page ?? 1;
  const lastPage = data?.lastPage ?? 1;

  return (
    <>
      {/* Filters */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">Request List</h1>
          <p className="text-slate-500 mt-2 text-base max-w-2xl">
            Manage and monitor support requests across departments.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={currentStatus ?? ''}
            onChange={(e) => onStatusFilter((e.target.value as TicketStatus) || undefined)}
            className="flex items-center bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={currentPriority ?? ''}
            onChange={(e) => onPriorityFilter((e.target.value as TicketPriority) || undefined)}
            className="flex items-center bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Request Details', 'Status', 'Priority', 'Assigned To', 'Date Created', 'Actions'].map((h) => (
                  <th key={h} className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    <span className="material-symbols-outlined animate-spin block mx-auto mb-2">progress_activity</span>
                    Loading...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No requests found.
                  </td>
                </tr>
              ) : (
                data?.data.map((t) => (
                  <TicketRow
                    key={t.id}
                    ticket={t}
                    onChangeStatus={onChangeStatus}
                    onAssign={onAssign}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-xs text-slate-500">
            Showing {data?.data.length ?? 0} of {total} requests
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-white transition-all disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 text-xs border border-slate-200 rounded transition-all ${p === page ? 'bg-white font-bold shadow-sm' : 'hover:bg-white'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= lastPage}
              className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-white transition-all disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
