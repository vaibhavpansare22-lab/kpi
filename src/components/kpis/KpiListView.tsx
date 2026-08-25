import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KPI, User } from '../../types';
import { KpiModal } from './KpiModal';
import { KpiEvaluationModal } from './KpiEvaluationModal';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  Award,
  Zap,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  ExternalLink,
} from 'lucide-react';

export const KpiListView: React.FC = () => {
  const {
    kpis,
    users,
    currentUser,
    isAdmin,
    isManager,
    isEmployee,
    deleteKpi,
    performanceSummaries,
    getDirectReports,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);

  // Evaluation modal
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalKpi, setEvalKpi] = useState<KPI | null>(null);
  const [evalUser, setEvalUser] = useState<User | null>(null);

  const directReports = isManager ? getDirectReports(currentUser.id) : users.filter((u) => u.role === 'employee');

  const mySummary = performanceSummaries.get(currentUser.id);

  const openEvaluation = (kpi: KPI, user: User) => {
    setEvalKpi(kpi);
    setEvalUser(user);
    setEvalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEmployee ? 'My Performance Targets & Goals' : 'KPI Management & Goal Framework'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isEmployee
              ? 'Review benchmarks assigned by your engineering manager and track target fulfillment.'
              : 'Define quantitative targets, calculation pipelines, importance weights, and periodic manager reviews.'}
          </p>
        </div>

        {!isEmployee && (
          <button
            id="create-kpi-btn"
            onClick={() => {
              setEditingKpi(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Define New KPI</span>
          </button>
        )}
      </div>

      {/* Employee Personal KPI Scorecards (if logged in as Employee) */}
      {isEmployee && mySummary && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 via-white to-slate-50 p-5 rounded-2xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Composite Scorecard
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Current Performance Rating: {mySummary.overallScore}%
              </h3>
              <p className="text-xs text-slate-500">
                Calculated across {mySummary.kpiScores.length} weighted KPIs for the active period.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-semibold">Period Trend</div>
                <div
                  className={`text-sm font-bold flex items-center gap-0.5 justify-end ${
                    mySummary.scoreTrend >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {mySummary.scoreTrend >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{mySummary.scoreTrend >= 0 ? `+${mySummary.scoreTrend}%` : `${mySummary.scoreTrend}%`}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {mySummary.overallScore}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySummary.kpiScores.map((item) => (
              <div
                key={item.kpi.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      Weight: {item.kpi.weight}%
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
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

                  <h4 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                    {item.kpi.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.kpi.description}
                  </p>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Actual / Target
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        {item.actualValue} {item.kpi.unit}{' '}
                        <span className="text-xs font-normal text-slate-400">
                          / {item.kpi.targetValue} {item.kpi.unit}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Normalized Score
                      </div>
                      <div className="text-base font-bold text-indigo-700">{item.score}%</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
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

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Frequency: {item.kpi.frequency}</span>
                  <span className="capitalize">{item.kpi.direction.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Definitions Grid (for Managers & Admins) */}
      {!isEmployee && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => {
              const appliesCount =
                kpi.appliesToUserIds === 'ALL'
                  ? 'All Direct Reports'
                  : `${(kpi.appliesToUserIds as string[]).length} Members`;

              return (
                <div
                  key={kpi.id}
                  id={`kpi-card-${kpi.id}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                          <Target className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          Weight: {kpi.weight}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingKpi(kpi);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit KPI"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteKpi(kpi.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete KPI"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
                      {kpi.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {kpi.description}
                    </p>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                          Target Value
                        </span>
                        <strong className="text-slate-800">
                          {kpi.targetValue} {kpi.unit}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                          Cadence
                        </span>
                        <strong className="text-slate-800 capitalize">{kpi.frequency}</strong>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {kpi.isSystemCalculated ? 'Automated Pipeline' : 'Manager Evaluation'}
                      </span>
                      <span>{appliesCount}</span>
                    </div>
                  </div>

                  {/* Manual Evaluation Trigger for qualitative metrics */}
                  {!kpi.isSystemCalculated && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-700 mb-2">
                        Grade Team Members:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {directReports.slice(0, 4).map((emp) => (
                          <button
                            key={emp.id}
                            onClick={() => openEvaluation(kpi, emp)}
                            className="px-2 py-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                          >
                            <span>Grade {emp.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Modal */}
      <KpiModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKpi(null);
        }}
        initialKpi={editingKpi}
      />

      {/* Evaluation Modal */}
      {evalModalOpen && evalKpi && evalUser && (
        <KpiEvaluationModal
          isOpen={evalModalOpen}
          onClose={() => {
            setEvalModalOpen(false);
            setEvalKpi(null);
            setEvalUser(null);
          }}
          kpi={evalKpi}
          user={evalUser}
        />
      )}
    </div>
  );
};
