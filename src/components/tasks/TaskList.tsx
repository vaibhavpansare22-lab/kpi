import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority, TaskSource } from '../../types';
import { TaskEntryModal } from './TaskEntryModal';
import { TaskReviewModal } from './TaskReviewModal';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Tag,
  Sparkles,
  ExternalLink,
  Shield,
  Star,
  Activity,
  Zap,
} from 'lucide-react';

export const TaskList: React.FC = () => {
  const {
    tasks,
    kpis,
    users,
    currentUser,
    isAdmin,
    isManager,
    isEmployee,
    updateTask,
    deleteTask,
    approveTask,
    getDirectReports,
    openTaskReview,
    addKpiToTask,
    removeKpiFromTask,
  } = useApp();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [reviewModalTaskId, setReviewModalTaskId] = useState<string | null>(null);

  // Accessible tasks based on role
  const directReports = isManager ? getDirectReports(currentUser.id) : [];
  const directReportIds = new Set(directReports.map((r) => r.id));

  const roleFilteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (isAdmin) return true;
      if (isManager) {
        // Direct reports + manager themselves
        return directReportIds.has(task.assignedTo) || task.assignedTo === currentUser.id;
      }
      // Employee sees only their own tasks
      return task.assignedTo === currentUser.id;
    });
  }, [tasks, isAdmin, isManager, currentUser.id, directReportIds]);

  // Secondary multi-dimensional search & filters
  const filteredTasks = useMemo(() => {
    return roleFilteredTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      const matchesSource = sourceFilter === 'ALL' || task.source === sourceFilter;
      const matchesAssignee = assigneeFilter === 'ALL' || task.assignedTo === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesAssignee;
    });
  }, [roleFilteredTasks, searchTerm, statusFilter, priorityFilter, sourceFilter, assigneeFilter]);

  const userMap = useMemo(() => {
    const map = new Map<string, (typeof users)[0]>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const kpiMap = useMemo(() => {
    const map = new Map<string, (typeof kpis)[0]>();
    kpis.forEach((k) => map.set(k.id, k));
    return map;
  }, [kpis]);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" /> In Progress
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
            Low
          </span>
        );
    }
  };

  const getSourceBadge = (source: TaskSource) => {
    switch (source) {
      case 'rally':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
            Rally
          </span>
        );
      case 'workday':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200">
            Workday
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
            Manual
          </span>
        );
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEmployee ? 'My Task & Velocity Log' : 'Task Operations & Review Matrix'}
            </h1>
            {isManager && (
              <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Manager Authority Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isEmployee
              ? 'Log work items, open futuristic task reviews (Problem Statement, Before/After, Challenges, Learnings, Outcomes).'
              : 'Review and approve team deliverables, manage Task KPI bindings, and sign off on reviews.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="new-task-btn"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Task Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Assignee filter for Managers / Admins */}
          {!isEmployee && (
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Assignees</option>
              {(isAdmin ? users : directReports).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.title.split(' ')[0]})
                </option>
              ))}
            </select>
          )}

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="not_started">Not Started</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Source filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
          >
            <option value="ALL">All Sources</option>
            <option value="manual">Manual Entry</option>
            <option value="rally">Rally Sync</option>
            <option value="workday">Workday Sync</option>
          </select>
        </div>

        {/* Active filter counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredTasks.length}</strong> of{' '}
            <strong>{roleFilteredTasks.length}</strong> tasks in scope
          </span>
          {(statusFilter !== 'ALL' ||
            priorityFilter !== 'ALL' ||
            sourceFilter !== 'ALL' ||
            assigneeFilter !== 'ALL' ||
            searchTerm !== '') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setSourceFilter('ALL');
                setAssigneeFilter('ALL');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Tasks Table with Review HUD Launcher */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Task Details & Category</th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-4">Linked KPIs (Manager Governed)</th>
                <th className="py-3.5 px-4">Timeline</th>
                <th className="py-3.5 px-4">Hours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Review HUD</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-600">No tasks found</p>
                      <p className="text-xs">
                        Adjust your search filters or click "New Task Entry" to add one.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const assignee = userMap.get(task.assignedTo);
                  const isApproved = task.approved;
                  const taskKpis = (task.kpiIds || []).map((id) => kpiMap.get(id)).filter(Boolean);

                  return (
                    <tr
                      key={task.id}
                      id={`task-row-${task.id}`}
                      className="hover:bg-indigo-50/20 transition-colors"
                    >
                      {/* Title & Category */}
                      <td className="py-3.5 px-4 min-w-[220px] max-w-[280px]">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            {task.category}
                          </span>
                          {getSourceBadge(task.source)}
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              assignee?.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                            }
                            alt={assignee?.name || 'User'}
                            className="w-7 h-7 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">
                              {assignee?.name || 'Unassigned'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {assignee?.title.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Linked KPIs (Manager Authority: Add/Remove KPIs per task) */}
                      <td className="py-3.5 px-4 min-w-[180px] max-w-[240px]">
                        <div className="flex flex-wrap gap-1 items-center">
                          {taskKpis.length === 0 ? (
                            <span className="text-[10px] text-slate-400 italic">No KPIs linked</span>
                          ) : (
                            taskKpis.map((kpi) => (
                              <span
                                key={kpi?.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                              >
                                <Tag className="w-2.5 h-2.5 text-indigo-500" />
                                <span className="truncate max-w-[110px]">{kpi?.name}</span>
                              </span>
                            ))
                          )}
                          {(isManager || isAdmin) && (
                            <button
                              onClick={() => {
                                setReviewModalTaskId(task.id);
                              }}
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold px-1.5 py-0.5 rounded bg-indigo-50/80 hover:bg-indigo-100 transition-colors cursor-pointer"
                              title="Manager Authority: Manage task KPI bindings"
                            >
                              + Manage KPIs
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <div className="text-[11px] font-medium">
                          Due: <strong className="text-slate-800">{task.dueDate}</strong>
                        </div>
                        {task.completedDate && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            ✓ {task.completedDate}
                          </div>
                        )}
                      </td>

                      {/* Hours */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-mono text-slate-600">{task.estimatedHours}h</span>
                          <span className="text-slate-300">/</span>
                          <span
                            className={`font-mono font-bold ${
                              task.actualHours > task.estimatedHours
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.actualHours}h
                          </span>
                        </div>
                      </td>

                      {/* Status & Quick Change */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value as TaskStatus)
                          }
                          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500 font-medium"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </td>

                      {/* Review Task Page Launcher (Cool & Futuristic) */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openTaskReview(task.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 shadow-sm transition-all cursor-pointer group"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                          <span>Review HUD</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve button for Manager/Admin on unapproved team tasks */}
                          {!isEmployee && !isApproved && (
                            <button
                              onClick={() => approveTask(task.id)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Approve team deliverable"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {(isAdmin || task.createdBy === currentUser.id) && (
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Edit/Create Modal */}
      <TaskEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />

      {/* Futuristic Task Review Modal */}
      <TaskReviewModal
        isOpen={!!reviewModalTaskId}
        onClose={() => setReviewModalTaskId(null)}
        taskId={reviewModalTaskId}
      />
    </div>
  );
};
