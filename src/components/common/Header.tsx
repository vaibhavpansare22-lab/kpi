import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  UserCheck,
  Calendar,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  LogOut,
  SlidersHorizontal,
  KeyRound,
} from 'lucide-react';
import { PeriodType } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    users,
    switchUserById,
    logout,
    period,
    setPeriod,
    resetToDefaults,
    notification,
  } = useApp();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Quick preset shortcuts for instant demoing matching user specified names
  const demoShortcuts = [
    { label: 'Admin (Sarah)', id: 'user-admin', role: 'admin' },
    { label: 'Manager (Ahmed)', id: 'user-ahmed', role: 'manager' },
    { label: 'Harsh Patil', id: 'user-harsh', role: 'employee' },
    { label: 'Advita Mali', id: 'user-advita', role: 'employee' },
    { label: 'OM Bhutki', id: 'user-om', role: 'employee' },
    { label: 'Akash Biswas', id: 'user-akash', role: 'employee' },
    { label: 'Mayank Nichlani', id: 'user-mayank', role: 'employee' },
    { label: 'Yadnesh', id: 'user-yadnesh', role: 'employee' },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner / Notification */}
      {notification && (
        <div
          className={`px-4 py-2 text-xs font-medium flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-b border-rose-200'
              : 'bg-indigo-50 text-indigo-800 border-b border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-indigo-600 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand and App title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md font-black text-sm tracking-tight">
              TP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  TeamPulse
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  v3.0 HUD
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Employee Performance & Role-Based KPI Suite
              </p>
            </div>
          </div>

          {/* Quick Demo Role Switcher Strip */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[11px] text-slate-500 font-semibold px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Switch View:
            </span>
            {demoShortcuts.slice(0, 5).map((s) => (
              <button
                key={s.id}
                id={`demo-switch-${s.id}`}
                onClick={() => switchUserById(s.id)}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium whitespace-nowrap cursor-pointer text-xs ${
                  currentUser.id === s.id
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Period Selector & User Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Period selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              {(['weekly', 'monthly', 'quarterly'] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  id={`period-btn-${p}`}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    period === p
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Reset button */}
            <button
              id="reset-seed-btn"
              onClick={resetToDefaults}
              title="Reset all data to default seed state"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Logout / Switch Role Portal Button */}
            <button
              onClick={logout}
              title="Return to Role Login Portal"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Active User Card & Switcher Dropdown */}
            <div className="relative">
              <button
                id="active-user-switcher-trigger"
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-left cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.role}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[90px]">
                      {currentUser.title.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isSwitcherOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSwitcherOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 bg-slate-50 border-b border-slate-200">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span>Switch Persona / Role View</span>
                        <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search people or roles..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          id={`select-user-${u.id}`}
                          onClick={() => {
                            switchUserById(u.id);
                            setIsSwitcherOpen(false);
                          }}
                          className={`w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                            currentUser.id === u.id ? 'bg-indigo-50/70' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {u.name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {u.title}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${getRoleBadgeColor(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                      <button
                        onClick={() => {
                          setIsSwitcherOpen(false);
                          logout();
                        }}
                        className="w-full py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Return to Role Login Screen →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
