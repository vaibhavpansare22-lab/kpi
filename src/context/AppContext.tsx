import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Task,
  KPI,
  KPIResult,
  Integration,
  PeriodType,
  UserPerformanceSummary,
  TaskReviewData,
} from '../types';
import {
  SEED_USERS,
  SEED_TASKS,
  SEED_KPIS,
  SEED_KPI_RESULTS,
  SEED_INTEGRATIONS,
} from '../mockData';
import { KpiEngine } from '../services/kpiEngine';
import { rallyService } from '../integrations/rally';
import { workdayService } from '../integrations/workday';

export type AppView =
  | 'dashboard'
  | 'tasks'
  | 'kpis'
  | 'org'
  | 'integrations'
  | 'employee_detail'
  | 'task_review';

interface AppContextType {
  // Auth & Role Context
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchUserById: (userId: string) => void;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;

  // View & Filter State
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  selectedManagerId: string | null;
  setSelectedManagerId: (id: string | null) => void;
  selectedReviewTaskId: string | null;
  setSelectedReviewTaskId: (id: string | null) => void;
  openTaskReview: (taskId: string) => void;
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;

  // Data Collections
  users: User[];
  tasks: Task[];
  kpis: KPI[];
  kpiResults: KPIResult[];
  integrations: Integration[];

  // User & Org Operations (Admin only)
  addUser: (userData: Partial<User>) => void;
  updateUser: (userId: string, partial: Partial<User>) => void;
  reassignManager: (userId: string, newManagerId: string | null) => void;
  promoteToManager: (userId: string) => void;
  demoteToEmployee: (userId: string, newManagerId: string | null) => void;
  toggleUserStatus: (userId: string) => void;

  // Task Operations
  addTask: (taskData: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, partial: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  approveTask: (taskId: string) => void;

  // Manager KPI Assignment to Tasks (Manager Authority)
  addKpiToTask: (taskId: string, kpiId: string) => boolean;
  removeKpiFromTask: (taskId: string, kpiId: string) => boolean;
  setTaskKpis: (taskId: string, kpiIds: string[]) => boolean;

  // Task Review Page Operations
  updateTaskReview: (taskId: string, review: Partial<TaskReviewData>) => void;
  managerSignOffReview: (taskId: string, notes: string, rating: number) => void;

  // KPI Operations
  addKpi: (kpiData: Omit<KPI, 'id'>) => void;
  updateKpi: (kpiId: string, partial: Partial<KPI>) => void;
  deleteKpi: (kpiId: string) => void;
  submitKpiEvaluation: (kpiId: string, userId: string, actualValue: number, notes?: string) => void;

  // Integration Operations
  updateIntegrationConfig: (id: string, partial: Partial<Integration>) => void;
  testIntegrationConnection: (type: 'rally' | 'workday') => Promise<{ success: boolean; message: string }>;
  triggerIntegrationSync: (type: 'rally' | 'workday') => Promise<{ success: boolean; message: string; count: number }>;

  // Derived Performance Summaries
  performanceSummaries: Map<string, UserPerformanceSummary>;
  getDirectReports: (managerId: string) => User[];
  canAccessUser: (targetUserId: string) => boolean;
  resetToDefaults: () => void;
  notification: { message: string; type: 'success' | 'info' | 'error' | 'warning' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'info' | 'error' | 'warning' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'teampulse_users_v3',
  TASKS: 'teampulse_tasks_v3',
  KPIS: 'teampulse_kpis_v3',
  RESULTS: 'teampulse_kpi_results_v3',
  INTEGRATIONS: 'teampulse_integrations_v3',
  ACTIVE_USER: 'teampulse_active_user_v3',
  AUTH_STATUS: 'teampulse_auth_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or seed data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [kpis, setKpis] = useState<KPI[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KPIS);
    return saved ? JSON.parse(saved) : SEED_KPIS;
  });

  const [kpiResults, setKpiResults] = useState<KPIResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return saved ? JSON.parse(saved) : SEED_KPI_RESULTS;
  });

  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    return saved ? JSON.parse(saved) : SEED_INTEGRATIONS;
  });

  // Authentication & active user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (savedId) {
      const match = SEED_USERS.find((u) => u.id === savedId);
      if (match) return match;
    }
    return SEED_USERS[1]; // Ahmed Naimabadi (Manager) by default
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_STATUS);
    return savedAuth === 'true'; // Users land on the login page initially if not explicitly authenticated
  });

  // Navigation & filter state
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [selectedReviewTaskId, setSelectedReviewTaskId] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('monthly');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error' | 'warning';
  } | null>(null);

  // Auto-dismiss notification after 4s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Persist state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(kpis));
  }, [kpis]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(kpiResults));
  }, [kpiResults]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Role permissions
  const isAdmin = currentUser.role === 'admin';
  const isManager = currentUser.role === 'manager';
  const isEmployee = currentUser.role === 'employee';

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSelectedEmployeeId(null);
    setSelectedManagerId(null);
    setSelectedReviewTaskId(null);
    setActiveView('dashboard');
    setNotification({
      message: `Welcome back, ${user.name}! Logged in as ${user.role.toUpperCase()}.`,
      type: 'success',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSelectedReviewTaskId(null);
    setSelectedEmployeeId(null);
    setSelectedManagerId(null);
    setNotification({
      message: 'Logged out successfully. Please sign in.',
      type: 'info',
    });
  };

  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      setSelectedEmployeeId(null);
      setSelectedManagerId(null);
      setSelectedReviewTaskId(null);
      setActiveView('dashboard');
      setNotification({
        message: `Switched identity to ${found.name} (${found.role.toUpperCase()})`,
        type: 'info',
      });
    }
  };

  const openTaskReview = (taskId: string) => {
    setSelectedReviewTaskId(taskId);
    setActiveView('task_review');
  };

  // Helper to get direct reports of a manager
  const getDirectReports = (managerId: string): User[] => {
    return users.filter((u) => u.managerId === managerId && u.status === 'active');
  };

  // RBAC Access Control Validator
  const canAccessUser = (targetUserId: string): boolean => {
    if (isAdmin) return true;
    if (currentUser.id === targetUserId) return true;
    if (isManager) {
      const reports = getDirectReports(currentUser.id);
      return reports.some((r) => r.id === targetUserId);
    }
    return false;
  };

  // Derived Performance Summaries for all users
  const performanceSummaries = useMemo(() => {
    const map = new Map<string, UserPerformanceSummary>();
    users.forEach((u) => {
      const summary = KpiEngine.generateUserSummary(u, kpis, tasks, kpiResults, period);
      map.set(u.id, summary);
    });
    return map;
  }, [users, kpis, tasks, kpiResults, period]);

  // User & Org Management (Admin only)
  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New Employee',
      email: userData.email || `employee.${Date.now()}@teampulse.com`,
      role: userData.role || 'employee',
      managerId: userData.managerId !== undefined ? userData.managerId : 'user-ahmed',
      department: userData.department || 'Core Platform Engineering',
      title: userData.title || 'Software Engineer',
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      phone: userData.phone || '+1 (555) 019-0000',
      location: userData.location || 'Remote',
    };
    setUsers((prev) => [...prev, newUser]);
    setNotification({
      message: `Added new user ${newUser.name} assigned to manager.`,
      type: 'success',
    });
  };

  const updateUser = (userId: string, partial: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...partial } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...partial }));
    }
    setNotification({ message: 'User profile updated.', type: 'success' });
  };

  const reassignManager = (userId: string, newManagerId: string | null) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, managerId: newManagerId } : u))
    );
    const target = users.find((u) => u.id === userId);
    const manager = users.find((u) => u.id === newManagerId);
    setNotification({
      message: `Reassigned ${target?.name} to manager ${manager ? manager.name : 'None (Top Level)'}.`,
      type: 'success',
    });
  };

  const promoteToManager = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: 'manager' } : u))
    );
    const target = users.find((u) => u.id === userId);
    setNotification({
      message: `Promoted ${target?.name} to Manager role.`,
      type: 'success',
    });
  };

  const demoteToEmployee = (userId: string, newManagerId: string | null) => {
    setUsers((prev) => {
      return prev.map((u) => {
        if (u.id === userId) {
          return { ...u, role: 'employee', managerId: newManagerId || 'user-ahmed' };
        }
        if (u.managerId === userId) {
          return { ...u, managerId: newManagerId || 'user-ahmed' };
        }
        return u;
      });
    });
    setNotification({
      message: 'Demoted user to Employee role and updated team hierarchy.',
      type: 'info',
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'inactive' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    setNotification({ message: 'Updated employee status.', type: 'info' });
  };

  // Task Management
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const defaultReview: TaskReviewData = {
      problemStatement: `Implementation and technical execution for ${taskData.title}.`,
      beforeState: 'Legacy architectural baseline requiring technical remediation and feature enhancements.',
      afterState: 'Production-ready milestone completed with high test coverage and verified performance metrics.',
      challenges: 'Managing technical dependencies, handling distributed concurrency, and verifying edge-case resilience.',
      learning: 'Established reusable patterns, improved automated test coverage, and documented system retrospectives.',
      businessOutcome: 'Accelerated engineering velocity, satisfied sprint SLAs, and improved customer satisfaction.',
      architectureHighlights: ['Modular Design', 'High Concurrency', 'Zero-Downtime Migration'],
      metricsDelta: [
        { label: 'Engineering Output', before: 'Baseline', after: 'Enhanced (+100%)', impact: 'Sprint Target Met' }
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
      reviewedByManager: isManager || isAdmin,
      managerNotes: isManager ? 'Initial review logged and acknowledged by Manager.' : undefined,
      managerRating: 5,
    };

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      approved: isManager || isAdmin,
      kpiIds: taskData.kpiIds && taskData.kpiIds.length > 0 ? taskData.kpiIds : ['kpi-1', 'kpi-2'],
      review: taskData.review || defaultReview,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNotification({
      message: `Task "${newTask.title}" created successfully.`,
      type: 'success',
    });
  };

  const updateTask = (taskId: string, partial: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...partial };
          if (partial.status === 'completed' && !t.completedDate) {
            updated.completedDate = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return t;
      })
    );
    setNotification({ message: 'Task updated.', type: 'success' });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setNotification({ message: 'Task deleted.', type: 'info' });
  };

  const approveTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, approved: true } : t))
    );
    setNotification({ message: 'Task approved by Manager (Ahmed Naimabadi).', type: 'success' });
  };

  // Manager Authority: Add / Remove KPIs per Task
  const addKpiToTask = (taskId: string, kpiId: string): boolean => {
    if (!isManager && !isAdmin) {
      setNotification({
        message: 'Authority Restricted: Only Manager (Ahmed Naimabadi) or Admin can modify Task KPIs.',
        type: 'warning',
      });
      return false;
    }

    const targetKpi = kpis.find((k) => k.id === kpiId);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const existingKpiIds = t.kpiIds || [];
          if (!existingKpiIds.includes(kpiId)) {
            return { ...t, kpiIds: [...existingKpiIds, kpiId] };
          }
        }
        return t;
      })
    );

    setNotification({
      message: `Manager Authority: Added KPI "${targetKpi?.name || kpiId}" to task.`,
      type: 'success',
    });
    return true;
  };

  const removeKpiFromTask = (taskId: string, kpiId: string): boolean => {
    if (!isManager && !isAdmin) {
      setNotification({
        message: 'Authority Restricted: Only Manager (Ahmed Naimabadi) or Admin can modify Task KPIs.',
        type: 'warning',
      });
      return false;
    }

    const targetKpi = kpis.find((k) => k.id === kpiId);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const existingKpiIds = t.kpiIds || [];
          return { ...t, kpiIds: existingKpiIds.filter((id) => id !== kpiId) };
        }
        return t;
      })
    );

    setNotification({
      message: `Manager Authority: Removed KPI "${targetKpi?.name || kpiId}" from task.`,
      type: 'info',
    });
    return true;
  };

  const setTaskKpis = (taskId: string, kpiIds: string[]): boolean => {
    if (!isManager && !isAdmin) {
      setNotification({
        message: 'Authority Restricted: Only Manager (Ahmed Naimabadi) or Admin can modify Task KPIs.',
        type: 'warning',
      });
      return false;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, kpiIds } : t))
    );

    setNotification({
      message: `Manager Authority: Updated KPI bindings (${kpiIds.length} KPIs attached).`,
      type: 'success',
    });
    return true;
  };

  // Task Review Operations
  const updateTaskReview = (taskId: string, reviewPartial: Partial<TaskReviewData>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentReview = t.review || {
            problemStatement: '',
            beforeState: '',
            afterState: '',
            challenges: '',
            learning: '',
            businessOutcome: '',
          };
          return {
            ...t,
            review: {
              ...currentReview,
              ...reviewPartial,
              lastUpdated: new Date().toISOString().split('T')[0],
            },
          };
        }
        return t;
      })
    );

    setNotification({
      message: 'Futuristic Task Review saved successfully.',
      type: 'success',
    });
  };

  const managerSignOffReview = (taskId: string, notes: string, rating: number) => {
    if (!isManager && !isAdmin) {
      setNotification({
        message: 'Only Manager (Ahmed Naimabadi) has authority to sign off on Task Reviews.',
        type: 'warning',
      });
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentReview = t.review || {
            problemStatement: '',
            beforeState: '',
            afterState: '',
            challenges: '',
            learning: '',
            businessOutcome: '',
          };
          return {
            ...t,
            approved: true,
            review: {
              ...currentReview,
              reviewedByManager: true,
              managerNotes: notes,
              managerRating: rating,
              lastUpdated: new Date().toISOString().split('T')[0],
            },
          };
        }
        return t;
      })
    );

    setNotification({
      message: `Manager Ahmed Naimabadi signed off review with a ${rating}/5.0 Technical Rating!`,
      type: 'success',
    });
  };

  // KPI Management
  const addKpi = (kpiData: Omit<KPI, 'id'>) => {
    const newKpi: KPI = {
      ...kpiData,
      id: `kpi-${Date.now()}`,
    };
    setKpis((prev) => [...prev, newKpi]);
    setNotification({
      message: `KPI "${newKpi.name}" defined for team.`,
      type: 'success',
    });
  };

  const updateKpi = (kpiId: string, partial: Partial<KPI>) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === kpiId ? { ...k, ...partial } : k))
    );
    setNotification({ message: 'KPI definition updated.', type: 'success' });
  };

  const deleteKpi = (kpiId: string) => {
    setKpis((prev) => prev.filter((k) => k.id !== kpiId));
    setNotification({ message: 'KPI definition removed.', type: 'info' });
  };

  const submitKpiEvaluation = (
    kpiId: string,
    userId: string,
    actualValue: number,
    notes?: string
  ) => {
    const currentPeriodLabel =
      period === 'weekly' ? 'Week 34' : period === 'quarterly' ? 'Q3 2026' : 'August 2026';
    const targetKpi = kpis.find((k) => k.id === kpiId);
    const computedScore = targetKpi ? KpiEngine.calculateSingleKpiScore(targetKpi, actualValue) : 90;

    setKpiResults((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.kpiId === kpiId && r.userId === userId && r.period === currentPeriodLabel
      );
      const newEntry: KPIResult = {
        id: `res-${Date.now()}`,
        kpiId,
        userId,
        period: currentPeriodLabel,
        actualValue,
        computedScore,
        notes,
        updatedDate: new Date().toISOString().split('T')[0],
        evaluatorId: currentUser.id,
      };
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newEntry;
        return next;
      }
      return [...prev, newEntry];
    });

    setNotification({
      message: `Evaluation submitted: actual value ${actualValue} (Score: ${computedScore}%).`,
      type: 'success',
    });
  };

  // Integrations Management
  const updateIntegrationConfig = (id: string, partial: Partial<Integration>) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    setNotification({ message: 'Integration settings saved.', type: 'success' });
  };

  const testIntegrationConnection = async (type: 'rally' | 'workday') => {
    const config = integrations.find((i) => i.type === type);
    if (!config) return { success: false, message: 'Integration not found.' };

    const service = type === 'rally' ? rallyService : workdayService;
    const result = await service.testConnection(config);

    setIntegrations((prev) =>
      prev.map((i) =>
        i.type === type
          ? {
              ...i,
              connectionStatus: result.success ? 'connected' : 'error',
              errorMessage: result.success ? undefined : result.message,
            }
          : i
      )
    );

    return {
      success: result.success,
      message: result.message,
    };
  };

  const triggerIntegrationSync = async (type: 'rally' | 'workday') => {
    const config = integrations.find((i) => i.type === type);
    if (!config) return { success: false, message: 'Integration not found.', count: 0 };

    setIntegrations((prev) =>
      prev.map((i) => (i.type === type ? { ...i, connectionStatus: 'syncing' } : i))
    );

    const service = type === 'rally' ? rallyService : workdayService;
    const targetReports = users.filter((u) => u.role === 'employee' && u.status === 'active');
    const targetUserIds = targetReports.map((u) => u.id);

    const syncRes = await service.fetchTasks(config, targetUserIds);

    if (syncRes.success && syncRes.newTasks.length > 0) {
      setTasks((prev) => [...syncRes.newTasks, ...prev]);
      setIntegrations((prev) =>
        prev.map((i) =>
          i.type === type
            ? {
                ...i,
                connectionStatus: 'connected',
                lastSyncedAt: syncRes.timestamp,
                recordsCount: i.recordsCount + syncRes.tasksFetched,
              }
            : i
        )
      );
      setNotification({
        message: syncRes.message,
        type: 'success',
      });
      return { success: true, message: syncRes.message, count: syncRes.tasksFetched };
    } else {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.type === type
            ? {
                ...i,
                connectionStatus: 'error',
                errorMessage: syncRes.message,
              }
            : i
        )
      );
      setNotification({
        message: syncRes.message || 'Sync failed',
        type: 'error',
      });
      return { success: false, message: syncRes.message, count: 0 };
    }
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(SEED_USERS);
    setTasks(SEED_TASKS);
    setKpis(SEED_KPIS);
    setKpiResults(SEED_KPI_RESULTS);
    setIntegrations(SEED_INTEGRATIONS);
    setCurrentUser(SEED_USERS[1]); // Ahmed Naimabadi (Manager)
    setIsAuthenticated(false);
    setActiveView('dashboard');
    setSelectedEmployeeId(null);
    setSelectedManagerId(null);
    setSelectedReviewTaskId(null);
    setNotification({
      message: 'Reset all application data, users, tasks, and KPI hierarchy to default state.',
      type: 'info',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        switchUserById,
        isAdmin,
        isManager,
        isEmployee,
        activeView,
        setActiveView,
        selectedEmployeeId,
        setSelectedEmployeeId,
        selectedManagerId,
        setSelectedManagerId,
        selectedReviewTaskId,
        setSelectedReviewTaskId,
        openTaskReview,
        period,
        setPeriod,
        users,
        tasks,
        kpis,
        kpiResults,
        integrations,
        addUser,
        updateUser,
        reassignManager,
        promoteToManager,
        demoteToEmployee,
        toggleUserStatus,
        addTask,
        updateTask,
        deleteTask,
        approveTask,
        addKpiToTask,
        removeKpiFromTask,
        setTaskKpis,
        updateTaskReview,
        managerSignOffReview,
        addKpi,
        updateKpi,
        deleteKpi,
        submitKpiEvaluation,
        updateIntegrationConfig,
        testIntegrationConnection,
        triggerIntegrationSync,
        performanceSummaries,
        getDirectReports,
        canAccessUser,
        resetToDefaults,
        notification,
        setNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
