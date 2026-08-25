import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KPI, MetricType, MetricDirection, KpiFrequency } from '../../types';
import { X, Target, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKpi?: KPI | null;
}

export const KpiModal: React.FC<KpiModalProps> = ({ isOpen, onClose, initialKpi }) => {
  const { currentUser, users, addKpi, updateKpi, isManager, isAdmin } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metricType, setMetricType] = useState<MetricType>('percentage');
  const [direction, setDirection] = useState<MetricDirection>('higher_is_better');
  const [targetValue, setTargetValue] = useState<number>(85);
  const [weight, setWeight] = useState<number>(20);
  const [frequency, setFrequency] = useState<KpiFrequency>('monthly');
  const [unit, setUnit] = useState('%');
  const [appliesTo, setAppliesTo] = useState<'ALL' | string[]>('ALL');
  const [isSystemCalculated, setIsSystemCalculated] = useState(true);
  const [systemCalculationType, setSystemCalculationType] = useState<any>('task_completion_rate');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialKpi) {
      setName(initialKpi.name);
      setDescription(initialKpi.description);
      setMetricType(initialKpi.metricType);
      setDirection(initialKpi.direction);
      setTargetValue(initialKpi.targetValue);
      setWeight(initialKpi.weight);
      setFrequency(initialKpi.frequency);
      setUnit(initialKpi.unit);
      setAppliesTo(initialKpi.appliesToUserIds);
      setIsSystemCalculated(initialKpi.isSystemCalculated ?? true);
      setSystemCalculationType(initialKpi.systemCalculationType || 'task_completion_rate');
    } else {
      setName('');
      setDescription('');
      setMetricType('percentage');
      setDirection('higher_is_better');
      setTargetValue(90);
      setWeight(20);
      setFrequency('monthly');
      setUnit('%');
      setAppliesTo('ALL');
      setIsSystemCalculated(true);
      setSystemCalculationType('task_completion_rate');
    }
    setErrorMessage(null);
  }, [initialKpi, isOpen]);

  if (!isOpen) return null;

  const eligibleTeamMembers = users.filter((u) => {
    if (isAdmin) return u.role === 'employee';
    return u.managerId === currentUser.id;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('KPI Metric Name is required.');
      return;
    }

    if (weight <= 0 || weight > 100) {
      setErrorMessage('Weight must be between 1 and 100%.');
      return;
    }

    if (initialKpi) {
      updateKpi(initialKpi.id, {
        name: name.trim(),
        description: description.trim(),
        metricType,
        direction,
        targetValue: Number(targetValue),
        weight: Number(weight),
        frequency,
        unit: unit.trim(),
        appliesToUserIds: appliesTo,
        isSystemCalculated,
        systemCalculationType: isSystemCalculated ? systemCalculationType : undefined,
      });
    } else {
      addKpi({
        name: name.trim(),
        description: description.trim(),
        ownerManagerId: currentUser.id,
        metricType,
        direction,
        targetValue: Number(targetValue),
        weight: Number(weight),
        frequency,
        unit: unit.trim(),
        appliesToUserIds: appliesTo,
        isSystemCalculated,
        systemCalculationType: isSystemCalculated ? systemCalculationType : undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialKpi ? 'Edit KPI Definition' : 'Define New Team KPI'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure metric benchmarks, calculation engine, and importance weights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* KPI Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Metric Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint Story Points Velocity"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Business Value
            </label>
            <textarea
              rows={2}
              placeholder="Explain how this metric is measured and what excellence looks like..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Metric Type & Direction */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metric Type
              </label>
              <select
                value={metricType}
                onChange={(e) => {
                  const val = e.target.value as MetricType;
                  setMetricType(val);
                  if (val === 'percentage') setUnit('%');
                  else if (val === 'rating_scale') setUnit('/5.0');
                  else if (val === 'boolean') setUnit('pass/fail');
                  else setUnit('pts');
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="numeric">Numeric Value</option>
                <option value="rating_scale">Rating Scale (1 - 5)</option>
                <option value="boolean">Boolean (Met / Missed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scoring Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as MetricDirection)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="higher_is_better">Higher is Better (e.g. Completion %)</option>
                <option value="lower_is_better">Lower is Better (e.g. Cycle Time, Bugs)</option>
              </select>
            </div>
          </div>

          {/* Target Value, Unit & Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Threshold *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit of Measure
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="%, days, pts"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight Importance (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Frequency & Applies To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evaluation Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as KpiFrequency)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applies To
              </label>
              <select
                value={appliesTo === 'ALL' ? 'ALL' : 'CUSTOM'}
                onChange={(e) => {
                  if (e.target.value === 'ALL') setAppliesTo('ALL');
                  else setAppliesTo(eligibleTeamMembers.map((m) => m.id));
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Entire Team (All Reports)</option>
                <option value="CUSTOM">Specific Direct Reports</option>
              </select>
            </div>
          </div>

          {/* Calculation Engine Source */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">
                Calculation Method
              </label>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="calcEngine"
                    checked={isSystemCalculated}
                    onChange={() => setIsSystemCalculated(true)}
                  />
                  <span>Automated</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="calcEngine"
                    checked={!isSystemCalculated}
                    onChange={() => setIsSystemCalculated(false)}
                  />
                  <span>Manual Manager Review</span>
                </label>
              </div>
            </div>

            {isSystemCalculated ? (
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Connect to Data Pipeline:
                </label>
                <select
                  value={systemCalculationType}
                  onChange={(e) => setSystemCalculationType(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="task_completion_rate">Task Completion Rate (% from Task log)</option>
                  <option value="on_time_delivery">On-Time Delivery (% delivered by due date)</option>
                  <option value="cycle_time">Average Task Cycle Time (days elapsed)</option>
                  <option value="rally_story_points">Rally Velocity (Story Points synced)</option>
                  <option value="workday_utilization">Workday Utilization & Compliance (% completed)</option>
                </select>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Manager will periodically grade employees using the built-in Performance Evaluation slider (1.0 - 5.0).
              </p>
            )}
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
              <span>{initialKpi ? 'Update KPI' : 'Save KPI Definition'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
