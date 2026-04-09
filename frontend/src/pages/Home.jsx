import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-container fade-in" style={{ position: 'relative' }}>
      
      {/* Decorative Advanced Background Elements */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="hero-section" style={{minHeight: '80vh', paddingBottom: '2rem'}}>
        <div className="hero-content pulse-glow">
          <div className="header-badge fade-slide-up" style={{animationDelay: '0.1s'}}>Next-Generation Career Intelligence</div>
          <h1 className="hero-title fade-slide-up" style={{animationDelay: '0.2s', fontSize: '6rem'}}>
            Master Your <br/><span className="text-shimmer">Placement</span> Journey
          </h1>
          <p className="hero-subtitle fade-slide-up" style={{animationDelay: '0.3s', maxWidth: '700px', margin: '0 auto 4rem'}}>
            Solox combines deep learning analytics with real-world verification to predict your placement probability and build your personalized roadmap to success.
          </p>
          <div className="fade-slide-up" style={{animationDelay: '0.4s', display: 'flex', gap: '1.5rem', justifyContent: 'center'}}>
            <Link to="/dashboard" className="submit-btn start-now-btn" style={{padding: '1.2rem 3.5rem', fontSize: '1.2rem'}}>
              Launch Dashboard →
            </Link>
            <Link to="/analyzer" className="nav-link" style={{display: 'flex', alignItems: 'center', fontWeight: '800', border: '1px solid var(--border-color)', borderRadius: '999px', padding: '0 2rem', background: 'rgba(255,255,255,0.02)'}}>
              Try Resume Analyzer
            </Link>
          </div>
        </div>
      </div>

      <section className="features-section fade-in" style={{animationDelay: '0.6s', marginTop: '4rem'}}>
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Deep Intelligence</h3>
            <p>Our Deep Learning MLP architecture analyzes 50+ non-linear parameters to predict placement outcomes with 96% accuracy.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Work Verification</h3>
            <p>Direct GitHub API integration verifies the authenticity of your projects, commits, and technical consistency.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Strategic Roadmap</h3>
            <p>Get a personalized 6-month preparation plan based on your current skill gaps and target compensation.</p>
          </div>
        </div>
      </section>

      <section className="stats-strip mt-5 pt-5 fade-in" style={{textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingBottom: '5rem'}}>
         <div style={{display: 'flex', justifyContent: 'center', gap: '5rem', opacity: '0.8'}}>
            <div>
               <h4 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white'}}>96.2%</h4>
               <p className="text-muted">Prediction Precision</p>
            </div>
            <div>
               <h4 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white'}}>7.5k+</h4>
               <p className="text-muted">Career Profiles Analyzed</p>
            </div>
            <div>
               <h4 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white'}}>4.8m</h4>
               <p className="text-muted">Avg. Success Duration</p>
            </div>
         </div>
      </section>
    </div>
  );
}

