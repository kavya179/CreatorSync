import React from 'react';

const AnalyticsCard = ({ title, children, action }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '38px 42px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ marginBottom: '28px' }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a', fontFamily: "'Outfit', var(--font-sans)" }}>{title}</h4>
        {action}
      </div>
      <div style={{ marginTop: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default AnalyticsCard;
