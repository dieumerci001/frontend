import React, { useState } from 'react';
import API from '../api/axios';

const Analytics = () => {
  const [report, setReport] = useState(null);
  const [form, setForm] = useState({ totalRides: '', totalEarnings: '', fuelCost: '', period: 'week' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const res = await API.post('/analytics/report', form);
      setReport(res.data.report);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to generate report' });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">Analytics 📈</h2>

      {message && <div className={`alert alert-alert-error`}>{message.text}</div>}

      <div className="grid-2">
        <div className="card">
          <h3>Generate Report</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-section">
              <label className="form-label">Period</label>
              <select className="select" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Total Rides</label>
                <input className="input" type="number" placeholder="e.g. 20" value={form.totalRides} onChange={e => setForm({ ...form, totalRides: e.target.value })} />
              </div>
              <div className="form-section">
                <label className="form-label">Total Earnings (RWF)</label>
                <input className="input" type="number" placeholder="e.g. 25000" value={form.totalEarnings} onChange={e => setForm({ ...form, totalEarnings: e.target.value })} />
              </div>
            </div>
            <div className="form-section">
              <label className="form-label">Fuel Cost (RWF)</label>
              <input className="input" type="number" placeholder="e.g. 5000" value={form.fuelCost} onChange={e => setForm({ ...form, fuelCost: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Report Results</h3>
          {!report ? (
            <div className="empty-state"><div className="icon">📊</div><p>Fill the form and generate a report</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(report).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <strong>{typeof value === 'number' ? value.toLocaleString() : value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
