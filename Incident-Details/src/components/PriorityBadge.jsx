import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const getBadgeStyle = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'rgba(255, 69, 58, 0.12)',
          border: 'rgba(255, 69, 58, 0.3)',
          color: '#FF453A',
          dot: '#FF453A'
        };
      case 'high':
        return {
          bg: 'rgba(255, 159, 10, 0.12)',
          border: 'rgba(255, 159, 10, 0.3)',
          color: '#FF9F0A',
          dot: '#FF9F0A'
        };
      case 'medium':
        return {
          bg: 'rgba(255, 214, 10, 0.12)',
          border: 'rgba(255, 214, 10, 0.3)',
          color: '#FFD60A',
          dot: '#FFD60A'
        };
      case 'low':
        return {
          bg: 'rgba(48, 209, 88, 0.12)',
          border: 'rgba(48, 209, 88, 0.3)',
          color: '#30D158',
          dot: '#30D158'
        };
      default:
        return {
          bg: 'rgba(161, 161, 166, 0.12)',
          border: 'rgba(161, 161, 166, 0.3)',
          color: '#A1A1A6',
          dot: '#A1A1A6'
        };
    }
  };

  const style = getBadgeStyle(priority);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.02em',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.dot,
        }}
      />
      {priority}
    </span>
  );
};
