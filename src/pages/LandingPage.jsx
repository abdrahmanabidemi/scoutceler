import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Trophy, Compass, ChevronRight, CheckCircle2, Globe, Video, Zap, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is Scoutceler?",
      a: "Scoutceler is a football platform that helps players create profiles, showcase their skills, and get discovered by scouts, agents, clubs, and football professionals."
    },
    {
      q: "Who can use Scoutceler?",
      a: "Scoutceler is for male and female football players, scouts, agents, managers, and clubs."
    },
    {
      q: "How does Scoutceler work?",
      a: "Players create a profile, add their football information and upload videos showing their skills. Scouts and football professionals can discover players through the platform."
    },
    {
      q: "Can scouts find my profile?",
      a: "Yes. Your profile is designed to help scouts, agents, clubs, and other football professionals discover your talent."
    },
    {
      q: "Do I need to be a professional footballer?",
      a: "No. Scoutceler is designed to give both emerging and established players an opportunity to showcase their talent."
    },
    {
      q: "Is Scoutceler free to use?",
      a: "The availability of free and paid features may depend on the current Scoutceler plan. Check the platform for the latest options."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        maxWidth: '1220px',
        width: 'calc(100% - clamp(16px, 4vw, 32px))',
        margin: '16px auto 24px auto',
        padding: 'clamp(44px, 6.5vw, 76px) clamp(20px, 4vw, 40px)',
        borderRadius: 'clamp(18px, 3vw, 28px)',
        backgroundImage: 'linear-gradient(180deg, rgba(5, 15, 10, 0.28) 0%, rgba(7, 20, 13, 0.38) 50%, rgba(4, 12, 8, 0.62) 100%), url("/hero-player.jpg")',
        backgroundPosition: 'center 22%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        border: '1px solid rgba(0, 209, 108, 0.28)',
        boxShadow: '0 20px 45px -12px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Subtle top spotlight */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0, 209, 108, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <h1 style={{
          fontSize: 'clamp(2.1rem, 5.2vw, 3.75rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          maxWidth: '920px',
          marginBottom: '20px',
          letterSpacing: '-1px',
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.65), 0 5px 22px rgba(0, 0, 0, 0.75)',
          position: 'relative',
          zIndex: 1
        }}>
          Discover Africa's Next Football Stars.
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
          color: '#f1f5f9',
          maxWidth: '720px',
          lineHeight: '1.6',
          marginBottom: '36px',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.8), 0 3px 12px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          zIndex: 1
        }}>
          Scoutceler connects talented footballers with scouts, agents and clubs through professional player profiles, video highlights and talent discovery.
        </p>

        <div className="hero-buttons-container" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px' }}>
          <Link to="/register" className="btn-primary glow-btn" style={{ padding: '14px 30px', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', borderRadius: '10px' }}>
            Create a Player Profile <ChevronRight size={18} />
          </Link>
          <Link to="/search" style={{
            padding: '14px 30px',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}>
            Explore Talent
          </Link>
        </div>
      </section>

      {/* 2. HOW SCOUTCELER WORKS (Three user pathways) */}
      <section id="how-it-works" style={{
        padding: '72px 24px',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              maxWidth: '850px',
              margin: '0 auto 10px auto',
              lineHeight: 1.25,
              letterSpacing: '-0.5px'
            }}>
              How Scoutceler Works
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Three simple pathways connecting African talent directly to scouting networks and clubs.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px'
          }}>
            {/* A. Players */}
            <div className="glass" style={{
              padding: '32px 28px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{
                  background: 'rgba(0, 209, 108, 0.1)',
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--primary-green)'
                }}>
                  <Trophy size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  Players
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Create your football profile, showcase your highlights and make your talent easier to discover.
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
                  borderRadius: '8px',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  Join as Player <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* B. Scouts */}
            <div className="glass" style={{
              padding: '32px 28px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{
                  background: 'rgba(0, 209, 108, 0.1)',
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--primary-green)'
                }}>
                  <Compass size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  Scouts
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Discover players, review their profiles and identify talent that matches your scouting needs.
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
                  borderRadius: '8px',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  Discover Players <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* C. Clubs */}
            <div className="glass" style={{
              padding: '32px 28px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{
                  background: 'rgba(0, 209, 108, 0.1)',
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--primary-green)'
                }}>
                  <ShieldCheck size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  Clubs
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Explore player profiles, build shortlists and connect with emerging football talent.
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
                  borderRadius: '8px',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  Explore Talent <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY SCOUTCELER SECTION */}
      <section id="why-scoutceler" style={{
        padding: '72px 24px',
        background: '#09150e',
        borderTop: '1px solid rgba(0, 209, 108, 0.2)',
        borderBottom: '1px solid rgba(0, 209, 108, 0.2)',
        width: '100%',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px',
              margin: '0 auto 10px auto'
            }}>
              Why Choose Scoutceler?
            </h2>
            <p style={{
              color: '#94a3b8',
              maxWidth: '620px',
              margin: '0 auto',
              fontSize: '1rem',
              lineHeight: 1.6
            }}>
              Core tools built specifically for modern football talent discovery and player visibility.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Global Visibility */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 209, 108, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-green)',
                  marginBottom: '20px'
                }}>
                  <Globe size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  Global Visibility
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  Showcase talent without geographical barriers, putting player portfolios in front of international scouts and clubs.
                </p>
              </div>
              <div style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-green)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={15} /> Open Scouting Directory
              </div>
            </div>

            {/* Card 2: Digital CV */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 209, 108, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-green)',
                  marginBottom: '20px'
                }}>
                  <Video size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  Permanent Football Portfolio
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  Build a centralized football profile with video highlight links, physical stats, tactical positions and career milestones.
                </p>
              </div>
              <div style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-green)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={15} /> Video & Stat Portfolio
              </div>
            </div>

            {/* Card 3: Direct Connection */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 209, 108, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-green)',
                  marginBottom: '20px'
                }}>
                  <Zap size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  Direct Discovery & Outreach
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  Enable scouts and football officials to find players by code or role and reach out directly through registered contact channels.
                </p>
              </div>
              <div style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-green)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={15} /> Direct Contact Records
              </div>
            </div>

            {/* Card 4: Verified Identity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 209, 108, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-green)',
                  marginBottom: '20px'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  Verified Identity & Codes
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  Every registered player receives a unique player code (e.g. SC-10001) and optional admin verification tier for enhanced credibility.
                </p>
              </div>
              <div style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-green)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={15} /> Unique Player ID Codes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      <section id="faq" style={{
        padding: 'clamp(64px, 8vw, 92px) 24px',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        width: '100%'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: '10px',
              letterSpacing: '-0.5px'
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Everything you need to know about getting discovered, showcasing your talent, and connecting with scouts on Scoutceler.
            </p>
          </div>

          {/* Accordion list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass"
                  style={{
                    borderRadius: '14px',
                    border: isOpen ? '1.5px solid var(--primary-green)' : '1px solid var(--border-color)',
                    transition: 'all 0.25s ease',
                    overflow: 'hidden',
                    background: isOpen ? 'rgba(0, 209, 108, 0.02)' : '#ffffff',
                    boxShadow: isOpen ? '0 8px 24px -6px rgba(0, 209, 108, 0.12)' : '0 2px 8px -2px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
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
                    <span style={{
                      fontSize: 'clamp(0.98rem, 1.8vw, 1.1rem)',
                      fontWeight: 700,
                      color: isOpen ? 'var(--primary-green)' : 'var(--text-primary)',
                      transition: 'color 0.2s'
                    }}>
                      {faq.q}
                    </span>
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
                      padding: '0 24px 20px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.96rem',
                      lineHeight: '1.65',
                      borderTop: '1px solid rgba(0, 209, 108, 0.1)',
                      paddingTop: '16px'
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
        padding: '64px 24px 88px',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(56px, 8vw, 84px) clamp(20px, 4vw, 48px)',
          borderRadius: 'clamp(20px, 3vw, 32px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(8, 20, 14, 0.6) 0%, rgba(9, 22, 16, 0.72) 50%, rgba(5, 14, 10, 0.88) 100%), url("/opportunities-players.jpg")',
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
            background: 'radial-gradient(ellipse at center, rgba(0, 209, 108, 0.28) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 6px 20px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            zIndex: 1,
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            One Platform. <span style={{ color: 'var(--primary-green)' }}>Endless Opportunities.</span>
          </h2>
          <p style={{
            color: '#f8fafc',
            fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            zIndex: 1,
            lineHeight: 1.6
          }}>
            Whether you are a player showcasing your talent, or a scout or club searching for top emerging African footballers, Scoutceler gives you the platform to connect.
          </p>
          <div className="hero-buttons-container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '540px', margin: '0 auto' }}>
            <Link to="/register" className="btn-primary glow-btn" style={{
              padding: '14px 32px',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              borderRadius: '10px'
            }}>
              Create a Player Profile <ChevronRight size={18} />
            </Link>
            <Link to="/search" style={{
              padding: '14px 32px',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}>
              Explore Talent Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
