import { useDashboard } from '../hooks/useDashboard';
import MetricCard from '../components/MetricCard';
import StatusChart from '../components/StatusChart';
import PriorityChart from '../components/PriorityChart';

export default function DashboardContainer() {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="material-symbols-outlined animate-spin text-slate-400 text-4xl">progress_activity</span>
      </div>
    );
  }

  const pending    = data.byStatus.pending    ?? 0;
  const inProgress = data.byStatus.in_progress ?? 0;
  const resolved   = data.byStatus.resolved   ?? 0;
  const high       = data.byPriority.high      ?? 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">Operations Overview</h1>
        <p className="text-slate-500 text-base">Monitor support request traffic and resolution velocity in real-time.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Total Requests"  value={data.total}  icon="trending_up"  iconColor="text-emerald-600" note={`${pending} pending`} />
        <MetricCard label="In Progress"     value={inProgress}  icon="autorenew"    iconColor="text-blue-600"   note="Active allocation"    />
        <MetricCard label="Resolved"        value={resolved}    icon="check_circle" iconColor="text-emerald-600" note="Closed successfully"  />
        <MetricCard label="High Priority"   value={high}        icon="priority_high" iconColor="text-red-500"   note="Requires attention"   />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <StatusChart   data={data} />
        <PriorityChart data={data} />
      </div>
    </div>
  );
}
