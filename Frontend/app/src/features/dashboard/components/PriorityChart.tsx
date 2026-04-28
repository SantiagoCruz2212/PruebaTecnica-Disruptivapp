import type { DashboardDto } from '../../../shared/dtos/ticket.dto';

interface Props { data: DashboardDto; }

export default function PriorityChart({ data }: Props) {
  const total = data.total || 1;
  const high   = data.byPriority.high   ?? 0;
  const medium = data.byPriority.medium ?? 0;
  const low    = data.byPriority.low    ?? 0;

  const highPct   = Math.round((high   / total) * 100);
  const mediumPct = Math.round((medium / total) * 100);
  const lowPct    = Math.round((low    / total) * 100);

  // Donut segments
  const highDash   = highPct;
  const mediumDash = mediumPct;
  const lowDash    = lowPct;

  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Priority Distribution</h3>
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500">
          LIVE <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse ml-1" />
        </div>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#f1f5f9" strokeWidth="3" />
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#0f172a"
              strokeDasharray={`${highDash} ${100 - highDash}`} strokeDashoffset="0" strokeWidth="3" />
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#2563eb"
              strokeDasharray={`${mediumDash} ${100 - mediumDash}`} strokeDashoffset={`-${highDash}`} strokeWidth="3" />
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#bfdbfe"
              strokeDasharray={`${lowDash} ${100 - lowDash}`} strokeDashoffset={`-${highDash + mediumDash}`} strokeWidth="3" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{data.total}</span>
            <span className="text-[10px] text-slate-500 font-medium">total</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { dot: 'bg-slate-900', label: 'High Priority',   count: high,   pct: highPct   },
          { dot: 'bg-blue-600',  label: 'Medium Priority', count: medium, pct: mediumPct },
          { dot: 'bg-blue-200',  label: 'Low Priority',    count: low,    pct: lowPct    },
        ].map(({ dot, label, count, pct }) => (
          <div key={label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-xs font-medium text-slate-700">{label}</span>
            </div>
            <span className="text-xs font-bold text-slate-900">{pct}% <span className="text-slate-400 font-normal">({count})</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
