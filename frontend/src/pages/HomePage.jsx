import React from 'react';
import { ArrowRight, Target, Map, Award, CheckCircle2, Layers, Zap, Globe } from 'lucide-react';
import Disclaimers from '../components/Disclaimers';

export default function HomePage({ setActiveTab }) {
  return (
    <div className="animate-fade-in">
      {/* Ambient right orb */}
      <div className="ambient-orb-right" />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3rem 1rem' }}>

        {/* Badge */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div className="pill-badge">
            <Globe size={13} />
            <span>UN Sustainable Development Goal 4 • Quality Education</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          maxWidth: '900px',
          margin: '0 auto 1.4rem auto',
          lineHeight: 1.12,
          fontWeight: 800
        }} className="text-shimmer">
          Build the Technical Skills Modern Careers Demand
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.65
        }}>
          SkillBridge evaluates your current skills against structured industry benchmarks, surfaces missing prerequisites, and generates a step-by-step learning pathway tailored to your schedule.
        </p>

        {/* CTA Row */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <button
            className="btn-primary"
            style={{ fontSize: '0.96rem', padding: '0.9rem 2.1rem' }}
            onClick={() => setActiveTab('profile')}
          >
            Analyze My Skill Profile <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '0.96rem', padding: '0.9rem 2rem' }}
            onClick={() => setActiveTab('career')}
          >
            Explore Career Benchmarks
          </button>
        </div>

        {/* Domain Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
          opacity: 0.6,
          margin: '0 auto 4rem auto',
          padding: '0.85rem 2rem',
          background: 'rgba(20,184,166,0.04)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(20,184,166,0.1)',
          maxWidth: '900px'
        }}>
          {['DATA ANALYTICS', 'FULL STACK ENGINEERING', 'AI & ML', 'CYBERSECURITY', 'CLOUD ARCHITECTURE'].map(d => (
            <span key={d} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid-3" style={{ marginBottom: '3.5rem' }}>
        <div className="glass-card glass-card-interactive">
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
            background: 'rgba(20, 184, 166, 0.1)',
            border: '1px solid rgba(20, 184, 166, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.3rem'
          }}>
            <Target size={22} style={{ color: 'var(--brand-teal)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem' }}>Deterministic Gap Matrix</h3>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Normalizes skill variants (e.g. "py" → Python, "mysql" → SQL) and classifies competencies into Existing, Needs Improvement, Missing, and Optional using transparent rule logic — no black-box AI.
          </p>
        </div>

        <div className="glass-card glass-card-interactive">
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.3rem'
          }}>
            <Map size={22} style={{ color: 'var(--brand-coral)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem' }}>Prerequisite-Ordered Pathways</h3>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Structures learning into a 5-phase sequential curriculum. Foundational prerequisites are always scheduled before advanced specializations so you never hit knowledge walls.
          </p>
        </div>

        <div className="glass-card glass-card-interactive">
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.3rem'
          }}>
            <Award size={22} style={{ color: 'var(--brand-cyan)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem' }}>Portfolio Capstone Projects</h3>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Recommends hands-on builds calibrated to your target career, enabling you to demonstrate observable technical proficiency to prospective employers.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="glass-card" style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>WORKFLOW</div>
          <h2 style={{ fontSize: '1.65rem' }}>How SkillBridge Operates</h2>
        </div>

        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {[
            {
              step: '01',
              title: 'Define Profile & Skills',
              desc: 'Input your education level, experience, self-reported skills, and weekly study time.',
              color: 'var(--brand-teal)'
            },
            {
              step: '02',
              title: 'Select Career Benchmark',
              desc: 'Choose a target role from 7 career benchmarks covering Data, Engineering, AI/ML, Security, and Cloud.',
              color: 'var(--brand-coral)'
            },
            {
              step: '03',
              title: 'Get Gap Matrix & Roadmap',
              desc: 'Receive a classified gap report, readiness score, 5-phase roadmap, and capstone project ideas.',
              color: 'var(--brand-cyan)'
            }
          ].map(({ step, title, desc, color }) => (
            <div key={step} style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '1.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(20,184,166,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                fontSize: '3.5rem', fontWeight: 900, color, opacity: 0.08,
                position: 'absolute', top: '-0.5rem', right: '0.75rem',
                fontFamily: 'var(--font-heading)', lineHeight: 1
              }}>
                {step}
              </div>
              <div className="section-label" style={{ color, marginBottom: '0.4rem' }}>STEP {step}</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.45rem' }}>{title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SDG Commitment */}
      <section className="glass-card" style={{
        borderLeft: '3px solid var(--brand-teal)',
        background: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(6,182,212,0.03) 100%)',
        margin: '2rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Zap size={18} style={{ color: 'var(--brand-teal)' }} />
          <h3 style={{ color: 'var(--brand-teal)', fontSize: '1.15rem' }}>
            UN Sustainable Development Goals Commitment
          </h3>
        </div>
        <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--text-main)' }}>Primary SDG 4 (Quality Education)</strong>: Making career skill gap identification accessible, equitable, and personalized for learners worldwide.<br />
          <strong style={{ color: 'var(--text-main)' }}>Secondary SDG 8 (Decent Work & Economic Growth)</strong>: Assisting lifelong learners in building workforce-ready competencies for sustainable employment.
        </p>
      </section>

      <Disclaimers />
    </div>
  );
}
