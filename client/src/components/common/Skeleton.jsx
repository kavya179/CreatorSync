import React from 'react';

const Skeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  const renderSkeletonType = () => {
    switch (type) {
      case 'text':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <div className="skeleton-pulse" style={{ height: '16px', width: '80%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
            <div className="skeleton-pulse" style={{ height: '12px', width: '60%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
          </div>
        );
      case 'profile':
        return (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%', padding: '16px' }}>
            <div className="skeleton-pulse" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
              <div className="skeleton-pulse" style={{ height: '16px', width: '40%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
              <div className="skeleton-pulse" style={{ height: '12px', width: '25%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
            </div>
          </div>
        );
      default: // 'card'
        return (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '180px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="skeleton-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                <div className="skeleton-pulse" style={{ height: '14px', width: '50%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
                <div className="skeleton-pulse" style={{ height: '10px', width: '30%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
              </div>
            </div>
            <div className="skeleton-pulse" style={{ height: '12px', width: '90%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
            <div className="skeleton-pulse" style={{ height: '12px', width: '70%', borderRadius: '4px', background: 'var(--border-color)' }}></div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {items.map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeletonType()}
        </React.Fragment>
      ))}
      <style>{`
        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
