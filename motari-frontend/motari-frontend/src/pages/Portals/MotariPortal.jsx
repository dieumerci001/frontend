import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, Fuel, Bike, Wrench, Bot } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import API from '../../api/axios';

const earningsData = [
  { day: 'Mon', earned: 4500 }, { day: 'Tue', earned: 3200 }, { day: 'Wed', earned: 6100 },
  { day: 'Thu', earned: 2800 }, { day: 'Fri', earned: 7400 }, { day: 'Sat', earned: 8200 }, { day: 'Sun', earned: 5100 },
];
const ridesData = [
  { day: 'Mon', rides: 5 }, { day: 'Tue', rides: 3 }, { day: 'Wed', rides: 7 },
  { day: 'Thu', rides: 2 }, { day: 'Fri', rides: 8 }, { day: 'Sat', rides: 9 }, { day: 'Sun', rides: 6 },
];

const MotariPortal = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/wallet'),
      API.post('/analytics/report', { period: 'week' }),
    ]).then(([w, r]) => { setBalance(w.data.balance); setReport(r.data.report); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">{t('loading')}</div>;

  const maintenance = [
    { label: 'Oil Change', pct: 80, status: 'Good', color: 'fill-green', badge: 'badge-green' },
    { label: 'Tire Condition', pct: 40, status: 'Check Soon', color: 'fill-orange', badge: 'badge-orange' },
    { label: 'Brakes', pct: 90, status: 'Good', color: 'fill-green', badge: 'badge-green' },
    { label: 'Chain', pct: 60, status: 'Monitor', color: 'fill-blue', badge: 'badge-blue' },
  ];

  return (
    <div>
      <h2 className="page-title">Motari Dashboard</h2>

      <div className="stats-grid">
        {[
          { icon: <Wallet size={20} />, label: t('walletBalance'), value: `${balance.toLocaleString()} RWF`, sub: t('availableEarnings'), color: 'blue' },
          { icon: <Bike size={20} />, label: t('totalRides'), value: report?.totalRides ?? '40', sub: t('thisWeek'), color: 'green' },
          { icon: <TrendingUp size={20} />, label: t('totalEarned'), value: `${(report?.totalEarnings ?? 37300).toLocaleString()} RWF`, sub: t('thisWeek'), color: 'orange' },
          { icon: <Fuel size={20} />, label: t('fuelCost'), value: `${(report?.fuelCost ?? 5000).toLocaleString()} RWF`, sub: 'Estimated', color: 'red' },
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
        {/* Earnings area chart */}
        <div className="card">
          <h3><TrendingUp size={16} style={{ marginRight: 6 }} />{t('earnings')} — {t('thisWeek')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004a99" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#004a99" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `${v.toLocaleString()} RWF`} />
              <Area type="monotone" dataKey="earned" stroke="#004a99" fill="url(#earnGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rides bar chart */}
        <div className="card">
          <h3><Bike size={16} style={{ marginRight: 6 }} />{t('totalRides')} — {t('thisWeek')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ridesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="rides" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        {/* Maintenance */}
        <div className="card">
          <h3><Wrench size={16} style={{ marginRight: 6 }} />{t('maintenanceStatus')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {maintenance.map((m, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{m.label}</span>
                  <span className={`badge ${m.badge}`}>{m.status}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <a href="/maintenance" className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>View Full History →</a>
        </div>

        {/* AI tip */}
        <div className="card">
          <h3><Bot size={16} style={{ marginRight: 6 }} />{t('aiRecommendation')}</h3>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            {report?.aiTip || 'Remera and Kacyiru zones are busiest today. Expect 20% more rides between 7–9 AM.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="alert alert-success">Your earnings are up 12% vs last week</div>
            <div className="alert alert-error" style={{ background: '#fef3c7', color: '#d97706', borderColor: '#fde68a' }}>
              Oil change recommended in 3 days
            </div>
          </div>
          <a href="/ai" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Open AI Assistant →</a>
        </div>
      </div>
    </div>
  );
};

export default MotariPortal;
