import { Task, Integration } from '../types';

export interface SyncResult {
  success: boolean;
  tasksFetched: number;
  newTasks: Task[];
  message: string;
  timestamp: string;
}

export interface IntegrationService {
  testConnection(config: Partial<Integration>): Promise<{ success: boolean; latencyMs: number; message: string }>;
  fetchTasks(config: Partial<Integration>, targetUserIds: string[]): Promise<SyncResult>;
}
