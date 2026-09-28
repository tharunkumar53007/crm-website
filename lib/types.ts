export type Activity = {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  time: string;
  user: string;
};

export type Lead = {
  id: number;
  name: string;
  company: string;
  score: number;
  status: 'Qualified' | 'In Review' | 'Proposal';
  value: number;
};

export type Deal = {
  id: number;
  customer: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed';
  probability: number;
  owner: string;
};

export type Task = {
  id: number;
  title: string;
  due: string;
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Done';
};

export type CRMData = {
  stats: {
    newLeads: number;
    totalRevenue: string;
    winRate: number;
    activeDeals: number;
  };
  pipeline: Array<{
    label: string;
    value: number;
    percentage: number;
  }>;
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
};
