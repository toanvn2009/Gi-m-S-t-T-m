
export enum ViewType {
  OVERVIEW = 'overview',
  PROGRESS = 'progress',
  FINANCE = 'finance',
  CONTRACTORS = 'contractors',
  DOCUMENTS = 'documents',
  ISSUES = 'issues',
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
  phase?: string; // Tên giai đoạn thi công, VD: "Đổ sàn T1"
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

export interface Contractor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  rating: number; // 1-5
  status: 'active' | 'completed' | 'paused';
  notes?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  category: 'contract' | 'permit' | 'blueprint' | 'invoice' | 'photo' | 'other';
  url?: string; // base64 or link
  fileSize?: string;
  uploadDate: string;
  notes?: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  location: string; // VD: "Tường phòng khách T1", "Sàn T2"
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  assignee?: string; // Người chịu trách nhiệm sửa
  photoUrl?: string; // Ảnh chụp lỗi (base64)
  createdDate: string;
  resolvedDate?: string;
}
