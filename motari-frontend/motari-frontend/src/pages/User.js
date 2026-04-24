import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ phone, password });
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Phone Number (078...)" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;