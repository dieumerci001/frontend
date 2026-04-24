import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Ride from './pages/Ride';
import Maintenance from './pages/Maintenance';
import AI from './pages/AI';
import Wallet from './pages/Wallet';
import Group from './pages/Group';
import Meetings from './pages/Meetings';
import Analytics from './pages/Analytics';
import AdminPortal from './pages/Portals/AdminPortal';
import AdminManage from './pages/AdminManage';
import Profile from './pages/Profile';

import VerifyEmail from './pages/VerifyEmail';
import HomePage from './pages/HomePage';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <div className="main-content-wrapper">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="rides" element={<Ride />} />
                      <Route path="maintenance" element={<Maintenance />} />
                      <Route path="wallet" element={<Wallet />} />
                      <Route path="ai" element={<AI />} />
                      <Route path="group" element={<Group />} />
                      <Route path="meetings" element={<Meetings />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="admin" element={<AdminPortal />} />
                      <Route path="admin/manage" element={<AdminManage />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
