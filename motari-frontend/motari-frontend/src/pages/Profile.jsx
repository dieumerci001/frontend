import React, { useState, useContext } from 'react';
import { User, Lock, Trash2, Save, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const [tab, setTab] = useState('info');

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [infoMsg, setInfoMsg] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [deletePwd, setDeletePwd] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeletePwd, setShowDeletePwd] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setInfoLoading(true); setInfoMsg(null);
    try {
      const res = await API.put('/auth/profile', { fullName, phone });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setInfoMsg({ type: 'success', text: t('saveChanges') + ' ✅' });
    } catch (err) {
      setInfoMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
    setInfoLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPwd !== confirmPwd) return setPwdMsg({ type: 'error', text: 'Passwords do not match' });
    if (newPwd.length < 6) return setPwdMsg({ type: 'error', text: 'Min. 6 characters' });
    setPwdLoading(true);
    try {
      const res = await API.put('/auth/profile/password', { currentPassword: currentPwd, newPassword: newPwd });
      setPwdMsg({ type: 'success', text: res.data.message });
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
    setPwdLoading(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteMsg(null);
    if (deleteConfirm !== 'DELETE') return setDeleteMsg({ type: 'error', text: t('typeDelete') });
    setDeleteLoading(true);
    try {
      const body = user?.googleId && !user?.password ? {} : { password: deletePwd };
      await API.delete('/auth/profile', { data: body });
      logout();
    } catch (err) {
      setDeleteMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
    setDeleteLoading(false);
  };

  const roleColors = { ADMIN: 'badge-red', MOTARI: 'badge-green', PASSENGER: 'badge-blue', LEADER: 'badge-orange' };
  const TABS = [
    { id: 'info',     label: t('myInfo'),         icon: <User size={16} /> },
    { id: 'password', label: t('changePassword'),  icon: <Lock size={16} /> },
    { id: 'delete',   label: t('deleteAccount'),   icon: <Trash2 size={16} /> },
  ];

  return (
    <div>
      <h2 className="page-title">{t('myProfile')} 👤</h2>
      <div className="profile-layout">

        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-big">{user?.fullName?.[0]?.toUpperCase()}</div>
          <div className="profile-name">{user?.fullName}</div>
          <div className="profile-email">{user?.email}</div>
          <span className={`badge ${roleColors[user?.role] || 'badge-gray'}`} style={{ marginTop: 8 }}>{user?.role}</span>
          <div className="profile-verified">{user?.isVerified ? '✅ Verified' : '⚠️ Not Verified'}</div>
          <div className="profile-tabs">
            {TABS.map(tb => (
              <button key={tb.id}
                className={`profile-tab ${tab === tb.id ? 'active' : ''} ${tb.id === 'delete' ? 'danger' : ''}`}
                onClick={() => setTab(tb.id)}>
                {tb.icon} {tb.label}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-content">

          {/* MY INFO */}
          {tab === 'info' && (
            <div className="card">
              <h3><User size={16} style={{ marginRight: 8 }} />{t('myInfo')}</h3>
              {infoMsg && <div className={`alert alert-${infoMsg.type === 'success' ? 'success' : 'error'}`}>{infoMsg.text}</div>}
              <form onSubmit={handleUpdateInfo}>
                <div className="form-section">
                  <label className="form-label">{t('fullName')}</label>
                  <input className="input" value={fullName} placeholder={t('fullName')} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="form-section">
                  <label className="form-label">{t('phoneNumber')}</label>
                  <input className="input" value={phone} placeholder={t('phoneNumber')} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="form-section">
                  <label className="form-label">{t('emailAddress')}</label>
                  <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  <small style={{ color: 'var(--muted)', fontSize: 12 }}>{t('emailCannotChange')}</small>
                </div>
                <div className="form-section">
                  <label className="form-label">Role</label>
                  <input className="input" value={user?.role || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={infoLoading}>
                  <Save size={15} style={{ marginRight: 6 }} />
                  {infoLoading ? t('saving') : t('saveChanges')}
                </button>
              </form>
            </div>
          )}

          {/* CHANGE / SET PASSWORD */}
          {tab === 'password' && (
            <div className="card">
              <h3><Lock size={16} style={{ marginRight: 8 }} />
                {user?.googleId && !user?.password ? t('setPassword') : t('changePassword')}
              </h3>
              {user?.googleId && !user?.password ? (
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  🔵 {t('setPassword')} — {t('emailCannotChange').replace('Email', 'Password')}
                </div>
              ) : (
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  🔒 {t('currentPassword')} {t('password').toLowerCase()}.
                </div>
              )}
              {pwdMsg && <div className={`alert alert-${pwdMsg.type === 'success' ? 'success' : 'error'}`}>{pwdMsg.text}</div>}
              <form onSubmit={handleChangePassword}>
                {!(user?.googleId && !user?.password) && (
                  <div className="form-section">
                    <label className="form-label">{t('currentPassword')}</label>
                    <div className="pwd-input-wrap">
                      <input className="input" type={showCurrent ? 'text' : 'password'} value={currentPwd}
                        placeholder={t('currentPassword')}
                        onChange={e => setCurrentPwd(e.target.value)} required />
                      <button type="button" className="pwd-eye" onClick={() => setShowCurrent(o => !o)}>
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
                <div className="form-section">
                  <label className="form-label">{t('newPassword')}</label>
                  <div className="pwd-input-wrap">
                    <input className="input" type={showNew ? 'text' : 'password'} value={newPwd}
                      placeholder={t('newPassword')}
                      onChange={e => setNewPwd(e.target.value)} required />
                    <button type="button" className="pwd-eye" onClick={() => setShowNew(o => !o)}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPwd && (
                    <div>
                      <div className="progress-bar" style={{ marginTop: 8 }}>
                        <div className={`progress-fill ${newPwd.length < 6 ? 'fill-red' : newPwd.length < 10 ? 'fill-orange' : 'fill-green'}`}
                          style={{ width: `${Math.min(100, (newPwd.length / 12) * 100)}%` }} />
                      </div>
                      <small style={{ color: 'var(--muted)', fontSize: 11 }}>
                        {newPwd.length < 6 ? t('passwordWeak') : newPwd.length < 10 ? t('passwordMedium') : t('passwordStrong')}
                      </small>
                    </div>
                  )}
                </div>
                <div className="form-section">
                  <label className="form-label">{t('confirmPassword')}</label>
                  <input className="input" type="password" value={confirmPwd}
                    placeholder={t('confirmPassword')}
                    onChange={e => setConfirmPwd(e.target.value)} required />
                  {confirmPwd && newPwd !== confirmPwd && <small style={{ color: 'var(--danger)', fontSize: 12 }}>✗ Passwords do not match</small>}
                  {confirmPwd && newPwd === confirmPwd && <small style={{ color: 'var(--success)', fontSize: 12 }}>✓ Passwords match</small>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={pwdLoading}>
                  <Lock size={15} style={{ marginRight: 6 }} />
                  {pwdLoading ? t('saving') : user?.googleId && !user?.password ? t('setPassword') : t('changePassword')}
                </button>
              </form>
            </div>
          )}

          {/* DELETE ACCOUNT */}
          {tab === 'delete' && (
            <div className="card">
              <h3 style={{ color: 'var(--danger)' }}><ShieldAlert size={16} style={{ marginRight: 8 }} />{t('deleteAccount')}</h3>
              <div className="alert alert-error" style={{ marginBottom: 20 }}>
                ⚠️ <strong>{t('deleteWarning')}</strong>
              </div>
              {deleteMsg && <div className={`alert alert-${deleteMsg.type === 'success' ? 'success' : 'error'}`}>{deleteMsg.text}</div>}
              <form onSubmit={handleDeleteAccount}>
                {user?.googleId && !user?.password && (
                  <div className="alert alert-info" style={{ marginBottom: 16 }}>
                    🔵 {t('setPassword')} — just type DELETE to confirm.
                  </div>
                )}
                {(!user?.googleId || user?.password) && (
                  <div className="form-section">
                    <label className="form-label">{t('currentPassword')}</label>
                    <div className="pwd-input-wrap">
                      <input className="input" type={showDeletePwd ? 'text' : 'password'} value={deletePwd}
                        placeholder={t('currentPassword')}
                        onChange={e => setDeletePwd(e.target.value)} required />
                      <button type="button" className="pwd-eye" onClick={() => setShowDeletePwd(o => !o)}>
                        {showDeletePwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
                <div className="form-section">
                  <label className="form-label">{t('typeDelete')}</label>
                  <input className="input" value={deleteConfirm} placeholder="DELETE"
                    onChange={e => setDeleteConfirm(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-danger" disabled={deleteLoading || deleteConfirm !== 'DELETE'}>
                  <Trash2 size={15} style={{ marginRight: 6 }} />
                  {deleteLoading ? t('deleting') : t('permanentlyDelete')}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
