import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Check, X, UserPlus } from 'lucide-react';
import API from '../api/axios';

const TABS = ['Leaders', 'Users', 'Rides', 'Groups', 'Payments'];

const AdminManage = () => {
  const [tab, setTab] = useState('Leaders');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [msg, setMsg] = useState(null);

  // Add leader form
  const [leaderForm, setLeaderForm] = useState({ fullName: '', email: '', phone: '', cooperativeName: '' });
  const [addingLeader, setAddingLeader] = useState(false);
  const [newLeaderCreds, setNewLeaderCreds] = useState(null);

  const endpoints = { Leaders: '/admin/leaders', Users: '/admin/users', Rides: '/admin/rides', Groups: '/admin/groups', Payments: '/admin/payments' };
  const deleteEndpoints = { Leaders: '/admin/leaders', Users: '/admin/users', Rides: '/admin/rides', Groups: '/admin/groups' };

  useEffect(() => {
    setLoading(true); setEditId(null); setMsg(null); setNewLeaderCreds(null);
    API.get(endpoints[tab]).then(r => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false));
  }, [tab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await API.delete(`${deleteEndpoints[tab]}/${id}`);
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item) => { setEditId(item.id); setEditData({ fullName: item.fullName, email: item.email, role: item.role, phone: item.phone }); };

  const handleSave = async (id) => {
    const updated = await API.put(`/admin/users/${id}`, editData);
    setData(prev => prev.map(item => item.id === id ? updated.data : item));
    setEditId(null);
  };

  const handleAddLeader = async (e) => {
    e.preventDefault();
    setAddingLeader(true); setMsg(null); setNewLeaderCreds(null);
    try {
      const res = await API.post('/admin/leaders', leaderForm);
      setMsg({ type: 'success', text: res.data.message });
      setNewLeaderCreds({ ...res.data.leader, tempPassword: res.data.tempPassword, cooperative: leaderForm.cooperativeName });
      setLeaderForm({ fullName: '', email: '', phone: '', cooperativeName: '' });
      const r = await API.get('/admin/leaders');
      setData(r.data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add leader' });
    }
    setAddingLeader(false);
  };

  const renderLeaders = () => (
    <div>
      {/* Add leader form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3><UserPlus size={16} style={{ marginRight: 8 }} />Add New Leader</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Only admins can add group leaders. A temporary password will be generated.
        </p>
        {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        {/* Show credentials after creation */}
        {newLeaderCreds && (
          <div className="alert alert-success" style={{ marginBottom: 16 }}>
            <strong>✅ Leader Created Successfully!</strong><br />
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <div>👤 Name: <strong>{newLeaderCreds.fullName}</strong></div>
              <div>📞 Phone: <strong>{newLeaderCreds.phone}</strong></div>
              {newLeaderCreds.email && <div>📧 Email: <strong>{newLeaderCreds.email}</strong></div>}
              {newLeaderCreds.cooperative && <div>🏢 Cooperative: <strong>{newLeaderCreds.cooperative}</strong></div>}
              <div>🔑 Temp Password: <strong style={{ color: 'var(--danger)' }}>{newLeaderCreds.tempPassword}</strong></div>
              <div style={{ marginTop: 6, color: 'var(--warning)', fontSize: 12 }}>⚠️ Share these credentials with the leader. They must change the password on first login.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleAddLeader}>
          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Full Name *</label>
              <input className="input" placeholder="Jean Pierre" value={leaderForm.fullName} onChange={e => setLeaderForm({ ...leaderForm, fullName: e.target.value })} required />
            </div>
            <div className="form-section">
              <label className="form-label">Phone Number *</label>
              <input className="input" placeholder="078..." value={leaderForm.phone} onChange={e => setLeaderForm({ ...leaderForm, phone: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Email (optional)</label>
              <input className="input" placeholder="leader@example.com" value={leaderForm.email} onChange={e => setLeaderForm({ ...leaderForm, email: e.target.value })} />
            </div>
            <div className="form-section">
              <label className="form-label">Cooperative Name (optional)</label>
              <input className="input" placeholder="e.g. Nyabugogo Cooperative" value={leaderForm.cooperativeName} onChange={e => setLeaderForm({ ...leaderForm, cooperativeName: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" disabled={addingLeader}>
            <UserPlus size={14} style={{ marginRight: 6 }} />
            {addingLeader ? 'Adding...' : 'Add Leader'}
          </button>
        </form>
      </div>

      {/* Leaders list */}
      <div className="card">
        <h3>All Leaders ({data.length})</h3>
        {data.length === 0 ? (
          <div className="empty-state"><div className="icon">👑</div><p>No leaders yet.</p></div>
        ) : (
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Cooperative</th><th>Verified</th><th>Action</th></tr></thead>
            <tbody>
              {data.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="motari-avatar" style={{ width: 30, height: 30, fontSize: 12 }}>{l.fullName?.[0]}</div>
                    {l.fullName}
                  </div></td>
                  <td>{l.phone}</td>
                  <td>{l.email || '—'}</td>
                  <td>{l.ledGroup?.name || '—'}</td>
                  <td><span className={`badge ${l.isVerified ? 'badge-green' : 'badge-orange'}`}>{l.isVerified ? 'Yes' : 'No'}</span></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <table className="admin-table">
      <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Verified</th><th>Actions</th></tr></thead>
      <tbody>
        {data.map((u, i) => (
          <tr key={u.id}>
            <td>{i + 1}</td>
            <td>{editId === u.id ? <input value={editData.fullName} onChange={e => setEditData({ ...editData, fullName: e.target.value })} className="admin-input" /> : u.fullName}</td>
            <td>{editId === u.id ? <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} className="admin-input" /> : u.email}</td>
            <td>{editId === u.id ? <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="admin-input" /> : u.phone}</td>
            <td>{editId === u.id
              ? <select value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} className="admin-input">
                  {['PASSENGER', 'MOTARI', 'LEADER', 'ADMIN'].map(r => <option key={r}>{r}</option>)}
                </select>
              : <span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role}</span>}
            </td>
            <td><span className={`badge ${u.isVerified ? 'badge-green' : 'badge-red'}`}>{u.isVerified ? 'Yes' : 'No'}</span></td>
            <td style={{ display: 'flex', gap: 6 }}>
              {editId === u.id
                ? <><button className="btn btn-sm btn-primary" onClick={() => handleSave(u.id)}><Check size={14} /></button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}><X size={14} /></button></>
                : <><button className="btn btn-sm btn-secondary" onClick={() => handleEdit(u)}><Edit size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}><Trash2 size={14} /></button></>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderRides = () => (
    <table className="admin-table">
      <thead><tr><th>#</th><th>ID</th><th>Status</th><th>From</th><th>To</th><th>Fare</th><th>Actions</th></tr></thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={r.id}>
            <td>{i + 1}</td><td style={{ fontSize: 11 }}>{r.id?.toString().slice(0, 8)}...</td>
            <td><span className="badge badge-green">{r.status}</span></td>
            <td>{r.pickup}</td><td>{r.destination}</td><td>{r.price} RWF</td>
            <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderGroups = () => (
    <table className="admin-table">
      <thead><tr><th>#</th><th>Name</th><th>Actions</th></tr></thead>
      <tbody>
        {data.map((g, i) => (
          <tr key={g.id}>
            <td>{i + 1}</td><td>{g.name}</td>
            <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}><Trash2 size={14} /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPayments = () => (
    <table className="admin-table">
      <thead><tr><th>#</th><th>ID</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={p.id}>
            <td>{i + 1}</td><td style={{ fontSize: 11 }}>{p.id?.toString().slice(0, 8)}...</td>
            <td>{p.amount} RWF</td>
            <td><span className="badge badge-green">{p.status}</span></td>
            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renders = { Leaders: renderLeaders, Users: renderUsers, Rides: renderRides, Groups: renderGroups, Payments: renderPayments };

  return (
    <div>
      <h2 className="page-title">System Management</h2>
      <div className="tab-bar" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        {loading ? <div className="loading">Loading...</div> : data.length === 0 && tab !== 'Leaders' ? <div className="empty-state"><p>No {tab.toLowerCase()} found.</p></div> : renders[tab]()}
      </div>
    </div>
  );
};

export default AdminManage;
