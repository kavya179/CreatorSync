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
  Sparkles
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
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.12)',
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
        backgroundColor: ['#00b4d8', '#ffbe0b', '#00e5a0', '#ff6b6b'],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#a8a0bf' } }
    },
    scales: {
      x: { ticks: { color: '#a8a0bf' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#a8a0bf' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Creator Dashboard..." />;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Welcome Back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Track your pitch proposals, active sponsorships, and earnings.
          </p>
        </div>

        <Link to="/discover" className="btn btn-primary" style={{ padding: '10px 20px', fontWeight: 700 }}>
          <Sparkles size={16} />
          Discover Briefs
        </Link>
      </div>

      {/* 4 Stat Overview Widgets Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="ACTIVE CAMPAIGNS"
            value={stats.activeCampaigns}
            subtitle="Ongoing collaborations"
            icon={<Briefcase size={20} style={{ color: 'var(--primary)' }} />}
            color="var(--primary)"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="PENDING PITCHES"
            value={stats.pendingPitches}
            subtitle="Awaiting brand review"
            icon={<Clock size={20} style={{ color: 'var(--warning)' }} />}
            color="var(--warning)"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL EARNINGS"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            subtitle="Approved platform payouts"
            icon={<DollarSign size={20} style={{ color: 'var(--success)' }} />}
            color="var(--success)"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="COMPLETED WORK"
            value={stats.completedCampaigns}
            subtitle="Successfully closed"
            icon={<CheckCircle size={20} style={{ color: '#d63384' }} />}
            color="#d63384"
          />
        </div>
      </div>

      {/* Chart.js Analytics Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <AnalyticsCard title="Earnings Overview Trend ($)">
            <Line data={monthlyEarningsData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>

        <div className="col-12 col-lg-5">
          <AnalyticsCard title="Pitch Proposal Conversion Funnel">
            <Bar data={pitchConversionData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>
      </div>

      {/* Bottom Grid: Pitch History & Recommendations */}
      <div className="row g-4">
        {/* Recent Applications Feed */}
        <div className="col-12 col-lg-7">
          <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                Recent Pitch Proposals
              </h4>
            </div>

            {applications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                You haven't pitched to any campaigns yet. Explore the Discover section to find briefs!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {app.campaignId?.title || app.projectId?.title || 'Campaign Pitch'}
                      </h5>
                      <span className={`badge badge-${app.status}`} style={{ fontSize: '0.75rem' }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0' }}>"{app.pitch?.substring(0, 80)}..."</p>
                    <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
          <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Compass size={18} style={{ color: 'var(--primary)' }} />
                Recommended Briefs
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map((camp) => (
                <div key={camp._id} className="p-3 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--text-primary)' }}>{camp.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Budget: ${camp.budget?.min} - ${camp.budget?.max}
                    </span>
                  </div>
                  <Link to={`/campaigns/${camp._id}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
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
