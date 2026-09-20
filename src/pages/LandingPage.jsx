import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Trophy, Compass, Star, ChevronRight, CheckCircle2, Globe, Zap, Video, ChevronDown, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      num: "1",
      q: "What is Scoutceler?",
      a: "Scoutceler is a football platform that helps players create profiles, showcase their skills, and get discovered by scouts, agents, clubs, and football professionals."
    },
    {
      num: "2",
      q: "Who can use Scoutceler?",
      a: "Scoutceler is for male and female football players, scouts, agents, managers, and clubs."
    },
    {
      num: "3",
      q: "How does Scoutceler work?",
      a: "Players create a profile, add their football information and upload videos showing their skills. Scouts and football professionals can discover players through the platform."
    },
    {
      num: "5",
      q: "Can scouts find my profile?",
      a: "Yes. Your profile is designed to help scouts, agents, clubs, and other football professionals discover your talent."
    },
    {
      num: "6",
      q: "Do I need to be a professional footballer?",
      a: "No. Scoutceler is designed to give both emerging and established players an opportunity to showcase their talent."
    },
    {
      num: "12",
      q: "Is Scoutceler free to use?",
      a: "The availability of free and paid features may depend on the current Scoutceler plan. Check the platform for the latest options."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1. HERO SECTION - With African footballer in action background */}
      <section style={{
        position: 'relative',
        maxWidth: '1220px',
        width: 'calc(100% - clamp(16px, 4vw, 32px))',
        margin: '16px auto 20px auto',
        padding: 'clamp(54px, 8vw, 88px) clamp(16px, 4vw, 24px)',
        borderRadius: 'clamp(20px, 4vw, 32px)',
        backgroundImage: 'linear-gradient(180deg, rgba(8, 20, 14, 0.78) 0%, rgba(12, 30, 22, 0.86) 50%, rgba(8, 18, 13, 0.94) 100%), url("/hero-player.jpg")',
        backgroundPosition: 'center 20%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        border: '1px solid rgba(0, 209, 108, 0.3)',
        boxShadow: '0 20px 45px -12px rgba(0, 0, 0, 0.35)',
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
          fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
          fontWeight: 800,
          lineHeight: 1.18,
          maxWidth: '920px',
          marginBottom: '20px',
          letterSpacing: '-1px',
          color: '#ffffff',
          position: 'relative',
          zIndex: 1
        }}>
          Discover Africa's Next Football Stars.
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
          color: '#cbd5e1',
          maxWidth: '780px',
          lineHeight: '1.65',
          marginBottom: '36px',
          position: 'relative',
          zIndex: 1
        }}>
          Scoutceler connects talented footballers with scouts, agents and clubs through professional player profiles, video highlights and intelligent talent discovery.
        </p>

        <div className="hero-buttons-container" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px' }}>
          <Link to="/register" className="btn-primary glow-btn" style={{ padding: '14px 32px', fontSize: '1.05rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            Get Discovered Now <ChevronRight size={20} />
          </Link>
          <Link to="/search" style={{
            padding: '14px 32px',
            fontSize: '1.05rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50px',
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

      {/* 2. HOW SCOUTCELER WORKS (Three simple paths) */}
      <section style={{
        padding: '80px 24px',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              maxWidth: '850px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.25,
              marginBottom: '12px'
            }}>
              How Scoutceler Works
            </h2>
            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Three simple paths. One big goal - more opportunities for African talent.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px'
          }}>
            {/* A. I'm a player */}
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
                  marginBottom: '20px',
                  color: 'var(--primary-green)'
                }}>
                  <Trophy size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  I'm a player
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Create your professional football profile, Upload highlights, Get discovered by scouts and clubs.
                </p>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Link to="/register" className="btn-primary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  borderRadius: '50px'
                }}>
                  Join as Player <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* B. I'm a scout */}
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
                  marginBottom: '20px',
                  color: 'var(--secondary-orange)'
                }}>
                  <Compass size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  I'm a scout
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Search talent for talent, filter players, review profile and scout.
                </p>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Link to="/search" className="btn-primary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  borderRadius: '50px'
                }}>
                  Search Talent <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* C. I'm a club */}
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
                  marginBottom: '20px',
                  color: 'var(--primary-green)'
                }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                  I'm a club
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Discovered promising players, Build shortlists and  Connect with the next generation of talent.
                </p>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Link to="/search" className="btn-primary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  borderRadius: '50px'
                }}>
                  Discover Talent <ChevronRight size={16} />
                </Link>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
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

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      <section style={{
        padding: '90px 24px',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        width: '100%'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--primary-green)',
              background: 'rgba(0, 209, 108, 0.1)',
              padding: '4px 14px',
              borderRadius: '20px',
              marginBottom: '12px',
              letterSpacing: '1px'
            }}>
              HELP & SUPPORT
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: '12px'
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto'
            }}>
              Everything you need to know about getting discovered, showcasing your talent, and connecting with scouts on Scoutceler.
            </p>
          </div>

          {/* Accordion list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.num}
                  className="glass"
                  style={{
                    borderRadius: '16px',
                    border: isOpen ? '1.5px solid var(--primary-green)' : '1px solid var(--border-color)',
                    transition: 'all 0.25s ease',
                    overflow: 'hidden',
                    background: isOpen ? 'rgba(0, 209, 108, 0.02)' : 'var(--bg-card)',
                    boxShadow: isOpen ? '0 8px 24px -6px rgba(0, 209, 108, 0.12)' : 'none'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '22px 26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: isOpen ? '#ffffff' : 'var(--primary-green)',
                        background: isOpen ? 'var(--primary-green)' : 'rgba(0, 209, 108, 0.12)',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s'
                      }}>
                        {faq.num}
                      </span>
                      <span style={{
                        fontSize: 'clamp(1rem, 2vw, 1.12rem)',
                        fontWeight: 700,
                        color: isOpen ? 'var(--primary-green)' : 'var(--text-primary)',
                        transition: 'color 0.2s'
                      }}>
                        {faq.q}
                      </span>
                    </div>
                    <div style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? 'var(--primary-green)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 26px 22px 68px',
                      color: 'var(--text-secondary)',
                      fontSize: '1rem',
                      lineHeight: '1.7',
                      animation: 'fadeIn 0.25s ease'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION: One Platform. Endless Opportunities. */}
      <section style={{
        padding: '70px 24px 100px',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(60px, 9vw, 90px) clamp(24px, 5vw, 56px)',
          borderRadius: '32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(8, 20, 14, 0.82) 0%, rgba(12, 30, 21, 0.88) 50%, rgba(6, 16, 11, 0.95) 100%), url("/opportunities-players.jpg")',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          border: '1px solid rgba(0, 209, 108, 0.35)',
          boxShadow: '0 25px 50px -15px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Subtle glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            height: '350px',
            background: 'radial-gradient(ellipse at center, rgba(0, 209, 108, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#ffffff',
            position: 'relative',
            zIndex: 1,
            letterSpacing: '-0.5px'
          }}>
            One Platform. <span style={{ color: 'var(--primary-green)' }}>Endless Opportunities.</span>
          </h2>
          <p style={{
            color: '#e2e8f0',
            marginBottom: '36px',
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            position: 'relative',
            zIndex: 1,
            lineHeight: 1.6
          }}>
            Join the ecosystem today as a Player, Scout, or Club Representative.
          </p>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary glow-btn" style={{
              padding: '16px 42px',
              fontSize: '1.1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Create Your Account <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
