import React, { useState } from 'react';
import axios from 'axios';

export default function GithubVerification() {
  const [githubUrl, setGithubUrl] = useState('');
  const [jobField, setJobField] = useState('Full Stack Development');
  const [customField, setCustomField] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jobFields = [
    "Full Stack Development",
    "Data Science & AI",
    "DevOps & Cloud",
    "Backend Engineering",
    "Frontend Engineering",
    "Software Testing",
    "Mobile App Development",
    "Cybersecurity"
  ];

  const handleFieldChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setShowCustom(true);
      setJobField('');
    } else {
      setShowCustom(false);
      setJobField(val);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const finalField = showCustom ? customField : jobField;

    if (!githubUrl) return;
    if (!finalField) {
      setError('Please select or type a job field.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-github', {
        github_link: githubUrl,
        job_field: finalField
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Analysis failed. Make sure your profile is public.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Coding Activity</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>Check Your <span className="text-gradient">GitHub</span></h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            We scan your profile to see if you're actually coding what companies need. No more faking green squares.
          </p>
        </div>
      </div>

      <div className="dashboard-grid mb-5">
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
                  <label>What job are you aiming for?</label>
                  <select 
                    onChange={handleFieldChange}
                    className="styled-select"
                    style={{marginBottom: showCustom ? '1rem' : '0'}}
                  >
                    {jobFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                    <option value="Other">Other / Custom</option>
                  </select>
                  
                  {showCustom && (
                    <input 
                      type="text" 
                      placeholder="Type your job title here..." 
                      className="styled-input fade-in"
                      value={customField}
                      onChange={(e) => setCustomField(e.target.value)}
                      style={{marginTop: '0.5rem'}}
                    />
                  )}
                </div>

              <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.2rem'}}>
                {loading ? <><span className="spinner"></span> Working...</> : 'Scan My Profile'}
              </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}

            <div className="no-github-card mt-5 pt-4 border-top">
              <h4 className="mb-2" style={{color: 'white'}}>No Portfolio yet?</h4>
              <p className="text-muted mb-4" style={{fontSize: '0.85rem'}}>GitHub is the standard for tech jobs. If you don't have one, start building projects today.</p>
              <a href="https://github.com/join" target="_blank" rel="noopener noreferrer" className="nav-link" style={{color: 'var(--accent)', padding: 0}}>Create Account Now →</a>
            </div>
          </div>
        </section>

        <section className="industry-context" style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--accent)', background: 'rgba(129, 140, 248, 0.05)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent)'}}>🛠️ Show Your Work</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Recruiters love to see real code. We check your repositories to find the original projects you built from scratch.
            </p>
          </div>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--accent-secondary)', animationDelay: '0.1s', background: 'rgba(168, 85, 247, 0.05)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)'}}>⚡ Consistency exists</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Coding once a month isn't enough. We calculate how often you commit code to see if you have the "Developer Momentum" companies want.
            </p>
          </div>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--success)', animationDelay: '0.2s', background: 'rgba(16, 185, 129, 0.05)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--success)'}}>📂 Beyond Forks</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Anyone can fork a project. We separate your original code from copied ones to find your true technical ability.
            </p>
          </div>
        </section>
      </div>

      <div className="results-container">
          {loading && (
             <div className="placeholder-result loading-result card" style={{height: '300px'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent-secondary)'}}></span>
               <h3>Reading GitHub...</h3>
               <p>Calculating your coding velocity and checking repositories...</p>
             </div>
          )}

          {!result && !loading && (
             <div className="placeholder-result card" style={{height: '300px', borderStyle: 'solid'}}>
                <div className="placeholder-icon">🛡️</div>
                <h3>Result will appear here</h3>
                <p>Enter your GitHub link and target job to see your developer score.</p>
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
                  <div className="badges mt-2">
                     <span className={`badge ${result.is_authentic ? 'risk-low' : 'risk-high'}`}>
                       {result.is_authentic ? 'Authentic Work' : 'Low Activity'}
                     </span>
                     <span className="badge">Code Velocity: {result.velocity} commits/mo</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                 <div className="card" style={{padding: '1.5rem'}}>
                    <h3 className="section-title" style={{fontSize: '1rem'}}>Key Insights</h3>
                    <ul className="bullet-list" style={{marginTop: '1rem'}}>
                      {result.screening_insights.map((ins, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', padding: '0.4rem 0 0.4rem 1.5rem'}}>{ins}</li>
                      ))}
                    </ul>
                 </div>
                 
                 <div className="card" style={{padding: '1.5rem'}}>
                   <h3 className="section-title" style={{fontSize: '1rem'}}>Top Languages</h3>
                   <div style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                     {result.technical_stack.map(([lang, count], idx) => (
                       <span key={idx} className="badge" style={{background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.1)'}}>{lang}: {count}</span>
                     ))}
                   </div>
                 </div>
              </div>

              <div className="card mb-4" style={{background: 'rgba(129, 140, 248, 0.05)', border: '1px solid rgba(129, 140, 248, 0.2)'}}>
                <h3 className="section-title" style={{color: 'var(--accent)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                   <span>💡</span> Projects you should build
                </h3>
                <div className="grid-2-cols" style={{gap: '1rem'}}>
                  {result.recommended_projects.map((proj, idx) => (
                    <div key={idx} className="card" style={{padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s'}}>
                      <div style={{fontSize: '0.9rem', fontWeight: 'bold', color: 'white'}}>{proj}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem'}}>Great for showing progress in {showCustom ? customField : jobField}.</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="card" style={{borderLeft: '4px solid var(--danger)'}}>
                   <h4 style={{color: 'var(--danger)', fontSize: '1rem', borderBottom: '1px solid rgba(239, 68, 68, 0.1)', paddingBottom: '0.8rem'}}>Coding Gaps</h4>
                   <ul className="bullet-list mt-3">
                     {result.weak_points.map((pt, idx) => (
                       <li key={idx} style={{fontSize: '0.85rem', padding: '0.4rem 0.4rem 0.4rem 1.5rem'}}>{pt}</li>
                     ))}
                   </ul>
                </div>
                <div className="card" style={{borderLeft: '4px solid var(--accent-secondary)'}}>
                   <h4 style={{color: 'var(--accent-secondary)', fontSize: '1rem', borderBottom: '1px solid rgba(168, 85, 247, 0.1)', paddingBottom: '0.8rem'}}>How to Improve</h4>
                   <ul className="bullet-list mt-3">
                     {result.improvements.map((im, idx) => (
                       <li key={idx} style={{fontSize: '0.85rem', padding: '0.4rem 0.4rem 0.4rem 1.5rem'}}>{im}</li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
