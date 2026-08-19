import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import GlassCard from '../components/GlassCard';

function Sharing() {
  const { session } = useAuth();
  const [grantedShares, setGrantedShares] = useState([]);
  const [receivedShares, setReceivedShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newShareEmail, setNewShareEmail] = useState('');
  const [newShareLevel, setNewShareLevel] = useState('caregiver');
  const [newShareExpiresIn, setNewShareExpiresIn] = useState('');

  useEffect(() => {
    fetchShares();
  }, [session]);

  const fetchShares = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shares`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch shares');
      const data = await res.json();
      setGrantedShares(data.granted_patient_shares || []);
      setReceivedShares(data.received_patient_shares || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShare = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        shared_with_email: newShareEmail,
        access_level: newShareLevel,
        expires_in_days: newShareExpiresIn ? parseInt(newShareExpiresIn) : null
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shares/patient`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create share');
      
      setShowModal(false);
      setNewShareEmail('');
      setNewShareLevel('caregiver');
      setNewShareExpiresIn('');
      fetchShares();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRevoke = async (shareId) => {
    if (!window.confirm('Are you sure you want to revoke this access?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shares/patient/${shareId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) throw new Error('Failed to revoke share');
      fetchShares();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-[var(--color-text-secondary)] font-secondary">Loading sharing settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-primary text-[var(--color-text-primary)] mb-2">Sharing & Access</h1>
          <p className="text-[var(--color-text-secondary)] font-secondary">Manage who has access to your health record.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[var(--color-brand-primary)] text-white rounded-xl font-secondary font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all"
        >
          Share Record
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl text-red-400 font-secondary">
          {error}
        </div>
      )}

      {/* People I've Shared With */}
      <section>
        <h2 className="text-2xl font-primary text-[var(--color-text-primary)] mb-4">People with Access</h2>
        {grantedShares.length === 0 ? (
          <GlassCard>
            <p className="text-[var(--color-text-secondary)] font-secondary italic text-center py-4">You haven't shared your record with anyone yet.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {grantedShares.map(share => (
              <GlassCard key={share.id} className="flex justify-between items-center p-5">
                <div>
                  <div className="font-secondary font-medium text-[var(--color-text-primary)]">{share.shared_with_email}</div>
                  <div className="text-sm text-[var(--color-text-secondary)] capitalize mt-1">
                    Role: <span className="text-[var(--color-brand-primary)]">{share.access_level.replace('_', ' ')}</span>
                  </div>
                  {share.expires_at && (
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
                      Expires: {new Date(share.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleRevoke(share.id)}
                  className="px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors font-secondary"
                >
                  Revoke Access
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Shared With Me */}
      <section>
        <h2 className="text-2xl font-primary text-[var(--color-text-primary)] mb-4">Records Shared With Me</h2>
        {receivedShares.length === 0 ? (
          <GlassCard>
            <p className="text-[var(--color-text-secondary)] font-secondary italic text-center py-4">No one has shared their record with you.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {receivedShares.map(share => (
              <GlassCard key={share.id} className="p-5 flex justify-between items-center border border-[var(--color-brand-secondary)]/30">
                <div>
                  <div className="font-secondary font-medium text-[var(--color-text-primary)]">Patient ID: {share.patient_id}</div>
                  <div className="text-sm text-[var(--color-text-secondary)] capitalize mt-1">
                    Your Access: <span className="text-[var(--color-brand-secondary)]">{share.access_level.replace('_', ' ')}</span>
                  </div>
                </div>
                <a 
                  href={`/patient/${share.patient_id}`}
                  className="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors font-secondary text-sm"
                >
                  View Record
                </a>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Create Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-2xl font-primary text-[var(--color-text-primary)] mb-4">Share Your Record</h3>
              <form onSubmit={handleCreateShare} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 font-secondary">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newShareEmail}
                    onChange={e => setNewShareEmail(e.target.value)}
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none font-secondary"
                    placeholder="doctor@clinic.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 font-secondary">Access Level</label>
                  <select 
                    value={newShareLevel}
                    onChange={e => setNewShareLevel(e.target.value)}
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none font-secondary"
                  >
                    <option value="caregiver">Caregiver (Full Access)</option>
                    <option value="clinician">Clinician (Full Access)</option>
                    <option value="summary_only">Summary Only (Hide Raw Documents)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 font-secondary">Expiration (Optional)</label>
                  <select 
                    value={newShareExpiresIn}
                    onChange={e => setNewShareExpiresIn(e.target.value)}
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none font-secondary"
                  >
                    <option value="">Never expire</option>
                    <option value="1">1 Day</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors font-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white rounded-xl font-secondary font-medium hover:opacity-90 transition-opacity"
                  >
                    Share
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Sharing;
