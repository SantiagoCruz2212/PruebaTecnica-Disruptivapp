import type { DashboardDto } from '../../../shared/dtos/ticket.dto';

interface Props {
  data: DashboardDto;
}

const bars = [
  { key: 'pending' as const,     label: 'Pending',     color: 'bg-blue-200' },
  { key: 'in_progress' as const, label: 'In Progress', color: 'bg-blue-600' },
  { key: 'resolved' as const,    label: 'Resolved',    color: 'bg-slate-900' },
];

export default function StatusChart({ data }: Props) {
  const total = data.total || 1;

  return (
    <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Requests by Status</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {bars.map(({ key, label, color }) => {
          const count = data.byStatus[key] ?? 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-bold text-slate-900">{pct}% <span className="text-slate-400 font-normal">({count})</span></span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`${color} h-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Total</p>
          <p className="text-sm font-semibold text-slate-900">{data.total} tickets</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Pending</p>
          <p className="text-sm font-semibold text-slate-900">{data.byStatus.pending ?? 0}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Resolved</p>
          <p className="text-sm font-semibold text-slate-900">{data.byStatus.resolved ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
