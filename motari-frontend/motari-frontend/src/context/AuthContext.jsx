import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios'; // Ensure your axios instance has the correct baseURL

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // credentials contains { identifier, password } from our new form
      const response = await API.post('/auth/login', credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);

      if (response.data.mustChangePassword) {
        return { success: true, mustChangePassword: true };
      }
      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      if (data?.needsVerification) return { success: false, needsVerification: true, userId: data.userId, message: data.message };
      return { success: false, message: data?.message };
    }
  };

  const loginWithToken = async (token) => {
    try {
      // Decode the token to get user info, then fetch full profile
      const res = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const userData = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithToken, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};