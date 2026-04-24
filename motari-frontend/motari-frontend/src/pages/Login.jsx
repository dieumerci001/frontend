import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      loginWithToken(token).then(result => {
        if (result.success) navigate('/dashboard');
        else setError(t('googleLoginFailed') || 'Google login failed. Please try again.');
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ identifier, password });
    if (result.success) {
      if (result.mustChangePassword) return navigate('/change-password');
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    }
    else if (result.needsVerification) navigate('/verify-email', { state: { userId: result.userId, email: identifier } });
    else setError(result.message || 'Login failed');
  };

  const handleGoogle = () => { window.location.href = 'http://localhost:5000/api/auth/google'; };

  return (
    <div className="auth-page">
      <div className="login-card">
        <div className="login-header">
          <h2>MMS Rwanda</h2>
          <p>{t('signInTitle')}</p>
        </div>

        <button onClick={handleGoogle} className="social-login-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G" />
          {t('continueGoogle')}
        </button>

        <div className="divider">{t('orDivider')}</div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('emailOrPhone')}</label>
            <input type="text" placeholder={t('emailOrPhone')} value={identifier} onChange={e => setIdentifier(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-submit">{t('signIn')}</button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">{t('forgotPassword')}</Link>
          <Link to="/register">{t('createAccountLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
