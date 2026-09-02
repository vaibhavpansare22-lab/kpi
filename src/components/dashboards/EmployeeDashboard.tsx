import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskEntryModal } from '../tasks/TaskEntryModal';
import { TaskStatus } from '../../types';
import {
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const EmployeeDashboard: React.FC = () => {
  const {
    currentUser,
    tasks,
    performanceSummaries,
    period,
    updateTask,
    setActiveView,
    openTaskReview,
  } = useApp();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const summary = performanceSummaries.get(currentUser.id);
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.id);
  const completedTasks = myTasks.filter((t) => t.status === 'completed');
  const inProgressTasks = myTasks.filter((t) => t.status === 'in_progress');

  const score = summary?.overallScore || 90;
  const trend = summary?.scoreTrend || 2.1;

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100/80 text-emerald-800 rounded-full border border-emerald-200">
              Personal Performance Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.title} • {currentUser.department} • Active Evaluation Cycle: <strong className="text-slate-700 font-semibold">{period}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('tasks')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <span>All Tasks ({myTasks.length})</span>
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Task Entry</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Bento Tile 1: Hero Composite Rating Card (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Personal KPI Rating
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-indigo-200 border border-white/10 uppercase">
                {period}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-4xl font-extrabold tracking-tight text-white">
                {score}%
              </div>
              <div
                className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-md border ${
                  trend >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
              >
                {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{trend >= 0 ? `+${trend}%` : `${trend}%`}</span>
              </div>
            </div>

            <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
              Weighted composite across your {summary?.kpiScores.length || 6} assigned engineering benchmarks.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-indigo-300/80 uppercase font-semibold block">Task Velocity</span>
              <strong className="text-sm font-bold text-white">{completedTasks.length} / {myTasks.length} done</strong>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300/80 uppercase font-semibold block">On-Time SLA</span>
              <strong className="text-sm font-bold text-emerald-400">{summary?.onTimeDeliveryRate || 92}% Goal</strong>
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Historical Trajectory Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Historical Performance Trajectory</span>
                </h3>
                <p className="text-xs text-slate-500">Your composite score progression over the last 4 review cycles</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl self-start sm:self-auto border border-emerald-100">
                Target: Exceeding 85%
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary?.scoreHistory || []} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} unit="%" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontSize: '11px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Your KPI Score']}
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
          <p className="text-[11px] text-slate-400 text-center mt-2 pt-2 border-t border-slate-100">
            Trajectory updated in real-time as tasks and automated sprint syncs complete
          </p>
        </div>

        {/* Bento Tile 3: KPI Goals Grid (12 cols) */}
        <div className="lg:col-span-12 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Assigned KPI Goals & Live Progress</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current metric thresholds and automated integration telemetry
              </p>
            </div>
            <button
              onClick={() => setActiveView('kpis')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              View KPI Matrix →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary?.kpiScores.map((item) => (
              <div
                key={item.kpi.id}
                className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white text-slate-600 rounded-md border border-slate-200/60 shadow-2xs">
                      Weight: {item.kpi.weight}%
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        item.status === 'exceeded'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'met'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-3 leading-snug">
                    {item.kpi.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {item.kpi.description}
                  </p>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Actual vs Target
                      </span>
                      <strong className="text-sm text-slate-900">
                        {item.actualValue} {item.kpi.unit}{' '}
                        <span className="text-xs font-normal text-slate-400">
                          / {item.kpi.targetValue} {item.kpi.unit}
                        </span>
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Score
                      </span>
                      <strong className="text-sm font-bold text-indigo-700">{item.score}%</strong>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200/70 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.score >= 90
                          ? 'bg-emerald-500'
                          : item.score >= 75
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, item.score)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="capitalize">Cadence: {item.kpi.frequency}</span>
                  <span className="font-semibold text-slate-500 uppercase">{item.kpi.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Tile 4: Personal Task History Table (12 cols) with Review HUD */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>My Task History & Workload ({myTasks.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update status, track logged hours, and view the futuristic Task Review HUD
              </p>
            </div>
            <button
              onClick={() => setActiveView('tasks')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Open Full Tasks Matrix →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-5">Task Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Logged Hours</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Review HUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      <div>{t.title}</div>
                      {t.storyPoints && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold inline-block mt-0.5 border border-indigo-100">
                          {t.storyPoints} pts
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{t.category}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{t.dueDate}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      {t.actualHours}h / {t.estimatedHours}h
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value as TaskStatus)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800 cursor-pointer shadow-2xs"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => openTaskReview(t.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 shadow-sm transition-all cursor-pointer group"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                        <span>Review HUD</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TaskEntryModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
