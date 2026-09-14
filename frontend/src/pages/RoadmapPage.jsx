import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import PriorityBadge from '../components/PriorityBadge';
import Disclaimers from '../components/Disclaimers';
import { Map, Clock, CheckCircle2, ArrowRight, Layers, Award, Sparkles } from 'lucide-react';

export default function RoadmapPage({ setActiveTab }) {
  const { analysisResult } = useAnalysis();

  if (!analysisResult || !analysisResult.roadmap) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No Active Roadmap Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Please complete your skill gap analysis first to generate a personalized learning roadmap.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('profile')}>
          Go to Profile & Analysis
        </button>
      </div>
    );
  }

  const { roadmap, career_name } = analysisResult;

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <span className="section-label">
            Personalized Learning Pathway • {career_name}
          </span>
          <h1 className="text-gradient" style={{ fontSize: '2rem', margin: '0.2rem 0' }}>
            5-Phase Skill Sequence Roadmap
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Sequenced according to prerequisite dependencies and career priority.
          </p>
        </div>

        <div style={{
          background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.25)',
          padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'right'
        }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }} className="text-gradient">
            ~{roadmap.total_estimated_weeks} Weeks
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            at {roadmap.weekly_commitment_hours} Hours / Week
          </span>
        </div>
      </div>

      {/* Timeline of 5 Phases */}
      <div className="timeline">
        {roadmap.phases.map((phase) => (
          <div key={phase.phase_number} className="timeline-item">
            <div className="timeline-dot" />

            <div className="glass-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-medium" style={{ marginBottom: '0.3rem' }}>
                    Phase {phase.phase_number}
                  </span>
                  <h2 style={{ fontSize: '1.4rem' }}>{phase.phase_title}</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--brand-teal)' }}>
                  <Clock size={16} /> ~{phase.duration_weeks} Weeks
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {phase.objective}
              </p>

              {/* Skills in Phase */}
              {phase.skills && phase.skills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {phase.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem' }}>{skill.skill_name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {skill.category} • Target Proficiency: <strong style={{ color: 'var(--brand-teal)' }}>{skill.target_proficiency}</strong>
                          </span>
                        </div>
                        <PriorityBadge priority={skill.priority} />
                      </div>

                      <div style={{ margin: '0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-main)' }}>Suggested Practice:</strong> {skill.suggested_practice}
                      </div>

                      {skill.prerequisites && skill.prerequisites.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                          <span>Prerequisite Dependencies: </span>
                          {skill.prerequisites.map((pr, pIdx) => (
                            <span key={pIdx} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginRight: '0.3rem', color: 'var(--text-muted)' }}>
                              {pr}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <Award size={18} style={{ color: 'var(--brand-teal)' }} />
                  {phase.phase_number === 5
                    ? 'Engineered portfolio projects (See Projects tab for recommended hands-on builds).'
                    : 'No additional missing skills assigned to this phase.'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flexible Time Guarantee Disclaimer */}
      <div className="glass-card" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)', margin: '2rem 0' }}>
        <h4 style={{ color: '#f59e0b', marginBottom: '0.4rem' }}>Flexible Learning Timeline Disclaimer</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Time estimates (e.g. ~{roadmap.total_estimated_weeks} weeks) are flexible approximations based on your self-reported weekly study hours ({roadmap.weekly_commitment_hours} hrs/week). SkillBridge AI does not guarantee specific timelines, as actual mastery speed depends on prior experience, study consistency, and individual learning style.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
        <button className="btn-secondary" onClick={() => setActiveTab('projects')}>
          View Practical Projects
        </button>
        <button className="btn-primary" onClick={() => setActiveTab('progress')}>
          Track Progress & Regenerate Roadmap <ArrowRight size={18} />
        </button>
      </div>

      <Disclaimers />
    </div>
  );
}
