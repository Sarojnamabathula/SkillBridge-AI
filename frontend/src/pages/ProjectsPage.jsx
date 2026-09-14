import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import PriorityBadge from '../components/PriorityBadge';
import Disclaimers from '../components/Disclaimers';
import { Code, CheckCircle, ArrowRight, Award, FolderGit2 } from 'lucide-react';

export default function ProjectsPage({ setActiveTab }) {
  const { analysisResult } = useAnalysis();

  if (!analysisResult || !analysisResult.roadmap) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No Active Projects Recommended</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Please complete your skill gap analysis first to view tailored practical projects.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('profile')}>
          Start Skill Gap Analysis
        </button>
      </div>
    );
  }

  const projects = analysisResult.roadmap.recommended_projects || [];
  const careerName = analysisResult.career_name;

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Practical Project Recommendations
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Portfolio projects engineered for <strong>{careerName}</strong>. Building these hands-on artifacts allows you to demonstrate missing competencies in real-world scenarios.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {projects.map((proj, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FolderGit2 size={22} style={{ color: 'var(--primary-cyan)' }} />
                  <h3 style={{ fontSize: '1.25rem' }}>{proj.title}</h3>
                </div>
                <span className="badge badge-medium">
                  {proj.difficulty}
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {proj.description}
              </p>

              {/* Skills Practiced */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>
                  Skills Practiced in Project:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {proj.skills_practiced.map((skill, sIdx) => (
                    <span key={sIdx} className="badge badge-existing" style={{ fontSize: '0.75rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Outcome Box */}
            <div style={{
              background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: 'var(--radius-md)', padding: '0.85rem', marginTop: '1rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                Expected Learning Outcome:
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {proj.learning_outcome}
              </p>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
            No specific projects loaded. Complete your skill gap analysis to generate tailored project recommendations.
          </div>
        )}
      </div>

      <Disclaimers />
    </div>
  );
}
