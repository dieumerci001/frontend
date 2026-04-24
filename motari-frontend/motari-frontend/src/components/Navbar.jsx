import React, { useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Bell, LogOut, Globe } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { ThemeContext } from '../context/ThemeContext';

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

const pageTitles = {
  '/dashboard': 'dashboard', '/rides': 'rides', '/maintenance': 'maintenance',
  '/wallet': 'wallet', '/ai': 'ai', '/group': 'group',
  '/meetings': 'meetings', '/analytics': 'analytics',
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, getIcon } = useContext(NotificationContext);
  const { dark, toggle } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [tab, setTab] = useState('all');
  const notifRef = useRef(null);
  const langRef = useRef(null);
  const location = useLocation();
  const titleKey = pageTitles[location.pathname] || 'dashboard';

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setLangOpen(false);
  };

  const filtered = tab === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h3>{t(titleKey)}</h3>
        <p>{t('welcomeBack')}, {user?.fullName}</p>
      </div>

      <div className="topbar-right">

        {/* 🌐 Language Switcher */}
        <div className="notif-wrapper" ref={langRef}>
          <button className="topbar-icon-btn" onClick={() => setLangOpen(o => !o)} title={t('language')}>
            <Globe size={18} />
            <span style={{ fontSize: 12, marginLeft: 4 }}>{currentLang.flag}</span>
          </button>
          {langOpen && (
            <div className="lang-dropdown">
              {LANGS.map(l => (
                <button key={l.code} className={`lang-option ${i18n.language === l.code ? 'active' : ''}`} onClick={() => changeLanguage(l.code)}>
                  <span>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🌙 Dark Mode Toggle */}
        <button className="topbar-icon-btn" onClick={toggle} title={dark ? t('lightMode') : t('darkMode')}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* 🔔 Notifications */}
        <div className="notif-wrapper" ref={notifRef}>
          <button className="notif-bell topbar-icon-btn" onClick={() => setNotifOpen(o => !o)}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span className="notif-title">{t('notifications')}</span>
                {unreadCount > 0 && <button className="notif-mark-all" onClick={markAllAsRead}>{t('markAllRead')}</button>}
              </div>
              <div className="notif-tabs">
                <button className={`notif-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>{t('all')} ({notifications.length})</button>
                <button className={`notif-tab ${tab === 'unread' ? 'active' : ''}`} onClick={() => setTab('unread')}>{t('unread')} ({unreadCount})</button>
              </div>
              <div className="notif-list">
                {filtered.length === 0 ? (
                  <div className="notif-empty"><Bell size={32} /><p>{t('noNotifications')}</p></div>
                ) : filtered.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markAsRead(n.id)}>
                    <div className="notif-icon">{getIcon(n.type)}</div>
                    <div className="notif-content">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-item-time">{timeAgo(n.time)}</div>
                    </div>
                    <button className="notif-remove" onClick={e => { e.stopPropagation(); removeNotification(n.id); }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User badge */}
        <div className="user-badge">
          <div className="user-avatar">{user?.fullName?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.fullName}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{user?.role}</div>
          </div>
        </div>

        <button className="topbar-icon-btn" onClick={logout} title={t('logout')}>
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
