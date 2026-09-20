import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
            background: 'rgba(0, 209, 108, 0.1)',
            color: 'var(--primary-green)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0 }}>Privacy Policy</h1>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Last updated: September 2026</span>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          At Scoutceler, we are committed to safeguarding the privacy and personal data of our players, scouts, agents, club representatives, and site visitors. This Privacy Policy explains how we collect, use, disclose, and protect your information when you access or use our platform.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '10px' }}>
              We collect information that you directly provide when registering an account, editing your profile, or contacting us:
            </p>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
              <li><strong>Account Credentials:</strong> Full name, email address, phone number, role, and password.</li>
              <li><strong>Player Profile & Metrics:</strong> Age, nationality, position, height, weight, preferred foot, current club, match stats, videos, and bio.</li>
              <li><strong>Identity Verification:</strong> Player identification code (e.g. SC-XXXXX) and verification tier documentation.</li>
              <li><strong>Usage Information:</strong> Profile views, scout shortlists, search queries, and interaction timestamps.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              2. How We Use Your Information
            </h2>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
              <li>To create, display, and maintain your football portfolio and player profile.</li>
              <li>To enable verified scouts, agents, and clubs to search, discover, and contact players.</li>
              <li>To authenticate your sign-in via either your email address or phone number.</li>
              <li>To provide analytics including real profile views and career engagement.</li>
              <li>To communicate important service updates, notifications, and security alerts.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              3. Confidentiality & Admin Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Personal contact details such as direct telephone numbers and private email addresses are protected. They are never sold to third-party marketing companies. Only authorized administrators and verified scouting partners under strict data-protection agreements may access confidential contact channels to coordinate legitimate trials and transfers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              4. Data Security & Storage
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              We implement industry-standard encryption and security protocols to safeguard your personal records and video assets against unauthorized access, loss, alteration, or misuse.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              5. Your Rights & Account Deletion
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              You retain total control over your profile. You may update your phone number, change your password, or permanently delete your account and all associated player records at any time through the Account Settings panel in your dashboard.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              6. Contact Us
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              If you have any questions or inquiries regarding this Privacy Policy, please contact our data team at{' '}
              <strong style={{ color: 'var(--primary-green)' }}>scoutceler.business@gmail.com</strong> or via phone at{' '}
              <strong>+2347038075053</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}