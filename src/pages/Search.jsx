import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { Search as SearchIcon, MapPin, ArrowRight, ShieldCheck, Settings } from 'lucide-react';
import AccountSettingsModal from '../components/AccountSettingsModal';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const currentUser = auth.getCurrentUser();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('code') || '');
  const [positionFilter, setPositionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const hasActiveSearch = Boolean(
    searchQuery.trim() !== '' || 
    positionFilter !== '' || 
    (locationFilter && locationFilter.trim() !== '') || 
    verificationFilter !== '' || 
    genderFilter !== ''
  );

  useEffect(() => {
    db.getAllProfiles()
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!hasActiveSearch) {
      setFiltered([]);
      return;
    }

    let result = [...profiles];

    // Search query match (name, nickname, club, playerCode)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.fullName && p.fullName.toLowerCase().includes(q)) || 
        (p.nickname && p.nickname.toLowerCase().includes(q)) ||
        (p.playerCode && p.playerCode.toLowerCase().includes(q)) ||
        (p.currentClub && p.currentClub.toLowerCase().includes(q))
      );
    }

    // Position match
    if (positionFilter !== '') {
      result = result.filter(p => p.primaryPosition === positionFilter);
    }

    // Location / Nationality match
    if (locationFilter.trim() !== '') {
      const loc = locationFilter.toLowerCase().trim();
      result = result.filter(p => 
        (p.nationality && p.nationality.toLowerCase().includes(loc)) ||
        (p.city && p.city.toLowerCase().includes(loc)) ||
        (p.state && p.state.toLowerCase().includes(loc))
      );
    }

    // Verification Match
    if (verificationFilter !== '') {
      if (verificationFilter === 'any') {
        result = result.filter(p => p.verification && p.verification !== 'none');
      } else {
        result = result.filter(p => p.verification === verificationFilter);
      }
    }

    // Gender Match
    if (genderFilter !== '') {
      result = result.filter(p => p.gender === genderFilter);
    }

    setFiltered(result);
  }, [searchQuery, positionFilter, locationFilter, verificationFilter, genderFilter, profiles, hasActiveSearch]);

  // Helper to render Verification Badges
  const renderVerificationBadge = (level) => {
    if (!level || level === 'none') return null;

    let badgeColor = 'var(--primary-green)';
    let textColor = '#fff';
    if (level === 'Elite') {
      badgeColor = 'var(--secondary-orange)';
    }

    return (
      <span style={{
        background: badgeColor,
        color: textColor,
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: `0 0 10px ${level === 'Elite' ? 'var(--secondary-orange-glow)' : 'var(--primary-green-glow)'}`
      }}>
        <ShieldCheck size={12} /> {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h2>Loading Talents Database...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 clamp(14px, 3vw, 24px)', width: '100%' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.8rem)', fontWeight: 800 }} className="gradient-text">
          Global Football Talent Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
          Discover the next generation of football stars. Browse and filter player portfolios instantly.
        </p>
        {currentUser && currentUser.role === 'scout' && (
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setShowSettings(true)}
              className="btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Settings size={16} /> Scout Account Settings
            </button>
          </div>
        )}
      </div>

      {/* Filters Form */}
      <div className="glass" style={{
        padding: 'clamp(16px, 3vw, 24px)',
        borderRadius: '16px',
        marginBottom: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: '16px',
        alignItems: 'end'
      }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Search Keywords or Code</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 600 }}>e.g. SC-10001</span>
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <SearchIcon size={18} color="var(--primary-green)" style={{ position: 'absolute', left: '14px', zIndex: 2, pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '42px', paddingRight: '48px' }}
              placeholder="Player code (e.g. SC-10001), name, club..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              aria-label="Search Player"
              title="Search by Player Code or Name"
              style={{
                position: 'absolute',
                right: '6px',
                background: 'var(--primary-green)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 209, 108, 0.35)'
              }}
            >
              <SearchIcon size={18} />
            </button>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Position</label>
          <select className="form-select" value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
            <option value="">All Positions</option>
            <option value="Forward">Forward</option>
            <option value="Winger">Winger</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
            <option value="Goalkeeper">Goalkeeper</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location / Country</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. France, Lagos..."
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Gender</label>
          <select className="form-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Verification Status</label>
          <select className="form-select" value={verificationFilter} onChange={e => setVerificationFilter(e.target.value)}>
            <option value="">All Players</option>
            <option value="any">Any Verification</option>
            <option value="Basic">Basic Verified</option>
            <option value="Professional">Professional Verified</option>
            <option value="Elite">Elite Verified</option>
          </select>
        </div>
      </div>

      {/* Active Search Results or Clean Prompt */}
      {!hasActiveSearch ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px dashed var(--border-color)',
          maxWidth: '540px',
          margin: '20px auto 40px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0, 209, 108, 0.1)',
            color: 'var(--primary-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <SearchIcon size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Search African Football Talent
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 auto', lineHeight: 1.6 }}>
            Type a player code (e.g. <strong>SC-10001</strong>), player name, position, or country above to search verified talent.
          </p>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> player profile{filtered.length === 1 ? '' : 's'}
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setPositionFilter('');
                setLocationFilter('');
                setVerificationFilter('');
                setGenderFilter('');
              }}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Clear Search
            </button>
          </div>

          {/* Grid Results */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '540px', margin: '20px auto' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No players found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No profiles match your query or player code. Try a different search term.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPositionFilter('');
                  setLocationFilter('');
                  setVerificationFilter('');
                  setGenderFilter('');
                }}
                className="btn-primary"
                style={{ marginTop: '18px', padding: '8px 20px', fontSize: '0.88rem' }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '24px'
            }}>
              {filtered.map((player) => (
                <div key={player.uid} className="glass" style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {/* Picture Header */}
                  <div style={{
                    height: '200px',
                    position: 'relative',
                    background: 'rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                  }}>
                    {player.profilePic ? (
                      <img
                        src={player.profilePic}
                        alt={player.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--border-color) 100%)',
                        color: 'var(--text-secondary)'
                      }}>
                        No Photo Uploaded
                      </div>
                    )}

                    {/* Badges Absolute overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {renderVerificationBadge(player.verification)}
                    </div>

                    {/* Rating Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(15, 24, 19, 0.85)',
                      border: '1px solid var(--border-color)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.65rem', color: '#a3b899', fontWeight: 600 }}>OVR</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>{player.rating !== undefined && player.rating !== null ? player.rating : 0}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
                          {player.fullName}
                        </h3>
                        {player.playerCode && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--primary-green)',
                            background: 'rgba(0, 209, 108, 0.1)',
                            border: '1px solid rgba(0, 209, 108, 0.25)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            letterSpacing: '0.4px'
                          }}>
                            {player.playerCode}
                          </span>
                        )}
                      </div>
                      {player.nickname && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                          "{player.nickname}"
                        </span>
                      )}

                      {/* Position and Location metadata */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{
                          background: 'rgba(0, 209, 108, 0.08)',
                          color: 'var(--primary-green)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {player.primaryPosition} {player.secondaryPosition ? `/ ${player.secondaryPosition}` : ''}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {player.nationality && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} color="var(--text-muted)" />
                            <span>{player.nationality} {player.city ? `(${player.city})` : ''}</span>
                          </div>
                        )}
                        <div>Gender: <strong>{player.gender || 'Male'}</strong> | Age: <strong>{player.age || 'N/A'}</strong></div>
                        <div>H: <strong>{player.height || 'N/A'} cm</strong> | W: <strong>{player.weight || 'N/A'} kg</strong></div>
                        <div>Club: <strong>{player.currentClub || 'Unattached'}</strong></div>
                        <div>Value: <strong style={{ color: 'var(--text-primary)' }}>{player.marketValue ? `€${player.marketValue}` : 'N/A'}</strong></div>
                      </div>
                    </div>

                    <Link to={`/player/${player.uid}`} className="btn-secondary" style={{
                      marginTop: '20px',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '6px',
                      width: '100%',
                      textDecoration: 'none'
                    }}>
                      View Portfolio <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* Scout Account Settings Modal */}
      <AccountSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
