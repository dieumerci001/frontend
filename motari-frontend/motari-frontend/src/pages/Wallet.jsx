import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchBalance = () => API.get('/wallet').then(r => setBalance(r.data.balance)).catch(() => {});

  useEffect(() => { fetchBalance(); }, []);

  const handleAction = async (type) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setMessage({ type: 'error', text: 'Enter a valid amount' });
    setLoading(true); setMessage(null);
    try {
      const res = await API.post(`/wallet/${type}`, { amount: Number(amount) });
      setBalance(res.data.balance);
      setMessage({ type: 'success', text: res.data.message });
      setAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Transaction failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Wallet 💰</h2>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Current Balance</div>
          <div className="stat-value">{balance.toLocaleString()} RWF</div>
          <div className="stat-sub">Available funds</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Add / Withdraw Money</h3>
          {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}
          <div className="form-section">
            <label className="form-label">Amount (RWF)</label>
            <input className="input" type="number" placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} min="1" />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-success" onClick={() => handleAction('add')} disabled={loading}>+ Add Money</button>
            <button className="btn btn-danger" onClick={() => handleAction('withdraw')} disabled={loading}>- Withdraw</button>
          </div>
        </div>

        <div className="card">
          <h3>💡 Wallet Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--muted)' }}>
            <p>• Your wallet is used to pay for rides and receive earnings.</p>
            <p>• Motaris receive ride payments directly to their wallet.</p>
            <p>• Passengers need sufficient balance before booking.</p>
            <p>• Withdrawals are processed instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
