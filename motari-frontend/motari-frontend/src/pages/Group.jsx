import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { UserPlus, Upload, Trash2, Users, Download } from 'lucide-react';

const TABS = [
  { id: 'members', label: 'My Motaris', icon: <Users size={15} /> },
  { id: 'add', label: 'Add Motari', icon: <UserPlus size={15} /> },
  { id: 'excel', label: 'Upload Excel', icon: <Upload size={15} /> },
];

export default function Group() {
  const [tab, setTab] = useState('members');
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add form
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', plateNumber: '' });

  // Excel
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const fileRef = useRef();

  const fetchData = async () => {
    try {
      const [g, m] = await Promise.all([API.get('/leader/group'), API.get('/leader/motaris')]);
      setGroup(g.data);
      setMembers(m.data);
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await API.post('/leader/group', { name: groupName });
      setGroup(res.data);
      setMsg({ type: 'success', text: `Group "${res.data.name}" created!` });
      setGroupName('');
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' }); }
    setLoading(false);
  };

  const handleAddMotari = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await API.post('/leader/motaris', form);
      setMsg({ type: 'success', text: res.data.message });
      setForm({ fullName: '', phone: '', email: '', plateNumber: '' });
      fetchData();
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' }); }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg({ type: 'error', text: 'Please select an Excel file' });
    setLoading(true); setMsg(null); setUploadResult(null);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await API.post('/leader/motaris/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(res.data.results);
      setMsg({ type: 'success', text: res.data.message });
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchData();
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.message || 'Upload failed' }); }
    setLoading(false);
  };

  const handleRemove = async (motariId, name) => {
    if (!window.confirm(`Remove ${name} from your group?`)) return;
    try {
      await API.delete(`/leader/motaris/${motariId}`);
      setMembers(prev => prev.filter(m => m.motariId !== motariId));
      setMsg({ type: 'success', text: `${name} removed from group.` });
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' }); }
  };

  const downloadTemplate = () => {
    const csv = 'Full Name,Phone,Email,Plate Number\nJean Pierre,0780000001,jean@example.com,RAB 123A\nAmina Uwase,0780000002,,RAC 456B';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'motari_template.csv'; a.click();
  };

  return (
    <div>
      <h2 className="page-title">Group Management</h2>

      {/* No group yet */}
      {!group && (
        <div className="card" style={{ maxWidth: 480, marginBottom: 24 }}>
          <h3>Create Your Group First</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            You need a group before adding Motaris.
          </p>
          {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}
          <form onSubmit={handleCreateGroup}>
            <div className="form-section">
              <label className="form-label">Group / Cooperative Name</label>
              <input className="input" placeholder="e.g. Nyabugogo Cooperative" value={groupName} onChange={e => setGroupName(e.target.value)} required />
            </div>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Group'}</button>
          </form>
        </div>
      )}

      {group && (
        <>
          {/* Group info banner */}
          <div className="day-banner" style={{ marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{group.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Your cooperative group</div>
            </div>
            <div className="day-banner-stats">
              <div className="day-stat"><span>{members.length}</span>Total Motaris</div>
              <div className="day-stat green"><span>{members.filter(m => m.status === 'ACTIVE').length}</span>Active</div>
            </div>
          </div>

          {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 16 }}>{msg.text}</div>}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {TABS.map(t => (
              <button key={t.id} className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* MEMBERS LIST */}
          {tab === 'members' && (
            <div className="card">
              <h3><Users size={16} style={{ marginRight: 6 }} />Motaris in Your Group ({members.length})</h3>
              {members.length === 0 ? (
                <div className="empty-state">
                  <div className="icon"><Users size={40} /></div>
                  <p>No Motaris yet. Add them manually or upload an Excel file.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Verified</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {members.map((m, i) => (
                        <tr key={m.id}>
                          <td>{i + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="motari-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                                {m.motari?.fullName?.[0]}
                              </div>
                              {m.motari?.fullName}
                            </div>
                          </td>
                          <td>{m.motari?.phone}</td>
                          <td>{m.motari?.email || '—'}</td>
                          <td>
                            <span className={`badge ${m.motari?.isVerified ? 'badge-green' : 'badge-orange'}`}>
                              {m.motari?.isVerified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleRemove(m.motariId, m.motari?.fullName)}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ADD MANUALLY */}
          {tab === 'add' && (
            <div className="card" style={{ maxWidth: 560 }}>
              <h3><UserPlus size={16} style={{ marginRight: 8 }} />Add Motari Manually</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                A default password <strong>Moto@1234</strong> will be set. The Motari can change it after first login.
              </p>
              <form onSubmit={handleAddMotari}>
                <div className="form-row">
                  <div className="form-section">
                    <label className="form-label">Full Name *</label>
                    <input className="input" placeholder="Jean Pierre" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                  </div>
                  <div className="form-section">
                    <label className="form-label">Phone Number *</label>
                    <input className="input" placeholder="078..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-section">
                    <label className="form-label">Email (optional)</label>
                    <input className="input" placeholder="jean@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="form-section">
                    <label className="form-label">Plate Number (optional)</label>
                    <input className="input" placeholder="RAB 123A" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })} />
                  </div>
                </div>
                <button className="btn btn-primary" disabled={loading}>
                  <UserPlus size={15} style={{ marginRight: 6 }} />
                  {loading ? 'Adding...' : 'Add Motari'}
                </button>
              </form>
            </div>
          )}

          {/* UPLOAD EXCEL */}
          {tab === 'excel' && (
            <div className="card" style={{ maxWidth: 560 }}>
              <h3><Upload size={16} style={{ marginRight: 8 }} />Upload Excel / CSV File</h3>

              <div className="alert alert-info" style={{ marginBottom: 16 }}>
                Your file must have these columns:<br />
                <strong>Full Name, Phone, Email, Plate Number</strong><br />
                Email and Plate Number are optional.
              </div>

              <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={downloadTemplate}>
                <Download size={13} style={{ marginRight: 6 }} />Download Template (CSV)
              </button>

              <form onSubmit={handleUpload}>
                <div className="form-section">
                  <label className="form-label">Select Excel or CSV file</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="input"
                    onChange={e => setFile(e.target.files[0])}
                    required
                  />
                </div>
                <button className="btn btn-primary" disabled={loading}>
                  <Upload size={15} style={{ marginRight: 6 }} />
                  {loading ? 'Uploading...' : 'Upload & Import'}
                </button>
              </form>

              {uploadResult && (
                <div style={{ marginTop: 16 }}>
                  <div className="alert alert-success">Added: {uploadResult.added} · Skipped: {uploadResult.skipped}</div>
                  {uploadResult.errors?.length > 0 && (
                    <div className="alert alert-error" style={{ marginTop: 8 }}>
                      {uploadResult.errors.map((e, i) => <div key={i}>{e}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
