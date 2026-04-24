import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-brand">Motari Logistics System</div>
      <div className="nav-user">
        <span>{user?.name} ({user?.role})</span>
        <button onClick={logout} className="logout-mini">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;