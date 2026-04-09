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
              <div className="placeholder-icon">🔍</div>
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
              <div className="card overview-card mb-4" style={{gap: '2rem'}}>
                <div className="probability-wrapper" style={{width: '160px', height: '160px'}}>
                  <div className={`probability-circle ${result.github_score > 70 ? 'risk-low' : result.github_score > 40 ? 'risk-medium' : 'risk-high'}`}></div>
                  <div className="probability-value" style={{fontSize: '3.5rem'}}>{Math.round(result.github_score)}</div>
                </div>
                <div className="overview-details">
                  <div className="verification-badge-large">
                    <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800'}}>Verification Status</span>
                    <h2 className={getVerificationColor(result.verification_status)} style={{fontSize: '2.5rem', margin: '0.5rem 0'}}>{result.verification_status}</h2>
                  </div>
                  <div className="badges">
                    <span className="badge risk risk-low">{result.activity_level} Activity</span>
                    <span className={`badge ${result.is_authentic ? 'risk-low' : 'risk-high'}`}>
                      {result.is_authentic ? 'Authentic Work' : 'Low Authenticity'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                <div className="card stats-card" style={{flex: 1, padding: '1.5rem'}}>
                  <h4 style={{color: 'var(--accent)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.9rem'}}>Developer Stats</h4>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span>Total Commits</span>
                      <strong>{result.stats.total_commits}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Original Projects</span>
                      <strong>{result.stats.original_projects}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Forked Projects</span>
                      <strong>{result.stats.forked_projects}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Global Stars</span>
                      <strong>{result.stats.total_stars}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="card tech-card" style={{flex: 1, padding: '1.5rem'}}>
                  <h4 style={{color: 'var(--accent-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.9rem'}}>Top Technologies</h4>
                  <div className="tech-stack-list">
                    {result.technical_stack.map(([lang, count], idx) => (
                      <div key={idx} className="tech-item">
                        <span className="lang-name">{lang}</span>
                        <div className="skill-bar-bg">
                          <div 
                            className="skill-bar-fill" 
                            style={{width: `${Math.min(count * 20, 100)}%`, background: 'var(--accent-secondary)'}}
                          ></div>
                        </div>
                        <span className="lang-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card insights-card">
                <h3>Screening Insights</h3>
                <ul className="bullet-list">
                  {result.screening_insights.map((insight, idx) => (
                    <li key={idx} className={insight.toLowerCase().includes('warning') ? 'insight-warning' : ''}>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
