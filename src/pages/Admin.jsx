import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { ShieldCheck, Users, ToggleLeft, ToggleRight, Trash2, Award, Download, Upload } from 'lucide-react';

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, verified: 0, elite: 0 });
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

  const handleUpdateVerification = async (uid, currentVal) => {
    // Cycle through levels: none -> Basic -> Professional -> Elite -> none
    let nextVal = 'none';
    if (currentVal === 'none') nextVal = 'Basic';
    else if (currentVal === 'Basic') nextVal = 'Professional';
    else if (currentVal === 'Professional') nextVal = 'Elite';
    else if (currentVal === 'Elite') nextVal = 'none';

    try {
      await db.updateVerification(uid, nextVal);
      // Reload UI data
      loadProfiles();
    } catch (err) {
      alert('Error updating status: ' + err.message);
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
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', width: '100%' }}>
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

      {/* User Management Directory */}
      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Player Management</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click badge to cycle verification status</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Name / Club</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nationality</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Position</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rating (OVR)</th>
                <th style={{ padding: '16px 30px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Verification Badge</th>
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
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.fullName}</strong>
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
                    <button
                      onClick={() => handleUpdateVerification(p.uid, p.verification || 'none')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left'
                      }}
                    >
                      {p.verification === 'none' || !p.verification ? (
                        <span style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          None (Click to change)
                        </span>
                      ) : (
                        <span style={{
                          background: p.verification === 'Elite' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          boxShadow: p.verification === 'Elite' ? '0 0 10px var(--secondary-orange-glow)' : '0 0 10px var(--primary-green-glow)'
                        }}>
                          {p.verification}
                        </span>
                      )}
                    </button>
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
    </div>
  );
}
