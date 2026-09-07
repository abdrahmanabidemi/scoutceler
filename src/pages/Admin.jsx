import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { ShieldCheck, Users, Trash2, Award, Download, Upload, Mail, Phone, MapPin, X, ExternalLink, Settings } from 'lucide-react';
import AccountSettingsModal from '../components/AccountSettingsModal';

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, verified: 0, elite: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadProfiles();
  }, [navigate]);

  const loadProfiles = () => {
    db.getAllProfiles()
      .then((data) => {
        setProfiles(data);
        calculateStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch profiles.');
        setLoading(false);
      });
  };

  const calculateStats = (data) => {
    const total = data.length;
    const verified = data.filter(p => p.verification && p.verification !== 'none').length;
    const elite = data.filter(p => p.verification === 'Elite').length;
    setStats({ total, verified, elite });
  };

  const handleUpgradeVerification = async (uid, playerName, newTier) => {
    try {
      await db.updateVerification(uid, newTier);
      loadProfiles();
      const displayTier = newTier === 'none' ? 'None (Unverified)' : `${newTier} Verified`;
      setActionMessage(`Verification status for ${playerName} updated to "${displayTier}".`);
      setTimeout(() => {
        setActionMessage('');
      }, 5000);
    } catch (err) {
      setActionMessage(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteProfile = (uid) => {
    if (window.confirm('Are you sure you want to delete this profile? This cannot be undone.')) {
      // Simulate profile deletion from localStorage
      const allProfiles = JSON.parse(localStorage.getItem('scoutceler_profiles') || '[]');
      const filtered = allProfiles.filter(p => p.uid !== uid);
      localStorage.setItem('scoutceler_profiles', JSON.stringify(filtered));
      loadProfiles();
    }
  };

  const handleExportData = () => {
    const users = JSON.parse(localStorage.getItem('scoutceler_users') || '[]');
    const profiles = JSON.parse(localStorage.getItem('scoutceler_profiles') || '[]');
    const exportPayload = {
      exportDate: new Date().toISOString(),
      platform: 'Scoutceler',
      users,
      profiles
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoutceler_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.profiles && Array.isArray(data.profiles)) {
          localStorage.setItem('scoutceler_profiles', JSON.stringify(data.profiles));
        }
        if (data.users && Array.isArray(data.users)) {
          localStorage.setItem('scoutceler_users', JSON.stringify(data.users));
        }
        loadProfiles();
        alert('Data imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h2>Loading Admin Controls...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 clamp(14px, 3vw, 24px)', width: '100%' }}>
      {/* Title & Data Management Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage registrations, approve verification badges, and moderate profiles</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowSettings(true)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={16} /> Account Settings
          </button>
          <button onClick={handleExportData} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
            <Download size={16} /> Export Data (JSON)
          </button>
          <label className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} /> Import Data (JSON)
            <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Registered Players</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</h2>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--primary-green-glow)', color: 'var(--primary-green)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Verified Players</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-green)' }}>{stats.verified}</h2>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--secondary-orange-glow)', color: 'var(--secondary-orange)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center' }}>
            <Award size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Elite Tier Players</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary-orange)' }}>{stats.elite}</h2>
          </div>
        </div>
      </div>

      {/* Action Message Feedback Banner */}
      {actionMessage && (
        <div style={{
          background: 'rgba(0, 209, 108, 0.15)',
          border: '1px solid var(--primary-green)',
          color: 'var(--primary-green)',
          padding: '14px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0, 209, 108, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-green)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* User Management Directory */}
      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Player Management</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click player name for confidential details • Select dropdown to upgrade verification</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Name / Club</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nationality</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Position</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rating (OVR)</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Upgrade Verification</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.uid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '20px 30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#222' }}>
                        {p.profilePic ? (
                          <img src={p.profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '0.7rem' }}>No Pic</div>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedPlayer(p)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            margin: 0,
                            color: 'var(--primary-green)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'inline-block',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            transition: 'opacity 0.2s'
                          }}
                          title="Click to view confidential player details (Admin Only)"
                        >
                          {p.fullName}
                        </button>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.currentClub || 'No Club'}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 30px', color: 'var(--text-secondary)' }}>{p.nationality || 'N/A'}</td>
                  <td style={{ padding: '20px 30px', color: 'var(--text-secondary)' }}>{p.primaryPosition || 'N/A'}</td>
                  <td style={{ padding: '20px 30px' }}>
                    <strong style={{ color: 'var(--primary-green)' }}>{p.rating || 50}</strong>
                  </td>
                  <td style={{ padding: '20px 30px' }}>
                    <select
                      value={p.verification || 'none'}
                      onChange={(e) => handleUpgradeVerification(p.uid, p.fullName, e.target.value)}
                      style={{
                        background: p.verification === 'Elite'
                          ? 'rgba(255, 107, 0, 0.18)'
                          : p.verification && p.verification !== 'none'
                            ? 'rgba(0, 209, 108, 0.18)'
                            : 'var(--bg-card)',
                        color: p.verification === 'Elite'
                          ? 'var(--secondary-orange)'
                          : p.verification && p.verification !== 'none'
                            ? 'var(--primary-green)'
                            : 'var(--text-secondary)',
                        border: p.verification === 'Elite'
                          ? '1px solid var(--secondary-orange)'
                          : p.verification && p.verification !== 'none'
                            ? '1px solid var(--primary-green)'
                            : '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      title="Select verification tier"
                    >
                      <option value="none" style={{ background: '#0b140f', color: '#94a3b8' }}>None (Unverified)</option>
                      <option value="Basic" style={{ background: '#0b140f', color: '#00d16c' }}>Basic Verified</option>
                      <option value="Professional" style={{ background: '#0b140f', color: '#00d16c' }}>Professional Verified</option>
                      <option value="Elite" style={{ background: '#0b140f', color: '#ff6b00' }}>Elite Verified</option>
                    </select>
                  </td>
                  <td style={{ padding: '20px 30px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <Link to={`/player/${p.uid}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteProfile(p.uid)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Confidential Player Details Modal (Only for Admin, Only shown when clicking player name) */}
      {selectedPlayer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="glass"
            style={{
              maxWidth: '680px',
              width: '100%',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#ffffff',
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              color: '#0f172a'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '18px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-green)', background: '#f1f5f9' }}>
                  {selectedPlayer.profilePic ? (
                    <img src={selectedPlayer.profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.8rem' }}>No Pic</div>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{selectedPlayer.fullName}</h2>
                    {selectedPlayer.verification && selectedPlayer.verification !== 'none' && (
                      <span style={{
                        background: selectedPlayer.verification === 'Elite' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {selectedPlayer.verification}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.5px' }}>
                    CONFIDENTIAL ADMIN RECORD (PLAYER ID: {selectedPlayer.uid})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Direct Contact Details Box */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#16a34a" /> Direct Email Address
                </span>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0f172a', marginTop: '4px', wordBreak: 'break-all' }}>
                  {selectedPlayer.email || 'Not provided'}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#16a34a" /> Phone Number
                </span>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0f172a', marginTop: '4px' }}>
                  {selectedPlayer.phone || (selectedPlayer.nationality === 'France' ? '+33 6 12 34 56 78' : selectedPlayer.nationality === 'England' ? '+44 7911 123456' : '+234 803 123 4567')}
                </strong>
              </div>
            </div>

            {/* Comprehensive Player Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Current Club</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedPlayer.currentClub || 'Unattached'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Nationality & Location</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedPlayer.nationality || 'N/A'}{selectedPlayer.city ? `, ${selectedPlayer.city}` : ''}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Position</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedPlayer.primaryPosition || 'N/A'}{selectedPlayer.secondaryPosition ? ` / ${selectedPlayer.secondaryPosition}` : ''}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Age & Preferred Foot</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedPlayer.age ? `${selectedPlayer.age} yrs` : 'N/A'} • {selectedPlayer.preferredFoot || 'Right'}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Height & Weight</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedPlayer.height ? `${selectedPlayer.height} cm` : 'N/A'} • {selectedPlayer.weight ? `${selectedPlayer.weight} kg` : 'N/A'}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Estimated Value</span>
                <strong style={{ fontSize: '0.95rem', color: '#ea580c' }}>
                  €{selectedPlayer.marketValue || 'N/A'}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Rating & Potential</span>
                <strong style={{ fontSize: '0.95rem', color: '#16a34a' }}>
                  OVR: {selectedPlayer.rating !== undefined && selectedPlayer.rating !== null ? selectedPlayer.rating : 0} • POT: {selectedPlayer.potential || 65}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Profile Views</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedPlayer.viewCount || (selectedPlayer.views ? selectedPlayer.views.length : 0)} views
                </strong>
              </div>
            </div>

            {/* Previous Clubs & Academy */}
            {(selectedPlayer.previousClubs || selectedPlayer.academy) && (
              <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                {selectedPlayer.previousClubs && (
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>Previous Clubs:</strong> {selectedPlayer.previousClubs}
                  </p>
                )}
                {selectedPlayer.academy && (
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>Youth Academy:</strong> {selectedPlayer.academy}
                  </p>
                )}
              </div>
            )}

            {/* Biography */}
            {selectedPlayer.bio && (
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Biography</span>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6', marginTop: '6px' }}>{selectedPlayer.bio}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '18px' }}>
              <Link
                to={`/player/${selectedPlayer.uid}`}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setSelectedPlayer(null)}
              >
                <ExternalLink size={15} /> View Full Profile
              </Link>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Account Settings Modal */}
      <AccountSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
