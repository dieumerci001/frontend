import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Bike, Wallet, User, Wrench, Bot,
  Users, CalendarDays, BarChart2, Settings, Home, Crown
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const role = user?.role || 'PASSENGER';

  const links = {
    PASSENGER: [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
      { to: '/rides',     icon: <Bike size={18} />,            label: t('bookRide') },
      { to: '/wallet',    icon: <Wallet size={18} />,          label: t('wallet') },
      { to: '/profile',   icon: <User size={18} />,            label: t('myProfile') },
    ],
    MOTARI: [
      { to: '/dashboard',   icon: <LayoutDashboard size={18} />, label: t('dashboard') },
      { to: '/rides',       icon: <Bike size={18} />,            label: t('myRidesTitle') },
      { to: '/maintenance', icon: <Wrench size={18} />,          label: t('maintenance') },
      { to: '/wallet',      icon: <Wallet size={18} />,          label: t('earnings') },
      { to: '/ai',          icon: <Bot size={18} />,             label: t('ai') },
      { to: '/profile',     icon: <User size={18} />,            label: t('myProfile') },
    ],
    LEADER: [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
      { to: '/group',     icon: <Users size={18} />,           label: t('group') },
      { to: '/meetings',  icon: <CalendarDays size={18} />,    label: t('meetings') },
      { to: '/analytics', icon: <BarChart2 size={18} />,       label: t('analytics') },
      { to: '/profile',   icon: <User size={18} />,            label: t('myProfile') },
    ],
    ADMIN: [
      { to: '/dashboard',    icon: <LayoutDashboard size={18} />, label: t('dashboard') },
      { to: '/admin/manage', icon: <Settings size={18} />,        label: 'Manage System' },
      { to: '/rides',        icon: <Bike size={18} />,            label: t('rides') },
      { to: '/group',        icon: <Users size={18} />,           label: t('group') },
      { to: '/analytics',    icon: <BarChart2 size={18} />,       label: t('analytics') },
      { to: '/meetings',     icon: <CalendarDays size={18} />,    label: t('meetings') },
      { to: '/profile',      icon: <User size={18} />,            label: t('myProfile') },
    ],
  };

  const navLinks = links[role] || links.PASSENGER;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>MMS Rwanda</h2>
        <p>Moto Management System</p>
      </div>
      <nav>
        {navLinks.map(link => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {link.icon} {link.label}
          </NavLink>
        ))}
        <NavLink to="/" className="nav-link" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Home size={18} /> {t('homePage')}
        </NavLink>
      </nav>
      <div className="sidebar-footer">v1.0 · MMS Rwanda</div>
    </div>
  );
};

export default Sidebar;
