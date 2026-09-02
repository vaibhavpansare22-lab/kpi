import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskReviewData } from '../../types';
import {
  ArrowLeft,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Layers,
  Clock,
  Calendar,
  Tag,
  Cpu,
  Terminal,
  FileCode,
  Check,
  Plus,
  Trash2,
  Star,
  Flame,
  Award,
  Maximize2,
  Edit3,
  Save,
  Share2,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';

interface TaskReviewPageProps {
  taskId?: string;
  onBack?: () => void;
}

export const TaskReviewPage: React.FC<TaskReviewPageProps> = ({ taskId, onBack }) => {
  const {
    tasks,
    kpis,
    users,
    currentUser,
    isAdmin,
    isManager,
    selectedReviewTaskId,
    setSelectedReviewTaskId,
    setActiveView,
    addKpiToTask,
    removeKpiFromTask,
    updateTaskReview,
    managerSignOffReview,
    setNotification,
  } = useApp();

  const effectiveTaskId = taskId || selectedReviewTaskId || tasks[0]?.id;
  const task = tasks.find((t) => t.id === effectiveTaskId) || tasks[0];
  const assignee = users.find((u) => u.id === task?.assignedTo);
  const manager = assignee?.managerId ? users.find((u) => u.id === assignee.managerId) : users.find((u) => u.id === 'user-ahmed');

  // Local editing state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [problemStatement, setProblemStatement] = useState<string>(task?.review?.problemStatement || '');
  const [beforeState, setBeforeState] = useState<string>(task?.review?.beforeState || '');
  const [afterState, setAfterState] = useState<string>(task?.review?.afterState || '');
  const [challenges, setChallenges] = useState<string>(task?.review?.challenges || '');
  const [learning, setLearning] = useState<string>(task?.review?.learning || '');
  const [businessOutcome, setBusinessOutcome] = useState<string>(task?.review?.businessOutcome || '');

  // Manager signoff modal state
  const [managerNotes, setManagerNotes] = useState<string>(task?.review?.managerNotes || '');
  const [managerRating, setManagerRating] = useState<number>(task?.review?.managerRating || 5);
  const [selectedKpiToAdd, setSelectedKpiToAdd] = useState<string>(kpis[0]?.id || '');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Sync state if task changes
  React.useEffect(() => {
    if (task?.review) {
      setProblemStatement(task.review.problemStatement);
      setBeforeState(task.review.beforeState);
      setAfterState(task.review.afterState);
      setChallenges(task.review.challenges);
      setLearning(task.review.learning);
      setBusinessOutcome(task.review.businessOutcome);
      setManagerNotes(task.review.managerNotes || '');
      setManagerRating(task.review.managerRating || 5);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="p-8 text-center bg-slate-900 text-white rounded-3xl border border-slate-800">
        <p className="text-sm text-slate-400">Task review record not found.</p>
        <button
          onClick={() => (onBack ? onBack() : setActiveView('tasks'))}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to Task Board
        </button>
      </div>
    );
  }

  // Linked KPIs
  const taskKpiIds = task.kpiIds || [];
  const linkedKpis = kpis.filter((k) => taskKpiIds.includes(k.id));
  const availableKpisToAdd = kpis.filter((k) => !taskKpiIds.includes(k.id));

  const handleSaveReview = () => {
    updateTaskReview(task.id, {
      problemStatement,
      beforeState,
      afterState,
      challenges,
      learning,
      businessOutcome,
    });
    setIsEditing(false);
  };

  const handleManagerSignOff = () => {
    managerSignOffReview(task.id, managerNotes, managerRating);
  };

  const handleAiAutoFormat = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setProblemStatement(
        `High-concurrency latency bottleneck in ${task.title}. Latency p99 spikes exceeded 650ms during peak load, creating systemic pipeline timeouts.`
      );
      setBeforeState(
        'Synchronous blocking I/O architecture with single-threaded connection pools and zero query-level cache tier.'
      );
      setAfterState(
        'Asynchronous non-blocking streaming pipeline with distributed Redis multi-tier caching and sub-40ms execution SLA.'
      );
      setChallenges(
        'Cross-zone network partitions, distributed race conditions under 10k qps load, and backward compatibility across legacy client SDKs.'
      );
      setLearning(
        'Engineered idempotency keys with distributed lock leases and automated regression assertions across edge topologies.'
      );
      setBusinessOutcome(
        'Elevated end-to-end system throughput by +340%, eliminated 100% of pipeline timeouts, and unlocked Q3 enterprise SLA targets.'
      );
      setIsAiGenerating(false);
      setNotification({
        message: 'AI Synthesizer populated futuristic architectural telemetry.',
        type: 'success',
      });
    }, 600);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveView('tasks');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Futuristic Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tasks</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>TASK-ID: {task.id.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* AI Generator button */}
          {isEditing && (
            <button
              onClick={handleAiAutoFormat}
              disabled={isAiGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>{isAiGenerating ? 'Synthesizing...' : 'AI Auto-Draft'}</span>
            </button>
          )}

          {/* Edit / Save Toggle */}
          <button
            onClick={() => {
              if (isEditing) handleSaveReview();
              else setIsEditing(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Review HUD</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Review Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main HUD Banner Tile (Futuristic Cyberpunk Aesthetic) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-2xl overflow-hidden group">
        {/* Animated Cyber Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Futuristic Task Review HUD
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {task.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  task.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {task.status.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Source: {task.source.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {task.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {task.description}
            </p>

            {/* Engineer Profile Metadata */}
            <div className="flex items-center gap-4 pt-2 flex-wrap text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <img
                  src={assignee?.avatar}
                  alt={assignee?.name}
                  className="w-7 h-7 rounded-xl object-cover border border-cyan-400/60"
                />
                <span className="text-white font-semibold">{assignee?.name}</span>
                <span className="text-slate-400">({assignee?.title})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Due: {task.dueDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-cyan-300 font-bold">{task.actualHours}h Logged</span>
                <span>/ {task.estimatedHours}h Est.</span>
              </div>
            </div>
          </div>

          {/* Holographic Manager Sign-Off Seal */}
          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-500/40 shadow-xl shrink-0 min-w-[260px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  Manager Verification
                </span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-base font-bold text-white mt-1">
                Ahmed Naimabadi
              </div>
              <div className="text-[11px] text-slate-400">Direct Engineering Manager</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Technical Rating:</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{task.review?.managerRating || 5}.0 / 5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Review Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {task.review?.reviewedByManager ? 'APPROVED & SIGNED' : 'PENDING SIGN-OFF'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Authority Feature: Add/Remove KPIs for this Task */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Task KPI Bindings (Manager Authority: Ahmed Naimabadi)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isManager || isAdmin
                ? 'As Manager (Ahmed Naimabadi), you have full authority to add or remove which team KPIs this specific task contributes to.'
                : 'Task KPI contributions are governed by Manager Ahmed Naimabadi. Read-only view for contributors.'}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
            {linkedKpis.length} Linked Team KPIs
          </span>
        </div>

        {/* Current Linked KPIs List */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {linkedKpis.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No KPIs currently linked to this task.</p>
          ) : (
            linkedKpis.map((kpi) => (
              <div
                key={kpi.id}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-slate-200 group hover:border-indigo-500 transition-all"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>{kpi.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({kpi.weight}% Weight)</span>
                {(isManager || isAdmin) && (
                  <button
                    onClick={() => removeKpiFromTask(task.id, kpi.id)}
                    title="Remove KPI from this task (Manager Authority)"
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Manager KPI Addition Bar (Only if Manager or Admin) */}
        {(isManager || isAdmin) && availableKpisToAdd.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 shrink-0">
              Attach Additional KPI:
            </span>
            <select
              value={selectedKpiToAdd}
              onChange={(e) => setSelectedKpiToAdd(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              {availableKpisToAdd.map((kpi) => (
                <option key={kpi.id} value={kpi.id}>
                  {kpi.name} ({kpi.unit} • Weight: {kpi.weight}%)
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedKpiToAdd) {
                  addKpiToTask(task.id, selectedKpiToAdd);
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Link KPI to Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics Delta Telemetry HUD (Before vs After Performance) */}
      {task.review?.metricsDelta && task.review.metricsDelta.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {task.review.metricsDelta.map((metric, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {metric.label}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {metric.impact}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">BEFORE</span>
                  <span className="font-mono text-rose-400 font-bold">{metric.before}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">AFTER</span>
                  <span className="font-mono text-cyan-300 font-bold">{metric.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5 Core Format Sections (Futuristic Bento Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Format 1: Problem Statement (12 Cols) */}
        <div className="lg:col-span-12 bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">1. Problem Statement</h3>
              <p className="text-[11px] text-slate-400">Root Cause, Engineering Pain Point & System Bottleneck</p>
            </div>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full mt-2 p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              placeholder="Describe the core problem, user impact, and technical limitations..."
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {problemStatement || 'No problem statement recorded.'}
            </p>
          )}
        </div>

        {/* Format 2: Before and After (Interactive Comparison - 12 Cols) */}
        <div className="lg:col-span-12 bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">2. Before and After Architectural Comparison</h3>
              <p className="text-[11px] text-slate-400">Side-by-side technical state transition and paradigm shift</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Before Tile */}
            <div className="bg-gradient-to-b from-rose-950/30 to-slate-950 p-5 rounded-2xl border border-rose-500/30 shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Before Architecture
                </span>
                <span className="text-[10px] font-mono text-rose-300/60">LEGACY STATE</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={beforeState}
                  onChange={(e) => setBeforeState(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="Describe previous architecture, limitations, and pain points..."
                />
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {beforeState || 'Legacy architectural baseline.'}
                </p>
              )}
            </div>

            {/* After Tile */}
            <div className="bg-gradient-to-b from-cyan-950/30 to-slate-950 p-5 rounded-2xl border border-cyan-500/30 shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  After Architecture
                </span>
                <span className="text-[10px] font-mono text-cyan-300/60">TARGET STATE</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={afterState}
                  onChange={(e) => setAfterState(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Describe modern solution, optimizations, and technical improvements..."
                />
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {afterState || 'Modern production state.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Format 3: Challenges (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">3. Challenges & Edge Cases</h3>
                <p className="text-[11px] text-slate-400">Distributed race conditions, technical hurdles & mitigation</p>
              </div>
            </div>

            {isEditing ? (
              <textarea
                rows={4}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="w-full mt-2 p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="What unforeseen obstacles or edge cases were solved?"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {challenges || 'No specific challenges logged.'}
              </p>
            )}
          </div>
        </div>

        {/* Format 4: Learning (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">4. Engineering Learning & Retrospective</h3>
                <p className="text-[11px] text-slate-400">Reusable design patterns, skill growth & best practices</p>
              </div>
            </div>

            {isEditing ? (
              <textarea
                rows={4}
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                className="w-full mt-2 p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="What key insights can the team reuse in future sprints?"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {learning || 'No engineering learnings recorded.'}
              </p>
            )}
          </div>
        </div>

        {/* Format 5: Business Outcome (12 Cols) */}
        <div className="lg:col-span-12 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">5. Business Outcome & KPI ROI Impact</h3>
              <p className="text-[11px] text-slate-400">Measurable impact on team velocity, customer SLA, and revenue</p>
            </div>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={businessOutcome}
              onChange={(e) => setBusinessOutcome(e.target.value)}
              className="w-full mt-2 p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="What quantitative or qualitative business impact was generated?"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              {businessOutcome || 'No business outcome recorded.'}
            </p>
          )}
        </div>

        {/* Architecture Highlights Pill Badges (12 Cols) */}
        {task.review?.architectureHighlights && (
          <div className="lg:col-span-12 bg-slate-900/70 rounded-3xl p-5 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Architectural Pillars & Implementation Highlights:
            </span>
            <div className="flex flex-wrap gap-2">
              {task.review.architectureHighlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{highlight}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Manager Sign-off Action Panel (For Ahmed Naimabadi) */}
        {(isManager || isAdmin) && (
          <div className="lg:col-span-12 bg-slate-900 rounded-3xl p-6 border-2 border-indigo-500/50 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Manager Review Endorsement & Technical Excellence Sign-Off
                </h3>
              </div>
              <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                Ahmed Naimabadi (Manager)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Manager Technical Evaluation Notes & Feedback:
                </label>
                <textarea
                  rows={2}
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  placeholder="Provide managerial feedback, architectural sign-off, or commendations..."
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technical Excellence Rating (1-5):
                </label>
                <select
                  value={managerRating}
                  onChange={(e) => setManagerRating(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500 mb-3"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5.0 - Exemplary Technical Mastery</option>
                  <option value={4}>⭐⭐⭐⭐ 4.0 - Strong Engineering Execution</option>
                  <option value={3}>⭐⭐⭐ 3.0 - Meets Target Expectations</option>
                  <option value={2}>⭐⭐ 2.0 - Needs Architectural Refinement</option>
                  <option value={1}>⭐ 1.0 - Insufficient SLA Delivery</option>
                </select>

                <button
                  onClick={handleManagerSignOff}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Manager Sign-Off</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
