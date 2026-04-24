import React, { useState } from 'react';
import API from '../api/axios';

const AI = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Muraho! I am your AI Motari Assistant. Ask me anything about your earnings, fuel, or maintenance.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await API.post('/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply || res.data.message || 'No response from AI.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, AI service is currently unavailable.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">AI Motari Assistant 🤖</h2>

      <div className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
          <h3>Chat with AI</h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg)',
                color: msg.role === 'user' ? 'white' : 'var(--text)',
                padding: '10px 14px',
                borderRadius: 10,
                maxWidth: '80%',
                fontSize: 14,
              }}>
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--muted)', fontSize: 13 }}>AI is typing...</div>}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Ask about earnings, fuel, maintenance..." value={input} onChange={e => setInput(e.target.value)} />
            <button type="submit" className="btn btn-primary" disabled={loading}>Send</button>
          </form>
        </div>

        <div className="card">
          <h3>💡 Suggested Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'How much fuel will I need tomorrow?',
              'What are the busiest zones this week?',
              'When should I do my next oil change?',
              'How can I increase my earnings?',
              'What is my average ride price?',
            ].map((q, i) => (
              <button key={i} className="btn btn-secondary btn-sm" style={{ textAlign: 'left' }} onClick={() => setInput(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;
