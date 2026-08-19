import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import DNABackground from '../components/DNABackground';
import client from '../api/client';

function Sharing() {
  const { user } = useAuth();
  const [grantedShares, setGrantedShares] = useState([]);
  const [receivedShares, setReceivedShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newShareEmail, setNewShareEmail] = useState('');
  const [newShareLevel, setNewShareLevel] = useState('caregiver');
  const [newShareExpiresIn, setNewShareExpiresIn] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (user) fetchShares();
  }, [user]);

  const fetchShares = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await client.get('/api/shares');
      const data = res.data;
      setGrantedShares(data.granted_patient_shares || []);
      setReceivedShares(data.received_patient_shares || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch sharing data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShare = async (e) => {
    e.preventDefault();
    setSharing(true);
    try {
      await client.post('/api/shares/patient', {
        shared_with_email: newShareEmail,
        access_level: newShareLevel,
        expires_in_days: newShareExpiresIn ? parseInt(newShareExpiresIn) : null,
      });
      setShowModal(false);
      setNewShareEmail('');
      setNewShareLevel('caregiver');
      setNewShareExpiresIn('');
      fetchShares();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create share');
    } finally {
      setSharing(false);
    }
  };

  const handleRevoke = async (shareId) => {
    if (!window.confirm('Revoke access for this person?')) return;
    try {
      await client.delete(`/api/shares/patient/${shareId}`);
      fetchShares();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to revoke share');
    }
  };

  // Guest guard
  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <DNABackground />
        <GlassCard className="text-center p-12 relative z-10 max-w-md mx-4">
          <h2 className="text-2xl font-primary text-white mb-3">Sign In Required</h2>
          <p className="text-text-secondary font-primary">You need to be signed in to manage sharing settings.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden pt-24 pb-20 px-6">
      <DNABackground />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none z-[1]">
        <div className="absolute left-1/2 top-1/2 w-[350px] h-[350px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] blur-[90px] animate-spin-slow opacity-15 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-[2] max-w-4xl mx-auto flex flex-col gap-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
              Sharing{' '}
              <span className="font-primary italic font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">
                &amp; Access
              </span>
            </h1>
            <p className="text-base text-text-secondary max-w-xl leading-relaxed font-primary mt-1">
              Control who can view your health record and at what level.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4533] to-[#8A2BE2] text-white font-primary font-medium text-sm shadow-lg hover:opacity-90 transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,69,51,0.4)]"
          >
            + Share Record
          </button>
        </div>

        {/* ── Error Banner ──────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm font-primary flex items-center gap-3">
            <span className="text-lg">⚠</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400/60 hover:text-red-400 transition-colors">✕</button>
          </div>
        )}

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#8A2BE2] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* ── People with Access ────────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-primary font-medium text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4533] inline-block" />
                People with Access
              </h2>
              {grantedShares.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <p className="text-text-secondary font-primary italic">
                    You haven't shared your record with anyone yet.
                  </p>
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-3">
                  {grantedShares.map(share => (
                    <GlassCard key={share.id} className="flex justify-between items-center gap-4 p-5">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="font-primary font-medium text-white truncate">{share.shared_with_email}</div>
                        <div className="text-sm text-text-secondary capitalize font-primary">
                          Role:{' '}
                          <span className="text-[#8A2BE2]">{share.access_level?.replace('_', ' ')}</span>
                        </div>
                        {share.expires_at && (
                          <div className="text-xs text-text-secondary/60 font-primary">
                            Expires {new Date(share.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRevoke(share.id)}
                        className="shrink-0 px-4 py-2 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/40 transition-all font-primary"
                      >
                        Revoke
                      </button>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>

            {/* ── Records Shared With Me ────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-primary font-medium text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] inline-block" />
                Records Shared With Me
              </h2>
              {receivedShares.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <p className="text-text-secondary font-primary italic">
                    No one has shared their record with you.
                  </p>
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-3">
                  {receivedShares.map(share => (
                    <GlassCard key={share.id} className="flex justify-between items-center gap-4 p-5 border-[#00E5FF]/10">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="font-primary font-medium text-white">Patient ID: {share.patient_id?.substring(0, 8)}…</div>
                        <div className="text-sm text-text-secondary capitalize font-primary">
                          Your Access:{' '}
                          <span className="text-[#00E5FF]">{share.access_level?.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <a
                        href={`/patient/${share.patient_id}`}
                        className="shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors font-primary text-sm"
                      >
                        View Record →
                      </a>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* ── Create Share Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-7 flex flex-col gap-5">
              <div>
                <h3 className="text-2xl font-primary text-white mb-1">Share Your Record</h3>
                <p className="text-sm text-text-secondary font-primary">Grant a clinician or caregiver read access to your health data.</p>
              </div>

              <form onSubmit={handleCreateShare} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 font-primary uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newShareEmail}
                    onChange={e => setNewShareEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-[#8A2BE2]/60 transition-colors font-primary text-sm"
                    placeholder="doctor@clinic.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 font-primary uppercase tracking-wider">
                    Access Level
                  </label>
                  <select
                    value={newShareLevel}
                    onChange={e => setNewShareLevel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8A2BE2]/60 transition-colors font-primary text-sm"
                  >
                    <option value="caregiver">Caregiver — Full Access</option>
                    <option value="clinician">Clinician — Full Access</option>
                    <option value="summary_only">Summary Only — Hide Raw Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 font-primary uppercase tracking-wider">
                    Expiration
                  </label>
                  <select
                    value={newShareExpiresIn}
                    onChange={e => setNewShareExpiresIn(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8A2BE2]/60 transition-colors font-primary text-sm"
                  >
                    <option value="">Never expire</option>
                    <option value="1">1 Day</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors font-primary text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sharing}
                    className="flex-1 py-3 bg-gradient-to-r from-[#FF4533] to-[#8A2BE2] text-white rounded-xl font-primary font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {sharing ? 'Sharing…' : 'Share'}
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
