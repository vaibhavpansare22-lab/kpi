import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KPI, User } from '../../types';
import { KpiEngine } from '../../services/kpiEngine';
import { X, Award, CheckCircle2, Star, MessageSquare } from 'lucide-react';

interface KpiEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI;
  user: User;
}

export const KpiEvaluationModal: React.FC<KpiEvaluationModalProps> = ({
  isOpen,
  onClose,
  kpi,
  user,
}) => {
  const { submitKpiEvaluation, period } = useApp();

  const [rating, setRating] = useState<number>(4.7);
  const [notes, setNotes] = useState<string>('Demonstrated high craft, rigorous code reviews, and strong collaboration.');

  if (!isOpen) return null;

  const currentScore = KpiEngine.calculateSingleKpiScore(kpi, rating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKpiEvaluation(kpi.id, user.id, rating, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Grade KPI Evaluation
              </h3>
              <p className="text-xs text-slate-500">
                Quarterly Manager Review & Qualitative Scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Employee details card */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-300"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
            <p className="text-[11px] text-slate-500">{user.title}</p>
            <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
              Metric: {kpi.name} (Target: {kpi.targetValue} {kpi.unit})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Rating Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Assigned Rating / Metric Score
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-900">{rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">{kpi.unit}</span>
              </div>
            </div>

            <input
              type="range"
              min={kpi.metricType === 'rating_scale' ? '1.0' : '0'}
              max={kpi.metricType === 'rating_scale' ? '5.0' : '100'}
              step={kpi.metricType === 'rating_scale' ? '0.1' : '1'}
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{kpi.metricType === 'rating_scale' ? '1.0 (Needs Improvement)' : '0'}</span>
              <span>{kpi.metricType === 'rating_scale' ? '3.0 (Satisfactory)' : '50'}</span>
              <span>{kpi.metricType === 'rating_scale' ? '5.0 (Exemplary)' : '100'}</span>
            </div>
          </div>

          {/* Computed Score Preview Box */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-900">
              Normalized KPI Score (0-100):
            </span>
            <span className="text-sm font-bold text-indigo-700">{currentScore}%</span>
          </div>

          {/* Manager Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Evaluation Notes & Feedback
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Highlight key contributions, code review insights, or architectural impacts..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
