export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  slaStatus: 'open' | 'due-today' | 'due-next' | 'overdue';
  slaDueDate?: string;
  owner: {
    id: string;
    name: string;
    initials: string;
  };
  updatedAt: string;
  status: 'Open' | 'Waiting on Customer' | 'Ready for Approval' | 'Closed';
  customer?: string;
  accountNumber?: string;
  sensitivity?: 'Verified' | 'Unverified';
}

export interface CaseFilters {
  status: string[];
  sla: string[];
  owner: string[];
  sensitivity: string[];
}

export interface CaseStats {
  open: number;
  closed: number;
  overdue: number;
}
