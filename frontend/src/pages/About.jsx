export default function About() {
  return (
    <div className="page-container fade-in">
      <section className="about-section pt-5">
        <span className="header-badge">The Mission</span>
        <h1 className="hero-title" style={{fontSize: '4rem', textAlign: 'left', marginBottom: '2rem'}}>Next-Gen Career <span className="text-gradient">Intelligence</span></h1>
        <p className="about-desc">
          Solox is an advanced AI-driven Career intelligence engine designed to bridge the gap between academic education and industry expectations. 
          By combining historical placement data with real-time profile verification, we provide students with the most accurate career predictions in the ecosystem.
        </p>

        <h2 className="section-title mb-5">Core Capabilities</h2>
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Probability Defense</h3>
            <p>Our ensemble models analyze 12+ critical factors to determine your placement risk and probability with deterministic accuracy.</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon">📄</div>
            <h3>Vector Analysis</h3>
            <p>High-precision NLP parsing of resumes to identify technical identifiers, soft skills, and experience weights.</p>
          </div>
          
          <div className="card feature-card" style={{gridColumn: 'span 1'}}>
            <div className="feature-icon">🛡️</div>
            <h3>Auth Screening</h3>
            <p>Automated GitHub verification layer ensures your technical contributions are valid, consistent, and original.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Roadmap Engine</h3>
            <p>Dynamically generated 6-month growth plans that adapt to your specific skill deficiencies and career goals.</p>
          </div>
        </div>

        <div className="card mt-5" style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1))', border: '1px solid var(--border-color)', textAlign: 'center'}}>
           <h3 style={{fontSize: '2rem', marginBottom: '1.5rem'}}>Built for the Future</h3>
           <p className="text-muted" style={{maxWidth: '700px', margin: '0 auto'}}>
              Solox is built using state-of-the-art technologies including FastAPI, React, and Scikit-Learn. 
              Our goal is to democratize career intelligence and empower every student with data-driven decision making capabilities.
           </p>
        </div>
      </section>
    </div>
  );
}
