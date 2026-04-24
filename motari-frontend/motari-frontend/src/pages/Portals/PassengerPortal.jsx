import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, MapPin, Navigation, CheckCircle, TrendingUp, BarChart2, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../../api/axios';

const weekData = [
  { day: 'Mon', rides: 2 }, { day: 'Tue', rides: 1 }, { day: 'Wed', rides: 3 },
  { day: 'Thu', rides: 0 }, { day: 'Fri', rides: 4 }, { day: 'Sat', rides: 2 }, { day: 'Sun', rides: 1 },
];
const spendData = [
  { name: 'Rides', value: 7500, color: '#004a99' },
  { name: 'Saved', value: 2500, color: '#16a34a' },
];

const PassengerPortal = () => {
  const { t } = useTranslation();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    API.get('/wallet').then(r => setBalance(r.data.balance)).catch(() => {});
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const res = await API.post('/rides', { pickup, destination });
      setMessage({ type: 'success', text: `${t('requestRide')} #${res.data.id} — ${res.data.price} RWF` });
      setPickup(''); setDestination('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to book ride' });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">{t('bookRide')}</h2>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><Wallet size={22} /></div>
          <div className="stat-label">{t('walletBalance')}</div>
          <div className="stat-value">{balance.toLocaleString()} RWF</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><TrendingUp size={22} /></div>
          <div className="stat-label">{t('totalRides')}</div>
          <div className="stat-value">13</div>
          <div className="stat-sub">{t('thisWeek')}</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><CheckCircle size={22} /></div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">12</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>{t('requestRide')}</h3>
          {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}
          <form onSubmit={handleBook}>
            <div className="form-section">
              <label className="form-label"><MapPin size={14} style={{ marginRight: 4 }} />{t('pickup')}</label>
              <input className="input" placeholder="e.g. Nyabugogo - Gate A" value={pickup} onChange={e => setPickup(e.target.value)} required />
            </div>
            <div className="form-section">
              <label className="form-label"><Navigation size={14} style={{ marginRight: 4 }} />{t('destination')}</label>
              <input className="input" placeholder="e.g. Kimironko Market" value={destination} onChange={e => setDestination(e.target.value)} required />
            </div>
            <div className="alert alert-info" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={15} /> {t('estimatedPrice')}: <strong>{pickup === destination && pickup ? '500 RWF' : '1,000 RWF'}</strong>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? t('loading') : t('findMotari')}
            </button>
          </form>
        </div>

        <div className="card">
          <h3><Wallet size={16} style={{ marginRight: 6 }} />Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={spendData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {spendData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v.toLocaleString()} RWF`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3><BarChart2 size={16} style={{ marginRight: 6 }} />Rides This Week</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="rides" fill="#004a99" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PassengerPortal;
