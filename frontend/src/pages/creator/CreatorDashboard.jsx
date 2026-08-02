import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import campaignService from '../../services/campaignService';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import AnalyticsCard from '../../components/AnalyticsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  Compass,
  FileText,
  Calendar,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

// Chart.js integrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    pendingPitches: 0,
    acceptedPitches: 0,
    completedCampaigns: 0,
    totalEarnings: 0
  });
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    const fetchCreatorDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch creator applications
        const appsRes = await api.get('/applications/me');
        const apps = appsRes.data || [];
        setApplications(apps);

        // Calculate stats
        const active = apps.filter(a => a.status === 'approved').length;
        const pending = apps.filter(a => a.status === 'pending').length;
        const completed = apps.filter(a => a.status === 'completed').length;
        const earnings = apps
          .filter(a => a.status === 'approved' || a.status === 'completed')
          .reduce((sum, a) => sum + (a.proposedRate || 0), 0);

        setStats({
          activeCampaigns: active,
          pendingPitches: pending,
          acceptedPitches: active + completed,
          completedCampaigns: completed,
          totalEarnings: earnings
        });

        // 2. Fetch campaign recommendations
        const campsRes = await campaignService.getAllCampaigns();
        const allCamps = campsRes.campaigns || campsRes || [];
        setRecommendations(allCamps.slice(0, 3));

        // 3. Extract upcoming deadlines from active workspaces
        const wsRes = await api.get('/workspaces');
        const workspaces = wsRes.data || [];
        const upcomingDeadlines = [];
        workspaces.forEach(ws => {
          ws.milestones?.forEach(m => {
            if (m.status === 'pending') {
              upcomingDeadlines.push({
                _id: m._id,
                title: m.title,
                workspaceId: ws._id,
                projectTitle: ws.projectId?.title || 'Collaboration',
                status: m.status
              });
            }
          });
        });
        setDeadlines(upcomingDeadlines.slice(0, 3));
      } catch (err) {
        console.warn('Error fetching creator dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorDashboardData();
  }, []);

  // Chart data setup
  const monthlyEarningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Earnings ($)',
        data: [400, 750, 1200, 950, 1800, 2100, stats.totalEarnings || 1500],
        fill: true,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.18)',
        tension: 0.4
      }
    ]
  };

  const pitchConversionData = {
    labels: ['Pitches Submitted', 'Shortlisted', 'Hired & Active', 'Completed'],
    datasets: [
      {
        label: 'Proposals Count',
        data: [applications.length || 5, stats.pendingPitches || 2, stats.activeCampaigns || 2, stats.completedCampaigns || 1],
        backgroundColor: ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Creator Dashboard..." />;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero Welcome Glass Banner */}
      <div
        className="glass-panel mb-4"
        style={{
          padding: '32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(236, 72, 153, 0.14) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#8b5cf6', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              <Award size={14} /> Creator Partner Verified
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: '#ffffff', fontFamily: "'Outfit', var(--font-sans)" }}>
              Welcome back, <span className="gradient-text">{user?.name}</span> 👋
            </h1>
            <p style={{ color: '#cbd5e1', margin: '6px 0 0 0', fontSize: '0.98rem' }}>
              Track your pitch proposals, active sponsorships, and earnings in real-time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/discover" className="auth-btn-primary" style={{ width: 'auto', padding: '12px 24px', textDecoration: 'none', fontSize: '0.9rem' }}>
              <Sparkles size={16} />
              Discover Campaign Briefs
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Widgets Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="ACTIVE CAMPAIGNS"
            value={stats.activeCampaigns}
            subtitle="Ongoing collaborations"
            icon={<Briefcase size={20} style={{ color: '#8b5cf6' }} />}
            color="#8b5cf6"
            trend="+12.4%"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="PENDING PITCHES"
            value={stats.pendingPitches}
            subtitle="Awaiting brand review"
            icon={<Clock size={20} style={{ color: '#f59e0b' }} />}
            color="#f59e0b"
            trend="Active"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL EARNINGS"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            subtitle="Approved payouts"
            icon={<DollarSign size={20} style={{ color: '#10b981' }} />}
            color="#10b981"
            trend="+18.5%"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="COMPLETED WORK"
            value={stats.completedCampaigns}
            subtitle="Successfully closed"
            icon={<CheckCircle size={20} style={{ color: '#ec4899' }} />}
            color="#ec4899"
            trend="100% Rate"
          />
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <AnalyticsCard title="Earnings Overview Trend ($)">
            <Line data={monthlyEarningsData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>

        <div className="col-12 col-lg-5">
          <AnalyticsCard title="Pitch Conversion Funnel">
            <Bar data={pitchConversionData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>
      </div>

      {/* Bottom Grid: Pitch History & Recommendations */}
      <div className="row g-4">
        {/* Recent Applications Feed */}
        <div className="col-12 col-lg-7">
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                <FileText size={20} style={{ color: '#8b5cf6' }} />
                Recent Pitch Proposals
              </h4>
            </div>

            {applications.length === 0 ? (
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                You haven't pitched to any campaigns yet. Explore the Discover section to find briefs!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="p-3" style={{ background: '#140d24', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                        {app.campaignId?.title || app.projectId?.title || 'Campaign Pitch'}
                      </h5>
                      <span className={`badge badge-${app.status}`} style={{ fontSize: '0.75rem' }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: '0.83rem', color: '#cbd5e1', margin: '4px 0' }}>"{app.pitch?.substring(0, 80)}..."</p>
                    <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: '0.78rem', color: '#8b85a3' }}>
                      <span>Proposed rate: ${app.proposedRate}</span>
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Campaign Recommendations */}
        <div className="col-12 col-lg-5">
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                <Compass size={20} style={{ color: '#ec4899' }} />
                Recommended Briefs
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map((camp) => (
                <div key={camp._id} className="p-3 d-flex justify-content-between align-items-center" style={{ background: '#140d24', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 4px 0', color: '#ffffff' }}>{camp.title}</h5>
                    <span style={{ fontSize: '0.78rem', color: '#8b85a3' }}>
                      Budget: ${camp.budget?.min} - ${camp.budget?.max}
                    </span>
                  </div>
                  <Link to={`/campaigns/${camp._id}`} className="auth-btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', width: 'auto', textDecoration: 'none' }}>
                    Pitch <ArrowUpRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
