import { useState } from 'react';
import axios from 'axios';

export default function GithubVerification() {
  const [githubUrl, setGithubUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!githubUrl) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-github', {
        github_link: githubUrl
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Failed to analyze GitHub profile. Rate limits may apply for unauthenticated requests.');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationColor = (status) => {
    if (status?.includes('Expert')) return 'text-success';
    if (status?.includes('Authentic')) return 'text-accent';
    return 'text-warning';
  };

  return (
    <div className="page-container fade-in">
      <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Work Verification</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>GitHub <span className="text-gradient">Authenticity</span> Screening</h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            Validate technical consistency, verify original projects, and calculate your industry readiness score using our deep GitHub analysis engine.
          </p>
        </div>
      </div>

      <div className="dashboard-grid" style={{gridTemplateColumns: '1fr 2fr'}}>
        <section className="verification-input">
          <div className="card">
            <h3>Profile Screening</h3>
            <p className="text-muted mb-4">Enter your GitHub profile URL or username to begin verification.</p>
            
            <form onSubmit={handleAnalyze} className="input-form">
              <div className="form-group mb-5">
                <label>GitHub Profile Link</label>
                <input 
                  type="text" 
                  placeholder="https://github.com/username" 
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="styled-input"
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><span className="spinner"></span> Analyzing...</> : 'Start Screening'}
              </button>
            </form>

            <div className="no-github-card mt-5 pt-4 border-top">
              <h4 className="mb-2" style={{color: 'white'}}>Don't have a GitHub?</h4>
              <p className="text-muted mb-4" style={{fontSize: '0.9rem'}}>GitHub is essential for modern career verification. It serves as your living portfolio.</p>
              <a 
                href="https://github.com/join" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link" 
                style={{display: 'inline-block', color: 'var(--accent)', padding: 0}}
              >
                Create Account Now →
              </a>
            </div>
            
            {error && <div className="error-message mt-4">{error}</div>}
          </div>
        </section>

        <section className="verification-results">
          {!result && !loading && (
            <div className="card placeholder-result" style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div className="placeholder-icon">📊</div>
              <h3>Awaiting Analysis</h3>
              <p>Submit a profile to see deep metrics including commit history, fork analysis, and original work verification.</p>
            </div>
          )}

          {loading && (
            <div className="card placeholder-result loading-result" style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <span className="spinner large-spinner"></span>
              <h3>Scanning Repositories...</h3>
              <p>We are analyzing commit density, filtering forks, and calculating your authenticity score.</p>
            </div>
          )}

          {result && (
            <div className="results-stack fade-in">
              <div className="card overview-card mb-4" style={{gap: '3rem', position: 'relative'}}>
                <div className="probability-wrapper" style={{width: '200px', height: '200px'}}>
                  <div className={`probability-circle ${result.github_score > 75 ? 'risk-low' : result.github_score > 40 ? 'risk-medium' : 'risk-high'}`}></div>
                  <div className="probability-value" style={{fontSize: '4rem'}}>{Math.round(result.github_score)}<span>%</span></div>
                </div>
                
                <div className="overview-details">
                  <div className="persona-badge" style={{background: 'var(--accent)', color: 'white', padding: '0.2rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '900', display: 'inline-block', marginBottom: '1rem', textTransform: 'uppercase'}}>
                    Persona: {result.persona}
                  </div>
                  <div className="verification-badge-large">
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800'}}>Integrity Status</span>
                    <h2 className={result.is_authentic ? 'text-success' : 'text-danger'} style={{fontSize: '2.5rem', margin: '0.5rem 0'}}>{result.verification_status}</h2>
                  </div>
                  <div className="badges">
                    <span className="badge risk risk-low">Coding Velocity: {result.velocity} / mo</span>
                    <span className={`badge ${result.is_authentic ? 'risk-low' : 'risk-high'}`}>
                      {result.is_authentic ? 'Verified Authentic' : 'Authenticity Risk'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                 <div className="details-stack" style={{gap: '1.5rem'}}>
                    <div className="card stats-card" style={{padding: '2rem'}}>
                      <h3 className="section-title">Telemetry</h3>
                      <div className="stats-list" style={{marginTop: '1.5rem'}}>
                        <div className="stat-item" style={{display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                          <span className="text-muted">Total Commits</span>
                          <strong style={{color: 'white'}}>{result.stats.commits}</strong>
                        </div>
                        <div className="stat-item" style={{display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                          <span className="text-muted">Original Repos</span>
                          <strong style={{color: 'white'}}>{result.stats.originals}</strong>
                        </div>
                        <div className="stat-item" style={{display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                          <span className="text-muted">Stars Earned</span>
                          <strong style={{color: 'white'}}>{result.stats.stars}</strong>
                        </div>
                        <div className="stat-item" style={{display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0'}}>
                          <span className="text-muted">Monthly Avg</span>
                          <strong style={{color: 'var(--accent)'}}>{result.stats.velocity_per_month}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="card tech-card" style={{padding: '2rem'}}>
                      <h3 className="section-title" style={{color: 'var(--accent-secondary)'}}>Stack Dominance</h3>
                      <div className="tech-stack-list" style={{marginTop: '1.5rem'}}>
                        {result.technical_stack.map(([lang, count], idx) => (
                          <div key={idx} className="tech-item" style={{marginBottom: '1rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem'}}>
                               <span style={{fontWeight: '700'}}>{lang}</span>
                            </div>
                            <div className="skill-bar-bg" style={{height: '4px', background: 'rgba(255,255,255,0.05)'}}>
                              <div 
                                style={{width: `${(count / Math.max(...result.technical_stack.map(s => s[1]))) * 100}%`, background: 'var(--accent-secondary)', height: '100%'}}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="details-stack" style={{gap: '1.5rem'}}>
                    <div className="card strengths-card">
                       <h4 style={{color: 'var(--success)', marginBottom: '1rem'}}>Core Strengths</h4>
                       <ul className="bullet-list">
                          {result.strengths.map((s, idx) => (
                             <li key={idx} style={{fontSize: '0.85rem', padding: '0.6rem 0.8rem 0.6rem 2.2rem'}}>{s}</li>
                          ))}
                       </ul>
                    </div>

                    <div className="card weaknesses-card">
                       <h4 style={{color: 'var(--warning)', marginBottom: '1rem'}}>Observation Nodes</h4>
                       <ul className="bullet-list">
                          {result.weaknesses.map((w, idx) => (
                             <li key={idx} style={{fontSize: '0.85rem', padding: '0.6rem 0.8rem 0.6rem 2.2rem'}}>{w}</li>
                          ))}
                       </ul>
                    </div>

                    <div className="card screening-card" style={{background: 'rgba(255,255,255,0.01)'}}>
                       <h4 style={{marginBottom: '1rem'}}>Verification Verdict</h4>
                       <div className="insights-list">
                          {result.screening_insights.map((insight, idx) => (
                            <div key={idx} style={{padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '0.6rem', fontSize: '0.9rem', color: insight.includes('Warning') ? 'var(--warning)' : 'var(--text-muted)'}}>
                               {insight}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}


        </section>
      </div>
    </div>
  );
}
