import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CheckCircle, Clock, Link as LinkIcon, MessageSquare, Send, ShieldAlert, Star } from 'lucide-react';

const Workspace = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState(null);

  const fetchWorkspace = async () => {
    try {
      const { data } = await api.get(`/workspaces/${id}`);
      setWorkspace(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    const interval = setInterval(() => {
      fetchWorkspace();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const { data } = await api.post(`/workspaces/${id}/messages`, { text: message });
      setWorkspace(prev => ({ ...prev, messages: data }));
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err.message);
    }
  };

  const handleSubmitMilestone = async (e) => {
    e.preventDefault();
    if (!submitUrl) return;
    setActionLoading(true);

    try {
      const { data } = await api.post(`/workspaces/${id}/milestones`, {
        milestoneId: submittingId,
        submissionUrl: submitUrl,
        submissionNotes: submitNotes
      });
      setWorkspace(data);
      setSubmitUrl('');
      setSubmitNotes('');
      setSubmittingId(null);
    } catch (err) {
      console.error('Milestone submission failed:', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveMilestone = async (mId) => {
    try {
      const { data } = await api.patch(`/workspaces/${id}/milestones/${mId}`);
      setWorkspace(data);
    } catch (err) {
      console.error('Milestone approval failed:', err.message);
    }
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    setSubmitReviewError(null);
    try {
      await api.post('/reviews', {
        projectId: workspace.projectId?._id || workspace.projectId,
        revieweeId: partner._id,
        rating: feedbackRating,
        comment: feedbackComment
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      setSubmitReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading collaboration workspace...</div>;
  }

  if (error || !workspace) {
    return (
      <div className="glass-panel animate-fade-in-up" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <ShieldAlert size={40} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h3>Workspace Access Error</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{error || 'Workspace could not be fetched.'}</p>
        <Link to="/dashboard" className="btn btn-outline" style={{ marginTop: '16px' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const partner = user.role === 'creator' ? workspace.brandId : workspace.creatorId;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className={`badge badge-${workspace.status}`} style={{ marginBottom: '8px' }}>
            Collaboration Status: {workspace.status}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{workspace.projectId?.title || 'Project Workspace'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Partner: <strong>{partner?.name}</strong> ({partner?.role})
          </p>
        </div>
      </div>

      {workspace.status === 'completed' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Collaboration Completed! 🎉</h3>
          {feedbackSubmitted ? (
            <p style={{ color: 'var(--success)', fontWeight: 600 }}>Thank you! Your feedback review has been submitted successfully.</p>
          ) : (
            <form onSubmit={handleSendFeedback} style={{ maxWidth: '600px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Leave a feedback review for your partner: <strong>{partner?.name}</strong></p>
              
              {submitReviewError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '12px' }}>{submitReviewError}</p>}
              
              <div className="form-group">
                <label className="form-label">Rating Score (1-5 Stars)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <Star
                        size={28}
                        style={{
                          fill: star <= feedbackRating ? 'var(--warning)' : 'none',
                          stroke: star <= feedbackRating ? 'var(--warning)' : 'var(--text-muted)'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea
                  className="form-input"
                  placeholder="Share details of your experience working together..."
                  rows="3"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit Collaboration Review</button>
            </form>
          )}
        </div>
      )}

      <div className="grid-container" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Campaign Milestones</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workspace.milestones?.map((m) => (
                <div key={m._id} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 700 }}>{m.title}</h4>
                    <span className={`badge badge-${m.status}`}>{m.status}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{m.description}</p>

                  {m.status === 'submitted' && (
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: '4px' }}>Submission Link:</span>
                      <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LinkIcon size={14} />
                        {m.submissionUrl}
                      </a>
                      {m.submissionNotes && (
                        <>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginTop: '8px', marginBottom: '4px' }}>Notes:</span>
                          <p style={{ color: 'var(--text-secondary)' }}>{m.submissionNotes}</p>
                        </>
                      )}
                    </div>
                  )}

                  {m.status === 'submitted' && user.role === 'brand' && (
                    <button onClick={() => handleApproveMilestone(m._id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      <CheckCircle size={16} />
                      Approve Deliverable
                    </button>
                  )}

                  {m.status === 'pending' && user.role === 'creator' && submittingId !== m._id && (
                    <button onClick={() => setSubmittingId(m._id)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Submit Proof of Work
                    </button>
                  )}

                  {submittingId === m._id && (
                    <form onSubmit={handleSubmitMilestone} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Deliverable Verification Link (URL)</label>
                        <input
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          className="form-input"
                          value={submitUrl}
                          onChange={(e) => setSubmitUrl(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Notes for sponsor</label>
                        <textarea
                          placeholder="Provide timestamps or live statistics details..."
                          rows="3"
                          className="form-input"
                          value={submitNotes}
                          onChange={(e) => setSubmitNotes(e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={actionLoading}>
                          {actionLoading ? 'Submitting...' : 'Send Submission'}
                        </button>
                        <button type="button" onClick={() => setSubmittingId(null)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Workspace Activity</h3>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workspace.messages?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>
                No messages yet. Send a greeting to start collaborating!
              </p>
            ) : (
              workspace.messages?.map((msg, i) => {
                const isMe = msg.senderId === user._id;
                return (
                  <div key={i} style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: isMe ? 'var(--primary-glow)' : 'var(--bg-tertiary)',
                    border: isMe ? '1px solid rgba(255, 107, 107, 0.2)' : '1px solid var(--border-color)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    borderBottomRightRadius: isMe ? '0' : 'var(--radius-md)',
                    borderBottomLeftRadius: isMe ? 'var(--radius-md)' : '0'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: isMe ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {isMe ? 'You' : partner?.name}
                    </span>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word' }}>{msg.text}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '4px' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Send message or link..."
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
