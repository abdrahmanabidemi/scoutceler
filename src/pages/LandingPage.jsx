import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Trophy, Compass, Star, ChevronRight, CheckCircle2, Globe, Zap, Video } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1. HERO SECTION - Rounded, decent, soft stadium pitch aesthetic */}
      <section style={{
        position: 'relative',
        maxWidth: '1220px',
        width: 'calc(100% - 32px)',
        margin: '20px auto 20px auto',
        padding: '76px 24px 72px 24px',
        borderRadius: '32px',
        background: 'linear-gradient(180deg, #13271d 0%, #193627 50%, #12241b 100%)',
        border: '1px solid rgba(0, 209, 108, 0.25)',
        boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Stadium Floodlight Radial Spotlight */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0, 209, 108, 0.22) 0%, rgba(249, 115, 22, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <h1 style={{
          fontSize: 'clamp(2.3rem, 5.5vw, 3.8rem)',
          fontWeight: 800,
          lineHeight: 1.18,
          maxWidth: '920px',
          marginBottom: '20px',
          letterSpacing: '-1px',
          color: '#ffffff',
          position: 'relative',
          zIndex: 1
        }}>
          Football's Fastest Talent Discovery Platform
        </h1>

        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          color: '#cbd5e1',
          maxWidth: '740px',
          lineHeight: '1.65',
          marginBottom: '36px',
          position: 'relative',
          zIndex: 1
        }}>
          Thousands of talented players are overlooked every year—not because they lack ability, but because they lack visibility.{' '}
          <strong style={{ color: 'var(--primary-green)', fontWeight: 700 }}>Scoutceler</strong> changes that.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <Link to="/register" className="btn-primary glow-btn" style={{ padding: '15px 36px', fontSize: '1.05rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Get Discovered Now <ChevronRight size={20} />
          </Link>
          <Link to="/search" style={{
            padding: '15px 36px',
            fontSize: '1.05rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}>
            Search Talent
          </Link>
        </div>
      </section>

      {/* 2. ROLE VALUE PROPOSITIONS (For Players, Clubs, Scouts) */}
      <section style={{
        padding: '80px 24px',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              maxWidth: '850px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.3
            }}>
              A permanent digital home where performances, highlights, and verified stats are discovered worldwide.
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {/* For Players */}
            <div className="glass" style={{
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '4px solid var(--primary-green)'
            }}>
              <div>
                <div style={{
                  background: 'rgba(0, 209, 108, 0.1)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: 'var(--primary-green)'
                }}>
                  <Trophy size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  For Players
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Create a permanent, verifiable football profile. Showcase your highlights, technical metrics, and CV without geographic barriers.
                </p>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-green)', fontWeight: 600, fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Global visibility & trials
              </div>
            </div>

            {/* For Clubs */}
            <div className="glass" style={{
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '4px solid var(--secondary-orange)'
            }}>
              <div>
                <div style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: 'var(--secondary-orange)'
                }}>
                  <Compass size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  For Clubs
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Slash scouting overhead and discover verified talents faster. Filter players across positions, regions, and physical attributes with video evidence.
                </p>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-orange)', fontWeight: 600, fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Verified stats & video analysis
              </div>
            </div>

            {/* For Scouts & Agents */}
            <div className="glass" style={{
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '4px solid var(--primary-green)'
            }}>
              <div>
                <div style={{
                  background: 'rgba(0, 209, 108, 0.1)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: 'var(--primary-green)'
                }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  For Scouts & Agents
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Access powerful discovery and evaluation tools. Identify hidden gems, track player career progress, and initiate direct professional contact.
                </p>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-green)', fontWeight: 600, fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> First access to rising talent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY SCOUTCELER SECTION - Distinct stadium dark styling with color interchange */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #07120c 0%, #0d1e15 50%, #08140d 100%)',
        borderTop: '1px solid rgba(0, 209, 108, 0.25)',
        borderBottom: '1px solid rgba(0, 209, 108, 0.25)',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle radial emerald illumination */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 209, 108, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: 'clamp(2.1rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px'
            }}>
              Why Choose Scoutceler?
            </h2>
            <p style={{
              color: '#94a3b8',
              maxWidth: '620px',
              margin: '14px auto 0',
              fontSize: '1.05rem',
              lineHeight: 1.6
            }}>
              Four core pillars engineered specifically for the demands of modern football talent discovery and career acceleration.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Green Accent (Discovery) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(0, 209, 108, 0.15)',
                    border: '1px solid rgba(0, 209, 108, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-green)'
                  }}>
                    <Globe size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 209, 108, 0.15)',
                    color: 'var(--primary-green)',
                    border: '1px solid rgba(0, 209, 108, 0.3)'
                  }}>
                    01 • DISCOVERY
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                  Global Visibility
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Talented footballers are showcased worldwide without geographical limits or travel barriers, putting players directly in front of international clubs.
                </p>
              </div>
              <div style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-green)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} /> Worldwide Club Scouting Access
              </div>
            </div>

            {/* Card 2: Interchanged Orange / Featured Highlight Card (Digital CV) */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.12) 0%, rgba(18, 38, 26, 0.95) 100%)',
              border: '1.5px solid rgba(249, 115, 22, 0.45)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(249, 115, 22, 0.12)',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(249, 115, 22, 0.22)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--secondary-orange)'
                  }}>
                    <Video size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(249, 115, 22, 0.22)',
                    color: 'var(--secondary-orange)',
                    border: '1px solid rgba(249, 115, 22, 0.4)'
                  }}>
                    02 • DIGITAL CV
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                  Permanent Football Portfolio
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Build an immutable football passport featuring match highlights, physical stats, tactical positions, and verifiable career milestones in one place.
                </p>
              </div>
              <div style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(249, 115, 22, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--secondary-orange)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} /> Up to 5MB High-Res Uploads
              </div>
            </div>

            {/* Card 3: Interchanged Orange Badge (Opportunity) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--secondary-orange)'
                  }}>
                    <Zap size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: 'var(--secondary-orange)',
                    border: '1px solid rgba(249, 115, 22, 0.3)'
                  }}>
                    03 • OPPORTUNITY
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                  Direct Trials & Connection
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Cut out unnecessary gatekeepers. Licensed scouts and club officials initiate direct trial invitations and communication right through your dashboard.
                </p>
              </div>
              <div style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--secondary-orange)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} /> Real-Time View Notifications
              </div>
            </div>

            {/* Card 4: Green Badge (Verification) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '20px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(0, 209, 108, 0.15)',
                    border: '1px solid rgba(0, 209, 108, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-green)'
                  }}>
                    <ShieldCheck size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 209, 108, 0.15)',
                    color: 'var(--primary-green)',
                    border: '1px solid rgba(0, 209, 108, 0.3)'
                  }}>
                    04 • VERIFICATION
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                  AI Ratings & Verification
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Algorithmic evaluation of physical, technical, and psychological metrics gives players trusted badges that professional recruiters immediately rely upon.
                </p>
              </div>
              <div style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-green)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} /> Trusted Club-Standard Metrics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section style={{
        padding: '90px 24px',
        background: '#ffffff',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '60px 40px',
          borderRadius: '24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0,209,108,0.06) 0%, rgba(249,115,22,0.06) 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '16px' }} className="gradient-text">
            One Platform. Endless Opportunities.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 32px' }}>
            Join the ecosystem today as a Player, Scout, or Club Representative.
          </p>
          <Link to="/register" className="btn-orange" style={{ padding: '16px 44px', fontSize: '1.1rem', textDecoration: 'none' }}>
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
