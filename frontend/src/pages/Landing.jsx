import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Zap, Target, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '100px 20px 80px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'var(--primary)',
          filter: 'blur(120px)',
          opacity: 0.15,
          zIndex: -1
        }} />

        <div className="badge badge-primary animate-float" style={{ marginBottom: '24px', fontSize: '0.85rem', padding: '6px 16px' }}>
          <Sparkles size={14} style={{ marginRight: '6px' }} />
          Introducing CreatorSync v1.0
        </div>
        
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          lineHeight: '1.15',
          letterSpacing: '-0.03em',
          marginBottom: '24px'
        }}>
          Collaborate Smarter. <br />
          <span className="gradient-text">Creator</span> & <span className="gradient-text-sec">Brand</span> Integration.
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '650px',
          margin: '0 auto 40px auto'
        }}>
          A unified workspace to negotiate rates, publish briefs, apply for sponsorships, and manage milestones safely.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px' }}>
            Get Started
            <ChevronRight size={18} />
          </Link>
          <Link to="/campaigns" className="btn btn-outline" style={{ padding: '14px 28px' }}>
            Browse Campaigns
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '48px', fontWeight: 800 }}>
          Everything you need to collaborate in <span className="gradient-text">Sync</span>
        </h2>

        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
            <Zap size={32} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>Structured Briefs</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Brands publish clear platform specifications, target audiences, and structured budgets. No guess work.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
            <Target size={32} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>Tailored Submissions</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Creators submit custom pitches, price proposals, and reference active social channels directly to sponsors.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
            <ShieldCheck size={32} style={{ color: 'var(--success)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>Milestone Trackers</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Track execution stages step-by-step. Creators upload draft proofs, and brands approve deliverables securely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
