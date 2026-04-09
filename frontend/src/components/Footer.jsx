import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" style={{
      background: 'rgba(10, 15, 30, 0.9)',
      padding: '3rem 2rem',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      marginTop: 'auto'
    }}>
      <div className="footer-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '4rem'
      }}>
        {/* Brand Section */}
        <div style={{flex: 1.5}}>
          <div className="footer-brand" style={{fontSize: '1.4rem', fontWeight: '900', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
            <span style={{fontSize: '1.2rem'}}>✨</span> Nextora AI
          </div>
          <p style={{fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', maxWidth: '300px'}}>
            Your professional career companion. Empowering students with data-driven clarity since 2026.
          </p>
        </div>
        
        {/* Quick Links */}
        <div style={{flex: 1}}>
          <h4 style={{fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'white'}}>Quick Links</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
            <Link to="/" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.85rem'}}>Home</Link>
            <Link to="/predictor" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.85rem'}}>Predictor</Link>
            <Link to="/analyzer" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.85rem'}}>Resume</Link>
          </div>
        </div>

        {/* Resources */}
        <div style={{flex: 1}}>
          <h4 style={{fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'white'}}>Resources</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
             <Link to="/about" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.85rem'}}>Methodology</Link>
             <Link to="/profile" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.85rem'}}>Student Persona</Link>
             <a href="#" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.85rem'}}>Privacy Policy</a>
          </div>
        </div>

        {/* Community */}
        <div style={{flex: 1, textAlign: 'right'}}>
           <div className="footer-badge" style={{display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem'}}>
             Built for Results ❤️
           </div>
           <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
             <span style={{fontSize: '0.8rem', color: '#475569'}}>Nextora v1.0</span>
           </div>
        </div>
      </div>
      
      <div style={{maxWidth: '1200px', margin: '3rem auto 0', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center'}}>
        <p style={{fontSize: '0.8rem', color: '#475569'}}>&copy; 2026 Nextora AI Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
