import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto 80px',
      padding: '0 clamp(16px, 4vw, 32px)',
      width: '100%',
      color: 'var(--text-primary)'
    }}>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--primary-green)',
        textDecoration: 'none',
        fontWeight: 600,
        marginBottom: '28px',
        fontSize: '0.95rem'
      }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <div className="glass" style={{
        padding: 'clamp(28px, 5vw, 48px)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            background: 'rgba(249, 115, 22, 0.1)',
            color: 'var(--secondary-orange)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0 }}>Terms of Service</h1>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Last updated: September 2026</span>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Welcome to Scoutceler. By accessing or utilizing our platform, mobile interfaces, websites, or talent databases, you agree to be bound by these Terms of Service. Please read them thoroughly.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              1. Platform Purpose & Eligibility
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Scoutceler is a specialized football discovery and networking network that enables male and female football players, scouts, agents, managers, and clubs to showcase ability, identify prospects, and connect professionally. You must provide accurate and verifiable information during registration.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              2. User Accounts & Identity Codes
            </h2>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
              <li>Every registered player is assigned a unique Player Identity Code (e.g. SC-XXXXX) for official identification and public search.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials (email, phone number, password).</li>
              <li>You may not impersonate any player, scout, or club official. Doing so results in immediate termination.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              3. Profile Content & Video Highlights
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Players and representatives certify that all uploaded video highlights, physical statistics, match history, and club affiliations accurately represent the player's true career. Scoutceler reserves the right to review, verify, or revoke verification badges where inaccuracies are identified.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              4. Scouting & Professional Conduct
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Scouts, agents, and club representatives agree to use platform records exclusively for legitimate scouting, trial invitations, and football career opportunities in compliance with FIFA regulations and relevant local football association standards.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              5. Free & Paid Features
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              The availability of free and paid features (such as priority verification, advanced video analytics, or bespoke scout outreach) may depend on the current Scoutceler plan. Check the platform for the latest tier options.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              6. Termination
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Users may terminate their account at any time via Account Settings. Scoutceler may suspend or terminate accounts that breach these terms, misrepresent credentials, or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              7. Contact Information
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              For legal questions regarding these Terms of Service, contact us at{' '}
              <strong style={{ color: 'var(--primary-green)' }}>scoutceler.business@gmail.com</strong> or phone{' '}
              <strong>+2347038075053</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}