import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Building,
  Globe,
  Star,
  Users,
  Briefcase,
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

const BrandDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/brands/${id}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load brand profile.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrandProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading company profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={40} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Profile Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error || 'Brand profile not found.'}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const { brand, projects, reviews, avgRating, totalReviews, totalHired } = data;
  const userDetails = brand.userId || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }} className="animate-fade-in-up">
      
      {/* 1. Header Hero Card (Basic Info & Metrics) */}
      <div className="glass-panel" style={{ padding: '40px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Logo frame */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--secondary-grad)',
            padding: '4px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--radius-sm)',
              background: '#fff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2rem',
              color: 'var(--secondary)'
            }}>
              {userDetails.profileImage ? (
                <img src={userDetails.profileImage} alt={brand.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                brand.companyName?.substring(0, 2).toUpperCase()
              )}
            </div>
          </div>

          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{brand.companyName}</h1>
              {brand.industry && (
                <span className="badge badge-primary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>{brand.industry}</span>
              )}
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: '1.6', marginTop: '8px' }}>
              {brand.description || 'Premium sponsor hosting creative campaign projects on CreatorSync.'}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
              {brand.website && (
                <a href={brand.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                  <Globe size={16} />
                  Visit Website
                  <ExternalLink size={12} />
                </a>
              )}
              
              {/* Corporate Social Links */}
              {brand.socialLinks?.map((soc, idx) => (
                <a key={idx} href={`https://${soc.platform}.com/${soc.handle}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {soc.platform === 'instagram' && <Instagram size={16} />}
                  {soc.platform === 'twitter' && <Twitter size={16} />}
                  {soc.platform === 'linkedin' && <Linkedin size={16} />}
                  {soc.platform === 'facebook' && <Facebook size={16} />}
                  <span>{soc.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Summary Stats Row */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px 20px', background: 'var(--bg-tertiary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Creators Hired</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{totalHired}</span>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', background: 'var(--bg-tertiary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Campaigns Run</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>{projects.length}</span>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Feedback Rating</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{avgRating.toFixed(1)}</span>
            </div>
            <div style={{ display: 'flex', color: '#f59e0b', gap: '1px' }}>
              <Star size={16} fill="#f59e0b" stroke="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Split */}
      <div className="grid-container" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        
        {/* Left Column: Campaigns & Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Active Campaigns Posted list */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} style={{ color: 'var(--primary)' }} />
              Live Sponsorship Campaigns
            </h3>
            {projects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No active briefs published currently.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.map((proj) => (
                  <div key={proj._id} style={{ border: '1px solid var(--border-color)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                      <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{proj.title}</h4>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{proj.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>{proj.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <span>Platforms: {proj.targetPlatforms?.join(', ')}</span>
                      <span style={{ fontWeight: 700 }}>Budget: ${proj.budget?.min} - ${proj.budget?.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Gallery */}
          {brand.images?.length > 0 && (
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} style={{ color: 'var(--primary)' }} />
                Company Workspace Gallery
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {brand.images.map((img, i) => (
                  <div key={i} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '140px', background: 'var(--border-color)' }}>
                    <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Feedback Reviews list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} style={{ color: '#f59e0b' }} />
              Creator Collaboration Feedback
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{avgRating.toFixed(1)}</span>
              <div>
                <div style={{ display: 'flex', color: '#f59e0b', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(avgRating) ? '#f59e0b' : 'none'} stroke="currentColor" />
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Based on {totalReviews} reviews</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No ratings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map((r, i) => (
                  <div key={i} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{r.reviewerId?.name}</span>
                      <div style={{ display: 'flex', color: '#f59e0b', gap: '1px' }}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} size={10} fill={idx < r.rating ? '#f59e0b' : 'none'} stroke="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetails;
