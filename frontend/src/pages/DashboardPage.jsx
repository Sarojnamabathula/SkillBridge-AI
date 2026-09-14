import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import { fetchDashboardStats } from '../services/api';
import ProgressRing from '../components/ProgressRing';
import Disclaimers from '../components/Disclaimers';
import {
  LayoutDashboard, Award, CheckCircle2, Clock, BookOpen,
  Layers, ArrowRight, RefreshCw, BarChart2, TrendingUp, Target
} from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const { user } = useAuth();
  const { setAnalysisResult } = useAnalysis();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, [user]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSession = () => setActiveTab('analysis');

  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <RefreshCw size={34} className="spin" style={{ color: 'var(--brand-teal)', marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-muted)' }}>Loading Progress Dashboard...</h3>
      </div>
    );
  }

  const {
    total_sessions = 0,
    active_careers = [],
    overall_readiness_avg = 0.0,
    total_completed_skills = 0,
    total_learning_skills = 0,
    total_missing_skills = 0,
    category_breakdown = {},
    session_history = []
  } = stats || {};

  return (
    <div className="animate-fade-in">
      {/* Dashboard Header */}
      <div className="glass-card" style={{
        marginBottom: '2rem',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(6,182,212,0.05) 100%)',
        border: '1px solid rgba(20,184,166,0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <LayoutDashboard size={18} style={{ color: 'var(--brand-teal)' }} />
            <span className="section-label">Learner Monitoring & Progress Analytics</span>
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.2rem', margin: '0.2rem 0', lineHeight: 1.1 }}>
            {user ? `${user.full_name}'s Dashboard` : 'Guest Progress Dashboard'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Real-time analytics — skill completion rates, career readiness scores, and session history.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setActiveTab('profile')}>
          Run New Analysis <ArrowRight size={18} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Readiness */}
        <div className="glass-card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: '1px solid rgba(20,184,166,0.15)'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Average Readiness
            </span>
            <div className="stat-accent" style={{ marginTop: '0.2rem' }}>
              {overall_readiness_avg}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Across {total_sessions} analysis session{total_sessions !== 1 ? 's' : ''}
            </span>
          </div>
          <ProgressRing percentage={overall_readiness_avg} size={88} strokeWidth={8} title="" />
        </div>

        {/* Skills Status */}
        <div className="glass-card" style={{ border: '1px solid rgba(20,184,166,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Skills Breakdown
            </span>
            <TrendingUp size={18} style={{ color: 'var(--brand-emerald)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {[
              { count: total_completed_skills, label: 'Completed', color: '#10b981' },
              { count: total_learning_skills, label: 'In Progress', color: 'var(--brand-coral)' },
              { count: total_missing_skills, label: 'Missing', color: '#f43f5e' }
            ].map(({ count, label, color }) => (
              <div key={label}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>{count}</span>
                <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Career Goals */}
        <div className="glass-card" style={{ border: '1px solid rgba(6,182,212,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Active Career Goals
            </span>
            <Target size={18} style={{ color: 'var(--brand-cyan)' }} />
          </div>
          <div className="stat-accent" style={{ marginBottom: '0.4rem' }}>{active_careers.length} Roles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {active_careers.map((c, i) => (
              <span key={i} className="badge badge-medium" style={{ fontSize: '0.7rem' }}>{c}</span>
            ))}
            {active_careers.length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No career goals analyzed yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Mastery */}
      <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(20,184,166,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <BarChart2 size={20} style={{ color: 'var(--brand-teal)' }} />
          <h3 style={{ fontSize: '1.25rem' }}>Skill Mastery by Category</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {Object.entries(category_breakdown).map(([category, info], idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>{category}</span>
                <span style={{ color: 'var(--brand-teal)', fontWeight: 700 }}>
                  {info.completed} / {info.total} ({info.completion_percentage}%)
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${info.completion_percentage}%` }} />
              </div>
            </div>
          ))}

          {Object.keys(category_breakdown).length === 0 && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.25rem',
              background: 'rgba(20,184,166,0.04)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(20,184,166,0.15)' }}>
              Run a skill gap analysis to generate category mastery metrics.
            </div>
          )}
        </div>
      </div>

      {/* Session History Table */}
      <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(20,184,166,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Clock size={18} style={{ color: 'var(--brand-cyan)' }} />
          <h3 style={{ fontSize: '1.2rem' }}>Historical Analysis Sessions</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(20,184,166,0.12)', color: 'var(--text-muted)' }}>
                {['Date & Time', 'Career Goal', 'Readiness Score', 'Missing Skills', 'Existing Skills', 'Action'].map((h, i) => (
                  <th key={h} style={{ padding: '0.75rem 0.9rem', fontWeight: 600, fontSize: '0.78rem',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    textAlign: i === 5 ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {session_history.map((sess, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.8rem 0.9rem', color: 'var(--text-dim)' }}>
                    {sess.created_at ? new Date(sess.created_at).toLocaleDateString() : 'Recent'}
                  </td>
                  <td style={{ padding: '0.8rem 0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {sess.career_name}
                  </td>
                  <td style={{ padding: '0.8rem 0.9rem' }}>
                    <span className="badge badge-existing">{sess.readiness_percentage}%</span>
                  </td>
                  <td style={{ padding: '0.8rem 0.9rem', color: '#f43f5e', fontWeight: 600 }}>
                    {sess.missing_count} Skills
                  </td>
                  <td style={{ padding: '0.8rem 0.9rem', color: '#10b981', fontWeight: 600 }}>
                    {sess.existing_count} Skills
                  </td>
                  <td style={{ padding: '0.8rem 0.9rem', textAlign: 'right' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.28rem 0.65rem' }}
                      onClick={() => handleResumeSession(sess)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
              {session_history.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{
                      background: 'rgba(20,184,166,0.04)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed rgba(20,184,166,0.15)',
                      padding: '1.25rem'
                    }}>
                      No sessions logged yet. Complete your first skill gap analysis to populate this dashboard.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Disclaimers />
    </div>
  );
}
