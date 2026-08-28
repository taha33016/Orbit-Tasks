export type UserRole = 'admin' | 'manager' | 'member';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ProjectDates {
  startDate?: string;
  dueDate?: string;
}

export interface TaskAuditEvent {
  id: string;
  taskId: string;
  actorId: string;
  action: 'created' | 'assigned' | 'unassigned' | 'status_changed' | 'deadline_changed' | 'updated' | 'completed';
  from?: string;
  to?: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface TaskDates {
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  estimatedMinutes?: number;
}

export interface TaskAssignmentPeriod {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: string;
  unassignedAt?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
