import React from 'react';

const AnalyticsCard = ({ title, children, action }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '28px',
        borderRadius: '20px',
        background: 'rgba(19, 19, 24, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Outfit', var(--font-sans)" }}>{title}</h4>
        {action}
      </div>
      {children}
    </div>
  );
};

export default AnalyticsCard;
