'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, CRMData, Deal, Lead, Task } from '@/lib/types';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function CRMDashboard() {
  const [data, setData] = useState<CRMData | null>(null);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    score: '82',
    value: '18000',
    status: 'In Review',
  });

  const fetchData = async () => {
    const res = await fetch('/api/crm');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pipelineMetrics = useMemo(() => {
    if (!data) return [] as Array<{ label: string; value: number; percentage: number; }>; 
    return data.pipeline;
  }, [data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        company: form.company,
        email: form.email,
        score: Number(form.score),
        status: form.status,
        value: Number(form.value),
      }),
    });

    setForm({ name: '', company: '', email: '', score: '82', value: '18000', status: 'In Review' });
    await fetchData();
  };

  const handleDealStage = async (dealId: number, stage: Deal['stage']) => {
    await fetch('/api/deals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealId, stage }),
    });
    await fetchData();
  };

  if (!data) {
    return <div className="page-shell"><div className="inner">Loading CRM data...</div></div>;
  }

  return (
    <div className="page-shell">
      <div className="inner">
        <header className="topbar">
          <div>
            <div className="muted">CRM workspace</div>
            <h1>PulseCRM</h1>
          </div>
          <div className="topbar-actions">
            <input className="search-box" placeholder="Search contacts, deals..." />
            <button className="filter-btn">Filters</button>
            <button className="primary-btn">+ New Deal</button>
          </div>
        </header>

        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">New leads</div>
            <div className="metric-value">{data.stats.newLeads}</div>
            <div className="metric-change">+12.4% this month</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Revenue</div>
            <div className="metric-value">{data.stats.totalRevenue}</div>
            <div className="metric-change">+18.2% vs last month</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Win rate</div>
            <div className="metric-value">{data.stats.winRate}%</div>
            <div className="metric-change">+4.1% improvement</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active deals</div>
            <div className="metric-value">{data.stats.activeDeals}</div>
            <div className="metric-change">9 urgent follow-ups</div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Sales pipeline</h2>
              <button className="secondary-btn">View report</button>
            </div>
            {pipelineMetrics.map((item) => (
              <div key={item.label}>
                <div className="kpi-row">
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </section>

          <aside className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Tasks</h2>
              <button className="secondary-btn">Create task</button>
            </div>
            <div className="task-list">
              {data.tasks.map((task: Task) => (
                <div key={task.id} className="task-card">
                  <div className="task-card-header">
                    <strong>{task.title}</strong>
                    <span className={`badge ${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'info' : 'warning'}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="muted">Due {task.due}</div>
                  <div className="muted">Assigned to {task.assignee}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="app-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Hot leads</h2>
              <button className="secondary-btn">See all</button>
            </div>
            <div className="leads-list">
              {data.leads.map((lead: Lead) => (
                <div key={lead.id} className="lead-card">
                  <div className="lead-card-header">
                    <strong>{lead.name}</strong>
                    <span className={`badge ${lead.status === 'Qualified' ? 'success' : lead.status === 'In Review' ? 'warning' : 'info'}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="muted">{lead.company}</div>
                  <div className="kpi-row">
                    <span>Lead score</span>
                    <strong>{lead.score}</strong>
                  </div>
                  <div className="kpi-row">
                    <span>Potential value</span>
                    <strong>{currency.format(lead.value)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Pipeline deals</h2>
              <button className="secondary-btn">Update</button>
            </div>
            <div className="pipeline-list">
              {data.deals.map((deal: Deal) => (
                <div key={deal.id} className="pipeline-card">
                  <div className="pipeline-card-header">
                    <strong>{deal.customer}</strong>
                    <span className="badge info">{deal.stage}</span>
                  </div>
                  <div className="kpi-row">
                    <span>Value</span>
                    <strong>{currency.format(deal.value)}</strong>
                  </div>
                  <div className="kpi-row">
                    <span>Probability</span>
                    <strong>{deal.probability}%</strong>
                  </div>
                  <div className="form-row">
                    <select
                      className="select"
                      value={deal.stage}
                      onChange={(event) => handleDealStage(deal.id, event.target.value as Deal['stage'])}
                    >
                      <option value="Discovery">Discovery</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="app-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Add new lead</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Company</label>
                  <input
                    className="input"
                    value={form.company}
                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                    placeholder="Northwind"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="jane@northwind.com"
                  />
                </div>
                <div className="form-field">
                  <label>Lead score</label>
                  <input
                    className="input"
                    type="number"
                    value={form.score}
                    onChange={(event) => setForm({ ...form, score: event.target.value })}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="form-field">
                  <label>Expected value</label>
                  <input
                    className="input"
                    type="number"
                    value={form.value}
                    onChange={(event) => setForm({ ...form, value: event.target.value })}
                    min={0}
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    className="select"
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value })}
                  >
                    <option value="Qualified">Qualified</option>
                    <option value="In Review">In Review</option>
                    <option value="Proposal">Proposal</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ marginTop: 18 }}>
                <button className="primary-btn" type="submit">Save lead</button>
                <button className="secondary-btn" type="button">Cancel</button>
              </div>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent activity</h2>
            </div>
            <div className="activity-list">
              {data.activities.map((activity: Activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot" />
                  <div>
                    <div><strong>{activity.title}</strong></div>
                    <div className="muted">{activity.user} • {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
