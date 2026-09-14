import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { Compass, BookOpen, Layers, Award, Shield, Cpu, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { backendHealth, analysisResult } = useAnalysis();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Skills', icon: BookOpen },
    { id: 'career', label: 'Careers', icon: Layers },
    { id: 'analysis', label: 'Matrix', icon: Cpu, badge: analysisResult ? 'Active' : null },
    { id: 'roadmap', label: 'Roadmap', icon: Award, disabled: !analysisResult },
    { id: 'projects', label: 'Capstones', icon: BookOpen, disabled: !analysisResult },
    { id: 'progress', label: 'Tracker', icon: Award, disabled: !analysisResult },
    { id: 'responsible-ai', label: 'About', icon: Shield }
  ];

  return (
    <header style={{
      background: 'rgba(6, 10, 15, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(20, 184, 166, 0.12)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top teal shimmer line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.6), rgba(6,182,212,0.6), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{
        paddingTop: '0.7rem',
        paddingBottom: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('home')}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: '0 0 18px rgba(20, 184, 166, 0.4)',
            fontFamily: 'var(--font-heading)'
          }}>
            SB
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', lineHeight: 1.1, fontWeight: 700, fontFamily: 'var(--font-heading)' }}
              className="text-gradient">
              SkillBridge
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', letterSpacing: '0.04em' }}>
              UN SDG 4 • Learning Guidance
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          background: 'rgba(20, 184, 166, 0.04)',
          padding: '0.25rem 0.4rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(20, 184, 166, 0.1)'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(13,148,136,0.25), rgba(6,182,212,0.15))'
                    : 'transparent',
                  color: isActive ? '#5eead4' : item.disabled ? 'var(--text-dim)' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(20, 184, 166, 0.35)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.42rem 0.7rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.18s ease',
                  opacity: item.disabled ? 0.4 : 1,
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={13} />
                {item.label}
                {item.badge && (
                  <span className="badge badge-existing" style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                color: '#5eead4', fontSize: '0.82rem', fontWeight: 600,
                background: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(20,184,166,0.2)',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-pill)'
              }}>
                <User size={13} /> {user.full_name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '0.32rem 0.7rem' }}
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.42rem 0.95rem' }}
            >
              <LogIn size={14} /> Sign In
            </button>
          )}

          <div
            className={`health-dot ${backendHealth.status === 'healthy' ? 'healthy' : 'warning'}`}
            title={backendHealth.status === 'healthy' ? 'Engine Online' : 'Fallback Engine Active'}
          />
        </div>
      </div>
    </header>
  );
}
