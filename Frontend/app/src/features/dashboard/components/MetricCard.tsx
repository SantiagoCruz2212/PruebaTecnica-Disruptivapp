interface MetricCardProps {
  label: string;
  value: number | string;
  icon: string;
  iconColor: string;
  note: string;
}

export default function MetricCard({ label, value, icon, iconColor, note }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-[32px] font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className={`mt-4 flex items-center gap-2 ${iconColor}`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        <span className="text-xs font-bold">{note}</span>
      </div>
    </div>
  );
}
