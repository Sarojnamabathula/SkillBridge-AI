import React, { useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { Briefcase, Check, ArrowRight, ShieldCheck, Cpu, Code, Database, Cloud, Terminal } from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';

const CAREER_ICONS = {
  data_analyst: Database,
  software_developer: Code,
  full_stack_developer: Terminal,
  web_developer: Code,
  ai_ml_engineer: Cpu,
  cybersecurity_analyst: ShieldCheck,
  cloud_engineer: Cloud
};

export default function CareerSelectionPage({ setActiveTab }) {
  const { careers, learnerProfile, setLearnerProfile, runAnalysis } = useAnalysis();
  const [selectedId, setSelectedId] = useState(learnerProfile.career_goal || 'data_analyst');

  const handleSelect = (careerId) => {
    setSelectedId(careerId);
    setLearnerProfile(prev => ({ ...prev, career_goal: careerId }));
  };

  const handleProceed = async () => {
    try {
      await runAnalysis();
      setActiveTab('analysis');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Career Skill Profile Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Explore structured career profiles aligned with industry standards. Selecting a career loads its required skills, prerequisites, and proficiency expectations.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {careers.map(c => {
          const Icon = CAREER_ICONS[c.career_id] || Briefcase;
          const isSelected = selectedId === c.career_id;

          return (
            <div
              key={c.career_id}
              className={`glass-card glass-card-interactive ${isSelected ? 'glass-card-purple' : ''}`}
              onClick={() => handleSelect(c.career_id)}
              style={{
                cursor: 'pointer',
                borderWidth: isSelected ? '1px' : '1px',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--primary-gradient)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={16} strokeWidth={3} />
                </div>
              )}

              <div style={{
                width: '45px', height: '45px', borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.05)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
              }}>
                <Icon size={24} style={{ color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)' }} />
              </div>

              <h3 style={{ marginBottom: '0.4rem', fontSize: '1.2rem' }}>{c.name}</h3>
              <span className="badge badge-medium" style={{ marginBottom: '0.75rem' }}>
                {c.category}
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {c.description}
              </p>

              {c.skills && c.skills.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>
                    Key Skills Required ({c.skills.length}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {c.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)',
                        padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)'
                      }}>
                        {s.name}
                      </span>
                    ))}
                    {c.skills.length > 4 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--brand-teal)' }}>
                        +{c.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn-primary" onClick={handleProceed}>
          Analyze Skills for Selected Career <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
