
export enum ViewType {
  OVERVIEW = 'overview',
  PROGRESS = 'progress',
  FINANCE = 'finance',
  CONTRACTORS = 'contractors',
  DOCUMENTS = 'documents',
  SETTINGS = 'settings'
}

export interface TimelineStep {
  id: string;
  label: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
  progress?: number;
  contractor?: string;
  estimate?: string;
}

export interface DailyPhoto {
  id: string;
  url: string;
  timestamp: string;
  aiTag: string;
  aiColor: string;
}

export interface FinanceItem {
  id: string;
  date: string;
  name: string;
  vendor: string;
  quantity: string;
  unitPrice: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface AILog {
  id: string;
  type: string;
  time: string;
  content: string;
}
