import React from 'react';

export default function About() {
  return (
    <div className="page-container fade-in">
       <div className="hero-section" style={{padding: '5rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Nextora Intelligence Hub 🏛️</span>
          <h1 className="hero-title" style={{fontSize: '4.5rem', fontFamily: 'var(--font-heading)'}}>About <span className="text-gradient">Nextora AI</span></h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto'}}>
             A comprehensive breakdown of how we empower students to navigate the complex landscape of professional placements.
          </p>
        </div>
      </div>

      <div className="results-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '4rem'}}>
        
        {/* Section 1: Why this project exists */}
        <section className="card frosted-card" style={{padding: '4rem'}}>
          <div className="grid-2-cols" style={{alignItems: 'center', gap: '4rem'}}>
             <div>
                <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>Why we <span className="text-gradient">Exist</span></h2>
                <p style={{fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.8'}}>
                  Navigating the placement season is one of the most stressful phases of a student's life. Conventional advice is often generic, biased, or outdated. 
                  Nextora AI was created to provide a <strong>data-driven, objective, and supportive</strong> partner for every student, regardless of their background. 
                  We believe that with the right data and a clear plan, every student can reach their full potential.
                </p>
             </div>
             <div style={{fontSize: '8rem', textAlign: 'center'}}>🌟</div>
          </div>
        </section>

        {/* Section 2: How it helps */}
        <section className="card frosted-card" style={{padding: '4rem'}}>
          <div className="grid-2-cols" style={{alignItems: 'center', gap: '4rem'}}>
             <div style={{fontSize: '8rem', textAlign: 'center'}}>🛡️</div>
             <div>
                <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>How it <span className="text-gradient">Helps</span></h2>
                <p style={{fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.8'}}>
                  We bridge the gap between "where you are" and "where you want to be." By analyzing your current academic standing and technical work, we:
                </p>
                <ul style={{marginTop: '1.5rem', fontSize: '1rem', color: '#cbd5e1', lineHeight: '2'}}>
                   <li>Provide a realistic probability of your recruitment outcomes.</li>
                   <li>Identify specific skill gaps that recruiters care about.</li>
                   <li>Verify your technical projects so your profile has authentic proof.</li>
                   <li>Build a manageable 6-month preparation plan.</li>
                </ul>
             </div>
          </div>
        </section>

        {/* Section 3: What it uses */}
        <section className="card frosted-card" style={{padding: '4rem'}}>
           <h2 style={{fontSize: '2.5rem', marginBottom: '3rem', fontFamily: 'var(--font-heading)', textAlign: 'center'}}>Our <span className="text-gradient">Technical Arsenal</span></h2>
           <div className="features-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem'}}>
              <div className="card" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                 <h4 style={{color: 'var(--primary)', marginBottom: '1rem'}}>AI & ML</h4>
                 <p style={{fontSize: '0.85rem', color: '#64748b'}}>Multi-Layer Perceptron (MLP) Neural Networks and Scikit-learn for non-linear outcome prediction.</p>
              </div>
              <div className="card" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                 <h4 style={{color: 'var(--accent)', marginBottom: '1rem'}}>Intelligence APIs</h4>
                 <p style={{fontSize: '0.85rem', color: '#64748b'}}>Custom NLP parsers for Resume screening and GitHub Graph API for project verification.</p>
              </div>
              <div className="card" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                 <h4 style={{color: 'var(--success)', marginBottom: '1rem'}}>Modern Web Stack</h4>
                 <p style={{fontSize: '0.85rem', color: '#64748b'}}>React 18 for high-fidelity UI, FastAPI for performance-critical backend, and PostgreSQL for secure data storage.</p>
              </div>
           </div>
        </section>

        {/* Section 4: How it works */}
        <section className="card frosted-card" style={{padding: '4rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)'}}>
           <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>The <span className="text-gradient">Process</span></h2>
           <p style={{maxWidth: '700px', margin: '0 auto 4rem', color: '#94a3b8'}}>Four simple steps to professional clarity.</p>
           
           <div className="grid-4-cols" style={{gap: '2rem'}}>
              <div>
                 <div style={{fontSize: '2rem', marginBottom: '1rem'}}>1️⃣</div>
                 <h4>Data Intake</h4>
                 <p style={{fontSize: '0.8rem', color: '#64748b'}}>You provide your academic and technical details.</p>
              </div>
              <div>
                 <div style={{fontSize: '2rem', marginBottom: '1rem'}}>2️⃣</div>
                 <h4>Neural Analysis</h4>
                 <p style={{fontSize: '0.8rem', color: '#64748b'}}>Our ML model compares your data against 7,500+ successful paths.</p>
              </div>
              <div>
                 <div style={{fontSize: '2rem', marginBottom: '1rem'}}>3️⃣</div>
                 <h4>Smart Verification</h4>
                 <p style={{fontSize: '0.8rem', color: '#64748b'}}>We analyze your Resume and GitHub for industry alignment.</p>
              </div>
              <div>
                 <div style={{fontSize: '2rem', marginBottom: '1rem'}}>4️⃣</div>
                 <h4>Actionable Path</h4>
                 <p style={{fontSize: '0.8rem', color: '#64748b'}}>You receive a score, an explanation, and a 6-month roadmap.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
