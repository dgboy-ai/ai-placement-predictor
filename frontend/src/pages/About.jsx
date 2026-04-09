export default function About() {
  return (
    <div className="page-container fade-in">
      <div className="about-section card">
        <h1>About AI Placement Copilot</h1>
        <p className="about-desc">
          This platform utilizes advanced machine learning models to analyze student profiles across diverse parameters and provide precise placement probabilities. It is built to bridge the gap between academic preparation and industry readiness.
        </p>
        
        <h2 className="section-heading fade-slide-up" style={{animationDelay: '0.2s'}}>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card pop-in" style={{animationDelay: '0.3s'}}>
            <div className="feature-icon">🎯</div>
            <h3>Placement Prediction</h3>
            <p>Get a robust probability score based on academic, skills, and extracurricular metrics to assess your current standing.</p>
          </div>
          <div className="feature-card pop-in" style={{animationDelay: '0.4s'}}>
            <div className="feature-icon">🧠</div>
            <h3>Model Explanation</h3>
            <p>Understand the exact factors influencing your score. AI explains why you received your prediction.</p>
          </div>
          <div className="feature-card pop-in" style={{animationDelay: '0.5s'}}>
            <div className="feature-icon">📈</div>
            <h3>Personalized Roadmap</h3>
            <p>Receive a highly structured, 6-month actionable plan with monthly focus tasks, KPIs, and checkpoints.</p>
          </div>
          <div className="feature-card pop-in" style={{animationDelay: '0.6s'}}>
            <div className="feature-icon">📄</div>
            <h3>Resume Intelligence Engine</h3>
            <p>Upload your PDF resume to receive an ATS score, deep skill-gap analysis, and actionable formatting suggestions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
