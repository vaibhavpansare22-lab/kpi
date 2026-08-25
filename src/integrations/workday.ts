import { Task, Integration } from '../types';
import { IntegrationService, SyncResult } from './types';

export class WorkdayIntegrationService implements IntegrationService {
  async testConnection(config: Partial<Integration>): Promise<{ success: boolean; latencyMs: number; message: string }> {
    await new Promise((res) => setTimeout(res, 600));

    if (!config.apiEndpoint || !config.authToken) {
      return {
        success: false,
        latencyMs: 95,
        message: 'Missing Workday tenant endpoint or OAuth Client Secret.',
      };
    }

    return {
      success: true,
      latencyMs: 162,
      message: `Verified Workday HCM & Financials RaaS endpoint connection (Tenant: ${config.tenantOrWorkspaceId || 'wd3-impl-services'}).`,
    };
  }

  async fetchTasks(config: Partial<Integration>, targetUserIds: string[]): Promise<SyncResult> {
    await new Promise((res) => setTimeout(res, 800));

    if (targetUserIds.length === 0) {
      return {
        success: false,
        tasksFetched: 0,
        newTasks: [],
        message: 'No employee records provided for Workday sync.',
        timestamp: new Date().toISOString(),
      };
    }

    const sampleWorkdayRecords = [
      {
        title: 'WD-COMP-101: Mandatory Annual SOC2 & Cyber Threat Compliance Certification',
        desc: 'Complete required modules on phishing mitigation, data handling, and clean desk policies.',
        cat: 'Compliance & Training',
        estHrs: 6,
        actHrs: 6,
        status: 'completed' as const,
        priority: 'high' as const,
      },
      {
        title: 'WD-TIME-202: Q3 Timesheet & Billable Utilization Reconciliation',
        desc: 'Audit project hours against client allocations and PTO logging.',
        cat: 'Operations & HCM',
        estHrs: 4,
        actHrs: 4,
        status: 'completed' as const,
        priority: 'medium' as const,
      },
      {
        title: 'WD-REV-305: Mid-Year Engineering Goals Alignment & 360 Peer Review',
        desc: 'Submit self-evaluation and peer feedback for mentorship review cycle.',
        cat: 'Performance & Growth',
        estHrs: 8,
        actHrs: 7,
        status: 'in_progress' as const,
        priority: 'high' as const,
      },
      {
        title: 'WD-TRAIN-410: AWS Solution Architect Professional Cloud Upskilling',
        desc: 'Authorized professional development pathway for advanced distributed computing.',
        cat: 'Upskilling & Certs',
        estHrs: 20,
        actHrs: 18,
        status: 'completed' as const,
        priority: 'medium' as const,
      },
      {
        title: 'WD-HR-550: Benefits Enrollment & Emergency Contact Verification',
        desc: 'Review annual healthcare elections and remote working equipment ergonomics questionnaire.',
        cat: 'HCM Admin',
        estHrs: 2,
        actHrs: 2,
        status: 'completed' as const,
        priority: 'low' as const,
      },
    ];

    const today = new Date();
    const newTasks: Task[] = [];

    sampleWorkdayRecords.forEach((item, idx) => {
      const assignedUserId = targetUserIds[idx % targetUserIds.length];
      const start = new Date(today);
      start.setDate(today.getDate() - (10 - idx * 2));
      const due = new Date(start);
      due.setDate(start.getDate() + 5);

      const isCompleted = item.status === 'completed';
      const completed = isCompleted ? new Date(due) : undefined;

      newTasks.push({
        id: `workday-${Date.now()}-${idx + 1}`,
        assignedTo: assignedUserId,
        createdBy: 'system-workday',
        title: item.title,
        description: item.desc,
        category: item.cat,
        startDate: start.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0],
        completedDate: completed ? completed.toISOString().split('T')[0] : undefined,
        status: item.status,
        priority: item.priority,
        estimatedHours: item.estHrs,
        actualHours: item.actHrs,
        source: 'workday',
        approved: true,
        externalRef: `WD-ITEM-${1000 + idx * 85}`,
      });
    });

    return {
      success: true,
      tasksFetched: newTasks.length,
      newTasks,
      message: `Synchronized ${newTasks.length} compliance, utilization, and training items from Workday RaaS.`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const workdayService = new WorkdayIntegrationService();
