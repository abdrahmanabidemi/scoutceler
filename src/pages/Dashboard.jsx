import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { Save, Image, Video, Upload, Eye, CheckCircle, Download, Bell, Users, Clock, Share2, Check } from 'lucide-react';
import { printPlayerCv } from '../utils/exportData';
import { COUNTRIES } from '../data/countries';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  // Media state
  const [picFile, setPicFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'player') {
      navigate('/search');
      return;
    }
    setUser(currentUser);

    db.getProfile(currentUser.uid)
      .then((p) => {
        const numberFields = [
          'age', 'height', 'weight', 'jerseyNumber',
          'speed', 'strength', 'balance', 'jump', 'acceleration', 'agility', 'stamina',
          'passing', 'shooting', 'crossing', 'tackling', 'ballControl', 'dribbling', 'finishing',
          'leadership', 'vision', 'composure', 'decisionMaking', 'positioning', 'aggression', 'teamwork'
        ];
        const sanitized = { ...p };
        numberFields.forEach(field => {
          if (sanitized[field] === undefined || sanitized[field] === null || sanitized[field] === '') {
            sanitized[field] = 0;
          } else {
            sanitized[field] = Number(sanitized[field]);
          }
        });
        if (sanitized.marketValue === undefined || sanitized.marketValue === null || sanitized.marketValue === '') {
          sanitized.marketValue = '0';
        }
        setProfile(sanitized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleInputChange = (field, val) => {
    setProfile(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Profile picture must be under 5MB.');
      return;
    }
    setErrorMsg('');

    try {
      const base64Pic = await storage.uploadFile(file);
      handleInputChange('profilePic', base64Pic);
      setSuccessMsg('Profile picture uploaded successfully!');
    } catch (err) {
      setErrorMsg('Failed to upload profile picture.');
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Highlight video must be under 15MB to save storage space.');
      return;
    }
    setErrorMsg('');

    try {
      const videoDataUrl = await storage.uploadFile(file);
      handleInputChange('videoUrl', videoDataUrl);
      setSuccessMsg('Video uploaded to demo storage!');
    } catch (err) {
      setErrorMsg('Failed to upload video.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const numberFields = [
        'age', 'height', 'weight', 'jerseyNumber',
        'speed', 'strength', 'balance', 'jump', 'acceleration', 'agility', 'stamina',
        'passing', 'shooting', 'crossing', 'tackling', 'ballControl', 'dribbling', 'finishing',
        'leadership', 'vision', 'composure', 'decisionMaking', 'positioning', 'aggression', 'teamwork'
      ];
      const dataToSave = { ...profile };
      numberFields.forEach(field => {
        if (dataToSave[field] === '' || dataToSave[field] === undefined || dataToSave[field] === null) {
          dataToSave[field] = 0;
        } else {
          dataToSave[field] = Number(dataToSave[field]);
        }
      });
      const updated = await db.saveProfile(user.uid, dataToSave);
      setProfile(updated);
      setSuccessMsg('Profile updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg('Error saving profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyLink = () => {
    if (!user) return;
    const url = `${window.location.origin}/#/player/${user.uid}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Recently';
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Title & Actions bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800 }}>Edit Player Profile</h1>
            {profile.verification && profile.verification !== 'none' && (
              <span className="glass" style={{
                color: profile.verification === 'Elite' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                borderColor: profile.verification === 'Elite' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {profile.verification} Verified
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>Fill out your football resume and statistics</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => printPlayerCv(profile)}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
            title="Download your Football CV"
          >
            <Download size={16} /> Download CV
          </button>
          <button
            type="button"
            onClick={() => navigate(`/player/${user.uid}`)}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Eye size={16} /> View Profile
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary glow-btn"
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div style={{
          background: 'rgba(0, 209, 108, 0.1)',
          border: '1px solid rgba(0, 209, 108, 0.3)',
          color: 'var(--primary-green)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={20} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Profile Views & Activity Banner */}
      <div className="glass" style={{
        padding: '20px clamp(16px, 3vw, 24px)',
        borderRadius: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(0,209,108,0.06) 0%, rgba(249,115,22,0.04) 100%)',
        border: '1px solid rgba(0,209,108,0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--primary-green)',
            color: '#fff',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-green-glow)'
          }}>
            <Bell size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {profile.viewCount || 0} Profile Views
              </span>
              <span style={{
                background: (profile.viewCount || 0) > 0 ? 'rgba(0, 209, 108, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: (profile.viewCount || 0) > 0 ? 'var(--primary-green)' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {(profile.viewCount || 0) > 0 ? 'Active' : 'Awaiting Views'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
              {Array.isArray(profile.views) && profile.views.length > 0 ? (
                <>Latest view by <strong>{profile.views[0].viewerName}</strong> ({formatTimeAgo(profile.views[0].timestamp)})</>
              ) : (
                <>No views yet. Share your portfolio link to be discovered by scouts.</>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Eye size={15} /> Visitors Log ({Array.isArray(profile.views) ? profile.views.length : 0})
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {copiedLink ? <Check size={15} /> : <Share2 size={15} />}
            {copiedLink ? 'Link Copied!' : 'Share Portfolio'}
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          gap: '4px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'personal', name: 'Personal & Club Info' },
            { id: 'stats', name: 'Physical & Technical Stats' },
            { id: 'bio', name: 'Resume & Media' },
            { id: 'notifications', name: `Profile Views (${profile.viewCount || 0})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--primary-green-glow)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-green)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary-green)' : 'none',
                padding: '12px 20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
                borderRadius: '8px 8px 0 0',
                flexShrink: 0
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSave} className="glass dashboard-card">
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Personal Information
              </h3>
              <div className="dashboard-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={profile.fullName || ''} onChange={e => handleInputChange('fullName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nickname</label>
                  <input type="text" className="form-input" value={profile.nickname || ''} onChange={e => handleInputChange('nickname', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <select
                    className="form-select"
                    value={profile.nationality || ''}
                    onChange={e => handleInputChange('nationality', e.target.value)}
                  >
                    <option value="">Select Country</option>
                    {profile.nationality && !COUNTRIES.includes(profile.nationality) && (
                      <option value={profile.nationality}>{profile.nationality}</option>
                    )}
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">State / Region</label>
                  <input type="text" className="form-input" value={profile.state || ''} onChange={e => handleInputChange('state', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" value={profile.city || ''} onChange={e => handleInputChange('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={profile.age !== undefined && profile.age !== null ? profile.age : 0}
                    onChange={e => handleInputChange('age', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={profile.gender || 'Male'} onChange={e => handleInputChange('gender', e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={profile.height !== undefined && profile.height !== null ? profile.height : 0}
                    onChange={e => handleInputChange('height', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={profile.weight !== undefined && profile.weight !== null ? profile.weight : 0}
                    onChange={e => handleInputChange('weight', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Foot</label>
                  <select className="form-select" value={profile.preferredFoot || 'Right'} onChange={e => handleInputChange('preferredFoot', e.target.value)}>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Ambidextrous">Ambidextrous</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Position</label>
                  <select className="form-select" value={profile.primaryPosition || 'Forward'} onChange={e => handleInputChange('primaryPosition', e.target.value)}>
                    <option value="Forward">Forward</option>
                    <option value="Winger">Winger</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Secondary Position</label>
                  <input type="text" className="form-input" placeholder="e.g. Attacking Midfielder" value={profile.secondaryPosition || ''} onChange={e => handleInputChange('secondaryPosition', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number (Direct Contact)</label>
                  <input type="tel" className="form-input" placeholder="e.g. +234 803 123 4567" value={profile.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Market Value (€)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="0"
                    value={profile.marketValue !== undefined && profile.marketValue !== null ? profile.marketValue : '0'}
                    onChange={e => handleInputChange('marketValue', e.target.value)}
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginTop: '20px' }}>
                Football Information
              </h3>
              <div className="dashboard-form-grid">
                <div className="form-group">
                  <label className="form-label">Current Club</label>
                  <input type="text" className="form-input" value={profile.currentClub || ''} onChange={e => handleInputChange('currentClub', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Previous Clubs</label>
                  <input type="text" className="form-input" placeholder="Club A, Club B" value={profile.previousClubs || ''} onChange={e => handleInputChange('previousClubs', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Academy Name</label>
                  <input type="text" className="form-input" value={profile.academy || ''} onChange={e => handleInputChange('academy', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jersey Number</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={profile.jerseyNumber !== undefined && profile.jerseyNumber !== null ? profile.jerseyNumber : 0}
                    onChange={e => handleInputChange('jerseyNumber', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Playing Style</label>
                  <input type="text" className="form-input" placeholder="e.g. Playmaker, Target Man" value={profile.playingStyle || ''} onChange={e => handleInputChange('playingStyle', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Market Availability</label>
                  <select className="form-select" value={profile.marketAvailability || 'Available'} onChange={e => handleInputChange('marketAvailability', e.target.value)}>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                    <option value="On Loan">On Loan</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Performance Attributes (Rating 0 - 99)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Input your ratings honestly. Verified profiles require official testing records to keep these metrics.
                </p>
              </div>

              {/* Physical Attributes */}
              <h4 style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Physical Attributes</h4>
              <div className="dashboard-form-grid">
                {['speed', 'strength', 'balance', 'jump', 'acceleration', 'agility', 'stamina'].map(attr => (
                  <div key={attr} className="form-group">
                    <label className="form-label" style={{ textTransform: 'capitalize' }}>{attr}</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="form-input"
                      value={profile[attr] !== undefined && profile[attr] !== null ? profile[attr] : 0}
                      onChange={e => handleInputChange(attr, e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>

              {/* Technical Attributes */}
              <h4 style={{ color: 'var(--secondary-orange)', fontWeight: 600 }}>Technical Attributes</h4>
              <div className="dashboard-form-grid">
                {['passing', 'shooting', 'crossing', 'tackling', 'ballControl', 'dribbling', 'finishing'].map(attr => (
                  <div key={attr} className="form-group">
                    <label className="form-label" style={{ textTransform: 'capitalize' }}>{attr}</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="form-input"
                      value={profile[attr] !== undefined && profile[attr] !== null ? profile[attr] : 0}
                      onChange={e => handleInputChange(attr, e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>

              {/* Mental Attributes */}
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Mental Attributes</h4>
              <div className="dashboard-form-grid">
                {['leadership', 'vision', 'composure', 'decisionMaking', 'positioning', 'aggression', 'teamwork'].map(attr => (
                  <div key={attr} className="form-group">
                    <label className="form-label" style={{ textTransform: 'capitalize' }}>{attr}</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="form-input"
                      value={profile[attr] !== undefined && profile[attr] !== null ? profile[attr] : 0}
                      onChange={e => handleInputChange(attr, e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Football CV & Media Assets
              </h3>

              <div className="form-group">
                <label className="form-label">Biography</label>
                <textarea rows={4} className="form-textarea" placeholder="Describe your playing background..." value={profile.bio || ''} onChange={e => handleInputChange('bio', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Achievements</label>
                <textarea rows={2} className="form-textarea" placeholder="League trophies, cup wins, team milestones..." value={profile.achievements || ''} onChange={e => handleInputChange('achievements', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Individual Awards</label>
                <textarea rows={2} className="form-textarea" placeholder="Best Player award, top scorer, MVP awards..." value={profile.awards || ''} onChange={e => handleInputChange('awards', e.target.value)} />
              </div>

              {/* Profile Pic Upload */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-color)',
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--bg-dark)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--primary-green)'
                }}>
                  {profile.profilePic ? (
                    <img src={profile.profilePic} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Image size={32} color="var(--text-muted)" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 600 }}>Profile Picture</label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max file size: 5MB. Replaces instantly on select.</span>
                  <label className="btn-secondary" style={{
                    cursor: 'pointer',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Upload size={16} /> Upload Image
                    <input type="file" accept="image/*" onChange={handlePicUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Highlight Video Section */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-color)',
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Video color="var(--secondary-orange)" size={24} />
                  <h4 style={{ fontWeight: 600 }}>Highlight Reel / Performance Video</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Link to video (YouTube, Vimeo, or MP4 URL)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://youtube.com/watch?v=..."
                      value={profile.videoUrl || ''}
                      onChange={e => handleInputChange('videoUrl', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ height: '1px', background: 'var(--border-color)', flex: 1 }}></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR UPLOAD LOCAL VIDEO</span>
                    <div style={{ height: '1px', background: 'var(--border-color)', flex: 1 }}></div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      Max video file size: 15MB.
                    </span>
                    <label className="btn-secondary" style={{
                      cursor: 'pointer',
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: 'fit-content'
                    }}>
                      <Upload size={16} /> Upload Video File
                      <input type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Profile Discovery & Visitor Notifications
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Real-time log of scouts, clubs, and analysts who have inspected your portfolio and metrics.
                </p>
              </div>

              {/* Summary Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    background: 'var(--primary-green-glow)',
                    color: 'var(--primary-green)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Eye size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Profile Views</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                      {profile.viewCount || 0}
                    </h2>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    background: 'var(--secondary-orange-glow)',
                    color: 'var(--secondary-orange)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logged Recruiter Views</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary-orange)' }}>
                      {Array.isArray(profile.views) ? profile.views.length : 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Visitors Notification Feed */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={18} color="var(--primary-green)" /> Recent Viewers Activity Log
                </h4>

                {Array.isArray(profile.views) && profile.views.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {profile.views.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: item.viewerRole === 'admin' ? 'var(--secondary-orange-glow)' : 'var(--primary-green-glow)',
                            color: item.viewerRole === 'admin' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}>
                            {item.viewerName ? item.viewerName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {item.viewerName}
                              </strong>
                              <span style={{
                                background: item.viewerRole === 'admin' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                                color: '#fff',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textTransform: 'capitalize'
                              }}>
                                {item.viewerRole || 'Scout'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Inspected your profile & metrics
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Clock size={14} />
                          <span>{formatTimeAgo(item.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    <Users size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                    <p style={{ fontWeight: 500 }}>No profile views recorded yet.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Share your public portfolio link with clubs and scouts to begin building your discovery network.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="btn-primary"
                      style={{ marginTop: '16px', padding: '8px 20px', fontSize: '0.9rem' }}
                    >
                      {copiedLink ? 'Link Copied!' : 'Copy Public Profile Link'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'notifications' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <button type="submit" disabled={saving} className="btn-primary glow-btn" style={{ padding: '14px 40px' }}>
                <Save size={20} /> {saving ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
