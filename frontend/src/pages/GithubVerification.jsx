import { useState } from 'react';
import axios from 'axios';

export default function GithubVerification() {
  const [githubLink, setGithubLink] = useState('');
  const [fieldSelection, setFieldSelection] = useState('General Software Engineering');
  const [customField, setCustomField] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!githubLink) {
      setError('Please provide a GitHub profile link.');
      return;
    }
    
    const finalField = fieldSelection === 'Other' ? customField : fieldSelection;
    if (!finalField) {
      setError('Please provide a target job field.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-github', {
        github_link: githubLink,
        job_field: finalField
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Connection Error: Failed to check your GitHub profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Project Hub 💻</span>
          <h1 className="hero-title" style={{fontSize: '4rem', fontFamily: 'var(--font-heading)'}}>GitHub <span className="text-gradient">Review</span></h1>
          <p className="hero-subtitle" style={{fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto'}}>
             Connect your GitHub to see how your projects and code activity match your career goals.
          </p>
        </div>
      </div>

      <div className="dashboard-grid" style={{alignItems: 'flex-start', gap: '3rem'}}>
        <aside className="dashboard-sidebar" style={{position: 'sticky', top: '2rem', width: '380px', flexShrink: 0}}>
          <div className="card shadow-glass frosted-card">
            <h2 style={{fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--font-heading)'}}>
               Profile Check 🚀
            </h2>
            <form onSubmit={handleAnalyze} className="input-form">
              <div className="form-group mb-4">
                <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase'}}>GitHub Profile Link</label>
                <input 
                  type="url" 
                  value={githubLink} 
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="styled-input"
                />
              </div>

              <div className="form-group mb-5">
                <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase'}}>Target Job Field</label>
                <div style={{position: 'relative'}}>
                  <select 
                    className="styled-input" 
                    value={fieldSelection} 
                    onChange={(e) => setFieldSelection(e.target.value)}
                    style={{appearance: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1.2rem', cursor: 'pointer', display: 'block', width: '100%', marginBottom: '0.5rem'}}
                  >
                    <option value="General Software Engineering" style={{background: '#1e293b'}}>General Software Engineering</option>
                    <option value="Frontend Development" style={{background: '#1e293b'}}>Frontend Development</option>
                    <option value="Backend Development" style={{background: '#1e293b'}}>Backend Development</option>
                    <option value="Full Stack Development" style={{background: '#1e293b'}}>Full Stack Development</option>
                    <option value="Data Science" style={{background: '#1e293b'}}>Data Science</option>
                    <option value="Cybersecurity" style={{background: '#1e293b'}}>Cybersecurity</option>
                    <option value="Other" style={{background: '#1e293b'}}>Other...</option>
                  </select>
                </div>
                
                {fieldSelection === 'Other' && (
                  <input 
                    type="text" 
                    placeholder="Enter your field (e.g. DevOps)"
                    className="styled-input mt-2 fade-in"
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    style={{border: '1px solid var(--accent)', background: 'rgba(14, 165, 233, 0.05)'}}
                  />
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.2rem', fontSize: '1.1rem', background: 'var(--primary)', fontWeight: '700'}}>
                 {loading ? <><span className="spinner"></span> Checking...</> : 'Check My Profile 🚀'}
              </button>
            </form>
            {error && <div className="error-message mt-3">{error}</div>}
          </div>

          <div className="card frosted-card mt-4" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)'}}>
             <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.2rem', letterSpacing: '1.5px', fontWeight: '900'}}>Why check GitHub?</h4>
             <p style={{fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6'}}>
                Analyzing your GitHub helps verify your coding work and provides real proof of your skills to recruiters.
             </p>
          </div>
        </aside>

        <main className="dashboard-results" style={{flex: 1, minWidth: 0}}>
          {!result && !loading && (
             <div className="placeholder-result card frosted-card" style={{marginTop: 0, minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '5rem', marginBottom: '2rem'}}>💻</div>
                <h3 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white', fontFamily: 'var(--font-heading)'}}>Ready to Review</h3>
                <p style={{maxWidth: '500px', margin: '1.5rem auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
                  Enter your GitHub profile link to see how your projects and code activity match your target job.
                </p>
             </div>
          )}

          {loading && (
            <div className="placeholder-result card frosted-card" style={{marginTop: 0, minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent)'}}></span>
               <h3 style={{fontSize: '2rem', marginTop: '2rem', fontFamily: 'var(--font-heading)'}}>Checking your projects...</h3>
               <p className="text-muted">Analyzing repositories, commit history, and code languages.</p>
            </div>
          )}

          {result && (
            <div className="results-wrapper fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
               <div className="card overview-card mt-0 frosted-card" style={{borderLeft: '10px solid var(--accent)', padding: '3rem', display: 'flex', alignItems: 'center', gap: '3rem'}}>
                 <div style={{
                    width: '140px', height: '140px', borderRadius: '50%', 
                    border: '8px solid rgba(255,255,255,0.05)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    background: 'rgba(56, 189, 248, 0.05)',
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.1)'
                 }}>
                    <div style={{fontSize: '3.5rem', fontWeight: '900', color: 'white'}}>{result.coding_velocity}</div>
                 </div>
                 <div style={{flex: 1}}>
                    <span style={{fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px'}}>Activity Velocity</span>
                    <h3 style={{fontSize: '3rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)'}}>{result.user_tier}</h3>
                    <p style={{color: '#94a3b8', marginTop: '0.5rem'}}>Match found for <strong>{result.job_field}</strong> field.</p>
                 </div>
               </div>

               <div className="features-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem'}}>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Project Stats 📊</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                       <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <span style={{color: '#64748b'}}>Total Repos</span>
                          <span style={{color: 'white', fontWeight: 'bold'}}>{result.repo_count}</span>
                       </div>
                       <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <span style={{color: '#64748b'}}>Main Language</span>
                          <span style={{color: 'white', fontWeight: 'bold'}}>{result.top_languages[0]}</span>
                       </div>
                       <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem'}}>
                          <span style={{color: '#64748b'}}>Work Type</span>
                          <span style={{color: 'var(--success)', fontWeight: 'bold'}}>Authentic</span>
                       </div>
                    </div>
                  </div>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Field Suitability 🏆</h3>
                    <div style={{padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                       <p style={{fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6'}}>Your profile shows high experience in <strong>{result.top_languages.join(', ')}</strong>. This matches <strong>{result.field_adherence}%</strong> of industry requirements for <strong>{result.job_field}</strong>.</p>
                    </div>
                  </div>
               </div>

               <div className="card frosted-card" style={{padding: '3rem', background: 'rgba(15, 23, 42, 0.4)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem'}}>
                     <h3 style={{fontSize: '1.8rem', fontWeight: '900'}}>Recent Project History</h3>
                     <div style={{height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)'}}></div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                     {result.recent_projects.map((proj, idx) => (
                        <div key={idx} style={{padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <div>
                              <h4 style={{fontSize: '1.1rem', color: 'white'}}>{proj}</h4>
                              <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem'}}>Verified Contribution</p>
                           </div>
                           <span style={{color: 'var(--accent)', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase'}}>Sync Active</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
