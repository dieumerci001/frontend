import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', location: '', date: '', district: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async () => {
    try {
      const res = await API.get('/meetings');
      setMeetings(res.data);
    } catch { }
  };

  useEffect(() => { fetchMeetings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      await API.post('/meetings', form);
      setMessage({ type: 'success', text: 'Meeting created successfully!' });
      setForm({ title: '', description: '', location: '', date: '', district: '' });
      fetchMeetings();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create meeting' });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">Meetings 📅</h2>

      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="grid-2">
        <div className="card">
          <h3>Schedule a Meeting</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label className="form-label">Title</label>
              <input className="input" placeholder="Meeting title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-section">
              <label className="form-label">Description</label>
              <textarea className="textarea" placeholder="What is this meeting about?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Location</label>
                <input className="input" placeholder="e.g. Nyabugogo Hall" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="form-section">
                <label className="form-label">District</label>
                <input className="input" placeholder="e.g. Gasabo" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
              </div>
            </div>
            <div className="form-section">
              <label className="form-label">Date & Time</label>
              <input className="input" type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating...' : 'Create Meeting'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>All Meetings ({meetings.length})</h3>
          {meetings.length === 0 ? (
            <div className="empty-state"><div className="icon">📅</div><p>No meetings yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {meetings.map(m => (
                <div key={m.id} style={{ padding: '14px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{m.title}</div>
                    <span className="badge badge-blue">{m.district || 'General'}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                    📍 {m.location} · 🗓️ {new Date(m.date).toLocaleString()}
                  </div>
                  {m.description && <div style={{ fontSize: 13, marginTop: 6 }}>{m.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meetings;
