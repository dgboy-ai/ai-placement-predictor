import React, { useState } from 'react';
import axios from 'axios';

export default function GithubVerification() {
  const [githubUrl, setGithubUrl] = useState('');
  const [jobField, setJobField] = useState('Full Stack Development');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jobFields = [
    "Full Stack Development",
    "Data Science & AI",
    "DevOps & Cloud",
    "Backend Engineering",
    "Frontend Engineering"
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!githubUrl) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-github', {
        github_link: githubUrl,
        job_field: jobField
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Analysis timed out. Github API limits might be active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Proof of Work Verification</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>GitHub <span className="text-gradient">Integrity</span> Screen</h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem'}}>
            Beyond green squares. We analyze coding velocity, authorship integrity, and domain-specific portfolio depth.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-form">
          <div className="card shadow-glass">
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
               <span style={{fontSize: '2rem'}}>🔗</span> Target Profile
            </h2>
            
            <form onSubmit={handleAnalyze} className="input-form">
              <div className="form-group mb-4">
                <label>GitHub Profile Link</label>
                <input 
                  type="text" 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="styled-input"
                  required
                />
              </div>

              <div className="form-group mb-5">
                   <label>Evaluation Domain</label>
                   <select 
                     value={jobField} 
                     onChange={(e) => setJobField(e.target.value)}
                     className="styled-input"
                     style={{cursor: 'pointer'}}
                   >
                     {jobFields.map(field => (
                       <option key={field} value={field}>{field}</option>
                     ))}
                   </select>
                </div>

              <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.5rem'}}>
                {loading ? <><span className="spinner"></span> De-forking Repos...</> : 'Execute Deep Screening'}
              </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}

            <div className="no-github-card mt-5 pt-4 border-top">
              <h4 className="mb-2" style={{color: 'white'}}>No Portfolio yet?</h4>
              <p className="text-muted mb-4" style={{fontSize: '0.85rem'}}>GitHub serves as your living technical resume. Without it, verifying your skills becomes significantly harder.</p>
              <a href="https://github.com/join" target="_blank" rel="noopener noreferrer" className="nav-link" style={{color: 'var(--accent)', padding: 0}}>Create Account Now →</a>
            </div>
          </div>
        </section>

        <section className="dashboard-results">
          {loading && (
             <div className="placeholder-result loading-result card" style={{height: '100%'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent-secondary)'}}></span>
               <h3>Syncing Global Commits...</h3>
               <p>Calculating velocity vectors for target profile...</p>
             </div>
          )}

          {!result && !loading && (
             <div className="placeholder-result card" style={{height: '100%', borderStyle: 'solid'}}>
                <div className="placeholder-icon">🛡️</div>
                <h3>Deterministic Verification</h3>
                <p>Provide a GitHub link to verify coding activity and authorship heuristics.</p>
             </div>
          )}

          {result && (
            <div className="results-section pop-in">
              <div className="card overview-card mb-4" style={{ display: 'flex', alignItems: 'center', gap: '3rem', borderLeft: '8px solid var(--accent)' }}>
                <div className="probability-wrapper">
                  <div className={`probability-circle ${result.github_score >= 80 ? 'risk-low' : 'risk-medium'}`}></div>
                  <div className="probability-value" style={{fontSize: '3.5rem'}}>{result.github_score}<span>pt</span></div>
                </div>
                <div>
                  <h3 className="prediction-status" style={{fontSize: '1.8rem'}}>{result.persona}</h3>
                  <div className="badges">
                     <span className={`badge ${result.is_authentic ? 'risk-low' : 'risk-high'}`}>
                       {result.is_authentic ? 'Authentic' : 'Low Integrity'}
                     </span>
                     <span className="badge">Velocity: {result.velocity} / mo</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                 <div className="card" style={{padding: '1.5rem'}}>
                    <h3 className="section-title" style={{fontSize: '1rem'}}>Observation Nodes</h3>
                    <ul className="bullet-list" style={{marginTop: '1rem'}}>
                      {result.screening_insights.map((ins, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', padding: '0.5rem 0 0.5rem 1.5rem'}}>{ins}</li>
                      ))}
                    </ul>
                 </div>
                 
                 <div className="card" style={{padding: '1.5rem'}}>
                   <h3 className="section-title" style={{fontSize: '1rem'}}>Stack Dominance</h3>
                   <div style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                     {result.technical_stack.map(([lang, count], idx) => (
                       <span key={idx} className="badge" style={{background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem'}}>{lang}: {count}</span>
                     ))}
                   </div>
                 </div>
              </div>

              <div className="card mb-4" style={{background: 'rgba(129, 140, 248, 0.05)', border: '1px solid rgba(129, 140, 248, 0.2)'}}>
                <h3 className="section-title" style={{color: 'var(--accent)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                   <span>💡</span> Recommended High-Impact Projects
                </h3>
                <div className="grid-2-cols" style={{gap: '1rem'}}>
                  {result.recommended_projects.map((proj, idx) => (
                    <div key={idx} className="card" style={{padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s'}}>
                      <div style={{fontSize: '0.9rem', fontWeight: 'bold', color: 'white'}}>{proj}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem'}}>Critical infrastructure for {result.job_field} validation.</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="card" style={{borderLeft: '4px solid var(--danger)'}}>
                   <h4 style={{color: 'var(--danger)', fontSize: '1rem', borderBottom: '1px solid rgba(239, 68, 68, 0.1)', paddingBottom: '0.8rem'}}>Domain Gaps</h4>
                   <ul className="bullet-list mt-3">
                     {result.weak_points.map((pt, idx) => (
                       <li key={idx} style={{fontSize: '0.85rem', padding: '0.4rem 0.4rem 0.4rem 1.5rem'}}>{pt}</li>
                     ))}
                   </ul>
                </div>
                <div className="card" style={{borderLeft: '4px solid var(--accent-secondary)'}}>
                   <h4 style={{color: 'var(--accent-secondary)', fontSize: '1rem', borderBottom: '1px solid rgba(168, 85, 247, 0.1)', paddingBottom: '0.8rem'}}>Execution Strategy</h4>
                   <ul className="bullet-list mt-3">
                     {result.improvements.map((im, idx) => (
                       <li key={idx} style={{fontSize: '0.85rem', padding: '0.4rem 0.4rem 0.4rem 1.5rem'}}>{im}</li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
