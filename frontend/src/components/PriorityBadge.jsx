import React from 'react';

export default function PriorityBadge({ priority }) {
  const p = (priority || 'MEDIUM').toUpperCase();
  let badgeClass = 'badge-medium';
  if (p === 'CRITICAL') badgeClass = 'badge-critical';
  else if (p === 'HIGH') badgeClass = 'badge-high';
  else if (p === 'OPTIONAL') badgeClass = 'badge-optional';

  return (
    <span className={`badge ${badgeClass}`}>
      {p} Priority
    </span>
  );
}
