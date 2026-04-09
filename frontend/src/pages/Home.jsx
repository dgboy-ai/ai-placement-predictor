import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-container fade-in" style={{ position: 'relative' }}>
      
      {/* Decorative Advanced Background Elements */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="glass-panel-bg panel-1"></div>
      <div className="glass-panel-bg panel-2"></div>

      <div className="hero-section">
        <div className="hero-content pulse-glow">
          <div className="header-badge fade-slide-up" style={{animationDelay: '0.1s'}}>Next-Gen Career Analytics</div>
          <h1 className="hero-title fade-slide-up" style={{animationDelay: '0.2s'}}>
            AI Placement <br/><span className="text-gradient hover-shimmer">Copilot</span>
          </h1>
          <p className="hero-subtitle fade-slide-up" style={{animationDelay: '0.3s'}}>
            Predict, Understand, and Improve your placement chances with actionable machine learning analysis and a structured 6-month roadmap.
          </p>
          <div className="fade-slide-up" style={{animationDelay: '0.4s'}}>
            <Link to="/dashboard" className="submit-btn start-now-btn">
              Start Now 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
