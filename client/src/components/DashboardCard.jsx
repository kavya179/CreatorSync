import React from 'react';

const DashboardCard = ({ 
  title = 'Metric', 
  value = 0, 
  subtitle, 
  icon, 
  color = '#1e3a8a', 
  trend 
}) => {
  const displayValue = value !== null && value !== undefined ? value : 0;

  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: '34px 32px 28px 32px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '180px'
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: color || '#1e3a8a'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '20px' }}>
        <div>
          <span style={{ 
            fontSize: '0.78rem', 
            fontWeight: 800, 
            color: color || '#1e3a8a', 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '10px'
          }}>
            {title}
          </span>
          <h3 style={{ 
            fontSize: '2.3rem', 
            fontWeight: 900, 
            margin: 0, 
            color: '#0f172a', 
            fontFamily: "'Outfit', var(--font-sans)",
            lineHeight: '1.15'
          }}>
            {displayValue}
          </h3>
        </div>
        
        {icon && (
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
        {subtitle && (
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
            {subtitle}
          </span>
        )}
        {trend && (
          <span style={{ 
            fontSize: '0.78rem', 
            fontWeight: 800, 
            color: '#3b82f6', 
            background: '#eff6ff', 
            padding: '4px 12px', 
            borderRadius: '9999px', 
            border: '1px solid #bfdbfe',
            marginLeft: 'auto'
          }}>
            {String(trend)}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
