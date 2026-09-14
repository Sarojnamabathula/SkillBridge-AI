import React, { useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import ProgressRing from '../components/ProgressRing';
import Disclaimers from '../components/Disclaimers';
import { Award, RefreshCw, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProgressPage({ setActiveTab }) {
  const { analysisResult, skillStatuses, updateSkillProgress } = useAnalysis();
  const [updating, setUpdating] = useState(false);

  if (!analysisResult) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No Progress Record Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Please complete your skill gap analysis first to track skill completion.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('profile')}>
          Start Skill Gap Analysis
        </button>
      </div>
    );
  }

  // Combine all skills from missing, needs_improvement, and existing
  const allSkills = [
    ...analysisResult.missing_skills,
    ...analysisResult.needs_improvement_skills,
    ...analysisResult.existing_skills,
    ...analysisResult.optional_skills
  ];

  const totalCount = allSkills.length;
  const completedCount = Object.values(skillStatuses).filter(s => s === 'COMPLETED').length;
  const learningCount = Object.values(skillStatuses).filter(s => s === 'LEARNING').length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleStatusChange = async (skillName, newStatus) => {
    setUpdating(true);
    await updateSkillProgress(skillName, newStatus);
    setUpdating(false);

    if (newStatus === 'COMPLETED') {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // canvas-confetti optional
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
            Self-Reported Skill Progress Tracker
          </span>
          <h1 className="text-gradient" style={{ fontSize: '2rem', margin: '0.2rem 0' }}>
            {analysisResult.career_name} Mastery
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Mark skills as Completed or In Progress to dynamically update your 5-phase roadmap.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ProgressRing percentage={progressPct} title="Completion Rate" size={120} />
          
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ marginBottom: '0.3rem' }}><strong style={{ color: '#10b981' }}>{completedCount}</strong> Completed</div>
            <div style={{ marginBottom: '0.3rem' }}><strong style={{ color: '#f59e0b' }}>{learningCount}</strong> Currently Learning</div>
            <div><strong style={{ color: '#ef4444' }}>{totalCount - completedCount - learningCount}</strong> Not Started</div>
          </div>
        </div>
      </div>

      {/* Skills Progress List */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Update Skill Statuses</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {allSkills.map((skill, idx) => {
            const currentStatus = skillStatuses[skill.skill_name] || (skill.classification === 'EXISTING' ? 'COMPLETED' : 'NOT_STARTED');

            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', display: 'inline-block', marginRight: '0.5rem' }}>{skill.skill_name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{skill.category} • Target: {skill.required_level}</span>
                </div>

                {/* Status Toggle Buttons */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleStatusChange(skill.skill_name, 'NOT_STARTED')}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.75rem', padding: '0.3rem 0.6rem',
                      background: currentStatus === 'NOT_STARTED' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                      borderColor: currentStatus === 'NOT_STARTED' ? '#ef4444' : 'var(--border-color)',
                      color: currentStatus === 'NOT_STARTED' ? '#fca5a5' : 'var(--text-muted)'
                    }}
                  >
                    Not Started
                  </button>

                  <button
                    onClick={() => handleStatusChange(skill.skill_name, 'LEARNING')}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.75rem', padding: '0.3rem 0.6rem',
                      background: currentStatus === 'LEARNING' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                      borderColor: currentStatus === 'LEARNING' ? '#f59e0b' : 'var(--border-color)',
                      color: currentStatus === 'LEARNING' ? '#fcd34d' : 'var(--text-muted)'
                    }}
                  >
                    <PlayCircle size={12} /> Learning
                  </button>

                  <button
                    onClick={() => handleStatusChange(skill.skill_name, 'COMPLETED')}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.75rem', padding: '0.3rem 0.6rem',
                      background: currentStatus === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      borderColor: currentStatus === 'COMPLETED' ? '#10b981' : 'var(--border-color)',
                      color: currentStatus === 'COMPLETED' ? '#6ee7b7' : 'var(--text-muted)'
                    }}
                  >
                    <CheckCircle2 size={12} /> Completed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Disclaimer */}
      <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
        <h4 style={{ color: 'var(--primary-cyan)', marginBottom: '0.4rem' }}>Progress Tracking Verification Disclosure</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          SkillBridge AI does not claim that completed skills have been independently or externally verified. Statuses represent self-reported user estimates designed to adapt your personalized learning sequence.
        </p>
      </div>

      <Disclaimers />
    </div>
  );
}
