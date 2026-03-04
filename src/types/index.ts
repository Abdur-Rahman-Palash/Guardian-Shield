export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DashboardStats {
  totalUsers: number;
  activeReports: number;
  resolvedIssues: number;
  systemHealth: number;
}

export interface Report {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Guardian Shield specific types
export interface RiskySite {
  id: string;
  domain: string;
  category: 'porn' | 'gambling' | 'other';
  active: boolean;
}

export interface Alert {
  id: string;
  childName: string;
  url: string;
  domain: string;
  screenshot?: string;
  timestamp: Date;
  guardianPhone: string;
}

export interface GuardianUser {
  id: string;
  email: string;
  children: string[];
  guardianPhone: string;
  plan: 'free' | 'family' | 'school';
}
