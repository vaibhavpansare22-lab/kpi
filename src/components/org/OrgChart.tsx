import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Users,
  UserPlus,
  ArrowRightLeft,
  ArrowUpCircle,
  ArrowDownCircle,
  Power,
  Shield,
  Briefcase,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  Search,
  ExternalLink,
  Sparkles,
  Award,
} from 'lucide-react';

export const OrgChart: React.FC = () => {
  const {
    users,
    currentUser,
    isAdmin,
    addUser,
    reassignManager,
    promoteToManager,
    demoteToEmployee,
    toggleUserStatus,
    performanceSummaries,
    setSelectedEmployeeId,
    setActiveView,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [collapsedManagers, setCollapsedManagers] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [selectedNewManagerId, setSelectedNewManagerId] = useState<string>('');

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'employee' | 'manager'>('employee');
  const [newUserManagerId, setNewUserManagerId] = useState('user-ahmed');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('Core Platform Engineering');

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Restricted Access (Admin Role Required)
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Only organization administrators can view and modify the organizational hierarchy,
          reassign staff, promote managers, or add new employees.
        </p>
      </div>
    );
  }

  const toggleCollapse = (managerId: string) => {
    setCollapsedManagers((prev) => ({ ...prev, [managerId]: !prev[managerId] }));
  };

  const adminUsers = users.filter((u) => u.role === 'admin' && u.status === 'active');
  const managers = users.filter((u) => u.role === 'manager' && u.status === 'active');
  const allDepartments = Array.from(new Set(users.map((u) => u.department)));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      managerId: newUserManagerId || null,
      title: newUserTitle || (newUserRole === 'manager' ? 'Engineering Lead' : 'Software Engineer'),
      department: newUserDepartment,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 90000000)}?w=150&auto=format&fit=crop&q=80`,
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserTitle('');
    setIsAddModalOpen(false);
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;
    reassignManager(targetUser.id, selectedNewManagerId || null);
    setIsReassignModalOpen(false);
    setTargetUser(null);
  };

  const openReassignModal = (user: User) => {
    setTargetUser(user);
    setSelectedNewManagerId(user.managerId || '');
    setIsReassignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Organization Structure & Hierarchy
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full border border-purple-200">
              Admin Control Plane
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual tree chart representing management reporting lines, direct report counts, and team reassignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="ALL">All Departments</option>
            {allDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            id="add-employee-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Org Chart Tree View */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 overflow-x-auto">
        <div className="min-w-[780px] flex flex-col items-center">
          {/* Level 1: Admin Nodes */}
          {adminUsers.map((admin) => {
            const adminPerf = performanceSummaries.get(admin.id);
            return (
              <div key={admin.id} className="flex flex-col items-center w-full mb-8">
                {/* Admin Card */}
                <div className="bg-gradient-to-b from-purple-50 to-white border-2 border-purple-400 shadow-md rounded-2xl p-4 w-80 text-center relative z-10 transition-transform hover:-translate-y-0.5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-700 text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-xs">
                    Org Executive / Admin
                  </div>
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-purple-500 shadow-xs mt-1"
                  />
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{admin.name}</h3>
                  <p className="text-xs text-purple-700 font-medium">{admin.title}</p>
                  <p className="text-[11px] text-slate-500">{admin.department}</p>
                  <div className="mt-2.5 pt-2.5 border-t border-purple-100 flex items-center justify-center gap-2 text-xs">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-[11px] text-slate-700">{admin.email}</span>
                  </div>
                </div>

                {/* Vertical Stem from Admin */}
                <div className="w-0.5 h-8 bg-slate-300" />

                {/* Level 2: Managers Tier */}
                <div className="relative w-full flex justify-center">
                  {/* Horizontal Crossbar across managers */}
                  {managers.length > 1 && (
                    <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300 -translate-y-0" />
                  )}

                  <div className="flex flex-wrap justify-center gap-10 w-full pt-4">
                    {managers.map((mgr) => {
                      const directReports = users.filter(
                        (u) =>
                          u.managerId === mgr.id &&
                          (departmentFilter === 'ALL' || u.department === departmentFilter) &&
                          (searchTerm === '' ||
                            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      );

                      const mgrPerf = performanceSummaries.get(mgr.id);
                      const isCollapsed = collapsedManagers[mgr.id];

                      return (
                        <div
                          key={mgr.id}
                          className="flex flex-col items-center flex-1 min-w-[320px] max-w-[500px]"
                        >
                          {/* Manager Card */}
                          <div
                            className={`w-full bg-white border-2 rounded-2xl p-4 shadow-sm relative transition-all ${
                              mgr.id === 'user-ahmed'
                                ? 'border-blue-400 bg-blue-50/20'
                                : 'border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={mgr.avatar}
                                  alt={mgr.name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">
                                      {mgr.name}
                                    </h4>
                                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                                      Manager
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600">{mgr.title}</p>
                                  <p className="text-[11px] text-slate-500">{mgr.department}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleCollapse(mgr.id)}
                                className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200"
                              >
                                {isCollapsed ? (
                                  <>
                                    <span>Expand ({directReports.length})</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </>
                                ) : (
                                  <>
                                    <span>Collapse</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Manager Action Toolbar */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                                <span>Direct Reports:</span>
                                <strong className="text-slate-900">{directReports.length} members</strong>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => openReassignModal(mgr)}
                                  className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                                  title="Change manager reporting line"
                                >
                                  Reassign
                                </button>
                                <button
                                  onClick={() => demoteToEmployee(mgr.id, 'user-admin')}
                                  className="px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                                  title="Demote manager to employee"
                                >
                                  <ArrowDownCircle className="w-3 h-3" />
                                  Demote
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Connector Stem to Reports */}
                          {!isCollapsed && directReports.length > 0 && (
                            <div className="w-0.5 h-6 bg-slate-300" />
                          )}

                          {/* Level 3: Direct Reports Grid */}
                          {!isCollapsed && (
                            <div className="w-full space-y-2.5">
                              {directReports.length === 0 ? (
                                <div className="p-4 bg-white/70 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                                  No direct reports assigned to this manager yet.
                                </div>
                              ) : (
                                directReports.map((emp) => {
                                  const empPerf = performanceSummaries.get(emp.id);
                                  const score = empPerf?.overallScore || 90;
                                  const isInactive = emp.status === 'inactive';

                                  return (
                                    <div
                                      key={emp.id}
                                      id={`employee-node-${emp.id}`}
                                      className={`p-3 bg-white rounded-xl border transition-all shadow-2xs hover:shadow-sm ${
                                        isInactive
                                          ? 'border-slate-200 opacity-60 bg-slate-100'
                                          : 'border-slate-200 hover:border-indigo-300'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <img
                                            src={emp.avatar}
                                            alt={emp.name}
                                            className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0"
                                          />
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs font-bold text-slate-900 truncate">
                                                {emp.name}
                                              </span>
                                              {isInactive && (
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                                                  Inactive
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 truncate">
                                              {emp.title}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Performance score badge */}
                                        <div className="flex items-center gap-2">
                                          <div className="text-right">
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                              KPI Score
                                            </div>
                                            <div className="text-xs font-bold text-indigo-700">
                                              {score}%
                                            </div>
                                          </div>

                                          <button
                                            onClick={() => {
                                              setSelectedEmployeeId(emp.id);
                                              setActiveView('employee_detail');
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View detailed scorecard"
                                          >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Management Actions Strip */}
                                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                        <span className="font-mono text-[10px] truncate max-w-[120px]">
                                          {emp.email}
                                        </span>

                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => openReassignModal(emp)}
                                            className="px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200"
                                            title="Reassign to another manager"
                                          >
                                            Reassign
                                          </button>

                                          <button
                                            onClick={() => promoteToManager(emp.id)}
                                            className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 rounded border border-blue-200 flex items-center gap-0.5"
                                            title="Promote employee to Manager"
                                          >
                                            <ArrowUpCircle className="w-3 h-3" />
                                            Promote
                                          </button>

                                          <button
                                            onClick={() => toggleUserStatus(emp.id)}
                                            className={`px-1.5 py-0.5 text-[10px] rounded border ${
                                              isInactive
                                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                                : 'text-rose-700 bg-rose-50 border-rose-200'
                                            }`}
                                            title={isInactive ? 'Activate account' : 'Deactivate account'}
                                          >
                                            <Power className="w-2.5 h-2.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Team Member
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Provision a new staff member and assign their management reporting line.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Verma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rohan@teampulse.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    System Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Manager
                  </label>
                  <select
                    value={newUserManagerId}
                    onChange={(e) => setNewUserManagerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">None (Top-Level / Admin)</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  value={newUserTitle}
                  onChange={(e) => setNewUserTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={newUserDepartment}
                  onChange={(e) => setNewUserDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Core Platform Engineering">Core Platform Engineering</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="DevOps & Security">DevOps & Security</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Manager Modal */}
      {isReassignModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Reassign Reporting Line
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the new supervisor/manager for <strong>{targetUser.name}</strong>.
            </p>

            <form onSubmit={handleReassignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign To Manager:
                </label>
                <select
                  value={selectedNewManagerId}
                  onChange={(e) => setSelectedNewManagerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- No Direct Manager (Top Level) --</option>
                  {users
                    .filter((u) => (u.role === 'manager' || u.role === 'admin') && u.id !== targetUser.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role.toUpperCase()} - {m.department})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
