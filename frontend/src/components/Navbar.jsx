import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const isActive = (path) => location.pathname === path;

  // Do not show navbar if not authenticated OR on auth pages
  if (!isAuth || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(10, 15, 30, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      height: '85px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="nav-container" style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand */}
        <Link to="/" style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem', 
          textDecoration: 'none', 
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '900'
        }}>
          <div style={{
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.2rem',
            boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)'
          }}>
             ✨
          </div>
          Nextora <span style={{color: 'var(--accent)'}}>AI</span>
        </Link>
        
        {/* Links */}
        <div style={{
          display: 'flex', 
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', color: isActive('/') ? 'white' : 'rgba(255,255,255,0.6)'}}>Home</Link>
          <Link to="/predictor" className={`nav-link ${isActive('/predictor') ? 'active' : ''}`} style={{textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', color: isActive('/predictor') ? 'white' : 'rgba(255,255,255,0.6)'}}>Predictor</Link>
          <Link to="/analyzer" className={`nav-link ${isActive('/analyzer') ? 'active' : ''}`} style={{textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', color: isActive('/analyzer') ? 'white' : 'rgba(255,255,255,0.6)'}}>Resume</Link>
          <Link to="/github" className={`nav-link ${isActive('/github') ? 'active' : ''}`} style={{textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', color: isActive('/github') ? 'white' : 'rgba(255,255,255,0.6)'}}>GitHub</Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} style={{textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', color: isActive('/profile') ? 'white' : 'rgba(255,255,255,0.6)'}}>Profile</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} style={{textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', color: isActive('/about') ? 'white' : 'rgba(255,255,255,0.6)'}}>About</Link>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem'
        }}>
          <button 
            onClick={() => { localStorage.removeItem('isAuthenticated'); window.location.href = '/login'; }}
            style={{background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'}}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
