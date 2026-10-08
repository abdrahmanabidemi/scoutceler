import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { 
  ShieldCheck, 
  Users, 
  Trash2, 
  Award, 
  Download, 
  Upload, 
  Mail, 
  Phone, 
  MapPin, 
  X, 
  ExternalLink, 
  Settings, 
  Search as SearchIcon, 
  UserCheck, 
  Briefcase,
  Calendar,
  Filter
} from 'lucide-react';
import AccountSettingsModal from '../components/AccountSettingsModal';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'players'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'player' | 'scout' | 'club' | 'admin'
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalPlayers: 0, 
    scoutsClubs: 0, 
    verified: 0, 
    elite: 0 
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [usersData, profilesData] = await Promise.all([
        auth.getAllUsers(),
        db.getAllProfiles()
      ]);
      setUsers(usersData);
      setProfiles(profilesData);
      calculateStats(usersData, profilesData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch platform user data.');
      setLoading(false);
    }
  };

  const calculateStats = (usersData, profilesData) => {
    const totalUsers = usersData.length;
    const totalPlayers = usersData.filter(u => u.role === 'player').length;
    const scoutsClubs = usersData.filter(u => u.role === 'scout' || u.role === 'club').length;
    const verified = profilesData.filter(p => p.verification && p.verification !== 'none').length;
    const elite = profilesData.filter(p => p.verification === 'Elite').length;
    setStats({ totalUsers, totalPlayers, scoutsClubs, verified, elite });
  };

  const handleUpgradeVerification = async (uid, playerName, newTier) => {
    try {
      await db.updateVerification(uid, newTier);
      await loadAllData();
      const displayTier = newTier === 'none' ? 'None (Unverified)' : `${newTier} Verified`;
      setActionMessage(`Verification status for ${playerName} updated to "${displayTier}".`);
      setTimeout(() => {
        setActionMessage('');
      }, 5000);
    } catch (err) {
      setActionMessage(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteUser = async (uid, name) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${name}"? This will delete their account and profile data.`)) {
      await auth.adminDeleteUser(uid);
      await loadAllData();
      setActionMessage(`User "${name}" has been removed successfully.`);
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  const handleExportData = () => {
    const rawUsers = JSON.parse(localStorage.getItem('scoutceler_users') || '[]');
    const rawProfiles = JSON.parse(localStorage.getItem('scoutceler_profiles') || '[]');
    const exportPayload = {
      exportDate: new Date().toISOString(),
      platform: 'Scoutceler',
      users: rawUsers,
      profiles: rawProfiles
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
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.profiles && Array.isArray(data.profiles)) {
          localStorage.setItem('scoutceler_profiles', JSON.stringify(data.profiles));
        }
        if (data.users && Array.isArray(data.users)) {
          localStorage.setItem('scoutceler_users', JSON.stringify(data.users));
        }
        await loadAllData();
        alert('Data imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'player':
        return { background: 'rgba(0, 209, 108, 0.12)', color: 'var(--primary-green)', border: '1px solid rgba(0, 209, 108, 0.3)' };
      case 'scout':
        return { background: 'rgba(14, 165, 233, 0.12)', color: '#0284c7', border: '1px solid rgba(14, 165, 233, 0.3)' };
      case 'club':
        return { background: 'rgba(168, 85, 247, 0.12)', color: '#9333ea', border: '1px solid rgba(168, 85, 247, 0.3)' };
      case 'admin':
        return { background: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default:
        return { background: 'rgba(100, 116, 139, 0.12)', color: '#475569', border: '1px solid rgba(100, 116, 139, 0.3)' };
    }
  };

  // Filtered Users List for Tab 1
  const filteredUsers = users.filter((u) => {
    // Role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.playerCode && u.playerCode.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.currentClub && u.currentClub.toLowerCase().includes(q)) ||
      (u.nationality && u.nationality.toLowerCase().includes(q))
    );
  });

  // Filtered Players List for Tab 2
  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.fullName && p.fullName.toLowerCase().includes(q)) ||
      (p.playerCode && p.playerCode.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q)) ||
      (p.currentClub && p.currentClub.toLowerCase().includes(q)) ||
      (p.nationality && p.nationality.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h2>Loading Admin Controls & Sign-up Records...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '40px auto', padding: '0 clamp(14px, 3vw, 24px)', width: '100%' }}>
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
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800 }}>Admin Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage registrations, monitor user accounts, approve verification badges, and moderate platform data</p>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="glass" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'rgba(0, 209, 108, 0.12)', color: 'var(--primary-green)', width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Registered Accounts</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '2px 0 0' }}>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="glass" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.12)', color: '#0284c7', width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserCheck size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Players Registered</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '2px 0 0', color: '#0284c7' }}>{stats.totalPlayers}</h2>
          </div>
        </div>

        <div className="glass" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#9333ea', width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Scouts & Clubs</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '2px 0 0', color: '#9333ea' }}>{stats.scoutsClubs}</h2>
          </div>
        </div>

        <div className="glass" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'var(--secondary-orange-glow)', color: 'var(--secondary-orange)', width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Verified Players</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--secondary-orange)' }}>{stats.verified}</h2>
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

      {/* View Toggle Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: activeTab === 'users' ? '1.5px solid var(--primary-green)' : '1px solid var(--border-color)',
              background: activeTab === 'users' ? 'rgba(0, 209, 108, 0.1)' : '#ffffff',
              color: activeTab === 'users' ? 'var(--primary-green)' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={18} />
            All Registered Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('players')}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: activeTab === 'players' ? '1.5px solid var(--primary-green)' : '1px solid var(--border-color)',
              background: activeTab === 'players' ? 'rgba(0, 209, 108, 0.1)' : '#ffffff',
              color: activeTab === 'players' ? 'var(--primary-green)' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={18} />
            Player Profiles & Verification ({profiles.length})
          </button>
        </div>

        {/* Global Search Bar with Prominent Search Icon */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '360px' }}>
          <SearchIcon size={18} color="var(--primary-green)" style={{ position: 'absolute', left: '14px', zIndex: 2 }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '42px', paddingRight: '14px', fontSize: '0.88rem' }}
            placeholder="Search by code (SC-10001), name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1
              }}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: ALL REGISTERED USERS & SIGN-UPS */}
      {activeTab === 'users' && (
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {/* Header & Role Filters */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            background: 'rgba(248, 250, 252, 0.6)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Registered Accounts Directory</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Showing {filteredUsers.length} of {users.length} registered users • Click user name to view confidential contact details
              </span>
            </div>

            {/* Role Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={13} /> Role:
              </span>
              {['all', 'player', 'scout', 'club', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    border: roleFilter === role ? '1px solid var(--primary-green)' : '1px solid var(--border-color)',
                    background: roleFilter === role ? 'var(--primary-green)' : '#ffffff',
                    color: roleFilter === role ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '14px 24px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>User / Identity</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Role</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Contact Info</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Player Code / ID</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Date Registered</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.82rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No users match your current filter or search query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.uid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* User Name & Avatar */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', background: '#f1f5f9', border: '1px solid var(--border-color)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {u.profilePic ? (
                              <img src={u.profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                                {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedUser(u)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                margin: 0,
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'inline-block',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px'
                              }}
                              title="Click for confidential details (Admin Only)"
                            >
                              {u.fullName || 'Anonymous User'}
                            </button>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              ID: {u.uid}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'inline-block',
                          ...getRoleBadgeStyle(u.role)
                        }}>
                          {u.role || 'Player'}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.84rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                            <Mail size={13} color="var(--primary-green)" /> {u.email || 'No Email'}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                            <Phone size={13} color="var(--primary-green)" /> {u.phone || 'No Phone'}
                          </span>
                        </div>
                      </td>

                      {/* Player Code / ID */}
                      <td style={{ padding: '16px 20px' }}>
                        {u.playerCode ? (
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            color: 'var(--primary-green)',
                            background: 'rgba(0, 209, 108, 0.1)',
                            border: '1.5px solid rgba(0, 209, 108, 0.3)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-block'
                          }}>
                            {u.playerCode}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Non-player</span>
                        )}
                      </td>

                      {/* Date Registered */}
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={13} color="var(--text-muted)" />
                          {formatDate(u.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            title="View full confidential contact & profile details"
                          >
                            Details
                          </button>
                          {u.role === 'player' && (
                            <Link
                              to={`/player/${u.uid}`}
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                              title="View public profile"
                            >
                              Profile
                            </Link>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.uid, u.fullName)}
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PLAYER PROFILES & VERIFICATION */}
      {activeTab === 'players' && (
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', background: 'rgba(248, 250, 252, 0.6)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Player Verification Management</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Select dropdown to upgrade badges (Basic, Professional, Elite) • Click player name for full details
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {filteredProfiles.length} of {profiles.length} Players Listed
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Name & Code / Club</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nationality</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Position</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rating (OVR)</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Upgrade Verification</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p) => (
                  <tr key={p.uid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', background: '#222', flexShrink: 0 }}>
                          {p.profilePic ? (
                            <img src={p.profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '0.7rem' }}>No Pic</div>
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedUser(p)}
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
                                textUnderlineOffset: '3px'
                              }}
                              title="Click to view confidential player details"
                            >
                              {p.fullName}
                            </button>
                            {p.playerCode && (
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: 'var(--primary-green)',
                                background: 'rgba(0, 209, 108, 0.1)',
                                border: '1px solid rgba(0, 209, 108, 0.25)',
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}>
                                {p.playerCode}
                              </span>
                            )}
                          </div>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.currentClub || 'No Club'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '18px 20px', color: 'var(--text-secondary)' }}>{p.nationality || 'N/A'}</td>
                    <td style={{ padding: '18px 20px', color: 'var(--text-secondary)' }}>{p.primaryPosition || 'N/A'}</td>
                    <td style={{ padding: '18px 20px' }}>
                      <strong style={{ color: 'var(--primary-green)' }}>{p.rating || 50}</strong>
                    </td>
                    <td style={{ padding: '18px 20px' }}>
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
                      >
                        <option value="none">None (Unverified)</option>
                        <option value="Basic">Basic Verified</option>
                        <option value="Professional">Professional Verified</option>
                        <option value="Elite">Elite Verified</option>
                      </select>
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <Link to={`/player/${p.uid}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(p.uid, p.fullName)}
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
      )}

      {/* Admin Confidential User / Player Details Modal */}
      {selectedUser && (
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
          onClick={() => setSelectedUser(null)}
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
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-green)', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedUser.profilePic ? (
                    <img src={selectedUser.profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                      {selectedUser.fullName ? selectedUser.fullName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{selectedUser.fullName}</h2>
                    <span style={{
                      ...getRoleBadgeStyle(selectedUser.role),
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {selectedUser.playerCode && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--primary-green)',
                        background: 'rgba(0, 209, 108, 0.12)',
                        border: '1px solid rgba(0, 209, 108, 0.3)',
                        padding: '1px 8px',
                        borderRadius: '4px'
                      }}>
                        Code: {selectedUser.playerCode}
                      </span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.5px' }}>
                      CONFIDENTIAL RECORD (UID: {selectedUser.uid})
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
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
                  {selectedUser.email || 'Not provided'}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#16a34a" /> Phone Number
                </span>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0f172a', marginTop: '4px' }}>
                  {selectedUser.phone || 'Not provided'}
                </strong>
              </div>
            </div>

            {/* Additional Details Grid if Player */}
            {selectedUser.role === 'player' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Current Club</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedUser.currentClub || 'Unattached'}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Nationality</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedUser.nationality || 'N/A'}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Position</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedUser.primaryPosition || 'N/A'}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Rating</span>
                  <strong style={{ fontSize: '0.95rem', color: '#16a34a' }}>OVR: {selectedUser.rating || 0}</strong>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '18px' }}>
              {selectedUser.role === 'player' && (
                <Link
                  to={`/player/${selectedUser.uid}`}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setSelectedUser(null)}
                >
                  <ExternalLink size={15} /> View Full Profile
                </Link>
              )}
              <button
                onClick={() => setSelectedUser(null)}
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
