import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  Shield,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const EmployeeDetailView: React.FC = () => {
  const {
    selectedEmployeeId,
    setSelectedEmployeeId,
    setActiveView,
    users,
    performanceSummaries,
    tasks,
    currentUser,
    isAdmin,
    isManager,
  } = useApp();

  const employee = users.find((u) => u.id === selectedEmployeeId);
  const summary = selectedEmployeeId ? performanceSummaries.get(selectedEmployeeId) : undefined;
  const manager = employee?.managerId ? users.find((u) => u.id === employee.managerId) : undefined;

  const empTasks = tasks.filter((t) => t.assignedTo === selectedEmployeeId);

  if (!employee || !summary) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Employee record not found or access restricted.</p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Radar data
  const radarData = summary.kpiScores.map((k) => ({
    metric: k.kpi.name.length > 18 ? k.kpi.name.slice(0, 16) + '...' : k.kpi.name,
    score: k.score,
    target: 100,
  }));

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between bg-white p-4 md:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => {
            setSelectedEmployeeId(null);
            setActiveView('dashboard');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Performance Board</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Direct Supervisor:</span>
          <strong className="text-slate-900 font-semibold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
            {manager?.name || 'Executive Leadership'}
          </strong>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Bento Tile 1: Profile & Score Banner (12 cols) */}
        <div className="lg:col-span-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-indigo-400/80 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight">{employee.name}</h1>
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 rounded-full">
                    {employee.role}
                  </span>
                </div>
                <p className="text-sm text-indigo-200/80 mt-0.5 font-medium">{employee.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {employee.department} • Joined {employee.joinedDate} • Direct Manager: {manager?.name || 'Executive'}
                </p>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-200 block">
                  Composite Score
                </span>
                <div className="text-3xl font-extrabold tracking-tight text-white">
                  {summary.overallScore}%
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm ${
                  summary.overallScore >= 90
                    ? 'bg-emerald-500 text-white'
                    : summary.overallScore >= 75
                    ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {summary.overallScore >= 90 ? 'A+' : summary.overallScore >= 80 ? 'A' : 'B'}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Task Completion Metric (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Task Completion</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {summary.taskCompletionRate}%
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1">
            {summary.completedTasksCount} of {summary.totalTasksCount} tasks closed
          </span>
        </div>

        {/* Bento Tile 3: On-Time Delivery Metric (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">On-Time Delivery</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {summary.onTimeDeliveryRate}%
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-1">Sprint SLA Target: 90%</span>
        </div>

        {/* Bento Tile 4: Avg Cycle Time Metric (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Avg Cycle Time</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {summary.avgCycleTimeDays} days
          </div>
          <span className="text-xs text-indigo-600 font-semibold mt-1">Benchmark: ≤ 3.5 days</span>
        </div>

        {/* Bento Tile 5: Period Trend Metric (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Period Trend</span>
          <div
            className={`text-2xl font-extrabold mt-2 flex items-center gap-1 ${
              summary.scoreTrend >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {summary.scoreTrend >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            <span>{summary.scoreTrend >= 0 ? `+${summary.scoreTrend}%` : `${summary.scoreTrend}%`}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1">vs prior cycle evaluation</span>
        </div>

        {/* Bento Tile 6: KPI Balance Radar (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>KPI Metric Radar Profile</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Target Benchmark: 100%</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bento Tile 7: Historical Trajectory Line Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Historical Score Trajectory</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Past 4 Cycles</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.scoreHistory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} unit="%" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    border: 'none',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bento Tile 8: Assigned KPI Breakdown (12 cols) */}
        <div className="lg:col-span-12 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Assigned KPI Goals & Weight Breakdown</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.kpiScores.map((k) => (
              <div key={k.kpi.id} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                    Weight: {k.kpi.weight}%
                  </span>
                  <span className="text-xs font-bold text-indigo-700">{k.score}%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2.5">{k.kpi.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{k.kpi.description}</p>
                <div className="mt-3 text-xs text-slate-700">
                  Actual: <strong>{k.actualValue} {k.kpi.unit}</strong> / Target: {k.kpi.targetValue} {k.kpi.unit}
                </div>
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, k.score)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Tile 9: Assigned Task History Table (12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Assigned Task History ({empTasks.length})</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-5">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {empTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">{t.title}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{t.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {t.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{t.dueDate}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{t.actualHours}h / {t.estimatedHours}h</td>
                    <td className="py-3.5 px-5 text-right capitalize font-semibold text-indigo-700">
                      {t.status.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
