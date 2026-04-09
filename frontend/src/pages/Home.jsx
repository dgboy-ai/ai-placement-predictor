import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const userName = localStorage.getItem('userName') || 'Student';

  return (
    <div className="page-container fade-in" style={{ position: 'relative' }}>
      
      {/* Decorative Soft Background Orbs */}
      <div className="orb orb-1" style={{opacity: 0.15}}></div>
      <div className="orb orb-2" style={{opacity: 0.15}}></div>

      <div className="hero-section" style={{minHeight: '80vh', paddingBottom: '2rem'}}>
        <div className="hero-content pulse-glow">
          <div className="header-badge fade-slide-up" style={{animationDelay: '0.1s', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)'}}>
             Welcome to Nextora AI 🏠
          </div>
          <h1 className="hero-title fade-slide-up" style={{animationDelay: '0.2s', fontSize: '5rem', letterSpacing: '-0.02em'}}>
            Your Partner in <br/><span className="text-gradient">Career Success</span>
          </h1>
          <p className="hero-subtitle fade-slide-up" style={{animationDelay: '0.3s', maxWidth: '800px', margin: '0 auto 4rem', opacity: 0.7, fontSize: '1.2rem'}}>
            Hello, {userName}! We're here to help you navigate your placement journey with simple tools, honest feedback, and a clear path forward.
          </p>
          <div className="fade-slide-up" style={{animationDelay: '0.4s', display: 'flex', gap: '1.5rem', justifyContent: 'center'}}>
            <Link to="/predictor" className="submit-btn" style={{padding: '1.2rem 3rem', fontSize: '1.1rem', background: 'var(--primary)', textDecoration: 'none', borderRadius: '12px'}}>
               Start Prediction
            </Link>
            <Link to="/about" className="nav-link" style={{display: 'flex', alignItems: 'center', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 2.5rem', background: 'rgba(255,255,255,0.02)'}}>
               How we help
            </Link>
          </div>
        </div>
      </div>

      {/* Trust-Building Services Section */}
      <section className="features-section fade-in" style={{animationDelay: '0.6s', padding: '4rem 0'}}>
        <div style={{textAlign: 'center', marginBottom: '5rem'}}>
           <h2 style={{fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem'}}>How Nextora <span className="text-gradient">Supports You</span></h2>
           <p style={{color: '#64748b', maxWidth: '600px', margin: '0 auto'}}>We've built simple, powerful tools to help you understand where you stand and how to reach your goals.</p>
        </div>
        
        <div className="grid-3-cols">
          <div className="card frosted-card feature-card" style={{padding: '3rem', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>🎯</div>
            <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Helpful Predictions</h3>
            <p style={{fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6'}}>Submit your academic details to get a friendly estimate of your placement chances, based on successful alumni paths.</p>
          </div>
          
          <div className="card frosted-card feature-card" style={{padding: '3rem', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>📝</div>
            <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Resume Guidance</h3>
            <p style={{fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6'}}>Share your resume for an honest review. We'll show you exactly how to make it more appealing to your dream employers.</p>
          </div>
          
          <div className="card frosted-card feature-card" style={{padding: '3rem', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>🔗</div>
            <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Work Verification</h3>
            <p style={{fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6'}}>Connect your GitHub coding projects to build a profile that recruiters can trust with authentic proof of your work.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{padding: '8rem 0', textAlign: 'center'}}>
         <div className="card frosted-card" style={{padding: '5rem', background: 'rgba(255,255,255,0.01)'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)'}}>Designed with <span className="text-gradient">Students in Mind</span></h2>
            <p style={{maxWidth: '700px', margin: '0 auto 4rem', color: '#94a3b8', lineHeight: '1.8'}}>
              Nextora is more than just an AI—it's a home for your career ambitions. We prioritize clear, supportive feedback over complex jargon to ensure you feel confident every step of the way.
            </p>
            <div className="grid-3-cols" style={{opacity: 0.8}}>
               <div>
                  <h4 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white'}}>Reliable</h4>
                  <p style={{color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '0.5rem'}}>Verified Insights</p>
               </div>
               <div>
                  <h4 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white'}}>Simple</h4>
                  <p style={{color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '0.5rem'}}>Easy Navigation</p>
               </div>
               <div>
                  <h4 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white'}}>Friendly</h4>
                  <p style={{color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '0.5rem'}}>Supportive Tone</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
