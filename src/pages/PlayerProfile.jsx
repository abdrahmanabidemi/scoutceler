import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { ShieldCheck, Mail, Star, PhoneCall, Award, FileText, ChevronRight, Download } from 'lucide-react';
import { printPlayerCv } from '../utils/exportData';

export default function PlayerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setUserRole(user.role);
    }

    db.getProfile(id)
      .then((p) => {
        setProfile(p);
        setLoading(false);
        // Record profile view notification
        db.recordProfileView(id, user).then((updated) => {
          if (updated) setProfile(updated);
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h2>Loading Portfolio Profile...</h2>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Player profile not found.</h2>
        <Link to="/search" className="btn-secondary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  // Check if videoUrl is a local base64/object URL or standard youtube embed link
  const renderVideoPlayer = (url) => {
    if (!url) {
      return (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          borderRadius: '12px',
          height: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          No Video Highlights Uploaded Yet
        </div>
      );
    }

    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYoutube) {
      // Basic Youtube URL transformer
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    return (
      <video controls style={{ width: '100%', borderRadius: '12px', background: '#000', maxHeight: '450px' }}>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  const renderAttributeBar = (label, score, color) => {
    const displayScore = score !== undefined && score !== null && score !== '' ? Number(score) : 0;
    return (
      <div key={label} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
          <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{displayScore}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${displayScore}%`,
            background: color,
            borderRadius: '3px',
            boxShadow: `0 0 8px ${color}80`
          }}></div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', width: '100%' }}>
      {/* Back button */}
      <Link to="/search" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
        &larr; Back to Player Database
      </Link>

      {/* Main Grid Header */}
      <div className="glass profile-header-grid" style={{
        padding: 'clamp(24px, 4vw, 40px)',
        borderRadius: '24px',
        marginBottom: '36px',
        position: 'relative'
      }}>
        {/* Profile Pic */}
        <div style={{
          width: 'clamp(140px, 20vw, 200px)',
          height: 'clamp(140px, 20vw, 200px)',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid var(--primary-green)',
          boxShadow: '0 0 20px var(--primary-green-glow)',
          justifySelf: 'center'
        }}>
          {profile.profilePic ? (
            <img src={profile.profilePic} alt={profile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No Photo
            </div>
          )}
        </div>

        {/* Header Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800 }}>{profile.fullName}</h1>
              {profile.verification && profile.verification !== 'none' && (
                <span className="glow-btn" style={{
                  background: profile.verification === 'Elite' ? 'var(--secondary-orange)' : 'var(--primary-green)',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ShieldCheck size={16} /> {profile.verification} Verified
                </span>
              )}
            </div>
            {profile.nickname && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontStyle: 'italic', marginTop: '4px' }}>
                "{profile.nickname}"
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.95rem' }}>
            <span className="glass" style={{ padding: '6px 14px', borderRadius: '8px', color: 'var(--primary-green)' }}>
              Position: <strong>{profile.primaryPosition} {profile.secondaryPosition ? `/ ${profile.secondaryPosition}` : ''}</strong>
            </span>
            <span className="glass" style={{ padding: '6px 14px', borderRadius: '8px' }}>
              Current Club: <strong>{profile.currentClub || 'Unattached'}</strong>
            </span>
            <span className="glass" style={{ padding: '6px 14px', borderRadius: '8px', color: 'var(--secondary-orange)' }}>
              Est. Value: <strong>€{profile.marketValue || 'N/A'}</strong>
            </span>
          </div>

          {/* Action Buttons (Scout recruitment buttons only for scouts/admins; players see CV & portfolio tools) */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            {(userRole === 'scout' || userRole === 'admin') && (
              <>
                <button onClick={() => setShowContactModal(true)} className="btn-primary glow-btn">
                  <Mail size={18} /> Contact Scoutceler
                </button>
                <button onClick={handleShortlist} className="btn-secondary" style={{
                  borderColor: isShortlisted ? 'var(--secondary-orange)' : 'var(--border-color)',
                  color: isShortlisted ? 'var(--secondary-orange)' : 'var(--text-primary)'
                }}>
                  <Star size={18} fill={isShortlisted ? 'var(--secondary-orange)' : 'none'} /> {isShortlisted ? 'Shortlisted' : 'Shortlist Player'}
                </button>
              </>
            )}
            <button
              onClick={() => printPlayerCv(profile)}
              className="btn-secondary"
              title="Download Football CV"
            >
              <Download size={18} /> Download CV
            </button>
            {auth.getCurrentUser()?.uid === profile.uid && (
              <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Edit My Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Portfolio Grid */}
      <div className="profile-portfolio-grid">
        {/* Left Side: Video, CV, Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Highlight Video Card */}
          <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Highlight Reel
            </h3>
            {renderVideoPlayer(profile.videoUrl)}
          </div>

          {/* Bio / Resume Section */}
          <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Football Resume & Biography
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--primary-green)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={18} /> Biography
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{profile.bio || 'No biography details provided.'}</p>
              </div>

              <div>
                <h4 style={{ color: 'var(--secondary-orange)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} /> Achievements
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{profile.achievements || 'No achievements listed.'}</p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} /> Awards
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{profile.awards || 'No awards listed.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar stats, Attributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* AI Overall Rating / Performance Metrics */}
          <div className="glass" style={{
            padding: '30px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(0,209,108,0.02) 0%, rgba(249,115,22,0.02) 100%)',
            borderColor: 'var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', textAlign: 'center' }}>AI Scout Metrics</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rating</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-green)' }}>{profile.rating !== undefined && profile.rating !== null ? profile.rating : 0}</span>
              </div>
              <div style={{ height: '30px', width: '1px', background: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Potential</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary-orange)' }}>{profile.potential !== undefined && profile.potential !== null ? profile.potential : 0}</span>
                </div>
              </div>
              <div style={{ height: '30px', width: '1px', background: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Scout Conf.</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{profile.scoutConfidence !== undefined && profile.scoutConfidence !== null ? profile.scoutConfidence : 0}%</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Player Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gender</span>
                <strong style={{ color: 'var(--text-primary)' }}>{profile.gender || 'Male'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Age</span>
                <strong style={{ color: 'var(--text-primary)' }}>{profile.age || 'N/A'} years</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Height</span>
                <strong style={{ color: 'var(--text-primary)' }}>{profile.height || 'N/A'} cm</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Weight</span>
                <strong style={{ color: 'var(--text-primary)' }}>{profile.weight || 'N/A'} kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Preferred Foot</span>
                <strong style={{ color: 'var(--text-primary)' }}>{profile.preferredFoot || 'Right'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Jersey Number</span>
                <strong style={{ color: 'var(--text-primary)' }}>#{profile.jerseyNumber || 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Availability</span>
                <strong style={{ color: profile.marketAvailability === 'Available' ? 'var(--primary-green)' : 'var(--text-muted)' }}>
                  {profile.marketAvailability || 'Available'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Academy</span>
                <strong style={{ color: 'var(--text-primary)' }}>{profile.academy || 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Performance Attributes */}
          <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Performance Metrics
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-green)', marginBottom: '12px' }}>Physical</h4>
              {renderAttributeBar('Speed', profile.speed, 'var(--primary-green)')}
              {renderAttributeBar('Strength', profile.strength, 'var(--primary-green)')}
              {renderAttributeBar('Stamina', profile.stamina, 'var(--primary-green)')}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary-orange)', marginBottom: '12px' }}>Technical</h4>
              {renderAttributeBar('Passing', profile.passing, 'var(--secondary-orange)')}
              {renderAttributeBar('Shooting', profile.shooting, 'var(--secondary-orange)')}
              {renderAttributeBar('Dribbling', profile.dribbling, 'var(--secondary-orange)')}
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Mental</h4>
              {renderAttributeBar('Vision', profile.vision, 'var(--text-primary)')}
              {renderAttributeBar('Composure', profile.composure, 'var(--text-primary)')}
              {renderAttributeBar('Teamwork', profile.teamwork, 'var(--text-primary)')}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass" style={{
            maxWidth: '500px',
            width: '100%',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Interested in this player?</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              To ensure safety, validation, and fair recruitment, all contacts and transfer negotiations are routed through Scoutceler central agency.
            </p>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <Mail size={24} color="var(--primary-green)" />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send official offer or inquiry to</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>scoutceler.business@gmail.com</h4>
              </div>
            </div>

            <button onClick={() => setShowContactModal(false)} className="btn-primary" style={{ width: '100%' }}>
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
