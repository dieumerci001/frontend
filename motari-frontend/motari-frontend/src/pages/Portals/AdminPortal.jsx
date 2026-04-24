import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Bike, CalendarDays, Activity, ShieldCheck, Database, Zap, TrendingUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import API from '../../api/axios';

const activityData = [
  { time: '6AM', rides: 12 }, { time: '8AM', rides: 45 }, { time: '10AM', rides: 38 },
  { time: '12PM', rides: 60 }, { time: '2PM', rides: 42 }, { time: '4PM', rides: 55 },
  { time: '6PM', rides: 70 }, { time: '8PM', rides: 30 },
];
const roleData = [
  { name: 'Passengers', value: 65, color: '#004a99' },
  { name: 'Motaris', value: 25, color: '#16a34a' },
  { name: 'Leaders', value: 7, color: '#d97706' },
  { name: 'Admins', value: 3, color: '#ef4444' },
];
const weeklyRides = [
  { day: 'Mon', rides: 120 }, { day: 'Tue', rides: 98 }, { day: 'Wed', rides: 145 },
  { day: 'Thu', rides: 87 }, { day: 'Fri', rides: 160 }, { day: 'Sat', rides: 190 }, { day: 'Sun', rides: 110 },
];

const AdminPortal = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/leader/dashboard').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const systemItems = [
    { icon: <ShieldCheck size={16} />, label: 'API Server', status: 'Online', color: 'badge-green' },
    { icon: <Database size={16} />, label: 'Database', status: 'Connected', color: 'badge-green' },
    { icon: <Zap size={16} />, label: 'Socket.IO', status: 'Active', color: 'badge-green' },
    { icon: <Activity size={16} />, label: 'AI Service', status: 'Running', color: 'badge-green' },
  ];

  return (
    <div>
      <h2 className="page-title">Admin Dashboard</h2>

      <div className="stats-grid">
        {[
          { icon: <Users size={20} />, label: 'Total Users', value: '1,200', sub: '+12 today', color: 'blue' },
          { icon: <Bike size={20} />, label: 'Total Rides', value: '8,400', sub: '+160 today', color: 'green' },
          { icon: <CalendarDays size={20} />, label: t('totalMeetings'), value: stats?.totalMeetings ?? '—', color: 'orange' },
          { icon: <Activity size={20} />, label: 'System Uptime', value: '99.9%', sub: 'Last 30 days', color: 'red' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Ride activity line chart */}
        <div className="card">
          <h3><TrendingUp size={16} style={{ marginRight: 6 }} />Today's Ride Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="rides" stroke="#004a99" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User role pie chart */}
        <div className="card">
          <h3><Users size={16} style={{ marginRight: 6 }} />User Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {roleData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        {/* Weekly rides bar */}
        <div className="card">
          <h3><Bike size={16} style={{ marginRight: 6 }} />Weekly Rides Overview</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyRides}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="rides" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System status + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3><Activity size={16} style={{ marginRight: 6 }} />{t('systemStatus')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {systemItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{item.icon}{item.label}</span>
                  <span className={`badge ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3><Zap size={16} style={{ marginRight: 6 }} />{t('quickActions')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/group" className="btn btn-secondary btn-sm"><Users size={14} style={{ marginRight: 6 }} />Manage Groups</a>
              <a href="/meetings" className="btn btn-secondary btn-sm"><CalendarDays size={14} style={{ marginRight: 6 }} />View Meetings</a>
              <a href="/analytics" className="btn btn-secondary btn-sm"><Activity size={14} style={{ marginRight: 6 }} />Analytics</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
