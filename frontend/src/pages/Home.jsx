import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-container fade-in">
      <div className="hero-section">
        <div className="hero-content">
          <div className="header-badge fade-slide-up" style={{animationDelay: '0.1s'}}>Next-Gen Career Analytics</div>
          <h1 className="hero-title fade-slide-up" style={{animationDelay: '0.2s'}}>
            AI Placement <br/><span className="text-gradient">Copilot</span>
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
