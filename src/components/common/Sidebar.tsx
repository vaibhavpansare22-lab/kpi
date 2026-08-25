import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Network,
  Radio,
  Lock,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  Shield,
  Users,
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
    setSelectedEmployeeId,
    setSelectedManagerId,
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
        ? 'Org Executive Board'
        : isManager
        ? 'Team Performance'
        : 'My Scorecard',
      description: isAdmin
        ? 'Org-wide KPIs & Manager comparison'
        : isManager
        ? 'Direct reports & velocity metrics'
        : 'Personal score & goal tracking',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ['admin', 'manager', 'employee'],
    },
    {
      id: 'tasks',
      label: isEmployee ? 'My Tasks & Work Log' : 'Task Operations',
      description: isEmployee
        ? 'Manual & synced task entries'
        : 'Team assignments & approvals',
      icon: <CheckSquare className="w-4 h-4" />,
      allowedRoles: ['admin', 'manager', 'employee'],
      badge: pendingApprovalCount > 0 && !isEmployee ? `${pendingApprovalCount} pend.` : userTasksCount,
      badgeColor:
        pendingApprovalCount > 0 && !isEmployee
          ? 'bg-amber-100 text-amber-800'
          : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'kpis',
      label: isEmployee ? 'My Goals & Targets' : 'KPI Management',
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
      label: 'Org Structure Chart',
      description: 'Interactive hierarchy & team reassignments',
      icon: <Network className="w-4 h-4" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'integrations',
      label: 'API Integrations',
      description: 'Rally & Workday synchronization',
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
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/80 shadow-xs"
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
                className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
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
                {currentUser.department.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Role context helper message */}
        <div className="mt-3 p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
          {isAdmin ? (
            <>
              <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>Full Admin scope: Full Org Chart, all teams, KPIs, Integrations.</span>
            </>
          ) : isManager ? (
            <>
              <Users className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Manager scope: Managing 7 direct reports, KPIs & Task approvals.</span>
            </>
          ) : (
            <>
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Employee scope: Isolated personal scorecard & task logging.</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const isAllowed = item.allowedRoles.includes(currentUser.role);
          const isActive = activeView === item.id;

          if (!isAllowed) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 text-slate-600 rounded-lg text-xs font-medium cursor-not-allowed opacity-50 select-none"
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group text-left ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
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
      <div className="p-3 m-3 rounded-xl bg-slate-800/70 border border-slate-700/50 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> TeamPulse Engine
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
      </div>
    </aside>
  );
};
