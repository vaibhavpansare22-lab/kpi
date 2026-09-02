import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './components/dashboards/Dashboard';
import { OrgChart } from './components/org/OrgChart';
import { TaskList } from './components/tasks/TaskList';
import { TaskReviewPage } from './components/tasks/TaskReviewPage';
import { KpiListView } from './components/kpis/KpiListView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { EmployeeDetailView } from './components/dashboards/EmployeeDetailView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeView, selectedEmployeeId } = useApp();

  // If user is not logged in, show the Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (selectedEmployeeId || activeView === 'employee_detail') {
      return <EmployeeDetailView />;
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'task_review':
        return <TaskReviewPage />;
      case 'kpis':
        return <KpiListView />;
      case 'org':
        return <OrgChart />;
      case 'integrations':
        return <IntegrationsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100/70 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Role / User Switcher, Period Selector, and Logout */}
        <Header />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
