import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Search as SearchIcon, MapPin, ArrowRight, ShieldCheck, Download, FileSpreadsheet, FileJson } from 'lucide-react';
import { downloadJson, exportTalentListToCsv } from '../utils/exportData';

export default function Search() {
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    db.getAllProfiles()
      .then((data) => {
        setProfiles(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...profiles];

    // Search query match (name, nickname, club)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.fullName && p.fullName.toLowerCase().includes(q)) || 
        (p.nickname && p.nickname.toLowerCase().includes(q)) ||
        (p.currentClub && p.currentClub.toLowerCase().includes(q))
      );
    }

    // Position match
    if (positionFilter !== '') {
      result = result.filter(p => p.primaryPosition === positionFilter);
    }

    // Location / Nationality match
    if (locationFilter !== '') {
      const loc = locationFilter.toLowerCase();
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
  }, [searchQuery, positionFilter, locationFilter, verificationFilter, genderFilter, profiles]);

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
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', width: '100%' }}>
      {/* Title */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }} className="gradient-text">
          Global Football Talent Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Discover the next generation of football stars. Browse and filter player portfolios instantly.
        </p>
      </div>

      {/* Filters Form */}
      <div className="glass" style={{
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        alignItems: 'end'
      }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Search Keywords</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <SearchIcon size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '40px' }}
              placeholder="Name, nickname..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
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

      {/* Results Header with Export Data controls */}
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
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportTalentListToCsv(filtered, 'scoutceler_talent_roster.csv')}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
            title="Download list of filtered players as CSV spreadsheet"
          >
            <FileSpreadsheet size={16} /> Export Talent List (CSV)
          </button>
          <button
            onClick={() => downloadJson('scoutceler_talent_roster.json', filtered)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
            title="Export full filtered players data as JSON"
          >
            <FileJson size={16} /> Export (JSON)
          </button>
        </div>
      </div>

      {/* Grid Results */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No players found matching your filter criteria.</h3>
          <button
            onClick={() => {
              setSearchQuery('');
              setPositionFilter('');
              setLocationFilter('');
              setVerificationFilter('');
              setGenderFilter('');
            }}
            className="btn-secondary"
            style={{ marginTop: '20px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>{player.rating || 50}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-primary)' }}>
                    {player.fullName}
                  </h3>
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
    </div>
  );
}
