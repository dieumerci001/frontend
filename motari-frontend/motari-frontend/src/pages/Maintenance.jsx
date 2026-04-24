import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [motoId, setMotoId] = useState('');
  const [form, setForm] = useState({ type: '', cost: '', description: '', nextServiceDate: '', motoId: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!motoId) return;
    try {
      const res = await API.get(`/maintenance/${motoId}`);
      setRecords(res.data);
    } catch { setRecords([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      await API.post('/maintenance', form);
      setMessage({ type: 'success', text: 'Maintenance record added!' });
      setForm({ type: '', cost: '', description: '', nextServiceDate: '', motoId: '' });
      if (motoId === form.motoId) fetchRecords();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add record' });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">Maintenance Tracker 🛠️</h2>

      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="grid-2">
        <div className="card">
          <h3>Add Service Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Service Type</label>
                <input className="input" placeholder="e.g. Oil Change" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
              </div>
              <div className="form-section">
                <label className="form-label">Cost (RWF)</label>
                <input className="input" type="number" placeholder="e.g. 5000" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required />
              </div>
            </div>
            <div className="form-section">
              <label className="form-label">Description</label>
              <input className="input" placeholder="Details about the service" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Moto ID</label>
                <input className="input" type="number" placeholder="Your moto ID" value={form.motoId} onChange={e => setForm({ ...form, motoId: e.target.value })} required />
              </div>
              <div className="form-section">
                <label className="form-label">Next Service Date</label>
                <input className="input" type="date" value={form.nextServiceDate} onChange={e => setForm({ ...form, nextServiceDate: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Saving...' : 'Add Record'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>View History</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input className="input" type="number" placeholder="Enter Moto ID" value={motoId} onChange={e => setMotoId(e.target.value)} />
            <button className="btn btn-secondary" onClick={fetchRecords}>Search</button>
          </div>
          {records.length === 0 ? (
            <div className="empty-state"><div className="icon">🔧</div><p>No records found</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Type</th><th>Cost</th><th>Date</th></tr></thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id}>
                      <td>{r.type}</td>
                      <td>{Number(r.cost).toLocaleString()} RWF</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
