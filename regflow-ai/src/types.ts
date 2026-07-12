export interface Circular {
  id: string;
  title: string;
  date: string;
  referenceNumber: string;
  summary: string;
  content: string;
}

export interface Obligation {
  id: string;
  circularId: string;
  circularTitle: string;
  clause: string;
  requirement: string;
  originalQuote: string;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  confidence: number;
  status: 'Draft' | 'Approved' | 'Rejected';
  explanation: string;
}

export interface ComplianceTask {
  id: string;
  obligationId: string;
  title: string;
  description: string;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  evidenceName: string | null;
  evidenceContent: string | null;
  evidenceStatus: 'Unsubmitted' | 'PendingReview' | 'Verified' | 'Rejected';
  evidenceReasoning: string | null;
  evidenceConfidence: number | null;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: 'System' | 'AI Agent' | 'Compliance Officer' | 'Department Staff';
  action: string;
  details: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
