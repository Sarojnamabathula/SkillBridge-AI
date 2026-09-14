import React from 'react';
import { ShieldCheck, Eye, Lock, AlertTriangle, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function ResponsibleAIPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem'
        }}>
          <ShieldCheck size={16} /> Responsible AI Framework & Ethics
        </div>

        <h1 className="text-gradient" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Responsible AI, Privacy & Limitations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          SkillBridge AI is designed with strict adherence to fairness, transparency, privacy, ethics, and UN SDG 4 educational principles.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* FAIRNESS */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <HeartHandshake size={22} style={{ color: 'var(--primary-cyan)' }} />
            <h2 style={{ fontSize: '1.35rem' }}>1. Fairness & Non-Discrimination</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            SkillBridge AI strictly excludes demographic and sensitive personal attributes—including gender, race, ethnicity, religion, caste, political beliefs, and financial status—from all recommendation logic. Recommendations are strictly computed based on:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <li>User-reported current skills and proficiency levels.</li>
            <li>Selected target career skill benchmarks.</li>
            <li>Prerequisite dependency graphs.</li>
            <li>User-specified weekly learning availability.</li>
          </ul>
        </div>

        {/* TRANSPARENCY */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Eye size={22} style={{ color: 'var(--accent-purple)' }} />
            <h2 style={{ fontSize: '1.35rem' }}>2. Transparency & Explainability</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            All skill gap classifications (Existing, Needs Improvement, Missing, Optional) and priority scores are calculated using <strong>transparent, rule-based deterministic logic</strong>. AI models enhance narrative descriptions but do not silently fabricate missing skills or alter required prerequisites. Every recommendation displays an explicit rationale explaining why a skill was recommended.
          </p>
        </div>

        {/* PRIVACY */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Lock size={22} style={{ color: '#10b981' }} />
            <h2 style={{ fontSize: '1.35rem' }}>3. Privacy & Data Minimization</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Data collection is strictly minimized to what is necessary for learning gap analysis. Optional free-text or resume descriptions are processed transiently in-memory for entity extraction and are <strong>never stored, logged, or shared for third-party advertising or commercial profiling</strong>.
          </p>
        </div>

        {/* ETHICS & NO GUARANTEE */}
        <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={22} style={{ color: '#f59e0b' }} />
            <h2 style={{ fontSize: '1.35rem' }}>4. Ethical Disclaimers (No Job Guarantee)</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            <strong>Mandatory Notice:</strong> SkillBridge AI provides learning guidance and decision support. Recommendations are not guarantees of employment, career placement, salary outcomes, or professional certification.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            The system acts as a decision-support guide to complement, rather than replace, formal education and professional mentorship.
          </p>
        </div>

        {/* SYSTEM LIMITATIONS */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--primary-blue)' }} />
            <h2 style={{ fontSize: '1.35rem' }}>5. Explicit System Limitations</h2>
          </div>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <li><strong>Changing Industry Standards:</strong> Career profiles represent structured benchmarks but job requirements vary across employers, regions, and team sizes.</li>
            <li><strong>Self-Reported Estimates:</strong> Input proficiency levels reflect self-reported learner estimates and are not independently proctored or verified.</li>
            <li><strong>Knowledge Base Scope:</strong> The prototype contains initial career profiles; actual global workforce skills evolve continuously.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
