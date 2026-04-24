import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import API from '../api/axios';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPwd.length < 6) return setError('Password must be at least 6 characters');
    if (newPwd !== confirmPwd) return setError('Passwords do not match');
    setLoading(true);
    try {
      await API.put('/auth/profile/password', { newPassword: newPwd });
      // Update local user to remove mustChangePassword
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.mustChangePassword = false;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="split-page">

      {/* LEFT — Form */}
      <div className="split-form-side">
        <div className="split-form-inner">
          <div className="split-logo">MMS Rwanda</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <ShieldCheck size={28} color="var(--primary)" />
            <h2 className="split-title" style={{ margin: 0 }}>Set Your Password</h2>
          </div>

          <div className="alert alert-info" style={{ marginBottom: 24 }}>
            Welcome to MMS Rwanda! Your account was created by your cooperative leader.
            Please set a personal password before continuing.
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <div className="pwd-input-wrap">
                <input className="input" type={showNew ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
                <button type="button" className="pwd-eye" onClick={() => setShowNew(o => !o)}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPwd && (
                <div style={{ marginTop: 6 }}>
                  <div className="progress-bar">
                    <div className={`progress-fill ${newPwd.length < 6 ? 'fill-red' : newPwd.length < 10 ? 'fill-orange' : 'fill-green'}`}
                      style={{ width: `${Math.min(100, (newPwd.length / 12) * 100)}%` }} />
                  </div>
                  <small style={{ color: 'var(--muted)', fontSize: 11 }}>
                    {newPwd.length < 6 ? 'Weak' : newPwd.length < 10 ? 'Medium' : 'Strong'}
                  </small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="pwd-input-wrap">
                <input className="input" type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
                <button type="button" className="pwd-eye" onClick={() => setShowConfirm(o => !o)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPwd && newPwd !== confirmPwd && <small style={{ color: 'var(--danger)', fontSize: 12 }}>Passwords do not match</small>}
              {confirmPwd && newPwd === confirmPwd && <small style={{ color: 'var(--success)', fontSize: 12 }}>Passwords match</small>}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              <Lock size={15} style={{ marginRight: 6 }} />
              {loading ? 'Saving...' : 'Set Password & Continue'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT — Info */}
      <div className="split-brand-side">
        <div className="split-brand-inner">
          <div className="split-brand-logo"><ShieldCheck size={56} color="white" /></div>
          <h1>Secure Your Account</h1>
          <p>Your account was set up by your cooperative leader. Create a strong personal password that only you know.</p>

          <div className="split-features">
            {[
              { icon: <Lock size={18} />, text: 'Use at least 6 characters' },
              { icon: <ShieldCheck size={18} />, text: 'Mix letters and numbers for strength' },
              { icon: <Eye size={18} />, text: 'Never share your password with anyone' },
              { icon: <ShieldCheck size={18} />, text: 'You can change it anytime in Profile' },
            ].map((f, i) => (
              <div key={i} className="split-feature-item">
                <span className="split-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
