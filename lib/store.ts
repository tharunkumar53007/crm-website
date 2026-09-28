const initialData = {
  stats: {
    newLeads: 184,
    totalRevenue: '$468.2K',
    winRate: 68,
    activeDeals: 28,
  },
  pipeline: [
    { label: 'Qualified', value: 42, percentage: 82 },
    { label: 'Proposal', value: 31, percentage: 68 },
    { label: 'Negotiation', value: 18, percentage: 46 },
    { label: 'Closed', value: 11, percentage: 26 },
  ],
  leads: [
    { id: 1, name: 'Ava Patel', company: 'Northwind', score: 94, status: 'Qualified', value: 32000 },
    { id: 2, name: 'Leo Martins', company: 'Summit Labs', score: 87, status: 'In Review', value: 24000 },
    { id: 3, name: 'Nina Brooks', company: 'Blue Harbor', score: 91, status: 'Proposal', value: 41000 },
  ],
  deals: [
    { id: 1, customer: 'Northwind', value: 32000, stage: 'Discovery', probability: 82, owner: 'Priya' },
    { id: 2, customer: 'Summit Labs', value: 24000, stage: 'Proposal', probability: 68, owner: 'Carlos' },
    { id: 3, customer: 'Blue Harbor', value: 41000, stage: 'Negotiation', probability: 46, owner: 'Nora' },
    { id: 4, customer: 'Aster', value: 18500, stage: 'Closed', probability: 92, owner: 'David' },
  ],
  tasks: [
    { id: 1, title: 'Follow up with Northwind legal', due: 'Today', assignee: 'Priya', status: 'In Progress' },
    { id: 2, title: 'Prepare proposal deck for Blue Harbor', due: 'Tomorrow', assignee: 'Nora', status: 'Pending' },
    { id: 3, title: 'Schedule onboarding call', due: 'Friday', assignee: 'Alex', status: 'Done' },
  ],
  activities: [
    { id: 1, type: 'call', title: 'Called Summit Labs about pricing', time: '10 mins ago', user: 'Carlos' },
    { id: 2, type: 'email', title: 'Sent onboarding checklist to Northwind', time: '42 mins ago', user: 'Priya' },
    { id: 3, type: 'meeting', title: 'Met with Blue Harbor team', time: '2 hours ago', user: 'Nora' },
  ],
};

let crmData = structuredClone(initialData);

export function getCRMData() {
  return structuredClone(crmData);
}

export function createLead(lead: {
  name: string;
  company: string;
  email: string;
  score: number;
  status: string;
  value: number;
}) {
  const nextLead = {
    id: Date.now(),
    name: lead.name,
    company: lead.company,
    score: lead.score,
    status: lead.status as Lead['status'],
    value: lead.value,
  };

  crmData.leads.unshift(nextLead);
  crmData.stats.newLeads += 1;
  return nextLead;
}

export function updateDealStatus(id: number, stage: Deal['stage']) {
  const deal = crmData.deals.find((item) => item.id === id);
  if (!deal) return null;

  deal.stage = stage;
  deal.probability = stage === 'Closed' ? 92 : stage === 'Negotiation' ? 64 : stage === 'Proposal' ? 68 : 82;
  return deal;
}

export type { Lead, Deal, Task, Activity } from './types';
