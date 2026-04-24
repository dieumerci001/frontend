import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PassengerPortal from './Portals/PassengerPortal';
import MotariPortal from './Portals/MotariPortal';
import LeaderPortal from './Portals/LeaderPortal';
import AdminPortal from './Portals/AdminPortal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  switch (user?.role) {
    case 'ADMIN':    return <AdminPortal />;
    case 'LEADER':   return <LeaderPortal />;
    case 'MOTARI':   return <MotariPortal />;
    case 'PASSENGER': return <PassengerPortal />;
    default:         return <div className="empty-state"><div className="icon">🔒</div><p>Unknown role. Please contact support.</p></div>;
  }
};

export default Dashboard;
