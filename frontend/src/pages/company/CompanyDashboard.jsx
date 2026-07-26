import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import campaignService from '../../services/campaignService';
import notificationService from '../../services/notificationService';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import AnalyticsCard from '../../components/AnalyticsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Briefcase,
  Users,
  DollarSign,
  PlusCircle,
  FileText,
  Bell,
  MessageSquare,
  BarChart2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

// Chart.js integrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  BarController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  BarController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    remainingBudget: 0
  });

  useEffect(() => {
    const fetchCompanyDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch company campaigns
        const campRes = await campaignService.getMyCampaigns();
        const myCamps = campRes.campaigns || campRes || [];
        setCampaigns(myCamps);

        // Calculate total budget allocated
        const totalBudget = myCamps.reduce((sum, c) => sum + (c.budget?.max || 0), 0);

        // 2. Fetch applications across all campaigns
        let allApps = [];
        for (const camp of myCamps) {
          try {
            const apps = await campaignService.getCampaignApplications(camp._id);
            if (Array.isArray(apps)) {
              allApps = [...allApps, ...apps];
            }
          } catch (e) {
            // ignore empty
          }
        }
        setApplications(allApps);

        // Calculate spent budget
        const totalSpent = allApps
          .filter(a => a.status === 'approved' || a.status === 'completed')
          .reduce((sum, a) => sum + (a.proposedRate || 0), 0);

        setBudgetSummary({
          totalAllocated: totalBudget,
          totalSpent: totalSpent,
          remainingBudget: Math.max(0, totalBudget - totalSpent)
        });

        // 3. Fetch notifications
        const notifRes = await notificationService.getNotifications();
        setNotifications(notifRes.notifications || notifRes || []);

        // 4. Fetch inbox messages
        const msgRes = await api.get('/messages/inbox');
        setMessages(msgRes.data || []);
      } catch (err) {
        console.warn('Error fetching company dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDashboardData();
  }, []);

  // Chart data setup
  const budgetAllocationData = {
    labels: campaigns.map(c => c.title?.substring(0, 15) + '...') || ['Campaign 1', 'Campaign 2'],
    datasets: [
      {
        label: 'Budget Allocated ($)',
        data: campaigns.map(c => c.budget?.max || 1000),
        backgroundColor: ['#ff6b6b', '#00e5a0', '#00b4d8', '#ffbe0b', '#7209b7'],
        borderRadius: 6
      }
    ]
  };

  const applicationStatusData = {
    labels: ['Pending Review', 'Approved Creators', 'Rejected'],
    datasets: [
      {
        data: [
          applications.filter(a => a.status === 'pending').length || 3,
          applications.filter(a => a.status === 'approved').length || 2,
          applications.filter(a => a.status === 'rejected').length || 1
        ],
        backgroundColor: ['#ffbe0b', '#00e5a0', '#ef4444'],
        borderWidth: 0
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
    return <LoadingSpinner message="Loading Company Dashboard..." />;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Company Sponsor Dashboard 💼
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Manage active campaigns, review applicant pitches, and track marketing ROI.
          </p>
        </div>

        <Link to="/company/post-campaign" className="btn btn-primary" style={{ padding: '10px 20px', fontWeight: 700 }}>
          <PlusCircle size={16} />
          Post New Campaign Brief
        </Link>
      </div>

      {/* 4 Overview Metric Stat Widgets */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL CAMPAIGNS"
            value={campaigns.length}
            subtitle="Active sponsor briefs"
            icon={<Briefcase size={20} style={{ color: 'var(--primary)' }} />}
            color="var(--primary)"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL APPLICATIONS"
            value={applications.length}
            subtitle="Creator pitches received"
            icon={<FileText size={20} style={{ color: 'var(--warning)' }} />}
            color="var(--warning)"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="BUDGET ALLOCATED"
            value={`$${budgetSummary.totalAllocated.toLocaleString()}`}
            subtitle="Campaign fund pool"
            icon={<DollarSign size={20} style={{ color: 'var(--success)' }} />}
            color="var(--success)"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="HIRED CREATORS"
            value={applications.filter(a => a.status === 'approved').length}
            subtitle="Active collaborations"
            icon={<UserCheck size={20} style={{ color: '#00b4d8' }} />}
            color="#00b4d8"
          />
        </div>
      </div>

      {/* Charts & Budget Summary Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <AnalyticsCard title="Campaign Budget Allocations ($)">
            <BarChart data={budgetAllocationData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>

        <div className="col-12 col-lg-5">
          <AnalyticsCard title="Application Review Status">
            <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
              <DoughnutChart data={applicationStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Applications Review Feed & Creator Performance */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Users size={18} style={{ color: 'var(--primary)' }} />
                Recent Creator Applications
              </h4>
              <Link to="/company/campaigns" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                View All
              </Link>
            </div>

            {applications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                No creator applications received yet. Post a brief to start receiving pitches!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {app.creatorId?.name || 'Creator'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate: ${app.proposedRate}</span>
                      </div>
                      <span className={`badge badge-${app.status}`} style={{ fontSize: '0.75rem' }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 8px 0' }}>"{app.pitch}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Messaging Thread Summary */}
        <div className="col-12 col-lg-5">
          <div className="card glass-panel border-0 shadow-sm mb-4" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Bell size={18} style={{ color: 'var(--warning)' }} />
              Notifications Alert
            </h4>
            {notifications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>No new notifications.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.slice(0, 3).map((n) => (
                  <div key={n._id} className="p-2" style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 700, display: 'block' }}>{n.title}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{n.body}</span>
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

export default CompanyDashboard;
