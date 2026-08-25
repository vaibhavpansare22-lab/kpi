import { Task, Integration } from '../types';
import { IntegrationService, SyncResult } from './types';

export class RallyIntegrationService implements IntegrationService {
  async testConnection(config: Partial<Integration>): Promise<{ success: boolean; latencyMs: number; message: string }> {
    // Simulate network handshake
    await new Promise((res) => setTimeout(res, 650));
    
    if (!config.apiEndpoint || !config.authToken) {
      return {
        success: false,
        latencyMs: 120,
        message: 'Missing API endpoint URL or Rally API Key.',
      };
    }

    return {
      success: true,
      latencyMs: 148,
      message: `Connected successfully to CA Agile Central / Rally (Workspace: ${config.tenantOrWorkspaceId || 'WS-4819'}).`,
    };
  }

  async fetchTasks(config: Partial<Integration>, targetUserIds: string[]): Promise<SyncResult> {
    await new Promise((res) => setTimeout(res, 850));

    if (targetUserIds.length === 0) {
      return {
        success: false,
        tasksFetched: 0,
        newTasks: [],
        message: 'No active team members provided for Rally synchronization.',
        timestamp: new Date().toISOString(),
      };
    }

    const sampleRallyStories = [
      {
        title: 'US-4029: Implement OAuth 2.0 PKCE Authorization Handshake',
        desc: 'Security hardening for API gateways and third-party partner integrations.',
        cat: 'Security & Auth',
        pts: 8,
        estHrs: 24,
        actHrs: 22,
        status: 'completed' as const,
        priority: 'high' as const,
      },
      {
        title: 'DE-1823: Fix race condition in async distributed message consumer',
        desc: 'Resolve intermittent duplicate event acknowledgments in Redis stream listener.',
        cat: 'Backend / Infra',
        pts: 5,
        estHrs: 16,
        actHrs: 18,
        status: 'completed' as const,
        priority: 'urgent' as const,
      },
      {
        title: 'US-4112: Design and benchmark PostgreSQL partitioning for audit logs',
        desc: 'Implement monthly table partitions and retention pruning cron scripts.',
        cat: 'Database & Perf',
        pts: 8,
        estHrs: 32,
        actHrs: 28,
        status: 'in_progress' as const,
        priority: 'medium' as const,
      },
      {
        title: 'US-4201: Implement end-to-end Cypress regression suites for Checkout flow',
        desc: 'Automate payment tokenization validation, webhook retries, and receipt generation.',
        cat: 'QA & Automation',
        pts: 5,
        estHrs: 20,
        actHrs: 12,
        status: 'in_progress' as const,
        priority: 'high' as const,
      },
      {
        title: 'US-4309: Multi-region Kubernetes ingress migration to Cloud Armor',
        desc: 'Upgrade ingress controllers and configure DDoS rate-limiting rules.',
        cat: 'DevOps & SRE',
        pts: 13,
        estHrs: 40,
        actHrs: 36,
        status: 'completed' as const,
        priority: 'urgent' as const,
      },
      {
        title: 'US-4388: Redesign team performance radar visualization and tokens',
        desc: 'Standardize Tailwind color scales and responsive typography ratios.',
        cat: 'Design System',
        pts: 3,
        estHrs: 12,
        actHrs: 10,
        status: 'completed' as const,
        priority: 'medium' as const,
      },
      {
        title: 'US-4420: OpenAPI 3.1 schema auto-generation for microservices',
        desc: 'Integrate Swagger UI and automated contract test harnesses.',
        cat: 'API Architecture',
        pts: 5,
        estHrs: 16,
        actHrs: 14,
        status: 'completed' as const,
        priority: 'medium' as const,
      },
    ];

    const today = new Date();
    const newTasks: Task[] = [];

    // Distribute among target user IDs
    sampleRallyStories.forEach((story, idx) => {
      const assignedUserId = targetUserIds[idx % targetUserIds.length];
      const start = new Date(today);
      start.setDate(today.getDate() - (14 - idx * 2));
      const due = new Date(start);
      due.setDate(start.getDate() + 7);

      const isCompleted = story.status === 'completed';
      const completed = isCompleted ? new Date(due) : undefined;
      if (completed) completed.setDate(due.getDate() - 1);

      newTasks.push({
        id: `rally-${Date.now()}-${idx + 1}`,
        assignedTo: assignedUserId,
        createdBy: 'system-rally',
        title: story.title,
        description: story.desc,
        category: story.cat,
        startDate: start.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0],
        completedDate: completed ? completed.toISOString().split('T')[0] : undefined,
        status: story.status,
        priority: story.priority,
        estimatedHours: story.estHrs,
        actualHours: story.actHrs,
        source: 'rally',
        approved: true,
        storyPoints: story.pts,
        externalRef: `RALLY-${4000 + idx * 77}`,
      });
    });

    return {
      success: true,
      tasksFetched: newTasks.length,
      newTasks,
      message: `Successfully ingested ${newTasks.length} user stories & defects from Rally project.`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const rallyService = new RallyIntegrationService();
