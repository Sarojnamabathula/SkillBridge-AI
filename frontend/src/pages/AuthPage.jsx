import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthPage({ setActiveTab }) {
  const { login, register, loading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (isRegisterMode) {
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      setActiveTab('dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '460px', margin: '3.5rem auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
        <div style={{
          width: '58px', height: '58px', borderRadius: '16px',
          background: 'var(--primary-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.2rem auto',
          boxShadow: '0 0 30px rgba(20,184,166,0.35)',
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff'
        }}>
          SB
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>
          {isRegisterMode ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
          {isRegisterMode
            ? 'Sign up to track career progress, save skill roadmaps, and monitor your analytics.'
            : 'Log in to access your saved skill gap reports and progress dashboard.'}
        </p>
      </div>

      <div className="glass-card" style={{
        background: 'rgba(11, 20, 28, 0.85)',
        border: '1px solid rgba(20,184,166,0.15)',
      }}>
        {/* Mode Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(20,184,166,0.05)',
          padding: '0.28rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem',
          border: '1px solid rgba(20,184,166,0.1)'
        }}>
          {[
            { label: 'Log In', icon: LogIn, active: !isRegisterMode, action: () => { setIsRegisterMode(false); setErrorMsg(''); } },
            { label: 'Create Account', icon: UserPlus, active: isRegisterMode, action: () => { setIsRegisterMode(true); setErrorMsg(''); } }
          ].map(({ label, icon: Icon, active, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              style={{
                flex: 1, padding: '0.62rem', borderRadius: 'var(--radius-sm)',
                background: active
                  ? 'linear-gradient(135deg, rgba(13,148,136,0.3), rgba(6,182,212,0.2))'
                  : 'transparent',
                color: active ? '#5eead4' : 'var(--text-muted)',
                fontWeight: active ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                transition: 'all 0.2s ease',
                border: active ? '1px solid rgba(20,184,166,0.3)' : '1px solid transparent'
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.8rem 1rem',
            color: '#fda4af',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            ⚠ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-icon-wrapper">
                <User size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-icon-wrapper">
              <Mail size={16} />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="input-icon-wrapper">
              <Lock size={16} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', padding: '0.9rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegisterMode ? 'Create Account' : 'Log In'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Feature note */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem 1rem',
          background: 'rgba(20,184,166,0.06)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(20,184,166,0.12)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Sparkles size={14} style={{ color: 'var(--brand-teal)', flexShrink: 0 }} />
          Your data is stored locally and never shared with third parties. Guest mode is supported without login.
        </div>
      </div>
    </div>
  );
}
