import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import PlayerProfile from './pages/PlayerProfile';
import Admin from './pages/Admin';
import { 
  Search as SearchIcon,
  LogOut, 
  LayoutDashboard, 
  Phone, 
  Mail 
} from 'lucide-react';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

function Navigation() {
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Keep local state updated immediately upon route changes, events, and polling
    const syncUser = () => {
      const user = auth.getCurrentUser();
      setCurrentUser(user);
    };
    syncUser();
    const interval = setInterval(syncUser, 300);
    window.addEventListener('storage', syncUser);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', syncUser);
    };
  }, [location]);

  const handleLogout = async () => {
    await auth.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="glass" style={{
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(14px, 3.5vw, 40px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.jpg" 
            alt="Scoutceler Logo" 
            style={{ 
              height: 'clamp(38px, 5vw, 54px)', 
              objectFit: 'contain',
              filter: 'invert(1) hue-rotate(180deg)',
              mixBlendMode: 'multiply'
            }} 
          />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 20px)' }}>
        <Link to="/search" className="nav-search-btn" title="Search Players">
          <span className="nav-search-text">Search Players</span>
          <span className="nav-search-icon"><SearchIcon size={18} /></span>
        </Link>

        {currentUser ? (
          <>
            {currentUser.role === 'player' && (
              <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>
                <LayoutDashboard size={18} /> <span className="nav-text-hide-mobile">Dashboard</span>
              </Link>
            )}

            {currentUser.role === 'scout' && (
              <Link to="/search" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>
                <LayoutDashboard size={18} /> <span className="nav-text-hide-mobile">Dashboard</span>
              </Link>
            )}

            {currentUser.role === 'admin' && (
              <Link to="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--secondary-orange)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>
                Admin Dashboard
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 16px)' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                Hello, <strong>{currentUser.fullName}</strong>
              </span>
              <button onClick={handleLogout} className="btn-secondary" style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <LogOut size={15} /> <span className="nav-text-hide-mobile">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  const location = useLocation();

  // Contact section and footer should not be showing under player dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <footer style={{
      background: '#0b140f',
      borderTop: '3px solid var(--primary-green)',
      boxShadow: '0 -4px 25px rgba(0, 209, 108, 0.08)',
      padding: '50px clamp(16px, 4vw, 40px) 24px clamp(16px, 4vw, 40px)',
      marginTop: 'auto',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '36px'
      }}>
        {/* Branding */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <img 
              src="/logo.jpg" 
              alt="Scoutceler Logo" 
              style={{ 
                height: '40px', 
                objectFit: 'contain'
              }} 
            />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Democratizing football opportunities globally. The ultimate scouting and talent networking ecosystem built for the future of football.
          </p>
        </div>

        {/* Legal links */}
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '18px', color: '#ffffff', letterSpacing: '0.5px' }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li>
              <a href="#/privacy" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</a>
            </li>
            <li>
              <a href="#/terms" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '18px', color: '#ffffff', letterSpacing: '0.5px' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="var(--primary-green)" />
              <span style={{ color: '#f1f5f9' }}>+2347038075053</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="var(--secondary-orange)" />
              <span style={{ color: '#f1f5f9' }}>scoutceler.business@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Social media */}
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '18px', color: '#ffffff', letterSpacing: '0.5px' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '18px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>
              <InstagramIcon />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>
              <YoutubeIcon />
            </a>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        &copy; {new Date().getFullYear()} Scoutceler. All rights reserved. Empowering talent worldwide.
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
