import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Integration, SyncFrequency } from '../../types';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Key,
  Globe,
  Lock,
  Layers,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const {
    integrations,
    updateIntegrationConfig,
    testIntegrationConnection,
    triggerIntegrationSync,
    isAdmin,
    isManager,
  } = useApp();

  const [loadingTest, setLoadingTest] = useState<string | null>(null);
  const [loadingSync, setLoadingSync] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  const rallyConfig = integrations.find((i) => i.type === 'rally') || integrations[0];
  const workdayConfig = integrations.find((i) => i.type === 'workday') || integrations[1];

  const handleTest = async (type: 'rally' | 'workday') => {
    setLoadingTest(type);
    const res = await testIntegrationConnection(type);
    setTestResults((prev) => ({ ...prev, [type]: res }));
    setLoadingTest(null);
  };

  const handleSync = async (type: 'rally' | 'workday') => {
    setLoadingSync(type);
    await triggerIntegrationSync(type);
    setLoadingSync(null);
  };

  const toggleShowToken = (type: string) => {
    setShowTokens((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Bento Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Enterprise API Integrations
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100/80 text-emerald-800 rounded-full border border-emerald-200">
              Active Sync Connectors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Configure external API endpoints, OAuth credentials, and automated sprint & HR data synchronization.'
              : 'View live synchronization status for CA Agile Central / Rally and Workday RaaS telemetry.'}
          </p>
        </div>
      </div>

      {/* Grid of Integrations (Bento tiles) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rally Connector Card (6 cols) */}
        {rallyConfig && (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Card Header */}
              <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    CA
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Rally (CA Agile Central)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Agile sprint velocity, story points, and bug tracking
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                    rallyConfig.connectionStatus === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : rallyConfig.connectionStatus === 'syncing'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      rallyConfig.connectionStatus === 'connected'
                        ? 'bg-emerald-500'
                        : rallyConfig.connectionStatus === 'syncing'
                        ? 'bg-blue-500 animate-ping'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="capitalize">{rallyConfig.connectionStatus}</span>
                </span>
              </div>

              {/* Form & Settings */}
              <div className="p-5 md:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> Rally WSAPI Endpoint URL
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={rallyConfig.apiEndpoint}
                    onChange={(e) =>
                      updateIntegrationConfig(rallyConfig.id, { apiEndpoint: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" /> Rally API Key / Security Token
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleShowToken('rally')}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      {showTokens['rally'] ? 'Hide' : 'Reveal'}
                    </button>
                  </label>
                  <input
                    type={showTokens['rally'] ? 'text' : 'password'}
                    disabled={!isAdmin}
                    value={rallyConfig.authToken}
                    onChange={(e) =>
                      updateIntegrationConfig(rallyConfig.id, { authToken: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 disabled:opacity-75"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Workspace / Project ID
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={rallyConfig.tenantOrWorkspaceId}
                      onChange={(e) =>
                        updateIntegrationConfig(rallyConfig.id, {
                          tenantOrWorkspaceId: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Sync Frequency
                    </label>
                    <select
                      disabled={!isAdmin}
                      value={rallyConfig.syncFrequency}
                      onChange={(e) =>
                        updateIntegrationConfig(rallyConfig.id, {
                          syncFrequency: e.target.value as SyncFrequency,
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 disabled:opacity-75 cursor-pointer"
                    >
                      <option value="hourly">Hourly (Near Real-Time)</option>
                      <option value="daily">Daily Batch</option>
                      <option value="weekly">Weekly Rollup</option>
                      <option value="manual">Manual On-Demand</option>
                    </select>
                  </div>
                </div>

                {/* Telemetry metadata */}
                <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Last Synced:</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {rallyConfig.lastSyncedAt
                        ? new Date(rallyConfig.lastSyncedAt).toLocaleTimeString()
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Records Ingested:</span>
                    <span className="font-mono text-indigo-700 font-bold">
                      {rallyConfig.recordsCount} User Stories & Defects
                    </span>
                  </div>
                </div>

                {/* Test Feedback Message */}
                {testResults['rally'] && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                      testResults['rally'].success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {testResults['rally'].success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{testResults['rally'].message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="p-5 md:p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTest('rally')}
                disabled={loadingTest === 'rally'}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingTest === 'rally' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                id="sync-rally-btn"
                onClick={() => handleSync('rally')}
                disabled={loadingSync === 'rally'}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingSync === 'rally' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Workday Connector Card (6 cols) */}
        {workdayConfig && (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Card Header */}
              <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    WD
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Workday Human Capital & Financials (RaaS)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Timesheets, billable utilization, and compliance certifications
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                    workdayConfig.connectionStatus === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : workdayConfig.connectionStatus === 'syncing'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      workdayConfig.connectionStatus === 'connected'
                        ? 'bg-emerald-500'
                        : workdayConfig.connectionStatus === 'syncing'
                        ? 'bg-blue-500 animate-ping'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="capitalize">{workdayConfig.connectionStatus}</span>
                </span>
              </div>

              {/* Form & Settings */}
              <div className="p-5 md:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> Workday Report (RaaS) URL
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={workdayConfig.apiEndpoint}
                    onChange={(e) =>
                      updateIntegrationConfig(workdayConfig.id, { apiEndpoint: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> OAuth Client Secret / Token
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleShowToken('workday')}
                      className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                    >
                      {showTokens['workday'] ? 'Hide' : 'Reveal'}
                    </button>
                  </label>
                  <input
                    type={showTokens['workday'] ? 'text' : 'password'}
                    disabled={!isAdmin}
                    value={workdayConfig.authToken}
                    onChange={(e) =>
                      updateIntegrationConfig(workdayConfig.id, { authToken: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 disabled:opacity-75"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tenant ID
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={workdayConfig.tenantOrWorkspaceId}
                      onChange={(e) =>
                        updateIntegrationConfig(workdayConfig.id, {
                          tenantOrWorkspaceId: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Sync Cadence
                    </label>
                    <select
                      disabled={!isAdmin}
                      value={workdayConfig.syncFrequency}
                      onChange={(e) =>
                        updateIntegrationConfig(workdayConfig.id, {
                          syncFrequency: e.target.value as SyncFrequency,
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 disabled:opacity-75 cursor-pointer"
                    >
                      <option value="hourly">Hourly Automated</option>
                      <option value="daily">Daily Nightly Ingestion</option>
                      <option value="weekly">Weekly Sync</option>
                      <option value="manual">Manual Trigger Only</option>
                    </select>
                  </div>
                </div>

                {/* Telemetry metadata */}
                <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Last Synced:</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {workdayConfig.lastSyncedAt
                        ? new Date(workdayConfig.lastSyncedAt).toLocaleTimeString()
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Records Ingested:</span>
                    <span className="font-mono text-sky-700 font-bold">
                      {workdayConfig.recordsCount} Compliance & Timesheet Logs
                    </span>
                  </div>
                </div>

                {/* Test Feedback Message */}
                {testResults['workday'] && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                      testResults['workday'].success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {testResults['workday'].success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{testResults['workday'].message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="p-5 md:p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTest('workday')}
                disabled={loadingTest === 'workday'}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingTest === 'workday' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                id="sync-workday-btn"
                onClick={() => handleSync('workday')}
                disabled={loadingSync === 'workday'}
                className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingSync === 'workday' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
