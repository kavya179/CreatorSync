import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Compass,
  UserCircle,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Share2,
  Sparkles,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  BarChart2,
  Bookmark,
  Settings,
  PlusCircle,
  Users,
  CreditCard,
  AlertOctagon,
  TrendingUp,
  CheckSquare
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CS';
  };

  const isItemActive = (itemPath) => {
    const currentPath = location.pathname + location.search;
    if (itemPath === '/dashboard?tab=dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/' || currentPath.startsWith('/dashboard?tab=dashboard');
    }
    return currentPath.startsWith(itemPath);
  };

  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        {
          label: 'Admin Home',
          path: '/dashboard?tab=dashboard',
          icon: <LayoutDashboard size={20} />
        },
        {
          label: 'Manage Users',
          path: '/dashboard?tab=users',
          icon: <Users size={20} />
        },
        {
          label: 'Moderate Projects',
          path: '/dashboard?tab=projects',
          icon: <Briefcase size={20} />
        },
        {
          label: 'Flagged Reports',
          path: '/dashboard?tab=reports',
          icon: <AlertOctagon size={20} />
        },
        {
          label: 'Revenue Logs',
          path: '/dashboard?tab=revenue',
          icon: <CreditCard size={20} />
        },
        {
          label: 'Platform Stats',
          path: '/dashboard?tab=analytics',
          icon: <TrendingUp size={20} />
        },
        {
          label: 'Settings',
          path: '/dashboard/settings',
          icon: <Settings size={20} />
        }
      ];
    } else if (user?.role === 'creator') {
      return [
        {
          label: 'Dashboard',
          path: '/dashboard?tab=dashboard',
          icon: <LayoutDashboard size={20} />
        },
        {
          label: 'My Profile',
          path: '/dashboard/profile',
          icon: <UserCircle size={20} />
        },
        {
          label: 'Discover Campaigns',
          path: '/discover',
          icon: <Compass size={20} />
        },
        {
          label: 'My Applications',
          path: '/dashboard?tab=applications',
          icon: <FileText size={20} />
        },
        {
          label: 'Active Collaborations',
          path: '/dashboard?tab=active-collaborations',
          icon: <Briefcase size={20} />
        },
        {
          label: 'Completed Collaborations',
          path: '/dashboard?tab=completed-collaborations',
          icon: <CheckSquare size={20} />
        },
        {
          label: 'Messages',
          path: '/dashboard?tab=messages',
          icon: <MessageSquare size={20} />
        },
        {
          label: 'Notifications',
          path: '/dashboard?tab=notifications',
          icon: <Bell size={20} />
        },
        {
          label: 'Analytics',
          path: '/dashboard?tab=analytics',
          icon: <BarChart2 size={20} />
        },
        {
          label: 'Settings',
          path: '/dashboard/settings',
          icon: <Settings size={20} />
        }
      ];
    } else {
      return [
        {
          label: 'Dashboard',
          path: '/dashboard?tab=dashboard',
          icon: <LayoutDashboard size={20} />
        },
        {
          label: 'Company Profile',
          path: '/dashboard?tab=profile',
          icon: <UserCircle size={20} />
        },
        {
          label: 'Post Campaign',
          path: '/dashboard?tab=create',
          icon: <PlusCircle size={20} />
        },
        {
          label: 'My Campaigns',
          path: '/dashboard?tab=campaigns',
          icon: <Briefcase size={20} />
        },
        {
          label: 'Applications Received',
          path: '/dashboard?tab=applications',
          icon: <FileText size={20} />
        },
        {
          label: 'Shortlisted Creators',
          path: '/dashboard?tab=shortlist',
          icon: <Users size={20} />
        },
        {
          label: 'Company Collaborations',
          path: '/dashboard?tab=collaborations',
          icon: <Briefcase size={20} />
        },
        {
          label: 'Inbox Messages',
          path: '/dashboard?tab=messages',
          icon: <MessageSquare size={20} />
        },
        {
          label: 'Campaign Analytics',
          path: '/dashboard?tab=analytics',
          icon: <BarChart2 size={20} />
        },
        {
          label: 'Escrow Payments',
          path: '/dashboard?tab=payments',
          icon: <CreditCard size={20} />
        },
        {
          label: 'Account Settings',
          path: '/dashboard/settings',
          icon: <Settings size={20} />
        }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="dashboard-container">
      {/* Sidebar for Desktop & Mobile */}
      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="dashboard-sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="nav-logo gradient-text" style={{ fontSize: '1.25rem' }}>
            <Share2 size={20} />
            CreatorSync
          </Link>
          <button className="btn-icon close-sidebar-btn" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="dashboard-nav" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)', paddingRight: '4px' }}>
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={isItemActive(item.path) ? "dashboard-nav-item active" : "dashboard-nav-item"}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-user-card">
            <div className="dashboard-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">{user?.name}</span>
              <span className="dashboard-user-role" style={{ color: 'var(--primary)', fontWeight: 700 }}>{user?.role}</span>
            </div>
          </div>

          <button onClick={logout} className="btn btn-primary" style={{ marginTop: '8px', padding: '10px 16px', width: '100%' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn-icon mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={20} />
            </button>
            <h2 className="dashboard-title-bar">Workspace Panel</h2>
          </div>
          <div className="dashboard-user-card">
            <div className="dashboard-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
              {getInitials(user?.name)}
            </div>
            <span className="dashboard-user-name" style={{ fontSize: '0.85rem' }}>{user?.name}</span>
          </div>
        </header>

        <main className="dashboard-content animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      <style>{`
        .close-sidebar-btn {
          display: none !important;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .close-sidebar-btn {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
