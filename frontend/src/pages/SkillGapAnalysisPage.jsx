import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import ProgressRing from '../components/ProgressRing';
import PriorityBadge from '../components/PriorityBadge';
import Disclaimers from '../components/Disclaimers';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, BookOpen, MapPin } from 'lucide-react';

export default function SkillGapAnalysisPage({ setActiveTab }) {
  const { analysisResult } = useAnalysis();

  if (!analysisResult) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No Active Skill Gap Analysis</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Please complete your learner profile or select a career to generate a skill gap report.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('profile')}>
          Start Skill Gap Analysis
        </button>
      </div>
    );
  }

  const { summary, existing_skills, needs_improvement_skills, missing_skills, optional_skills, career_name, learner_profile_summary } = analysisResult;

  return (
    <div className="animate-fade-in">
      {/* Top Banner / Summary Header */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <span className="section-label">
            Competency Gap Matrix • {career_name}
          </span>
          <h1 className="text-gradient" style={{ fontSize: '2rem', margin: '0.2rem 0' }}>
            Skill Readiness & Benchmark Comparison
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
            {learner_profile_summary?.narrative || 'Deterministic evaluation of your technical skills against industry career benchmarks.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ProgressRing percentage={summary.readiness_percentage} title="Career Readiness" size={130} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div><span style={{ color: '#10b981', fontWeight: 700 }}>● {summary.existing_count}</span> Existing Skills</div>
            <div><span style={{ color: 'var(--brand-coral)', fontWeight: 700 }}>● {summary.needs_improvement_count}</span> Needs Improvement</div>
            <div><span style={{ color: '#f43f5e', fontWeight: 700 }}>● {summary.missing_count}</span> Missing Skills</div>
            <div><span style={{ color: 'var(--brand-cyan)', fontWeight: 700 }}>● {summary.optional_count}</span> Optional Skills</div>
          </div>
        </div>
      </div>

      {/* Category Tabs / Sections */}

      {/* 1. MISSING ESSENTIAL SKILLS */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <AlertCircle style={{ color: '#ef4444' }} size={22} />
          <h2 style={{ fontSize: '1.35rem' }}>Missing Essential Skills ({missing_skills.length})</h2>
        </div>

        <div className="grid-2">
          {missing_skills.map((item, idx) => (
            <SkillCard key={idx} item={item} badgeType="badge-missing" />
          ))}
          {missing_skills.length === 0 && (
            <div className="glass-card" style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              No missing essential skills! You have covered all baseline career requirements.
            </div>
          )}
        </div>
      </section>

      {/* 2. SKILLS REQUIRING IMPROVEMENT */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <HelpCircle style={{ color: '#f59e0b' }} size={22} />
          <h2 style={{ fontSize: '1.35rem' }}>Skills Requiring Improvement ({needs_improvement_skills.length})</h2>
        </div>

        <div className="grid-2">
          {needs_improvement_skills.map((item, idx) => (
            <SkillCard key={idx} item={item} badgeType="badge-improvement" />
          ))}
          {needs_improvement_skills.length === 0 && (
            <div className="glass-card" style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              No skills currently requiring level improvement.
            </div>
          )}
        </div>
      </section>

      {/* 3. EXISTING RELEVANT SKILLS */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CheckCircle2 style={{ color: '#10b981' }} size={22} />
          <h2 style={{ fontSize: '1.35rem' }}>Existing Relevant Skills ({existing_skills.length})</h2>
        </div>

        <div className="grid-2">
          {existing_skills.map((item, idx) => (
            <SkillCard key={idx} item={item} badgeType="badge-existing" />
          ))}
          {existing_skills.length === 0 && (
            <div className="glass-card" style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              No existing matching skills found yet.
            </div>
          )}
        </div>
      </section>

      {/* 4. OPTIONAL ADVANCED SKILLS */}
      {optional_skills.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Optional Specialization Skills ({optional_skills.length})
          </h2>
          <div className="grid-2">
            {optional_skills.map((item, idx) => (
              <SkillCard key={idx} item={item} badgeType="badge-optional" />
            ))}
          </div>
        </section>
      )}

      {/* CTA to Roadmap */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0' }}>
        <button className="btn-primary" onClick={() => setActiveTab('roadmap')}>
          View Personalized Learning Roadmap <ArrowRight size={18} />
        </button>
      </div>

      <Disclaimers />
    </div>
  );
}

function SkillCard({ item, badgeType }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>{item.skill_name}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.category}</span>
          </div>
          <PriorityBadge priority={item.priority} />
        </div>

        <div style={{
          display: 'flex', gap: '0.75rem', fontSize: '0.8rem', margin: '0.6rem 0',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
          background: 'rgba(20,184,166,0.04)', border: '1px solid rgba(20,184,166,0.1)'
        }}>
          <div><strong>Your Level:</strong> <span style={{ color: item.current_level === 'None' ? '#f43f5e' : '#10b981' }}>{item.current_level}</span></div>
          <div><strong>Target Level:</strong> <span style={{ color: 'var(--brand-teal)' }}>{item.required_level}</span></div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
          {item.explanation}
        </p>
      </div>

      {item.prerequisites && item.prerequisites.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-dim)', marginRight: '0.4rem' }}>Prerequisites:</span>
          {item.prerequisites.map((p, i) => (
            <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginRight: '0.3rem', color: 'var(--text-muted)' }}>
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
