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

export interface User {
  id: string;
  email: string;
  children: string[];
  guardianPhone: string;
  plan: 'free' | 'family' | 'school';
}
