import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Youtube,
  Instagram,
  Twitter,
  Globe,
  Award,
  BookOpen,
  Calendar,
  Briefcase,
  Star,
  Users,
  Video,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Activity,
  BarChart2,
  Clock,
  Zap,
  Heart,
  Eye,
  Play,
  RefreshCw,
  ThumbsUp,
  Target,
  Shield,
  AlertCircle,
  Plus,
  Mail,
  MapPin,
  Phone,
  Link as LinkIcon,
  ChevronRight,
  Facebook,
  Linkedin,
  ExternalLink
} from 'lucide-react';

const CreatorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCreatorProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/creators/${id}`);
      setData(res.data);
      setIsSaved(res.data.isSaved || false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load creator profile.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCreatorProfile();
    }
  }, [id, fetchCreatorProfile]);

  // Load brand campaigns for invite dropdown
  useEffect(() => {
    if (user?.role === 'brand') {
      api.get('/campaigns/me').then(res => setCampaigns(res.data || [])).catch(() => {});
    }
  }, [user]);

  const handleToggleSave = async () => {
    if (!user || user.role !== 'brand') return;
    setSavingToggle(true);
    try {
      const res = await api.post(`/creators/${id}/bookmark`);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.warn('Bookmark toggle failed:', err.message);
    } finally {
      setSavingToggle(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedCampaign) return;
    setInviting(true);
    try {
      await api.post(`/campaigns/${selectedCampaign}/invite`, { creatorId: id });
      const camp = campaigns.find(c => c._id === selectedCampaign);
      setInviteSuccess(`Invitation sent for: "${camp?.title}"`);
      setInviteModal(false);
      setSelectedCampaign('');
      setTimeout(() => setInviteSuccess(''), 4000);
    } catch (err) {
      console.warn('Invite failed:', err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleStartMessage = async () => {
    if (!user || !data) return;
    try {
      // Navigate to dashboard messages tab
      navigate(`/dashboard?tab=messages`);
    } catch (err) {
      console.warn('Message redirect failed:', err.message);
    }
  };

  const formatNumber = (n) => {
    if (!n && n !== 0) return 'N/A';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'active': return 'var(--primary)';
      case 'disputed': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '16px' }}>
        <div className="spinner-border" style={{ width: '40px', height: '40px', borderWidth: '3px', color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading creator performance report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
        <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Profile Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Creator profile data not found.'}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const { creator, reviews, avgRating, totalReviews, performanceStats, recentActivity } = data;
  const userDetails = creator.userId || {};
  const stats = performanceStats || {};

  // Calculate profile completion
  const profileCompletion = stats.profileCompletion || 0;

  // Match score for current brand's campaigns (if brand is viewing)
  const calculateMatchScore = (campaign, creatorData) => {
    if (!campaign || !creatorData) return 0;
    let score = 50;
    if (campaign.niche && creatorData.niche) {
      const commonNiches = campaign.niche.filter(n =>
        creatorData.niche.some(pn => pn.toLowerCase() === n.toLowerCase())
      );
      if (commonNiches.length > 0) score += 20;
    }
    if (campaign.targetPlatforms && creatorData.primaryPlatform) {
      if (campaign.targetPlatforms.map(p => p.toLowerCase()).includes(creatorData.primaryPlatform.toLowerCase())) {
        score += 20;
      }
    }
    if (campaign.minFollowers && creatorData.followersCount) {
      if (creatorData.followersCount >= campaign.minFollowers) score += 10;
    }
    return Math.min(score, 100);
  };

  const bestMatchScore = campaigns.length > 0
    ? Math.max(...campaigns.map(c => calculateMatchScore(c, creator)))
    : 0;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'performance', label: 'Performance' },
    { key: 'social', label: 'Social & Reach' },
    { key: 'showcase', label: 'Work Showcase' },
    { key: 'reviews', label: `Reviews (${totalReviews})` },
    { key: 'activity', label: 'Recent Activity' }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' }} className="animate-fade-in-up">

      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', padding: '7px 14px', marginBottom: '24px' }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Invite Success Toast */}
      {inviteSuccess && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--success)', color: '#fff', padding: '14px 20px',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)',
          display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.88rem'
        }}>
          <CheckCircle size={18} /> {inviteSuccess}
        </div>
      )}

      {/* ━━━━━━ HERO CARD ━━━━━━ */}
      <div className="glass-panel" style={{ padding: '0', marginBottom: '24px', overflow: 'hidden' }}>

        {/* Cover Banner */}
        <div style={{
          height: '180px',
          background: creator.coverBanner
            ? `url(${creator.coverBanner}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          position: 'relative'
        }}>
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
        </div>

        {/* Profile Header Content */}
        <div style={{ padding: '0 32px 32px', marginTop: '-56px', position: 'relative' }}>
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
            <div className="d-flex align-items-flex-end gap-4" style={{ alignItems: 'flex-end' }}>
              {/* Avatar */}
              <div style={{
                width: '112px', height: '112px', borderRadius: '50%',
                border: '4px solid var(--bg-primary)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>
                {userDetails.profileImage ? (
                  <img src={userDetails.profileImage} alt={userDetails.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 900, fontSize: '2.5rem',
                    background: 'var(--primary-gradient)', color: '#fff'
                  }}>
                    {userDetails.name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                )}
              </div>

              {/* Name + Meta */}
              <div style={{ paddingBottom: '8px' }}>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>{userDetails.name}</h1>
                  {creator.availability === 'Available' && (
                    <span style={{ padding: '3px 12px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
                      ● Available
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-3 flex-wrap mt-2">
                  {creator.category && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize' }}>
                      {creator.category}
                    </span>
                  )}
                  {creator.primaryPlatform && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      📱 {creator.primaryPlatform}
                    </span>
                  )}
                  {userDetails.country && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {userDetails.city ? `${userDetails.city}, ` : ''}{userDetails.country}
                    </span>
                  )}
                  {creator.experienceYears > 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      🏆 {creator.experienceYears} yr{creator.experienceYears > 1 ? 's' : ''} experience
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {user && (
              <div className="d-flex gap-2 flex-wrap" style={{ paddingBottom: '8px' }}>
                {user.role === 'brand' && (
                  <>
                    <button
                      onClick={handleToggleSave}
                      disabled={savingToggle}
                      className="btn"
                      style={{
                        padding: '9px 18px', fontSize: '0.84rem',
                        display: 'flex', alignItems: 'center', gap: '7px',
                        background: isSaved ? 'rgba(214,51,132,0.15)' : 'var(--bg-tertiary)',
                        color: isSaved ? '#d63384' : 'var(--text-secondary)',
                        border: isSaved ? '1px solid rgba(214,51,132,0.4)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      {isSaved ? 'Saved' : 'Save Creator'}
                    </button>

                    <button
                      onClick={() => setInviteModal(true)}
                      className="btn btn-outline"
                      style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '7px' }}
                    >
                      <Plus size={16} /> Invite to Campaign
                    </button>

                    <button
                      onClick={handleStartMessage}
                      className="btn btn-primary"
                      style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '7px' }}
                    >
                      <MessageSquare size={16} /> Message Creator
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bio */}
          {creator.bio && (
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', fontSize: '0.93rem', marginTop: '20px', maxWidth: '720px' }}>
              {creator.bio}
            </p>
          )}

          {/* Niche + Skills Tags */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            {creator.niche?.map((n, i) => (
              <span key={i} className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '5px 12px' }}>{n}</span>
            ))}
            {creator.skills?.map((s, i) => (
              <span key={i} style={{ fontSize: '0.72rem', padding: '5px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' }}>{s}</span>
            ))}
          </div>

          {/* Profile Completion Bar */}
          <div style={{ marginTop: '20px', maxWidth: '340px' }}>
            <div className="d-flex justify-content-between mb-1">
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Profile Completion</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: profileCompletion >= 80 ? 'var(--success)' : profileCompletion >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{profileCompletion}%</span>
            </div>
            <div style={{ height: '5px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${profileCompletion}%`,
                background: profileCompletion >= 80 ? 'var(--success)' : profileCompletion >= 50 ? 'var(--warning)' : 'var(--danger)',
                borderRadius: 'var(--radius-full)', transition: 'width 0.8s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━ KPI STAT CARDS ━━━━━━ */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Followers', value: formatNumber(creator.followersCount), icon: <Users size={18} />, color: 'var(--primary)' },
          { label: 'Avg Engagement', value: creator.avgEngagement ? `${creator.avgEngagement}%` : 'N/A', icon: <TrendingUp size={18} />, color: 'var(--success)' },
          { label: 'Avg Reach', value: formatNumber(creator.avgReach), icon: <Eye size={18} />, color: '#d63384' },
          { label: 'Monthly Views', value: formatNumber(creator.monthlyViews), icon: <Play size={18} />, color: 'var(--secondary)' },
          { label: 'Avg Rating', value: avgRating > 0 ? `${avgRating}/5` : 'N/A', icon: <Star size={18} />, color: 'var(--warning)' },
          { label: 'Campaigns Done', value: stats.campaignsCompleted || 0, icon: <Briefcase size={18} />, color: 'var(--success)' },
          { label: 'On-Time Rate', value: `${stats.onTimeDeliveryRate ?? 100}%`, icon: <Clock size={18} />, color: '#00e5a0' },
          { label: 'Repeat Collabs', value: stats.repeatCollabCount || 0, icon: <RefreshCw size={18} />, color: '#f59e0b' }
        ].map((kpi, i) => (
          <div key={i} className="col-6 col-sm-4 col-md-3">
            <div className="glass-panel" style={{ padding: '18px', textAlign: 'center' }}>
              <div style={{ color: kpi.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{kpi.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ━━━━━━ TAB NAVIGATION ━━━━━━ */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn"
            style={{
              padding: '8px 18px', fontSize: '0.82rem', whiteSpace: 'nowrap',
              background: activeTab === tab.key ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              border: activeTab === tab.key ? 'none' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              fontWeight: activeTab === tab.key ? 700 : 400
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ━━━━━━ TAB CONTENT ━━━━━━ */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          {/* Left: Basic + Professional Info */}
          <div className="col-12 col-lg-7">
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: 'var(--primary)' }} /> Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Full Name', value: userDetails.name, icon: <Users size={14} /> },
                  { label: 'Username', value: userDetails.username ? `@${userDetails.username}` : 'N/A', icon: <LinkIcon size={14} /> },
                  { label: 'Email', value: userDetails.email, icon: <Mail size={14} /> },
                  { label: 'Phone', value: userDetails.phone || 'N/A', icon: <Phone size={14} /> },
                  { label: 'Country', value: userDetails.country || 'N/A', icon: <MapPin size={14} /> },
                  { label: 'City', value: userDetails.city || 'N/A', icon: <MapPin size={14} /> }
                ].map((field, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{field.label}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{field.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Professional Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Category', value: creator.category },
                  { label: 'Primary Platform', value: creator.primaryPlatform },
                  { label: 'Experience', value: creator.experienceYears ? `${creator.experienceYears} years` : 'N/A' },
                  { label: 'Availability', value: creator.availability || 'N/A' }
                ].map((field, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{field.label}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{field.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
              {creator.languages?.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Languages</span>
                  <div className="d-flex gap-2 flex-wrap">
                    {creator.languages.map((lang, i) => (
                      <span key={i} style={{ padding: '3px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{lang}</span>
                    ))}
                  </div>
                </div>
              )}
              {creator.portfolioUrl && (
                <div style={{ marginTop: '16px' }}>
                  <a href={creator.portfolioUrl} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ExternalLink size={13} /> Visit Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right: Performance Quick Summary + Campaign Match */}
          <div className="col-12 col-lg-5">
            {/* Campaign Match Score (for brand) */}
            {user?.role === 'brand' && campaigns.length > 0 && (
              <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} style={{ color: 'var(--primary)' }} /> Campaign Match Score
                </h3>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 12px',
                    background: `conic-gradient(${bestMatchScore >= 80 ? 'var(--success)' : bestMatchScore >= 60 ? 'var(--warning)' : 'var(--danger)'} ${bestMatchScore * 3.6}deg, var(--bg-tertiary) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'inset 0 0 0 12px var(--bg-primary)'
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: bestMatchScore >= 80 ? 'var(--success)' : bestMatchScore >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                      {bestMatchScore}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Best match across {campaigns.length} campaign{campaigns.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {campaigns.slice(0, 3).map((camp, i) => {
                    const score = calculateMatchScore(camp, creator);
                    return (
                      <div key={i}>
                        <div className="d-flex justify-content-between mb-1">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{camp.title}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{score}%</span>
                        </div>
                        <div style={{ height: '5px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${score}%`, background: score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)', borderRadius: 'var(--radius-full)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Performance Quick View */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} style={{ color: 'var(--primary)' }} /> Performance Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Acceptance Rate', value: `${stats.acceptanceRate || 0}%`, bar: stats.acceptanceRate || 0, color: 'var(--success)' },
                  { label: 'On-Time Delivery', value: `${stats.onTimeDeliveryRate ?? 100}%`, bar: stats.onTimeDeliveryRate ?? 100, color: '#00e5a0' },
                  { label: 'Profile Completion', value: `${profileCompletion}%`, bar: profileCompletion, color: 'var(--primary)' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: item.color }}>{item.value}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.bar}%`, background: item.color, borderRadius: 'var(--radius-full)', transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Total Applied', value: stats.totalApplications || 0 },
                  { label: 'Accepted', value: stats.acceptedApplications || 0 },
                  { label: 'Active Collabs', value: stats.activeCollaborations || 0 },
                  { label: 'Repeat Brands', value: stats.repeatCollabCount || 0 }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{item.value}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERFORMANCE TAB */}
      {activeTab === 'performance' && (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--primary)' }} /> Key Performance Metrics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  { label: 'Campaigns Completed', value: stats.campaignsCompleted || 0, icon: <Briefcase size={16} />, suffix: ' campaigns', color: 'var(--success)' },
                  { label: 'Acceptance Rate', value: `${stats.acceptanceRate || 0}%`, icon: <ThumbsUp size={16} />, color: 'var(--primary)', bar: stats.acceptanceRate || 0 },
                  { label: 'On-Time Delivery Rate', value: `${stats.onTimeDeliveryRate ?? 100}%`, icon: <Clock size={16} />, color: '#00e5a0', bar: stats.onTimeDeliveryRate ?? 100 },
                  { label: 'Average Brand Rating', value: avgRating > 0 ? `${avgRating} / 5.0` : 'No ratings yet', icon: <Star size={16} />, color: 'var(--warning)' },
                  { label: 'Repeat Collaboration Count', value: stats.repeatCollabCount || 0, icon: <RefreshCw size={16} />, color: '#d63384', suffix: ' brands' },
                  { label: 'Active Collaborations', value: stats.activeCollaborations || 0, icon: <Zap size={16} />, color: 'var(--secondary)', suffix: ' active' }
                ].map((metric, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: `${metric.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color, flexShrink: 0 }}>
                      {metric.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3px' }}>{metric.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: metric.color }}>{metric.value}</div>
                      {metric.bar !== undefined && (
                        <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${metric.bar}%`, background: metric.color, borderRadius: 'var(--radius-full)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> Audience Statistics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Total Followers', value: formatNumber(creator.followersCount), icon: <Users size={16} />, color: 'var(--primary)' },
                  { label: 'Average Reach per Post', value: formatNumber(creator.avgReach), icon: <Eye size={16} />, color: '#d63384' },
                  { label: 'Monthly Views', value: formatNumber(creator.monthlyViews), icon: <Play size={16} />, color: 'var(--secondary)' },
                  { label: 'Avg Engagement Rate', value: creator.avgEngagement ? `${creator.avgEngagement}%` : 'N/A', icon: <Heart size={16} />, color: 'var(--danger)', bar: Math.min(creator.avgEngagement * 5, 100) }
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                      {stat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3px' }}>{stat.label}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      {stat.bar !== undefined && (
                        <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${stat.bar}%`, background: stat.color, borderRadius: 'var(--radius-full)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Collaborations */}
            {creator.experience?.length > 0 && (
              <div className="glass-panel" style={{ padding: '28px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Previous Collaborations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {creator.experience.map((exp, idx) => (
                    <div key={idx} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                        <h5 style={{ fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>{exp.projectTitle}</h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>{exp.companyName}</span>
                      {exp.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SOCIAL & REACH TAB */}
      {activeTab === 'social' && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ color: 'var(--primary)' }} /> Social Media Accounts
              </h3>
              {creator.socialChannels?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {creator.socialChannels.map((ch, idx) => {
                    const platformIcons = {
                      youtube: <Youtube size={22} style={{ color: '#ff0000' }} />,
                      instagram: <Instagram size={22} style={{ color: '#e1306c' }} />,
                      twitter: <Twitter size={22} style={{ color: '#1da1f2' }} />,
                      tiktok: <Play size={22} style={{ color: '#000' }} />
                    };
                    const platformColors = {
                      youtube: '#ff0000', instagram: '#e1306c', twitter: '#1da1f2', tiktok: '#69c9d0'
                    };
                    return (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '16px', background: 'var(--bg-panel)',
                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'
                      }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: 'var(--radius-sm)',
                          background: `${platformColors[ch.platform] || 'var(--primary)'}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {platformIcons[ch.platform] || <Globe size={22} style={{ color: 'var(--primary)' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'capitalize', marginBottom: '2px' }}>{ch.platform}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ch.handle}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: platformColors[ch.platform] || 'var(--primary)' }}>
                            {formatNumber(ch.followers)}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>FOLLOWERS</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No social channels linked yet.</p>
              )}
            </div>

            {/* Social Profile Links */}
            {(creator.instagramUrl || creator.youtubeUrl || creator.linkedinUrl || creator.xUrl || creator.facebookUrl || creator.websiteUrl) && (
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LinkIcon size={18} style={{ color: 'var(--primary)' }} /> Social Profile Links
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { url: creator.instagramUrl, label: 'Instagram', icon: <Instagram size={16} style={{ color: '#e1306c' }} /> },
                    { url: creator.youtubeUrl, label: 'YouTube', icon: <Youtube size={16} style={{ color: '#ff0000' }} /> },
                    { url: creator.linkedinUrl, label: 'LinkedIn', icon: <Linkedin size={16} style={{ color: '#0077b5' }} /> },
                    { url: creator.xUrl, label: 'X (Twitter)', icon: <Twitter size={16} style={{ color: '#1da1f2' }} /> },
                    { url: creator.facebookUrl, label: 'Facebook', icon: <Facebook size={16} style={{ color: '#1877f2' }} /> },
                    { url: creator.websiteUrl, label: 'Website', icon: <Globe size={16} style={{ color: 'var(--primary)' }} /> }
                  ].filter(l => l.url).map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                        textDecoration: 'none', color: 'var(--text-primary)'
                      }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {link.icon} {link.label}
                      </span>
                      <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-12 col-lg-5">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> Audience Statistics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Total Followers', value: formatNumber(creator.followersCount), color: 'var(--primary)', pct: null },
                  { label: 'Avg Reach per Post', value: formatNumber(creator.avgReach), color: '#d63384', pct: null },
                  { label: 'Monthly Views', value: formatNumber(creator.monthlyViews), color: 'var(--secondary)', pct: null },
                  { label: 'Avg Engagement Rate', value: creator.avgEngagement ? `${creator.avgEngagement}%` : 'N/A', color: 'var(--danger)', pct: creator.avgEngagement ? Math.min(creator.avgEngagement * 5, 100) : 0 }
                ].map((s, i) => (
                  <div key={i} style={{ padding: '14px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: s.color }}>{s.value}</span>
                    </div>
                    {s.pct !== null && (
                      <div style={{ marginTop: '8px', height: '5px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 'var(--radius-full)' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOWCASE TAB */}
      {activeTab === 'showcase' && (
        <div className="row g-4">
          {/* Work Showcase */}
          {creator.showcase?.length > 0 ? (
            <div className="col-12">
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={18} style={{ color: 'var(--primary)' }} /> Work Showcase
                </h3>
                <div className="row g-3">
                  {creator.showcase.map((item, i) => (
                    <div key={i} className="col-12 col-md-6 col-lg-4">
                      <div style={{ background: 'var(--bg-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        {item.thumbnail && (
                          <div style={{ height: '160px', overflow: 'hidden' }}>
                            <img src={item.thumbnail} alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        )}
                        <div style={{ padding: '16px' }}>
                          <h5 style={{ fontWeight: 800, fontSize: '0.9rem', margin: '0 0 6px' }}>{item.title}</h5>
                          <span style={{ fontSize: '0.72rem', padding: '2px 10px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', textTransform: 'capitalize' }}>{item.platform}</span>
                          {item.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px', marginBottom: '12px', lineHeight: 1.5 }}>{item.description}</p>}
                          <a href={item.url} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '0.78rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                            View Content <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-12">
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <Star size={48} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 700, margin: '0 0 8px' }}>No showcase content yet</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Creator hasn't added showcase work yet.</p>
              </div>
            </div>
          )}

          {/* Embedded Videos */}
          {creator.videos?.length > 0 && (
            <div className="col-12">
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={18} style={{ color: 'var(--primary)' }} /> Featured Videos
                </h3>
                <div className="row g-3">
                  {creator.videos.map((vid, i) => (
                    <div key={i} className="col-12 col-md-6">
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                        <iframe
                          src={vid.replace('watch?v=', 'embed/')}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                          title={`Video ${i + 1}`}
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements & Certificates */}
          <div className="col-12 col-md-6">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--primary)' }} /> Achievements
              </h3>
              {creator.achievements?.length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
                  {creator.achievements.map((ach, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      <span>{ach.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No achievements listed.</p>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} /> Certificates
              </h3>
              {creator.certificates?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {creator.certificates.map((cert, idx) => (
                    <div key={idx} style={{ padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <h5 style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 4px' }}>{cert.title}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {cert.issuer}{cert.date ? ` · ${new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No certificates listed.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div>
          {/* Rating Summary */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
            <div className="row g-4 align-items-center">
              <div className="col-auto" style={{ textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: 'var(--warning)' }}>
                  {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={18} fill={star <= Math.round(avgRating) ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="col" style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="d-flex align-items-center gap-2 mb-2">
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '16px', textAlign: 'right' }}>{star}</span>
                      <Star size={12} fill="#f59e0b" style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <div style={{ flex: 1, height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--warning)', borderRadius: 'var(--radius-full)' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '24px' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
              <Star size={48} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
              <h4 style={{ fontWeight: 700, margin: '0 0 8px' }}>No reviews yet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>This creator hasn't received any brand reviews yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((r, i) => (
                <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-tertiary)', flexShrink: 0 }}>
                        {r.reviewerId?.profileImage
                          ? <img src={r.reviewerId.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, background: 'var(--primary-gradient)', color: '#fff', fontSize: '0.85rem' }}>
                              {r.reviewerId?.name?.charAt(0)?.toUpperCase() || 'B'}
                            </div>
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.reviewerId?.name || 'Brand'}</div>
                        {r.projectId?.title && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Campaign: {r.projectId.title}</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={14} fill={star <= r.rating ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECENT ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'var(--primary)' }} /> Recent Campaign Activity
            </h3>
            {recentActivity?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {recentActivity.map((act, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 0',
                    borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: getStatusColor(act.status), flexShrink: 0,
                      boxShadow: `0 0 6px ${getStatusColor(act.status)}`
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{act.campaignTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'capitalize' }}>
                        Status: <span style={{ color: getStatusColor(act.status), fontWeight: 600 }}>{act.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <Activity size={40} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No recent campaign activity found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━━━━ INVITE TO CAMPAIGN MODAL ━━━━━━ */}
      {inviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '480px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Invite to Campaign</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Select a campaign to invite <strong>{userDetails.name}</strong> to:
            </p>
            {campaigns.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No active campaigns found. Please create a campaign first.</p>
            ) : (
              <select
                value={selectedCampaign}
                onChange={e => setSelectedCampaign(e.target.value)}
                className="form-input"
                style={{ marginBottom: '20px' }}
              >
                <option value="">— Select Campaign —</option>
                {campaigns.filter(c => c.status === 'active').map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            )}
            <div className="d-flex gap-3">
              <button
                onClick={handleInvite}
                disabled={!selectedCampaign || inviting}
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
              >
                {inviting ? 'Sending...' : <><Briefcase size={15} /> Send Invitation</>}
              </button>
              <button
                onClick={() => { setInviteModal(false); setSelectedCampaign(''); }}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorDetails;
