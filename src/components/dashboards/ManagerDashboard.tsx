import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronRight,
  Plus,
  ShieldCheck,
  Award,
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

export const ManagerDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    tasks,
    kpis,
    performanceSummaries,
    period,
    setSelectedEmployeeId,
    setActiveView,
    getDirectReports,
  } = useApp();

  // Get direct reports for this manager (e.g. Ahmed's 7 direct reports)
  const directReports = getDirectReports(currentUser.id);
  const directReportIds = new Set(directReports.map((r) => r.id));

  // Team tasks
  const teamTasks = tasks.filter((t) => directReportIds.has(t.assignedTo) || t.assignedTo === currentUser.id);
  const completedTeamTasks = teamTasks.filter((t) => t.status === 'completed');

  // Compute team average KPI score
  const teamSummaries = directReports.map((r) => performanceSummaries.get(r.id)!);
  const teamAvgScore =
    teamSummaries.length > 0
      ? Math.round(
          (teamSummaries.reduce((a, b) => a + (b?.overallScore || 0), 0) / teamSummaries.length) * 10
        ) / 10
      : 88;

  // Bar chart data comparing direct reports' overall scores & task completion
  const memberComparisonData = directReports.map((emp) => {
    const summary = performanceSummaries.get(emp.id);
    return {
      name: emp.name.split(' ')[0], // First name
      fullName: emp.name,
      score: summary?.overallScore || 85,
      completionRate: summary?.taskCompletionRate || 80,
      tasksCount: summary?.totalTasksCount || 4,
      empId: emp.id,
    };
  });

  // Task status distribution for this manager's team
  const teamStatusCounts = {
    completed: teamTasks.filter((t) => t.status === 'completed').length,
    in_progress: teamTasks.filter((t) => t.status === 'in_progress').length,
    blocked: teamTasks.filter((t) => t.status === 'blocked').length,
    not_started: teamTasks.filter((t) => t.status === 'not_started').length,
  };

  const donutData = [
    { name: 'Completed', value: teamStatusCounts.completed, color: '#10b981' },
    { name: 'In Progress', value: teamStatusCounts.in_progress, color: '#3b82f6' },
    { name: 'Blocked', value: teamStatusCounts.blocked, color: '#f43f5e' },
    { name: 'Not Started', value: teamStatusCounts.not_started, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {currentUser.name}'s Engineering Squad
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100/80 text-blue-800 rounded-full border border-blue-200">
              Manager Command Dashboard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervising <strong className="text-slate-700 font-semibold">{directReports.length} direct engineers</strong> in {currentUser.department} • Active Evaluation Period: <strong className="text-slate-700 font-semibold">{period}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveView('tasks')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Review Tasks ({teamTasks.length})</span>
          </button>
          <button
            onClick={() => setActiveView('kpis')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Define Team KPIs</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Bento Tile 1: Hero Team KPI Card (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Team Average KPI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-indigo-200 border border-white/10 uppercase">
                {period}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-4xl font-extrabold tracking-tight text-white">
                {teamAvgScore}%
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-500/30">
                <ArrowUpRight className="w-3.5 h-3.5" /> +1.8%
              </div>
            </div>

            <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
              Composite achievement score across all {directReports.length} direct report scorecards.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-indigo-300/80 uppercase font-semibold block">Team Capacity</span>
              <strong className="text-sm font-bold text-white">{directReports.length} Engineers</strong>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300/80 uppercase font-semibold block">Benchmark SLA</span>
              <strong className="text-sm font-bold text-emerald-400">85.0% Goal</strong>
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Task Throughput (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sprint Deliverables
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {completedTeamTasks.length}
                <span className="text-base font-normal text-slate-400 ml-1">/ {teamTasks.length}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tasks Completed On-Time
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">Execution Velocity</span>
              <span className="font-bold text-emerald-600">
                {teamTasks.length > 0 ? Math.round((completedTeamTasks.length / teamTasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${teamTasks.length > 0 ? (completedTeamTasks.length / teamTasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Blocker & Risk Radar (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Impediment Radar
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${teamStatusCounts.blocked > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className={`text-3xl font-extrabold tracking-tight ${teamStatusCounts.blocked > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {teamStatusCounts.blocked}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {teamStatusCounts.blocked > 0 ? 'Active Blockers Requiring Action' : 'Zero Blockers Reported'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">In Progress:</span>
            <span className="font-bold text-blue-600">{teamStatusCounts.in_progress} Active Work Items</span>
          </div>
        </div>

        {/* Bento Tile 4: Direct Reports Score Comparison Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Direct Reports Score Comparison</span>
                </h3>
                <p className="text-xs text-slate-500">Overall KPI Composite score (%) per engineer</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl self-start sm:self-auto">
                Benchmark: 88%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    formatter={(val: any) => [`${val}%`, 'KPI Score']}
                  />
                  <Bar
                    dataKey="score"
                    fill="#4f46e5"
                    radius={[8, 8, 0, 0]}
                    onClick={(entry) => {
                      setSelectedEmployeeId(entry.empId);
                      setActiveView('employee_detail');
                    }}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2 pt-2 border-t border-slate-100">
            💡 Click any bar to drill down into the employee's detailed scorecard
          </p>
        </div>

        {/* Bento Tile 5: Task Status Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Team Task Pipeline</h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Sprint
              </span>
            </div>
            <p className="text-xs text-slate-500">Current active workload</p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
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
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <strong className="text-slate-900 ml-auto">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Tile 6: Direct Reports Roster Table (12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Direct Reports Performance Roster ({directReports.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed performance metrics and scorecard drilldowns for {currentUser.name}'s squad
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Team Member</th>
                  <th className="py-3.5 px-4">Title & Discipline</th>
                  <th className="py-3.5 px-4">KPI Score</th>
                  <th className="py-3.5 px-4">Trend vs Last Period</th>
                  <th className="py-3.5 px-4">Task Completion %</th>
                  <th className="py-3.5 px-4">Active Tasks</th>
                  <th className="py-3.5 px-5 text-right">Scorecard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {directReports.map((emp) => {
                  const summary = performanceSummaries.get(emp.id);
                  const score = summary?.overallScore || 90;
                  const trend = summary?.scoreTrend || 1.2;
                  const completionRate = summary?.taskCompletionRate || 85;
                  const empTasks = tasks.filter((t) => t.assignedTo === emp.id);

                  return (
                    <tr
                      key={emp.id}
                      id={`manager-report-row-${emp.id}`}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      {/* Member */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-300 shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{emp.name}</span>
                            <p className="text-[11px] text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {emp.title}
                      </td>

                      {/* KPI Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-indigo-700">{score}%</span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 90 ? 'bg-emerald-500' : score >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, score)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Trend Arrow */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            trend >= 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border-rose-200/60'
                          }`}
                        >
                          {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{trend >= 0 ? `+${trend}%` : `${trend}%`}</span>
                        </span>
                      </td>

                      {/* Task Completion Rate */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{completionRate}%</div>
                        <span className="text-[10px] text-slate-400">
                          {summary?.completedTasksCount} / {summary?.totalTasksCount} done
                        </span>
                      </td>

                      {/* Active Tasks count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                          {empTasks.length} items
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            setSelectedEmployeeId(emp.id);
                            setActiveView('employee_detail');
                          }}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
