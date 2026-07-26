import React from 'react';

const AnalyticsCard = ({ title, children, action }) => {
  return (
    <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{title}</h4>
        {action}
      </div>
      {children}
    </div>
  );
};

export default AnalyticsCard;
