import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Disclaimers() {
  return (
    <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-cyan)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <ShieldCheck size={18} style={{ color: 'var(--primary-cyan)' }} />
        <h4 style={{ fontSize: '0.95rem' }}>Responsible AI & Decision-Support Notice</h4>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        SkillBridge AI provides learning guidance and decision support under <strong>UN Sustainable Development Goal 4 (Quality Education)</strong>. Skill gap classifications and learning roadmaps are generated using transparent, deterministic rules. Skill evaluations reflect user-reported estimates and are not independent verifications of employment or professional competence.
      </p>
    </div>
  );
}
