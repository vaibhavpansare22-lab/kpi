import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  Target,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  Radio,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    tasks,
    kpis,
    performanceSummaries,
    period,
    setSelectedEmployeeId,
    setSelectedManagerId,
    switchUserById,
    setActiveView,
  } = useApp();

  const activeEmployees = users.filter((u) => u.role === 'employee' && u.status === 'active');
  const activeManagers = users.filter((u) => u.role === 'manager' && u.status === 'active');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // Compute org-wide average performance score
  const allScores = activeEmployees.map((e) => performanceSummaries.get(e.id)?.overallScore || 85);
  const orgAverageScore =
    allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : 88.5;

  // Manager Team Comparison data
  const managerComparisonData = activeManagers.map((mgr) => {
    const reports = users.filter((u) => u.managerId === mgr.id && u.status === 'active');
    const teamScores = reports.map((r) => performanceSummaries.get(r.id)?.overallScore || 80);
    const avgScore =
      teamScores.length > 0
        ? Math.round((teamScores.reduce((a, b) => a + b, 0) / teamScores.length) * 10) / 10
        : 0;

    return {
      managerId: mgr.id,
      managerName: mgr.name,
      department: mgr.department,
      reportsCount: reports.length,
      averageScore: avgScore,
    };
  });

  // Task Status Distribution
  const statusCounts = {
    completed: tasks.filter((t) => t.status === 'completed').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    not_started: tasks.filter((t) => t.status === 'not_started').length,
  };

  const taskPieData = [
    { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
    { name: 'In Progress', value: statusCounts.in_progress, color: '#3b82f6' },
    { name: 'Blocked', value: statusCounts.blocked, color: '#f43f5e' },
    { name: 'Not Started', value: statusCounts.not_started, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Bento Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Enterprise Performance Command Center
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100/80 text-purple-800 rounded-full border border-purple-200">
              Org-Wide Admin Scope
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cross-departmental velocity, manager team benchmarks, and enterprise KPI health for <strong className="text-slate-700 font-semibold">{period}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveView('org')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Manage Org Chart</span>
          </button>
          <button
            onClick={() => setActiveView('integrations')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>API Integrations</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Bento Tile 1: Hero Org KPI Metric Card (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Org Average KPI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-indigo-200 border border-white/10 uppercase">
                {period}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-4xl font-extrabold tracking-tight text-white">
                {orgAverageScore}%
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-500/30">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4%
              </div>
            </div>

            <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
              Calculated across {activeEmployees.length} active engineers under {activeManagers.length} management teams.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-indigo-300/80 uppercase font-semibold block">Total Workforce</span>
              <strong className="text-sm font-bold text-white">{activeEmployees.length + activeManagers.length + 1} Staff</strong>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300/80 uppercase font-semibold block">Target SLA</span>
              <strong className="text-sm font-bold text-emerald-400">85.0% Goal</strong>
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Workforce Statistics (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Workforce Structure
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeEmployees.length}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active Software Engineers & QA
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Engineering Managers
              </span>
              <span className="font-bold text-slate-900">{activeManagers.length} Leads</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-500" /> Org Administrators
              </span>
              <span className="font-bold text-slate-900">1 Executive</span>
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Deliverable & Task Throughput (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Task Velocity
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {completedTasks.length}
                <span className="text-base font-normal text-slate-400 ml-1">/ {tasks.length}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Deliverables Closed Successfully
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">Overall Completion Rate</span>
              <span className="font-bold text-emerald-600">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bento Tile 4: Team Performance Benchmark Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Team Performance Benchmark</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Average KPI composite score (%) achieved by each manager's team
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl self-start sm:self-auto border border-indigo-100">
                Target SLA: 85%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={managerComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="managerName" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    formatter={(val: any) => [`${val}%`, 'Team Avg KPI']}
                  />
                  <Bar
                    dataKey="averageScore"
                    fill="#4f46e5"
                    radius={[8, 8, 0, 0]}
                    onClick={(entry) => {
                      switchUserById(entry.managerId);
                    }}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-2 pt-2 border-t border-slate-100">
            💡 Click any manager's bar to switch into their team dashboard directly
          </p>
        </div>

        {/* Bento Tile 5: Task Status Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Task Pipeline Status</h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500">Across manual & synced integrations</p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            {taskPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <strong className="text-slate-900 ml-auto">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Tile 6: Direct Drill-Down Directory Card (12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Executive Management & Direct Reports Directory</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any manager to simulate their team view or drill down into any individual employee scorecard.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {activeManagers.map((mgr) => {
              const teamReports = users.filter((u) => u.managerId === mgr.id && u.status === 'active');
              const teamScores = teamReports.map((r) => performanceSummaries.get(r.id)?.overallScore || 80);
              const teamAvg =
                teamScores.length > 0
                  ? Math.round((teamScores.reduce((a, b) => a + b, 0) / teamScores.length) * 10) / 10
                  : 85;

              return (
                <div key={mgr.id} className="p-5 md:p-6 hover:bg-slate-50/50 transition-colors">
                  {/* Manager Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={mgr.avatar}
                        alt={mgr.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{mgr.name}</h4>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                            Team Manager
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {mgr.title} • {mgr.department} ({teamReports.length} direct reports)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          Team Avg KPI
                        </div>
                        <div className="text-lg font-bold text-indigo-700">{teamAvg}%</div>
                      </div>

                      <button
                        onClick={() => switchUserById(mgr.id)}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                      >
                        <span>Simulate Manager View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Direct Reports Bento Mini-Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mt-4">
                    {teamReports.map((emp) => {
                      const empPerf = performanceSummaries.get(emp.id);
                      const score = empPerf?.overallScore || 90;

                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmployeeId(emp.id);
                            setActiveView('employee_detail');
                          }}
                          className="p-3.5 bg-slate-50/70 hover:bg-indigo-50/60 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-300 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                                {emp.name}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {emp.title.split(' ')[0]} {emp.title.split(' ')[1]}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-2">
                            <div className="text-xs font-bold text-slate-900">{score}%</div>
                            <span className="text-[10px] text-indigo-600 group-hover:underline flex items-center gap-0.5 justify-end">
                              Drill <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
