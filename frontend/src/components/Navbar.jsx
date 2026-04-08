import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <span className="brand-ai">AI</span> Placement Copilot
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/" className={path === '/' ? 'active nav-link' : 'nav-link'}>Home</Link>
          <Link to="/dashboard" className={path === '/dashboard' ? 'active nav-link' : 'nav-link'}>Dashboard</Link>
          <Link to="/analyzer" className={path === '/analyzer' ? 'active nav-link' : 'nav-link'}>Analyzer</Link>
          <Link to="/about" className={path === '/about' ? 'active nav-link' : 'nav-link'}>About</Link>
        </div>
      </div>
    </nav>
  );
}
