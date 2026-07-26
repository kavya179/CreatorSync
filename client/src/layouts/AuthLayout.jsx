import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Share2 } from 'lucide-react';

const AuthLayout = () => {
  const { user } = useAuth();

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-sidebar">
        <Link to="/" className="nav-logo gradient-text" style={{ position: 'absolute', top: '40px', left: '40px' }}>
          <Share2 size={24} />
          CreatorSync
        </Link>
        <div className="auth-sidebar-content animate-fade-in-up">
          <h1 className="auth-sidebar-title">
            Syncing <span className="gradient-text">Brands</span> & <span className="gradient-text-sec">Creators</span> Seamlessly.
          </h1>
          <p className="auth-sidebar-desc">
            Discover campaign briefs, submit pitches, manage milestones, and collaborate inside our unified professional platform.
          </p>
        </div>
      </div>
      <div className="auth-form-wrapper">
        <div className="auth-form-box">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
