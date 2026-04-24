import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = React.useState(() => new URLSearchParams(window.location.search));

  // Support both router state (normal register) and URL params (Google OAuth)
  const userId = state?.userId || searchParams.get('userId');
  const email  = state?.email  || searchParams.get('email');
  const isGoogle = searchParams.get('google') === 'true';

  if (!userId) { navigate('/register'); return null; }

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...codes]; next[i] = val; setCodes(next);
    if (val && i < 5) inputs.current[i + 1].focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !codes[i] && i > 0) inputs.current[i - 1].focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setCodes(pasted.split('')); inputs.current[5].focus(); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = codes.join('');
    if (code.length < 6) return setError('Enter the full 6-digit code');
    setLoading(true); setError('');
    try {
      await API.post('/auth/verify-email', { userId, code });
      setSuccess('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
      setCodes(['', '', '', '', '', '']);
      inputs.current[0].focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true); setError(''); setSuccess('');
    try {
      await API.post('/auth/resend-code', { userId });
      setSuccess('New code sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally { setResending(false); }
  };

  return (
    <div className="auth-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
        <div className="login-header">
          <h2>{t('verifyTitle')}</h2>
          <p>{t('verifySubA')}<br /><strong>{email}</strong></p>
          {isGoogle && (
            <div className="alert alert-info" style={{ marginTop: 12, textAlign: 'left', fontSize: 13 }}>
              🔵 You signed up with Google. We sent a verification code to your Gmail to confirm your identity.
            </div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '24px 0' }} onPaste={handlePaste}>
            {codes.map((c, i) => (
              <input key={i} ref={el => inputs.current[i] = el}
                type="text" inputMode="numeric" maxLength={1} value={c}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{ width: 48, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 700,
                  border: `2px solid ${c ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 8, outline: 'none', transition: 'border 0.2s' }} />
            ))}
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? t('verifying') : t('verifyBtn')}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          {t('noCode')}{' '}
          <button onClick={handleResend} disabled={resending}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            {resending ? t('sending') : t('resendCode')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
