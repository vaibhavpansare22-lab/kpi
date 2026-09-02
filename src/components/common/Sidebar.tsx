import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Network,
  Radio,
  Lock,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
  Award,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    isAdmin,
    isManager,
    isEmployee,
    tasks,
    kpis,
    selectedReviewTaskId,
    setSelectedEmployeeId,
    setSelectedManagerId,
    logout,
  } = useApp();

  const userTasksCount = tasks.filter((t) => {
    if (isAdmin) return true;
    if (isManager) return true; // Team tasks
    return t.assignedTo === currentUser.id;
  }).length;

  const pendingApprovalCount = tasks.filter(
    (t) => !t.approved && (isAdmin || isManager)
  ).length;

  interface NavItem {
    id: AppView;
    label: string;
    description: string;
    icon: React.ReactNode;
    allowedRoles: ('admin' | 'manager' | 'employee')[];
    badge?: string | number;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: isAdmin
        ? 'Executive Org Matrix'
        : isManager
        ? 'Manager Squad View'
        : 'Employee Scorecard',
      description: isAdmin
        ? 'Org-wide KPIs & Manager comparison'
        : isManager
        ? 'Direct reports, KPI authority & review sign-off'
        : 'Personal score & goal tracking',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ['admin', 'manager', 'employee'],
    },
    {
      id: 'tasks',
      label: isEmployee ? 'My Tasks & Work Log' : 'Task Operations & Matrix',
      description: isEmployee
        ? 'Manual & synced tasks + Review HUD'
        : 'Team deliverables & KPI bindings',
      icon: <CheckSquare className="w-4 h-4" />,
      allowedRoles: ['admin', 'manager', 'employee'],
      badge: pendingApprovalCount > 0 && !isEmployee ? `${pendingApprovalCount} pend.` : userTasksCount,
      badgeColor:
        pendingApprovalCount > 0 && !isEmployee
          ? 'bg-amber-100 text-amber-800'
          : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'task_review',
      label: 'Task Review HUD',
      description: 'Problem, Before/After, Challenges, Learnings',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      allowedRoles: ['admin', 'manager', 'employee'],
      badge: 'Futuristic',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    },
    {
      id: 'kpis',
      label: isEmployee ? 'My Goals & Targets' : 'KPI Registry & Weights',
      description: isEmployee
        ? 'Evaluations & target thresholds'
        : 'Define metrics, weights & review',
      icon: <Target className="w-4 h-4" />,
      allowedRoles: ['admin', 'manager', 'employee'],
      badge: kpis.length,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'org',
      label: 'Org Hierarchy Matrix',
      description: 'Interactive hierarchy & team reassignments',
      icon: <Network className="w-4 h-4" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'integrations',
      label: 'Rally & Workday Hub',
      description: 'Enterprise connector synchronization',
      icon: <Radio className="w-4 h-4" />,
      allowedRoles: ['admin', 'manager'],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
      {/* Role banner info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-2xl object-cover border-2 border-indigo-500/80 shadow-md"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                currentUser.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-bold text-white truncate">
              {currentUser.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  isAdmin
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                    : isManager
                    ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                }`}
              >
                {currentUser.role}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {currentUser.title.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Role context helper message */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
          {isAdmin ? (
            <>
              <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>Admin: Full Org Chart, Global KPIs, User Provisioning & Connectors.</span>
            </>
          ) : isManager ? (
            <>
              <Users className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Manager Ahmed: KPI Authority (Add/Remove per task) & Review Sign-offs.</span>
            </>
          ) : (
            <>
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Employee: Personal scorecard, task log & Futuristic Review HUD.</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Workspace
        </div>

        {navItems.map((item) => {
          const isAllowed = item.allowedRoles.includes(currentUser.role);
          const isActive = activeView === item.id;

          if (!isAllowed) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 text-slate-600 rounded-xl text-xs font-medium cursor-not-allowed opacity-50 select-none"
                title="Restricted by Role-Based Access Control (RBAC)"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-600" />
              </div>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => {
                setActiveView(item.id);
                setSelectedEmployeeId(null);
                setSelectedManagerId(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group text-left cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                >
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="leading-tight">{item.label}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-700 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Org & System Summary in Sidebar Footer */}
      <div className="p-3 m-3 rounded-2xl bg-slate-800/70 border border-slate-700/50 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold flex items-center gap-1.5 text-slate-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> TeamPulse Telemetry
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Rally Sync:</span>
            <span className="font-semibold text-emerald-400">Live (Daily)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Workday RaaS:</span>
            <span className="font-semibold text-emerald-400">Connected</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-3 w-full py-1.5 px-2 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>Exit to Login Screen</span>
        </button>
      </div>
    </aside>
  );
};
