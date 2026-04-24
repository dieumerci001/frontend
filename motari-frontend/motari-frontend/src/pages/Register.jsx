import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios.js';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await API.post('/auth/register', { ...formData, role: 'PASSENGER' });
      navigate('/verify-email', { state: { userId: res.data.userId, email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogle = () => { window.location.href = 'http://localhost:5000/api/auth/google'; };

  return (
    <div className="split-page">

      {/* LEFT — Branding */}
      <div className="split-brand-side">
        <div className="split-brand-inner">
          <div className="split-brand-logo">🏍️</div>
          <h1>Join MMS Rwanda</h1>
          <p>Create your account and become part of Rwanda's largest motorcycle management network.</p>

          <div className="split-features">
            {[
              { icon: '🚀', text: 'Get started in minutes' },
              { icon: '🔒', text: 'Secure & verified accounts' },
              { icon: '📱', text: 'Track rides in real-time' },
              { icon: '💰', text: 'Secure wallet & payments' },
              { icon: '🌍', text: 'Available in 3 languages' },
            ].map((f, i) => (
              <div key={i} className="split-feature-item">
                <span className="split-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="split-stats">
            <div className="split-stat"><strong>5,000+</strong><span>Motari</span></div>
            <div className="split-stat"><strong>30+</strong><span>Districts</span></div>
            <div className="split-stat"><strong>50K+</strong><span>Rides</span></div>
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="split-form-side">
        <div className="split-form-inner">
          <Link to="/" className="split-back">← {t('homePage')}</Link>

          <div className="split-logo">MMS Rwanda</div>
          <h2 className="split-title">{t('registerTitle')}</h2>
          <p className="split-sub">{t('registerSub')}</p>

          <button onClick={handleGoogle} className="social-login-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G" />
            {t('signUpGoogle')}
          </button>

          <div className="divider">{t('orRegister')}</div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Motari notice */}
          <div className="alert alert-info" style={{ marginBottom: 16, fontSize: 13 }}>
            Are you a Motari? Your account is created by your cooperative leader. Just login with your phone number and the default password provided.
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>{t('fullName')}</label>
              <input type="text" placeholder={t('fullName')} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>{t('emailAddress')}</label>
                <input type="email" placeholder="example@email.com" onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('phoneNumber')}</label>
                <input type="text" placeholder="078..." onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>{t('password')}</label>
              <input type="password" placeholder="Min. 6 characters" onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
              <input type="checkbox" required id="terms" style={{ marginTop: 3 }} />
              <label htmlFor="terms" style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{t('agreeTerms')}</label>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t('creatingAccount') : t('createAccountBtn')}
            </button>
          </form>

          <p className="split-switch">
            {t('alreadyAccount')} <Link to="/login">{t('logIn')}</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
