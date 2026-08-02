import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon, color = '#1e3a8a', trend }) => {
  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: color
        }}
      />

      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span style={{ fontSize: '0.73rem', fontWeight: 800, color: color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {title}
          </span>
          <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '6px 0 0 0', color: '#0f172a', fontFamily: "'Outfit', var(--font-sans)" }}>
            {value}
          </h3>
        </div>
        {icon && (
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justify-content: 'center'
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        {subtitle && (
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {subtitle}
          </span>
        )}
        {trend && (
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
