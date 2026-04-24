import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

const SAMPLE_NOTIFICATIONS = {
  PASSENGER: [
    { id: 1, type: 'ride', title: 'Ride Accepted!', message: 'A Motari has accepted your ride request.', time: new Date(Date.now() - 2 * 60000), read: false },
    { id: 2, type: 'wallet', title: 'Wallet Topped Up', message: 'Your wallet has been credited with 5,000 RWF.', time: new Date(Date.now() - 30 * 60000), read: false },
  ],
  MOTARI: [
    { id: 1, type: 'ride', title: 'New Ride Request!', message: 'A passenger near Nyabugogo needs a ride to Kimironko.', time: new Date(Date.now() - 1 * 60000), read: false },
    { id: 2, type: 'maintenance', title: 'Maintenance Due', message: 'Your oil change is due in 3 days.', time: new Date(Date.now() - 60 * 60000), read: false },
    { id: 3, type: 'wallet', title: 'Payment Received', message: 'You received 1,000 RWF for your last ride.', time: new Date(Date.now() - 2 * 3600000), read: true },
  ],
  LEADER: [
    { id: 1, type: 'group', title: 'New Member Request', message: 'Motari Jean wants to join your group.', time: new Date(Date.now() - 5 * 60000), read: false },
    { id: 2, type: 'meeting', title: 'Meeting Reminder', message: 'Group meeting tomorrow at 8 AM at Nyabugogo Hall.', time: new Date(Date.now() - 3 * 3600000), read: false },
  ],
  ADMIN: [
    { id: 1, type: 'system', title: 'New User Registered', message: 'A new Motari has registered and needs verification.', time: new Date(Date.now() - 10 * 60000), read: false },
    { id: 2, type: 'system', title: 'System Alert', message: 'High ride volume detected in Kigali City zone.', time: new Date(Date.now() - 45 * 60000), read: false },
  ],
};

const typeIcons = {
  ride: '🏍️',
  wallet: '💰',
  maintenance: '🛠️',
  group: '👥',
  meeting: '📅',
  system: '⚙️',
  info: 'ℹ️',
};

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.role) {
      setNotifications(SAMPLE_NOTIFICATIONS[user.role] || []);
    }
  }, [user?.role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ id: Date.now(), read: false, time: new Date(), ...notif }, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getIcon = (type) => typeIcons[type] || 'ℹ️';

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, removeNotification, getIcon }}>
      {children}
    </NotificationContext.Provider>
  );
};
