import React from 'react';

export default function SkillTag({ name, classification, level, onRemove }) {
  let badgeClass = 'badge-medium';
  if (classification === 'EXISTING') badgeClass = 'badge-existing';
  else if (classification === 'NEEDS_IMPROVEMENT') badgeClass = 'badge-improvement';
  else if (classification === 'MISSING') badgeClass = 'badge-missing';

  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
      {name} {level ? `(${level})` : ''}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            marginLeft: '0.3rem',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
