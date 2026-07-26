import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Users,
  Building,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Youtube,
  Instagram,
  Twitter,
  Globe,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Plus,
  MapPin,
  CheckCircle,
  Filter,
  X,
  RefreshCw,
  BarChart2,
  Clock,
  Zap,
  Eye
} from 'lucide-react';

const Discover = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Creator-specific filters
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [platform, setPlatform] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [availability, setAvailability] = useState('');
  const [minEngagement, setMinEngagement] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Project-specific filters
  const [minBudget, setMinBudget] = useState('');
  const [remote, setRemote] = useState('');

  // Results & Pagination
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Creator action states
  const [savedCreators, setSavedCreators] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [inviteModal, setInviteModal] = useState(null); // creatorUserId
  const [inviteModalName, setInviteModalName] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  const fetchDiscoverResults = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === 'creators') {
        const params = new URLSearchParams({
          search, category, skill, minFollowers, platform,
          country, language, availability, minEngagement,
          sortBy, page, limit: 9
        });
        res = await api.get(`/discover/creators?${params}`);
        setResults(res.data.creators || []);
        setTotalPages(res.data.pages || 1);
        setTotalItems(res.data.total || 0);
      } else if (activeTab === 'brands') {
        res = await api.get(`/discover/brands?search=${search}&industry=${category}&page=${page}&limit=9`);
        setResults(res.data.brands || []);
        setTotalPages(res.data.pages || 1);
        setTotalItems(res.data.total || 0);
      } else {
        res = await api.get(`/campaigns?search=${search}&niche=${category}&platform=${platform}&minBudget=${minBudget}&country=${country}&remote=${remote}&sortBy=${sortBy}&page=${page}&limit=9`);
        setResults(res.data.campaigns || []);
        setTotalPages(res.data.pages || 1);
        setTotalItems(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Discover fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, category, skill, minFollowers, platform, country, language, availability, minEngagement, sortBy, minBudget, remote, page]);

  useEffect(() => {
    setPage(1);
    setResults([]);
  }, [activeTab]);

  useEffect(() => {
    fetchDiscoverResults();
  }, [fetchDiscoverResults]);

  // Load brand campaigns for invite
  useEffect(() => {
    if (user?.role === 'brand') {
      api.get('/campaigns/me').then(res => setCampaigns(res.data || [])).catch(() => {});
    }
  }, [user]);

  const handleClearFilters = () => {
    setCategory('');
    setSkill('');
    setMinFollowers('');
    setPlatform('');
    setCountry('');
    setLanguage('');
    setAvailability('');
    setMinEngagement('');
    setMinBudget('');
    setSearch('');
    setRemote('');
    setSortBy('newest');
  };

  const handleToggleSave = async (creatorUserId) => {
    if (!user || user.role !== 'brand') return;
    setSavingId(creatorUserId);
    try {
      const res = await api.post(`/creators/${creatorUserId}/bookmark`);
      setSavedCreators(prev => ({ ...prev, [creatorUserId]: res.data.isSaved }));
    } catch (err) {
      console.warn('Bookmark toggle failed:', err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleInvite = async () => {
    if (!selectedCampaign || !inviteModal) return;
    setInviting(true);
    try {
      await api.post(`/campaigns/${selectedCampaign}/invite`, { creatorId: inviteModal });
      const camp = campaigns.find(c => c._id === selectedCampaign);
      setInviteSuccess(`Invitation sent to ${inviteModalName} for: "${camp?.title}"`);
      setInviteModal(null);
      setInviteModalName('');
      setSelectedCampaign('');
      setTimeout(() => setInviteSuccess(''), 4000);
    } catch (err) {
      console.warn('Invite failed:', err.message);
    } finally {
      setInviting(false);
    }
  };

  const formatNumber = (n) => {
    if (!n) return 'N/A';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const getPartnerAvatarInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'CS';

  const activeFiltersCount = [category, skill, minFollowers, platform, country, language, availability, minEngagement].filter(Boolean).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }} className="animate-fade-in-up">

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

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Explore CreatorSync</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0' }}>Discover talented creators, brands, and active sponsorship campaigns</p>
        </div>

        {/* Tab Switcher */}
        <div className="glass-panel" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
          <button onClick={() => setActiveTab('projects')} className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-outline'}`} style={{ border: 'none', padding: '10px 18px', fontSize: '0.85rem' }}>
            <Briefcase size={16} style={{ marginRight: '8px' }} />Discover Briefs
          </button>
          <button onClick={() => setActiveTab('creators')} className={`btn ${activeTab === 'creators' ? 'btn-primary' : 'btn-outline'}`} style={{ border: 'none', padding: '10px 18px', fontSize: '0.85rem' }}>
            <Users size={16} style={{ marginRight: '8px' }} />Find Creators
          </button>
          <button onClick={() => setActiveTab('brands')} className={`btn ${activeTab === 'brands' ? 'btn-primary' : 'btn-outline'}`} style={{ border: 'none', padding: '10px 18px', fontSize: '0.85rem' }}>
            <Building size={16} style={{ marginRight: '8px' }} />Find Brands
          </button>
        </div>
      </div>

      {/* ━━━━━ CREATOR SEARCH TAB ━━━━━ */}
      {activeTab === 'creators' && (
        <>
          {/* Search Bar + Controls Row */}
          <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              {/* Search Input */}
              <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by name or keyword..."
                  className="form-input"
                  style={{ paddingLeft: '40px', marginBottom: 0 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-input"
                style={{ marginBottom: 0, width: 'auto', minWidth: '160px' }}
              >
                <option value="newest">Newest First</option>
                <option value="followers">Most Followers</option>
                <option value="engagement">Best Engagement</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', position: 'relative', padding: '10px 16px' }}
              >
                <Filter size={15} />
                Filters
                {activeFiltersCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#fff',
                    fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{activeFiltersCount}</span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button onClick={handleClearFilters} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="row g-3" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category / Niche</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Tech">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fitness">Fitness & Health</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Beauty">Beauty & Fashion</option>
                    <option value="Finance">Finance</option>
                    <option value="Food">Food & Cooking</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={platform} onChange={e => setPlatform(e.target.value)}>
                    <option value="">All Platforms</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min Followers</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={minFollowers} onChange={e => setMinFollowers(e.target.value)}>
                    <option value="">Any Reach</option>
                    <option value="1000">1K+</option>
                    <option value="10000">10K+</option>
                    <option value="50000">50K+</option>
                    <option value="100000">100K+</option>
                    <option value="500000">500K+</option>
                    <option value="1000000">1M+</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min Engagement Rate (%)</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={minEngagement} onChange={e => setMinEngagement(e.target.value)}>
                    <option value="">Any Rate</option>
                    <option value="1">1%+</option>
                    <option value="3">3%+</option>
                    <option value="5">5%+</option>
                    <option value="8">8%+</option>
                    <option value="10">10%+</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India, USA..."
                    className="form-input"
                    style={{ marginBottom: 0 }}
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  />
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Language</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="">Any Language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Availability</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={availability} onChange={e => setAvailability(e.target.value)}>
                    <option value="">Any Status</option>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Open to Offers">Open to Offers</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Video Editing..."
                    className="form-input"
                    style={{ marginBottom: 0 }}
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          {!loading && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                {totalItems > 0 ? <><strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> creator{totalItems !== 1 ? 's' : ''} found</> : 'No creators found'}
              </p>
            </div>
          )}

          {/* Creator Cards Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
              <div className="spinner-border" style={{ width: '36px', height: '36px', borderWidth: '3px', color: 'var(--primary)' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Searching creator database...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <Search size={48} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
              <h4 style={{ fontWeight: 800, margin: '0 0 8px' }}>No creators found</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Try adjusting your filters or clearing the search.</p>
              <button onClick={handleClearFilters} className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} /> Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                {results.map((c) => {
                  const u = c.userId || {};
                  const isSaved = savedCreators[u._id] ?? false;
                  const isCurrentlySaving = savingId === u._id;

                  return (
                    <div key={c._id} className="col-12 col-md-6 col-lg-4">
                      <div className="glass-panel" style={{
                        padding: '0', overflow: 'hidden', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-purple)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                      >
                        {/* Card Top: Gradient Banner + Avatar */}
                        <div style={{ position: 'relative', height: '80px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                          {/* Availability badge */}
                          {c.availability && (
                            <span style={{
                              position: 'absolute', top: '12px', right: '12px',
                              padding: '3px 10px',
                              background: c.availability === 'Available' ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.9)',
                              color: '#fff', borderRadius: 'var(--radius-full)',
                              fontSize: '0.68rem', fontWeight: 700
                            }}>
                              {c.availability === 'Available' ? '● Available' : c.availability}
                            </span>
                          )}
                          {/* Avatar */}
                          <div style={{
                            position: 'absolute', bottom: '-28px', left: '20px',
                            width: '56px', height: '56px', borderRadius: '50%',
                            border: '3px solid var(--bg-primary)',
                            background: 'var(--bg-secondary)',
                            overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                          }}>
                            {u.profileImage
                              ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={u.name} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, background: 'var(--primary-gradient)', color: '#fff', fontSize: '1.1rem' }}>
                                  {getPartnerAvatarInitials(u.name)}
                                </div>
                            }
                          </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '36px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* Name + Category */}
                          <div style={{ marginBottom: '12px' }}>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h5 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{u.name || 'Creator'}</h5>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
                              {c.category && (
                                <span style={{ fontSize: '0.72rem', padding: '2px 10px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'capitalize' }}>
                                  {c.category}
                                </span>
                              )}
                              {c.primaryPlatform && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                  📱 {c.primaryPlatform}
                                </span>
                              )}
                              {u.country && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <MapPin size={10} /> {u.country}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={13}
                                  fill={star <= Math.round(c.avgRating || 0) ? '#f59e0b' : 'none'}
                                  style={{ color: '#f59e0b' }}
                                />
                              ))}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>
                              {c.avgRating > 0 ? c.avgRating : 'New'}
                            </span>
                          </div>

                          {/* Stats Grid */}
                          <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px', marginBottom: '16px',
                            padding: '12px', background: 'var(--bg-panel)',
                            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{formatNumber(c.followersCount)}</div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Followers</div>
                            </div>
                            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success)' }}>
                                {c.avgEngagement ? `${c.avgEngagement}%` : 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Engagement</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#d63384' }}>{c.completedCampaigns || 0}</div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Campaigns</div>
                            </div>
                          </div>

                          {/* Niche Tags */}
                          {c.niche?.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              {c.niche.slice(0, 3).map((n, i) => (
                                <span key={i} style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>{n}</span>
                              ))}
                              {c.niche.length > 3 && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+{c.niche.length - 3}</span>}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {/* Primary: View Profile */}
                            <Link
                              to={`/creators/${u._id}`}
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontSize: '0.83rem', padding: '9px' }}
                            >
                              <Eye size={14} /> View Profile
                            </Link>

                            {/* Secondary row: Invite + Save */}
                            {user?.role === 'brand' && (
                              <div className="d-flex gap-2">
                                <button
                                  onClick={() => { setInviteModal(u._id); setInviteModalName(u.name); }}
                                  className="btn btn-outline"
                                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.78rem', padding: '7px' }}
                                >
                                  <Plus size={13} /> Invite
                                </button>
                                <button
                                  onClick={() => handleToggleSave(u._id)}
                                  disabled={isCurrentlySaving}
                                  className="btn"
                                  style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                    fontSize: '0.78rem', padding: '7px',
                                    background: isSaved ? 'rgba(214,51,132,0.15)' : 'var(--bg-tertiary)',
                                    color: isSaved ? '#d63384' : 'var(--text-secondary)',
                                    border: isSaved ? '1px solid rgba(214,51,132,0.4)' : '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)'
                                  }}
                                >
                                  {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                                  {isSaved ? 'Saved' : 'Save'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn-icon" disabled={page === 1}>
                    <ChevronLeft size={18} />
                  </button>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn-icon" disabled={page === totalPages}>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ━━━━━ BRANDS TAB ━━━━━ */}
      {activeTab === 'brands' && (
        <div className="grid-container" style={{ gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
          <aside className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} /> Filters
              </h3>
              <button onClick={handleClearFilters} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>Reset</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Keyword Search</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Brand name..." className="form-input" style={{ paddingLeft: '36px', fontSize: '0.85rem', marginBottom: 0 }} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Industry</label>
                <select className="form-select form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">All Industries</option>
                  <option value="Tech">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Finance">Finance</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Food">Food & Beverage</option>
                </select>
              </div>
            </div>
          </aside>
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', height: '240px', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Searching brands...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <Search size={36} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h4 style={{ fontWeight: 800 }}>No brands found</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try clearing your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  {results.map((b) => {
                    const u = b.userId || {};
                    return (
                      <div key={b._id} className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '240px' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'var(--secondary-glow)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                              {u.profileImage ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getPartnerAvatarInitials(b.companyName)}
                            </div>
                            <div>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', display: 'block' }}>{b.companyName}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.industry}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.5', marginBottom: '16px' }}>
                            {b.description || 'Verified brand on CreatorSync.'}
                          </p>
                        </div>
                        <Link to={`/brands/${u._id}`} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem' }}>
                          View Brand <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn-icon" disabled={page === 1}><ChevronLeft size={18} /></button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn-icon" disabled={page === totalPages}><ChevronRight size={18} /></button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ━━━━━ PROJECTS/CAMPAIGNS TAB ━━━━━ */}
      {activeTab === 'projects' && (
        <div className="grid-container" style={{ gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
          <aside className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} /> Filters
              </h3>
              <button onClick={handleClearFilters} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>Reset</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Keyword Search</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Type name/keyword..." className="form-input" style={{ paddingLeft: '36px', fontSize: '0.85rem', marginBottom: 0 }} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Niche / Category</label>
                <select className="form-select form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">All Niches</option>
                  <option value="Tech">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Target Platforms</label>
                <select className="form-select form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={platform} onChange={e => setPlatform(e.target.value)}>
                  <option value="">All Channels</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">X (Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Min Budget ($)</label>
                <input type="number" placeholder="e.g. 500" className="form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={minBudget} onChange={e => setMinBudget(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Target Country</label>
                <input type="text" placeholder="e.g. United States" className="form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={country} onChange={e => setCountry(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Work Environment</label>
                <select className="form-select form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={remote} onChange={e => setRemote(e.target.value)}>
                  <option value="">All Environments</option>
                  <option value="true">Remote Only</option>
                  <option value="false">On-Site Only</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Sort By</label>
                <select className="form-select form-input" style={{ fontSize: '0.85rem', marginBottom: 0 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="highest-budget">Highest Budget</option>
                  <option value="deadline">Upcoming Deadline</option>
                </select>
              </div>
            </div>
          </aside>
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading campaigns...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <Search size={36} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h4 style={{ fontWeight: 800 }}>No campaigns matched</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try clearing filters or checking your spelling.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  {results.map((p) => {
                    const bUser = p.brandId || {};
                    const formattedDeadline = p.deadline ? new Date(p.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                    return (
                      <div key={p._id} className="card glass-panel glass-panel-hover border-0 shadow-sm" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-3">
                              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-gradient)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                                {bUser.profileImage ? <img src={bUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getPartnerAvatarInitials(bUser.name)}
                              </div>
                              <div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{bUser.name || 'Sponsor Brand'}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {p.location || 'Global'} {p.isRemote && '(Remote)'}</span>
                              </div>
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem', background: 'var(--success-glow)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(0, 229, 160, 0.2)' }}>
                              ${p.budget?.min?.toLocaleString()} - ${p.budget?.max?.toLocaleString()}
                            </span>
                          </div>

                          <div className="mb-2">
                            <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '4px', marginBottom: '8px', color: 'var(--text-primary)' }}>{p.title}</h4>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              {p.niche?.map((n, idx) => (
                                <span key={idx} className="badge badge-primary">{n}</span>
                              ))}
                              {p.targetPlatforms?.map((plat, idx) => (
                                <span key={idx} className="badge badge-shortlisted">{plat}</span>
                              ))}
                            </div>
                          </div>

                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                            {p.description}
                          </p>
                        </div>

                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>CREATORS REQUIRED</span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.creatorsRequired || 1} Creator(s)</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>APPLICATION DEADLINE</span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>{formattedDeadline}</span>
                            </div>
                          </div>

                          <Link to={`/campaigns/${p._id}`} className="btn btn-primary w-100" style={{ display: 'flex', justifyContent: 'center', fontWeight: 700 }}>
                            Apply Now <ExternalLink size={15} style={{ marginLeft: '6px' }} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn-icon" disabled={page === 1}><ChevronLeft size={18} /></button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn-icon" disabled={page === totalPages}><ChevronRight size={18} /></button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ━━━━━ INVITE MODAL ━━━━━ */}
      {inviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '440px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Invite to Campaign</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Select a campaign to invite <strong>{inviteModalName}</strong> to:
            </p>
            {campaigns.filter(c => c.status === 'active').length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No active campaigns. Create one first.</p>
            ) : (
              <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} className="form-input" style={{ marginBottom: '20px' }}>
                <option value="">— Select Campaign —</option>
                {campaigns.filter(c => c.status === 'active').map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            )}
            <div className="d-flex gap-3">
              <button onClick={handleInvite} disabled={!selectedCampaign || inviting} className="btn btn-primary" style={{ flex: 1 }}>
                {inviting ? 'Sending...' : 'Send Invitation'}
              </button>
              <button onClick={() => { setInviteModal(null); setSelectedCampaign(''); }} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
