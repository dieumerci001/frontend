import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CalendarDays, MessageSquare, Megaphone, TrendingUp, BarChart2, Target, MapPin } from 'lucide-react';
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import API from '../../api/axios';

const attendanceData = [
  { week: 'W1', present: 18, absent: 2 }, { week: 'W2', present: 20, absent: 0 },
  { week: 'W3', present: 15, absent: 5 }, { week: 'W4', present: 19, absent: 1 },
];
const radialData = [
  { name: 'Attendance', value: 92, fill: '#004a99' },
  { name: 'Active', value: 78, fill: '#16a34a' },
  { name: 'On Time', value: 85, fill: '#d97706' },
];

const LeaderPortal = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([API.get('/leader/dashboard'), API.get('/meetings')])
      .then(([s, m]) => { setStats(s.data); setMeetings(m.data.slice(0, 4)); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAnnounce = () => {
    if (!announcement.trim()) return;
    setSent(true);
    setAnnouncement('');
    setTimeout(() => setSent(false), 3000);
  };

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div>
      <h2 className="page-title">Leader Dashboard</h2>

      <div className="stats-grid">
        {[
          { icon: <CalendarDays size={20} />, label: t('totalMeetings'), value: stats?.totalMeetings ?? 0, color: 'blue' },
          { icon: <Users size={20} />, label: t('attendance'), value: stats?.totalAttendance ?? 0, color: 'green' },
          { icon: <MessageSquare size={20} />, label: t('comments'), value: stats?.totalComments ?? 0, color: 'orange' },
          { icon: <TrendingUp size={20} />, label: 'Group Score', value: '92%', color: 'red' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3><BarChart2 size={16} style={{ marginRight: 6 }} />Monthly Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#004a99" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3><Target size={16} style={{ marginRight: 6 }} />Group Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
              <RadialBar dataKey="value" cornerRadius={6} label={{ position: 'insideStart', fill: '#fff', fontSize: 11 }} />
              <Tooltip formatter={v => `${v}%`} />
              <Legend iconSize={10} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3><Megaphone size={16} style={{ marginRight: 6 }} />{t('broadcast')}</h3>
          {sent && <div className="alert alert-success">Announcement sent to all group members!</div>}
          <textarea className="textarea" placeholder="Write a message to all motaris..." value={announcement} onChange={e => setAnnouncement(e.target.value)} style={{ marginBottom: 12 }} />
          <button className="btn btn-primary" onClick={handleAnnounce}>{t('sendToAll')}</button>
        </div>

        <div className="card">
          <h3><CalendarDays size={16} style={{ marginRight: 6 }} />{t('upcomingMeetings')}</h3>
          {meetings.length === 0 ? (
            <div className="empty-state"><CalendarDays size={32} /><p>No meetings scheduled</p></div>
          ) : meetings.map(m => (
            <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} />{m.location} · {new Date(m.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          <a href="/meetings" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>Manage Meetings</a>
        </div>
      </div>
    </div>
  );
};

export default LeaderPortal;
