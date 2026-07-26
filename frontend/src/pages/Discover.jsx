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
  Globe,
  Bookmark,
  BookmarkCheck,
  Plus,
  MapPin,
  CheckCircle,
  Filter,
  X,
  RefreshCw,
  Eye
} from 'lucide-react';

const Discover = ({ forcedTab }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(forcedTab || 'projects');
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
  const [inviteModal, setInviteModal] = useState(null);
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Explore CreatorSync</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0' }}>Discover talented creators, brands, and active sponsorship campaigns</p>
        </div>

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

      {/* CREATOR SEARCH TAB */}
      {activeTab === 'creators' && (
        <>
          <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
            <div className="d-flex gap-3 flex-wrap align-items-center">
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

              {activeFiltersCount > 0 && (
                <button onClick={handleClearFilters} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>

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
                  </select>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min Followers</label>
                  <select className="form-input" style={{ marginBottom: 0 }} value={minFollowers} onChange={e => setMinFollowers(e.target.value)}>
                    <option value="">Any Reach</option>
                    <option value="1000">1K+</option>
                    <option value="10000">10K+</option>
                    <option value="50000">50K+</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Country</label>
                  <input
                    type="text"
                    placeholder="e.g. USA, India..."
                    className="form-input"
                    style={{ marginBottom: 0 }}
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
              <div className="spinner-border" style={{ width: '36px', height: '36px', borderWidth: '3px', color: 'var(--primary)' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Searching creator database...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <Search size={48} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
              <h4 style={{ fontWeight: 800, margin: '0 0 8px' }}>No creators found</h4>
              <button onClick={handleClearFilters} className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} /> Reset Filters
              </button>
            </div>
          ) : (
            <div className="row g-4 mb-4">
              {results.map((c) => {
                const u = c.userId || {};
                const isSaved = savedCreators[u._id] ?? false;
                const isCurrentlySaving = savingId === u._id;

                return (
                  <div key={c._id} className="col-12 col-md-6 col-lg-4">
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: '80px', background: 'var(--primary-gradient)' }}>
                        <div style={{
                          position: 'absolute', bottom: '-28px', left: '20px',
                          width: '56px', height: '56px', borderRadius: '50%',
                          border: '3px solid var(--bg-primary)',
                          background: 'var(--bg-secondary)',
                          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff'
                        }}>
                          {u.profileImage ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getPartnerAvatarInitials(u.name)}
                        </div>
                      </div>

                      <div style={{ padding: '36px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h5 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{u.name || 'Creator'}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{c.category || 'Content Creator'}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{formatNumber(c.followersCount)}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Followers</div>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>{c.avgEngagement ? `${c.avgEngagement}%` : 'N/A'}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Engagement</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d63384' }}>{c.completedCampaigns || 0}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</div>
                          </div>
                        </div>

                        <Link to={`/creators/${u._id}`} className="btn btn-primary w-100" style={{ fontSize: '0.83rem', padding: '9px' }}>
                          <Eye size={14} style={{ marginRight: '6px' }} /> View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* BRANDS TAB */}
      {activeTab === 'brands' && (
        <div className="row g-4">
          {results.map((b) => (
            <div key={b._id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h5 style={{ fontWeight: 800, fontSize: '1rem', margin: '0 0 4px' }}>{b.companyName}</h5>
                <span className="badge badge-primary mb-3">{b.industry}</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{b.description || 'Verified Sponsor'}</p>
                <Link to={`/brands/${b.userId?._id}`} className="btn btn-outline w-100">View Brand Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {p.location || 'Global'}</span>
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
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {p.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>CREATORS REQUIRED</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.creatorsRequired || 1} Creator(s)</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>DEADLINE</span>
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
      )}
    </div>
  );
};

export default Discover;
