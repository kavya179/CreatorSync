import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Save,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Briefcase,
  Plus,
  Trash2,
  Award,
  BookOpen,
  Video,
  ExternalLink,
  Image as ImageIcon,
  User as UserCircle,
  Globe,
  BarChart2,
  CheckSquare
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, error, setError } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Base profile details
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');

  // Creator specific fields
  const [niche, setNiche] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [socialChannels, setSocialChannels] = useState([]);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [videos, setVideos] = useState([]);

  // Creator basic information overrides
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  // Creator professional details
  const [coverBanner, setCoverBanner] = useState('');
  const [category, setCategory] = useState('');
  const [primaryPlatform, setPrimaryPlatform] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [languages, setLanguages] = useState('');
  const [availability, setAvailability] = useState('Available');

  // Creator social media links
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Creator audience statistics
  const [followersCount, setFollowersCount] = useState(0);
  const [avgEngagement, setAvgEngagement] = useState(0);
  const [avgReach, setAvgReach] = useState(0);
  const [monthlyViews, setMonthlyViews] = useState(0);

  // Skills dynamic list
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Work Showcase
  const [showcase, setShowcase] = useState([]);

  // Completed collaborations display list
  const [completedCollaborations, setCompletedCollaborations] = useState([]);

  // Brand specific fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [images, setImages] = useState([]);
  const [companyLogo, setCompanyLogo] = useState('');
  const [address, setAddress] = useState('');
  const [productsServices, setProductsServices] = useState('');
  const [mission, setMission] = useState('');

  // Hydrate details from API on mount
  useEffect(() => {
    const fetchDetails = async () => {
      if (!user) return;
      try {
        if (user.role === 'creator') {
          const res = await api.get(`/creators/${user._id}`);
          const c = res.data.creator || {};
          const u = res.data.creator?.userId || {};

          setUsername(u.username || '');
          setPhone(u.phone || '');
          setCountry(u.country || '');
          setCity(u.city || '');

          setCoverBanner(c.coverBanner || '');
          setCategory(c.category || '');
          setPrimaryPlatform(c.primaryPlatform || '');
          setExperienceYears(c.experienceYears || 0);
          setLanguages(c.languages?.join(', ') || '');
          setAvailability(c.availability || 'Available');

          setInstagramUrl(c.instagramUrl || '');
          setYoutubeUrl(c.youtubeUrl || '');
          setLinkedinUrl(c.linkedinUrl || '');
          setXUrl(c.xUrl || '');
          setFacebookUrl(c.facebookUrl || '');
          setWebsiteUrl(c.websiteUrl || '');

          setFollowersCount(c.followersCount || 0);
          setAvgEngagement(c.avgEngagement || 0);
          setAvgReach(c.avgReach || 0);
          setMonthlyViews(c.monthlyViews || 0);

          setSkillsList(c.skills || []);
          setShowcase(c.showcase || []);

          setNiche(c.niche?.join(', ') || '');
          setBio(c.bio || '');
          setPortfolioUrl(c.portfolioUrl || '');
          setPortfolioDescription(c.portfolioDescription || '');
          setSocialChannels(c.socialChannels || []);
          setExperience(c.experience || []);
          setAchievements(c.achievements || []);
          setCertificates(c.certificates || []);
          setVideos(c.videos || []);

          // Hydrate completed collaborations list
          try {
            const wsRes = await api.get('/workspaces');
            const completed = (wsRes.data || []).filter(w => w.status === 'completed');
            setCompletedCollaborations(completed);
          } catch (wsErr) {
            console.warn('Completed workspaces fetch error:', wsErr.message);
          }
        } else if (user.role === 'brand') {
          const res = await api.get(`/brands/${user._id}`);
          const b = res.data.brand || {};
          setCompanyName(b.companyName || '');
          setIndustry(b.industry || '');
          setWebsite(b.website || '');
          setDescription(b.description || '');
          setSocialLinks(b.socialLinks || []);
          setImages(b.images || []);
          setCompanyLogo(b.companyLogo || '');
          setCoverBanner(b.coverBanner || '');
          setPhone(b.phone || '');
          setCountry(b.country || '');
          setCity(b.city || '');
          setAddress(b.address || '');
          setProductsServices(b.productsServices || '');
          setMission(b.mission || '');
          setLinkedinUrl(b.linkedinUrl || '');
          setInstagramUrl(b.instagramUrl || '');
          setFacebookUrl(b.facebookUrl || '');
          setYoutubeUrl(b.youtubeUrl || '');
          setXUrl(b.twitterUrl || '');
        }
      } catch (err) {
        console.warn('Profile hydration skipped:', err.message);
      }
    };
    fetchDetails();
  }, [user]);

  // Social handles (Creator)
  const handleAddSocial = () => {
    setSocialChannels([...socialChannels, { platform: 'youtube', handle: '', followers: 0 }]);
  };
  const handleRemoveSocial = (idx) => {
    setSocialChannels(socialChannels.filter((_, i) => i !== idx));
  };
  const handleSocialChange = (idx, field, val) => {
    const updated = [...socialChannels];
    updated[idx][field] = field === 'followers' ? Number(val) : val;
    setSocialChannels(updated);
  };

  // Social Links (Brand)
  const handleAddBrandSocial = () => {
    setSocialLinks([...socialLinks, { platform: 'instagram', handle: '' }]);
  };
  const handleRemoveBrandSocial = (idx) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== idx));
  };
  const handleBrandSocialChange = (idx, field, val) => {
    const updated = [...socialLinks];
    updated[idx][field] = val;
    setSocialLinks(updated);
  };

  // Gallery Images (Brand)
  const handleAddGalleryImage = () => {
    setImages([...images, '']);
  };
  const handleRemoveGalleryImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };
  const handleGalleryImageChange = (idx, val) => {
    const updated = [...images];
    updated[idx] = val;
    setImages(updated);
  };

  // Experience handlers
  const handleAddExperience = () => {
    setExperience([...experience, { companyName: '', projectTitle: '', description: '', date: '' }]);
  };
  const handleRemoveExperience = (idx) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };
  const handleExperienceChange = (idx, field, val) => {
    const updated = [...experience];
    updated[idx][field] = val;
    setExperience(updated);
  };

  // Achievements handlers
  const handleAddAchievement = () => {
    setAchievements([...achievements, { title: '', date: '' }]);
  };
  const handleRemoveAchievement = (idx) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };
  const handleAchievementChange = (idx, field, val) => {
    const updated = [...achievements];
    updated[idx][field] = val;
    setAchievements(updated);
  };

  // Certificates handlers
  const handleAddCertificate = () => {
    setCertificates([...certificates, { title: '', issuer: '', date: '' }]);
  };
  const handleRemoveCertificate = (idx) => {
    setCertificates(certificates.filter((_, i) => i !== idx));
  };
  const handleCertificateChange = (idx, field, val) => {
    const updated = [...certificates];
    updated[idx][field] = val;
    setCertificates(updated);
  };

  // Skills dynamic tag handlers
  const handleAddSkillTag = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkillTag = (tag) => {
    setSkillsList(skillsList.filter(s => s !== tag));
  };

  // Videos handlers
  const handleAddVideo = () => {
    setVideos([...videos, '']);
  };
  const handleRemoveVideo = (idx) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };
  const handleVideoChange = (idx, val) => {
    const updated = [...videos];
    updated[idx] = val;
    setVideos(updated);
  };

  // Showcase Handlers
  const handleAddShowcase = () => {
    setShowcase([...showcase, { title: '', platform: 'youtube', description: '', url: '', thumbnail: '' }]);
  };
  const handleRemoveShowcase = (idx) => {
    setShowcase(showcase.filter((_, i) => i !== idx));
  };
  const handleShowcaseChange = (idx, field, val) => {
    const updated = [...showcase];
    updated[idx][field] = val;
    setShowcase(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const baseProfileData = {
      name,
      profileImage
    };

    if (password) {
      baseProfileData.password = password;
    }

    try {
      // 1. Update Core user credentials
      await updateProfile(baseProfileData);

      // 2. Update Role specific database schemas
      if (user.role === 'creator') {
        const creatorData = {
          niche: niche.split(',').map(s => s.trim()).filter(Boolean),
          skills: skillsList,
          bio,
          portfolioUrl,
          portfolioDescription,
          socialChannels,
          experience,
          achievements,
          certificates,
          videos,

          // User-level details
          username,
          phone,
          country,
          city,

          // Professional details
          coverBanner,
          category,
          primaryPlatform,
          experienceYears: Number(experienceYears) || 0,
          languages: languages.split(',').map(s => s.trim()).filter(Boolean),
          availability,

          // Social URLs
          instagramUrl,
          youtubeUrl,
          linkedinUrl,
          xUrl,
          facebookUrl,
          websiteUrl,

          // Audience stats
          followersCount: Number(followersCount) || 0,
          avgEngagement: Number(avgEngagement) || 0,
          avgReach: Number(avgReach) || 0,
          monthlyViews: Number(monthlyViews) || 0,

          // Showcase
          showcase
        };
        await api.put('/creators/me', creatorData);
      } else {
        const brandData = {
          companyName,
          industry,
          website,
          description,
          socialLinks,
          images,
          companyLogo,
          coverBanner,
          phone,
          country,
          city,
          address,
          productsServices,
          mission,
          linkedinUrl,
          instagramUrl,
          facebookUrl,
          youtubeUrl,
          twitterUrl: xUrl
        };
        await api.put('/brands/me', brandData);
      }

      setSuccess(true);
      setPassword('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Profile save failed.');
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletionScore = () => {
    let score = 0;
    if (user.role === 'creator') {
      if (name) score += 15;
      if (profileImage) score += 15;
      if (bio) score += 20;
      if (category) score += 15;
      if (skillsList && skillsList.length > 0) score += 10;
      if (instagramUrl || youtubeUrl || linkedinUrl || xUrl) score += 15;
      if (showcase && showcase.length > 0) score += 10;
    } else {
      if (companyName) score += 10;
      if (companyLogo) score += 10;
      if (coverBanner) score += 10;
      if (industry) score += 10;
      if (website) score += 10;
      if (description) score += 10;
      if (phone) score += 10;
      if (country || city || address) score += 10;
      if (productsServices || mission) score += 10;
      if (linkedinUrl || instagramUrl || facebookUrl || youtubeUrl || xUrl) score += 10;
    }
    return Math.min(score, 100);
  };
  const completionPct = getProfileCompletionScore();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Edit Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update your public parameters and brand outreach credentials</p>
        </div>
        {user?.role === 'creator' && (
          <Link to={`/creators/${user._id}`} className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}>
            <ExternalLink size={16} />
            View Public Portfolio
          </Link>
        )}
        {user?.role === 'brand' && (
          <Link to={`/brands/${user._id}`} className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}>
            <ExternalLink size={16} />
            View Public Brand Profile
          </Link>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'var(--success-glow)',
          color: 'var(--success)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <CheckCircle size={18} />
          <span>Profile parameters saved successfully!</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'var(--danger-glow)',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>

        {/* Profile Completion Indicator */}
        <div className="card glass-panel border-0 mb-4 shadow-sm" style={{ background: 'var(--primary-glow)', padding: '20px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {user.role === 'creator' ? 'CREATOR' : 'COMPANY'} PROFILE COMPLETENESS SCORE
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{completionPct}%</span>
          </div>
          <div className="progress mb-2" style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${completionPct}%`,
                background: 'var(--primary-gradient)',
                borderRadius: 'var(--radius-full)'
              }}
              aria-valuenow={completionPct}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {completionPct < 100
              ? (user.role === 'creator'
                ? "Fill in basic, professional, social handles, audience, and showcase fields to increase completeness index!"
                : "Fill in company name, logo, banner, mission, address, products/services, and social handles to optimize visibility!")
              : `Excellent! Your ${user.role} profile is 100% complete and fully optimized.`}
          </p>
        </div>

        {/* Section: Account Credentials (Core user fields) */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Account Credentials
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Profile Image URL</label>
            <input type="text" className="form-input" placeholder="https://..." value={profileImage} onChange={(e) => setProfileImage(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Change Password (leave blank to keep current)</label>
          <input type="password" placeholder="••••••••" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* Section: Creator details */}
        {user.role === 'creator' ? (
          <div style={{ marginTop: '32px' }}>

            {/* 1. Basic Information */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Basic Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input type="text" placeholder="@username" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Banner URL</label>
                <input type="text" placeholder="https://..." className="form-input" value={coverBanner} onChange={(e) => setCoverBanner(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Email (Account identifier)</label>
                <input type="email" className="form-input" value={user.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" placeholder="+1..." className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input type="text" placeholder="United States" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" placeholder="New York" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Biography tagline</label>
              <textarea placeholder="Summarize your main outreach focus..." rows="2" className="form-input" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            {/* 2. Professional Information */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Professional Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Creator Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="Tech & Coding">Tech & Coding</option>
                  <option value="Lifestyle & Vlog">Lifestyle & Vlog</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="Fashion & Beauty">Fashion & Beauty</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Primary Platform</label>
                <select className="form-select" value={primaryPlatform} onChange={(e) => setPrimaryPlatform(e.target.value)}>
                  <option value="">Select Platform</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">X (Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input type="number" min="0" className="form-input" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Availability Status</label>
                <select className="form-select" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Vacation">On Vacation</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Languages (comma separated)</label>
              <input type="text" placeholder="English, Spanish, Hindi" className="form-input" value={languages} onChange={(e) => setLanguages(e.target.value)} />
            </div>

            {/* 3. Social Media URLs */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Social Media Handles
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Instagram Profile Link</label>
                <input type="url" placeholder="https://instagram.com/..." className="form-input" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube Channel Link</label>
                <input type="url" placeholder="https://youtube.com/..." className="form-input" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">LinkedIn Profile Link</label>
                <input type="url" placeholder="https://linkedin.com/in/..." className="form-input" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">X (Twitter) URL</label>
                <input type="url" placeholder="https://x.com/..." className="form-input" value={xUrl} onChange={(e) => setXUrl(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div className="form-group">
                <label className="form-label">Facebook Profile Link</label>
                <input type="url" placeholder="https://facebook.com/..." className="form-input" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input type="url" placeholder="https://..." className="form-input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
              </div>
            </div>

            {/* 4. Audience Statistics */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Audience Statistics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Followers Count</label>
                <input type="number" min="0" className="form-input" value={followersCount} onChange={(e) => setFollowersCount(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Average Engagement Rate (%)</label>
                <input type="number" min="0" step="0.01" className="form-input" value={avgEngagement} onChange={(e) => setAvgEngagement(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div className="form-group">
                <label className="form-label">Average Reach Per Post</label>
                <input type="number" min="0" className="form-input" value={avgReach} onChange={(e) => setAvgReach(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Views</label>
                <input type="number" min="0" className="form-input" value={monthlyViews} onChange={(e) => setMonthlyViews(e.target.value)} />
              </div>
            </div>

            {/* 5. Skills tag CRUD */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Skills Tags
              </h3>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {skillsList.length === 0 ? (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills tags registered yet.</span>
                ) : (
                  skillsList.map((tag) => (
                    <span key={tag} className="badge badge-primary d-flex align-items-center gap-1" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillTag(tag)}
                        style={{ border: 'none', background: 'none', color: 'inherit', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="d-flex gap-2" style={{ maxWidth: '400px' }}>
                <input
                  type="text"
                  placeholder="Add skill (e.g. Video Editing)"
                  className="form-input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
                <button type="button" onClick={handleAddSkillTag} className="btn btn-outline" style={{ padding: '0 16px' }}>
                  Add Skill
                </button>
              </div>
            </div>

            {/* 6. Work Showcase dynamic items */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Work Showcase
                </h3>
                <button type="button" onClick={handleAddShowcase} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Showcase Item
                </button>
              </div>

              {showcase.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No showcase items added yet. Click Add Showcase Item above.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {showcase.map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'var(--bg-tertiary)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>SHOWCASE ITEM #{idx + 1}</span>
                        <button type="button" onClick={() => handleRemoveShowcase(idx)} className="btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Title</label>
                          <input type="text" placeholder="e.g. Tech Review Video" className="form-input" value={item.title} onChange={(e) => handleShowcaseChange(idx, 'title', e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Platform</label>
                          <select className="form-select" value={item.platform} onChange={(e) => handleShowcaseChange(idx, 'platform', e.target.value)}>
                            <option value="youtube">YouTube</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="twitter">X (Twitter)</option>
                            <option value="website">Website</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">URL link</label>
                          <input type="url" placeholder="https://..." className="form-input" value={item.url} onChange={(e) => handleShowcaseChange(idx, 'url', e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Thumbnail URL</label>
                          <input type="url" placeholder="https://..." className="form-input" value={item.thumbnail} onChange={(e) => handleShowcaseChange(idx, 'thumbnail', e.target.value)} />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Description</label>
                        <textarea placeholder="Tell brands about what this work showcase highlights..." rows="2" className="form-input" value={item.description} onChange={(e) => handleShowcaseChange(idx, 'description', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. Previous Completed Collaborations */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Previous Collaborations
              </h3>
              {completedCollaborations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No completed collaborations logged on CreatorSync yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {completedCollaborations.map((collab) => (
                    <div key={collab._id} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>{collab.projectId?.title || 'Brand Sponsorship Campaign'}</h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Workspace: {collab._id}</span>
                        </div>
                        <div className="text-end">
                          <span className="badge badge-approved mb-1">completed</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>Earnings: ${collab.proposedRate || 1500}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legacy sections */}
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} style={{ color: 'var(--primary)' }} /> Legacy Experience Log
                </h4>
                <button type="button" onClick={handleAddExperience} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Experience
                </button>
              </div>
              {experience.map((exp, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '16px', marginBottom: '16px', background: 'var(--bg-tertiary)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '12px' }}>
                    <input type="text" placeholder="Company Name" className="form-input" value={exp.companyName} onChange={(e) => handleExperienceChange(idx, 'companyName', e.target.value)} required />
                    <input type="text" placeholder="Project Title" className="form-input" value={exp.projectTitle} onChange={(e) => handleExperienceChange(idx, 'projectTitle', e.target.value)} required />
                    <input type="date" className="form-input" value={exp.date ? exp.date.substring(0, 10) : ''} onChange={(e) => handleExperienceChange(idx, 'date', e.target.value)} />
                    <button type="button" onClick={() => handleRemoveExperience(idx)} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </div>
                  <textarea placeholder="Experience brief description..." rows="2" className="form-input" value={exp.description} onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)} />
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Brand specific settings */
          <div style={{ marginTop: '32px' }}>
            <div className="d-flex align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <Briefcase size={20} style={{ marginRight: '8px', color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Company Branding Profile
              </h3>
              {user.isVerified && (
                <span className="badge badge-approved" style={{ marginLeft: '12px', background: 'var(--success-glow)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> Verified Company
                </span>
              )}
            </div>

            {/* Media/Visual Identity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Company Logo URL</label>
                <input type="url" placeholder="https://example.com/logo.png" className="form-input" value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Banner URL</label>
                <input type="url" placeholder="https://example.com/banner.png" className="form-input" value={coverBanner} onChange={(e) => setCoverBanner(e.target.value)} />
              </div>
            </div>

            {/* Company Name & Industry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Industry Sector</label>
                <input type="text" placeholder="e.g. Technology, Apparel" className="form-input" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
            </div>

            {/* Contact & Website */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input type="url" placeholder="https://..." className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Company Email (Disabled)</label>
                <input type="email" className="form-input" value={user.email} disabled style={{ opacity: 0.6 }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" placeholder="+1..." className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input type="text" placeholder="United States" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" placeholder="New York" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Full Office Address</label>
                <input type="text" placeholder="123 Corporate Blvd, Suite 400" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>

            {/* Structured Company text details */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">About Company</label>
              <textarea placeholder="Describe your brand products and campaign expectations..." rows="4" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Products / Services</label>
              <textarea placeholder="List key products or services your company provides..." rows="3" className="form-input" value={productsServices} onChange={(e) => setProductsServices(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Mission Statement</label>
              <textarea placeholder="What is your company's core mission or slogan?" rows="2" className="form-input" value={mission} onChange={(e) => setMission(e.target.value)} />
            </div>

            {/* Social Media Links */}
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Social Channels Links
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input type="url" placeholder="https://linkedin.com/company/..." className="form-input" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram Profile URL</label>
                <input type="url" placeholder="https://instagram.com/..." className="form-input" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Facebook Profile URL</label>
                <input type="url" placeholder="https://facebook.com/..." className="form-input" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube Channel URL</label>
                <input type="url" placeholder="https://youtube.com/..." className="form-input" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px', maxWidth: '380px' }}>
              <label className="form-label">X (Twitter) URL</label>
              <input type="url" placeholder="https://x.com/..." className="form-input" value={xUrl} onChange={(e) => setXUrl(e.target.value)} />
            </div>

            {/* Workspace Images gallery links */}
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={16} style={{ color: 'var(--secondary)' }} /> Company Workspace Gallery
                </h4>
                <button type="button" onClick={handleAddGalleryImage} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Image Link
                </button>
              </div>
              {images.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <input type="url" placeholder="Workspace Image URL (e.g. https://...)" className="form-input" value={img} onChange={(e) => handleGalleryImageChange(idx, e.target.value)} required style={{ marginBottom: 0 }} />
                  <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '32px', padding: '12px' }} disabled={loading}>
          <Save size={18} />
          {loading ? 'Saving Profile Changes...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;

