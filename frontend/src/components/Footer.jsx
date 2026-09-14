import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(20,184,166,0.15)',
      background: 'var(--bg-dark)',
      padding: '2.5rem 0',
      marginTop: '4rem',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        <div style={{ maxWidth: '400px' }}>
          <h3 className="text-gradient" style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>SkillBridge AI</h3>
          <p style={{ lineHeight: 1.5, marginBottom: '1rem' }}>
            An AI-powered decision support system identifying learning skill gaps and generating personalized learning pathways in support of Sustainable Development Goal 4 (Quality Education).
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Primary Focus: UN SDG 4 • Secondary Contribution: UN SDG 8
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>Quick Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><a style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }} onClick={() => setActiveTab('home')}>Home</a></li>
            <li><a style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }} onClick={() => setActiveTab('profile')}>Analyze Skills</a></li>
            <li><a style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }} onClick={() => setActiveTab('career')}>Career Catalog</a></li>
            <li><a style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }} onClick={() => setActiveTab('responsible-ai')}>Responsible AI Disclosures</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>Responsible AI Notice</h4>
          <p style={{ fontSize: '0.75rem', maxWidth: '300px', lineHeight: 1.5 }}>
            SkillBridge AI provides learning guidance and decision support. Skill evaluations reflect user-reported estimates and are not guarantees of employment or career success.
          </p>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid rgba(20,184,166,0.08)',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-dim)'
      }}>
        © 2026 SkillBridge AI • Internship Capstone Prototype • Built for Sustainable & Inclusive Education
      </div>
    </footer>
  );
}
