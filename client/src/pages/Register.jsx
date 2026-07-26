import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, AlertTriangle, Briefcase, Sparkles, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('creator'); // Default to creator
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    if (!name || !email || !password || !role) {
      return setLocalError('Please fill in all fields');
    }
    if (password.length < 6) {
      return setLocalError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, role);
      setSuccessMessage(res.message || 'Registration successful! Please check the console for the verification link.');
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--success)' }}>
          <CheckCircle size={56} />
        </div>
        <h2 className="auth-title" style={{ marginBottom: '12px' }}>Verify Your Email</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          {successMessage}
        </p>
        <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="auth-header">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Join as a creator or brand to start collaborating</p>
      </div>

      {localError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'var(--danger-glow)',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          <AlertTriangle size={18} />
          <span>{localError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Role Selector Card Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <button
            type="button"
            className="glass-panel"
            onClick={() => setRole('creator')}
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textAlign: 'center',
              border: role === 'creator' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: role === 'creator' ? 'var(--primary-glow)' : 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={24} style={{ color: role === 'creator' ? 'var(--primary)' : 'var(--text-muted)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Creator</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Apply to campaigns</span>
          </button>

          <button
            type="button"
            className="glass-panel"
            onClick={() => setRole('brand')}
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textAlign: 'center',
              border: role === 'brand' ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
              background: role === 'brand' ? 'var(--secondary-glow)' : 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <Briefcase size={24} style={{ color: role === 'brand' ? 'var(--secondary)' : 'var(--text-muted)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Brand</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Publish briefs</span>
          </button>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="form-input"
              style={{ paddingLeft: '48px' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="form-input"
              style={{ paddingLeft: '48px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              id="password"
              type="password"
              placeholder="•••••••• (Min 6 chars)"
              className="form-input"
              style={{ paddingLeft: '48px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : (
            <>
              Sign Up
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Already have an account?{' '}
        <Link to="/login" className="gradient-text" style={{ fontWeight: 600 }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
