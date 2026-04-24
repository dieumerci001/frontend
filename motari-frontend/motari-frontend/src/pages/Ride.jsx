import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { MapPin, Navigation, Clock, Phone, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff, Coffee } from 'lucide-react';

const DAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// ─── PASSENGER VIEW ───────────────────────────────────────────
function PassengerView() {
  const [locations, setLocations] = useState([]);
  const [location, setLocation]   = useState('');
  const [pickup, setPickup]       = useState('');
  const [destination, setDestination] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [booking, setBooking]     = useState(false);
  const [msg, setMsg]             = useState(null);
  const [assigned, setAssigned]   = useState(null);
  const [myRides, setMyRides]     = useState([]);

  useEffect(() => {
    API.get('/rides/locations').then(r => setLocations(r.data)).catch(() => {});
    API.get('/rides/my-rides').then(r => setMyRides(r.data)).catch(() => {});
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setBooking(true); setMsg(null); setAssigned(null);
    try {
      const res = await API.post('/rides/book', { pickup, destination, scheduledTime, location });
      setAssigned(res.data.motari);
      setMsg({ type: 'success', text: res.data.message });
      setPickup(''); setDestination(''); setScheduledTime(''); setLocation('');
      const r = await API.get('/rides/my-rides');
      setMyRides(r.data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    }
    setBooking(false);
  };

  const statusColor = { PENDING: 'badge-orange', ACCEPTED: 'badge-green', CANCELLED: 'badge-red', COMPLETED: 'badge-blue', ONGOING: 'badge-green' };

  return (
    <div>
      <h2 className="page-title">{t('bookRideTitle')}</h2>

      <div className="grid-2">
        <div className="card">
          <h3>Request a Ride</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            Our system will automatically assign the best available Motari in your area.
          </p>

          {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

          {/* Assigned Motari card */}
          {assigned && (
            <div className="assigned-card">
              <div className="motari-avatar">{assigned.fullName[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>🏍️ {assigned.fullName}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}><Phone size={12} /> {assigned.phone}</div>
                <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>✅ Your Motari has been notified!</div>
              </div>
            </div>
          )}

          <form onSubmit={handleBook}>
            <div className="form-section">
              <label className="form-label">📍 Your Location (Province/City)</label>
              <select className="input" value={location} onChange={e => setLocation(e.target.value)} required>
                <option value="">-- Select your location --</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-section">
              <label className="form-label"><MapPin size={13} style={{ marginRight: 4 }} />Pickup Point</label>
              <input className="input" placeholder="e.g. Nyabugogo Gate A" value={pickup} onChange={e => setPickup(e.target.value)} required />
            </div>
            <div className="form-section">
              <label className="form-label"><Navigation size={13} style={{ marginRight: 4 }} />Destination</label>
              <input className="input" placeholder="e.g. Kimironko Market" value={destination} onChange={e => setDestination(e.target.value)} required />
            </div>
            <div className="form-section">
              <label className="form-label"><Clock size={13} style={{ marginRight: 4 }} />Date & Time</label>
              <input className="input" type="datetime-local" value={scheduledTime}
                min={new Date().toISOString().slice(0, 16)}
                onChange={e => setScheduledTime(e.target.value)} required />
            </div>
            <div className="alert alert-info" style={{ marginBottom: 16, fontSize: 13 }}>
              🤖 A Motari in <strong>{location || 'your area'}</strong> will be automatically assigned based on availability and fairness.
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={booking}>
              {booking ? '🔍 Finding best Motari...' : '🏍️ Book Ride'}
            </button>
          </form>
        </div>

        {/* My Rides */}
        <div className="card">
          <h3>My Bookings</h3>
          {myRides.length === 0 ? (
            <div className="empty-state"><div className="icon">🏍️</div><p>No rides yet. Book your first ride!</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myRides.map(r => (
                <div key={r.id} className="booking-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>🏍️ {r.motari?.fullName || '—'}</div>
                    <span className={`badge ${statusColor[r.status] || 'badge-gray'}`}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div>📍 {r.pickup} → 🏁 {r.destination}</div>
                    <div>🕐 {new Date(r.scheduledTime).toLocaleString()}</div>
                    <div>💰 {r.price} RWF</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MOTARI VIEW ──────────────────────────────────────────────
function MotariView() {
  const [tab, setTab]             = useState('today');
  const [todayRides, setTodayRides] = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [status, setStatusState]  = useState('ONLINE');
  const [statusLoading, setStatusLoading] = useState(false);
  const [days, setDays]           = useState([1, 2, 3, 4, 5]);
  const [startHour, setStartHour] = useState(7);
  const [endHour, setEndHour]     = useState(18);
  const [location, setLocation]   = useState('');
  const [locations, setLocations] = useState([]);
  const [availMsg, setAvailMsg]   = useState(null);
  const [saving, setSaving]       = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const fetchAll = () => {
    API.get('/rides/today').then(r => setTodayRides(r.data)).catch(() => {});
    API.get('/rides/bookings').then(r => setBookings(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchAll();
    API.get('/rides/locations').then(r => setLocations(r.data)).catch(() => {});
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleDay = (d) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleSetStatus = async (newStatus) => {
    setStatusLoading(true);
    try {
      await API.put('/rides/status', { status: newStatus });
      setStatusState(newStatus);
    } catch {}
    setStatusLoading(false);
  };

  const saveAvailability = async () => {
    setSaving(true); setAvailMsg(null);
    try {
      await API.post('/rides/availability', { days, startHour, endHour, location });
      setAvailMsg({ type: 'success', text: '✅ Availability saved! You are now visible to passengers in ' + location });
    } catch { setAvailMsg({ type: 'error', text: 'Failed to save' }); }
    setSaving(false);
  };

  const handleAction = async (id, action) => {
    try { await API.put(`/rides/${id}/${action}`); fetchAll(); } catch {}
  };

  const statusConfig = {
    ONLINE:  { icon: <Wifi size={15} />,    label: 'Online',  color: 'var(--success)', bg: '#dcfce7' },
    OFFLINE: { icon: <WifiOff size={15} />, label: 'Offline', color: 'var(--danger)',  bg: '#fee2e2' },
    BUSY:    { icon: <Coffee size={15} />,  label: 'Busy',    color: 'var(--warning)', bg: '#fef3c7' },
  };
  const statusColors = { PENDING: 'badge-orange', ACCEPTED: 'badge-green', CANCELLED: 'badge-red', COMPLETED: 'badge-blue', ONGOING: 'badge-green' };
  const completed = todayRides.filter(r => r.status === 'COMPLETED').length;
  const accepted  = todayRides.filter(r => r.status === 'ACCEPTED').length;
  const earnings  = todayRides.filter(r => r.status === 'COMPLETED').reduce((s, r) => s + r.price, 0);

  return (
    <div>
      <h2 className="page-title">{t('myRidesTitle')}</h2>

      {/* Status toggle */}
      <div className="status-bar">
        <div style={{ fontSize: 14, fontWeight: 600 }}>My Status:</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button key={key} disabled={statusLoading}
              onClick={() => handleSetStatus(key)}
              className="status-btn"
              style={{
                background: status === key ? cfg.bg : 'var(--white)',
                color: status === key ? cfg.color : 'var(--muted)',
                border: `1px solid ${status === key ? cfg.color : 'var(--border)'}`,
                fontWeight: status === key ? 700 : 400
              }}>
              {cfg.icon} {cfg.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
          {status === 'ONLINE' ? '✅ Passengers can book you' : status === 'OFFLINE' ? '❌ You won\'t receive bookings' : '⏸️ Temporarily unavailable'}
        </div>
      </div>

      {/* Daily summary banner */}
      <div className="day-banner">
        <div className="day-banner-left">
          <div className="day-banner-date">📅 {today}</div>
          <div className="day-banner-sub">Good morning! Here's your day ahead.</div>
        </div>
        <div className="day-banner-stats">
          <div className="day-stat"><span>{todayRides.length}</span>Total Today</div>
          <div className="day-stat"><span>{accepted}</span>Upcoming</div>
          <div className="day-stat"><span>{completed}</span>Completed</div>
          <div className="day-stat green"><span>{earnings.toLocaleString()}</span>RWF Earned</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['today', "📅 Today's Schedule"], ['pending', `📬 New Requests (${bookings.length})`], ['availability', '⚙️ My Availability']].map(([id, label]) => (
          <button key={id} className={`btn ${tab === id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(id)}>{label}</button>
        ))}
        <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={fetchAll}><RefreshCw size={13} /></button>
      </div>

      {/* TODAY'S SCHEDULE */}
      {tab === 'today' && (
        <div className="card">
          <h3>📅 Today's Passengers — {todayRides.length} ride{todayRides.length !== 1 ? 's' : ''}</h3>
          {todayRides.length === 0 ? (
            <div className="empty-state"><div className="icon">😴</div><p>No rides scheduled for today.<br/>Make sure you're Online so passengers can book you!</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {todayRides.map((r, i) => (
                <div key={r.id} className="schedule-item">
                  <div className="schedule-time">
                    <div className="schedule-num">{i + 1}</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{new Date(r.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div className="schedule-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>👤 {r.passenger?.fullName}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>📞 {r.passenger?.phone}</div>
                      </div>
                      <span className={`badge ${statusColors[r.status]}`}>{r.status}</span>
                    </div>
                    <div style={{ fontSize: 13, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div>📍 <strong>From:</strong> {r.pickup}</div>
                      <div>🏁 <strong>To:</strong> {r.destination}</div>
                      <div>💰 <strong>Fare:</strong> {r.price} RWF</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PENDING REQUESTS */}
      {tab === 'pending' && (
        <div className="card">
          <h3>📬 New Booking Requests</h3>
          {bookings.length === 0 ? (
            <div className="empty-state"><div className="icon">📭</div><p>No pending requests right now.</p></div>
          ) : bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div className="motari-avatar" style={{ background: 'var(--success)' }}>{b.passenger?.fullName?.[0] || 'P'}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.passenger?.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>📞 {b.passenger?.phone}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>📍 <strong>From:</strong> {b.pickup}</div>
                <div>🏁 <strong>To:</strong> {b.destination}</div>
                <div>🕐 <strong>Time:</strong> {new Date(b.scheduledTime).toLocaleString()}</div>
                <div>💰 <strong>Price:</strong> {b.price} RWF</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={() => handleAction(b.id, 'accept')}>
                  <CheckCircle size={13} style={{ marginRight: 4 }} />Accept
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleAction(b.id, 'decline')}>
                  <XCircle size={13} style={{ marginRight: 4 }} />Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AVAILABILITY SETTINGS */}
      {tab === 'availability' && (
        <div className="card">
          <h3>⚙️ My Working Hours & Location</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            Set your location so passengers near you can find you. Only passengers in your area will be assigned to you.
          </p>
          {availMsg && <div className={`alert alert-${availMsg.type === 'success' ? 'success' : 'error'}`}>{availMsg.text}</div>}
          <div className="form-section">
            <label className="form-label">📍 My Location</label>
            <select className="input" value={location} onChange={e => setLocation(e.target.value)} required>
              <option value="">-- Select your province/city --</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-section">
            <label className="form-label">Working Days</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DAYS.map((d, i) => (
                <button key={i} type="button"
                  className={`btn btn-sm ${days.includes(i) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleDay(i)}>{d}</button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Start Hour</label>
              <select className="input" value={startHour} onChange={e => setStartHour(+e.target.value)}>
                {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
            <div className="form-section">
              <label className="form-label">End Hour</label>
              <select className="input" value={endHour} onChange={e => setEndHour(+e.target.value)}>
                {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={saveAvailability} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Availability'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Ride() {
  const { user } = useContext(AuthContext);
  if (user?.role === 'MOTARI') return <MotariView />;
  return <PassengerView />;
}
