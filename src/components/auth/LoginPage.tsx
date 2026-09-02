import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Shield,
  UserCheck,
  Briefcase,
  Users,
  Zap,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Terminal,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, login } = useApp();
  const [selectedRoleTab, setSelectedRoleTab] = useState<'manager' | 'admin' | 'employee'>('manager');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('user-harsh');
  const [pinCode, setPinCode] = useState<string>('••••');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Filter users by role
  const adminUser = users.find((u) => u.role === 'admin') || users[0];
  const managerUser = users.find((u) => u.id === 'user-ahmed') || users.find((u) => u.role === 'manager') || users[1];
  const employeeUsers = users.filter((u) => u.role === 'employee' && u.status === 'active');

  const handleQuickLogin = (user: User) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      login(user);
    }, 450);
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = users.find((u) => u.id === selectedEmployeeId);
    if (targetUser) {
      handleQuickLogin(targetUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 px-6 py-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                TeamPulse <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">v3.0 HUD</span>
              </span>
              <p className="text-[11px] text-slate-400">Enterprise Role-Based Performance & KPI Intelligence OS</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>RBAC Protected • Multi-Role Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full my-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Single Sign-On & Role Simulation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">Access View</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Each role unlocks distinct telemetry, authority levels, and personalized performance boards.
          </p>
        </div>

        {/* 3 Primary Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Manager View (Ahmed Naimabadi) */}
          <div
            onClick={() => handleQuickLogin(managerUser)}
            className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden border ${
              selectedRoleTab === 'manager'
                ? 'bg-gradient-to-b from-indigo-900/60 via-slate-900/80 to-slate-950 border-indigo-500/80 shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                Key Authority
              </span>
            </div>

            <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              Manager Portal
            </h2>
            <p className="text-xs text-indigo-200/80 mt-1 font-medium">
              Ahmed Naimabadi (Engineering Manager)
            </p>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Squad oversight with full authority to <strong className="text-slate-200">add / remove KPIs per task</strong>, approve sprint deliverables, and score reviews.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Task KPI Binding Authority</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Direct Report Task Reviews & Ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Squad Velocity & Radar Analytics</span>
              </div>
            </div>

            <button
              disabled={isAuthenticating}
              className="mt-6 w-full py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In as Ahmed Naimabadi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Employee View (Interactive Roster Selection) */}
          <div
            className={`group relative rounded-3xl p-6 transition-all duration-300 overflow-hidden border ${
              selectedRoleTab === 'employee'
                ? 'bg-gradient-to-b from-cyan-900/60 via-slate-900/80 to-slate-950 border-cyan-500/80 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />

            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                Individual Contributor
              </span>
            </div>

            <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              Employee Portal
            </h2>
            <p className="text-xs text-cyan-200/80 mt-1 font-medium">
              Select Engineer Roster Member
            </p>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Personalized scorecard, interactive task management, and the <strong className="text-slate-200">Futuristic Task Review HUD</strong>.
            </p>

            {/* Employee Selector Form */}
            <form onSubmit={handleEmployeeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Choose Employee Identity:
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {employeeUsers.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 space-y-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Futuristic Task Review Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Personalized KPI Trajectory & Radar</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Sign In as Selected Employee</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Card 3: Admin View (Sarah Jenkins) */}
          <div
            onClick={() => handleQuickLogin(adminUser)}
            className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden border ${
              selectedRoleTab === 'admin'
                ? 'bg-gradient-to-b from-purple-900/60 via-slate-900/80 to-slate-950 border-purple-500/80 shadow-2xl shadow-purple-500/20 ring-2 ring-purple-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />

            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40">
                Executive Access
              </span>
            </div>

            <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
              Admin Portal
            </h2>
            <p className="text-xs text-purple-200/80 mt-1 font-medium">
              Sarah Jenkins (VP of Engineering)
            </p>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Global engineering hierarchy, company-wide KPI governance, user provisioning, and enterprise Rally/Workday sync.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Executive Performance Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Interactive 2D Org Chart Visualizer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Rally & Workday RaaS Integrations</span>
              </div>
            </div>

            <button
              disabled={isAuthenticating}
              className="mt-6 w-full py-3 px-4 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Sign In as Admin (Sarah Jenkins)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Employee Badges Bar for 1-Click Jumping */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Direct Employee Quick-Launch Roster</span>
            </div>
            <span className="text-[11px] text-slate-400">Click any avatar to enter that employee's personalized view instantly</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {employeeUsers.slice(0, 6).map((emp) => (
              <button
                key={emp.id}
                onClick={() => handleQuickLogin(emp)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all text-left group cursor-pointer"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 group-hover:border-cyan-400 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                    {emp.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {emp.title.split(' ')[0]} {emp.title.split(' ')[1] || ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        TeamPulse Engineering Intelligence • Secure RBAC System • Built with React 19 & Tailwind CSS
      </footer>
    </div>
  );
};
