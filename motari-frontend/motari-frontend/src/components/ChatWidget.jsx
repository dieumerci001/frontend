import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Minimize2 } from 'lucide-react';
import API from '../api/axios';

const SUGGESTIONS = [
  'What is MMS Rwanda?',
  'How do I register?',
  'What features do you offer?',
  'Is it free to use?',
  'How does payment work?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm the MMS Rwanda AI assistant. Ask me anything about our platform!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop pulse after first open
  const handleOpen = () => { setOpen(true); setPulse(false); };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await API.post('/ai/public-chat', { message: msg });
      setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button className={`chat-fab ${pulse ? 'chat-fab-pulse' : ''}`} onClick={handleOpen} title="Chat with AI">
          <Bot size={26} />
          <span className="chat-fab-label">Ask AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar"><Bot size={18} /></div>
              <div>
                <div className="chat-title">MMS AI Assistant</div>
                <div className="chat-status">● Online</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="chat-icon-btn" onClick={() => setOpen(false)} title="Minimize"><Minimize2 size={16} /></button>
              <button className="chat-icon-btn" onClick={() => setOpen(false)} title="Close"><X size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
                {m.from === 'bot' && <div className="chat-msg-avatar"><Bot size={14} /></div>}
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-msg-avatar"><Bot size={14} /></div>
                <div className="chat-bubble chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chat-suggestion" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask anything about MMS Rwanda..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button className="chat-send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
