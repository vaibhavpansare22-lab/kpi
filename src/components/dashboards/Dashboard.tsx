import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';
import { EmployeeDetailView } from './EmployeeDetailView';

export const Dashboard: React.FC = () => {
  const { isAdmin, isManager, isEmployee, selectedEmployeeId } = useApp();

  if (selectedEmployeeId) {
    return <EmployeeDetailView />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isManager) {
    return <ManagerDashboard />;
  }

  return <EmployeeDashboard />;
};
