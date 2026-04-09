import { useState } from 'react';
import axios from 'axios';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobField, setJobField] = useState('General Software Engineering');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF resume first.');
      return;
    }
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_field', jobField);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Connection Error: Failed to analyze your resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Nextora Intelligence 📄</span>
          <h1 className="hero-title" style={{fontSize: '4rem', fontFamily: 'var(--font-heading)'}}>Resume <span className="text-gradient">Analysis</span></h1>
          <p className="hero-subtitle" style={{fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto'}}>
             Upload your resume and tell us your target field. We’ll help you see how well you match and how to stand out.
          </p>
        </div>
      </div>

      <div className="dashboard-grid" style={{alignItems: 'flex-start', gap: '3rem'}}>
        <aside className="dashboard-sidebar" style={{position: 'sticky', top: '2rem', width: '380px', flexShrink: 0}}>
          <div className="card shadow-glass frosted-card">
            <h2 style={{fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--font-heading)'}}>
               Analysis Guide 💡
            </h2>
            <form onSubmit={handleSubmit} className="input-form">
              <div className="form-group mb-4">
                <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase'}}>Target Job Field</label>
                <input 
                  type="text" 
                  value={jobField} 
                  onChange={(e) => setJobField(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="styled-input"
                />
              </div>

              <div className="form-group mb-5">
                <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase'}}>PDF Resume</label>
                <div 
                  className="file-drop-zone"
                  onClick={() => document.getElementById('resume-upload').click()}
                  style={{
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: '15px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: file ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <input 
                    id="resume-upload"
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".pdf"
                    style={{display: 'none'}}
                  />
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>{file ? '✅' : '📁'}</div>
                  <p style={{fontSize: '0.85rem', color: file ? 'white' : '#64748b'}}>
                    {file ? file.name : 'Click to select PDF'}
                  </p>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.2rem', fontSize: '1.1rem', background: 'var(--primary)', fontWeight: '700'}}>
                 {loading ? <><span className="spinner"></span> Checking...</> : 'Check My Resume 🚀'}
              </button>
            </form>
            {error && <div className="error-message mt-3">{error}</div>}
          </div>

          <div className="card frosted-card mt-4" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)'}}>
             <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.2rem', letterSpacing: '1.5px', fontWeight: '900'}}>Platform Tip</h4>
             <p style={{fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6'}}>
                Results are based on industry standards and data from 7,500+ successful career resumes.
             </p>
          </div>
        </aside>

        <main className="dashboard-results" style={{flex: 1, minWidth: 0}}>
          {!result && !loading && (
             <div className="placeholder-result card frosted-card" style={{marginTop: 0, minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '5rem', marginBottom: '2rem'}}>📄</div>
                <h3 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white', fontFamily: 'var(--font-heading)'}}>Ready for Review</h3>
                <p style={{maxWidth: '500px', margin: '1.5rem auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
                  Upload your resume to receive a personalized report on your job market readiness.
                </p>
             </div>
          )}

          {loading && (
            <div className="placeholder-result card frosted-card" style={{marginTop: 0, minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent)'}}></span>
               <h3 style={{fontSize: '2rem', marginTop: '2rem', fontFamily: 'var(--font-heading)'}}>Reading Your Resume...</h3>
               <p className="text-muted">Comparing your details with industry standards.</p>
            </div>
          )}

          {result && (
            <div className="results-wrapper fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
               <div className="card overview-card mt-0 frosted-card" style={{borderLeft: '10px solid var(--primary)', padding: '3rem', display: 'flex', alignItems: 'center', gap: '3rem'}}>
                 <div style={{
                    width: '140px', height: '140px', borderRadius: '50%', 
                    border: '8px solid rgba(255,255,255,0.05)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    background: 'rgba(56, 189, 248, 0.05)',
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.1)'
                 }}>
                    <div style={{fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)'}}>{result.score}<span style={{fontSize: '1rem', verticalAlign: 'middle'}}>%</span></div>
                 </div>
                 <div style={{flex: 1}}>
                    <span style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px'}}>Readiness Score</span>
                    <h3 style={{fontSize: '3rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)'}}>{result.match_label}</h3>
                    <div className="badges mt-3" style={{display: 'flex', gap: '1rem'}}>
                      <span className="badge" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                        Best Field: {result.recommended_field}
                      </span>
                    </div>
                 </div>
               </div>

               <div className="features-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Your Strengths ✨</h3>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {result.strengths.slice(0,4).map((str, i) => (
                        <li key={i} style={{fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e1', lineHeight: '1.5', display: 'flex', gap: '0.8rem'}}>
                          <span style={{color: 'var(--success)'}}>✓</span> {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Areas to Grow 🌱</h3>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {result.improvements.slice(0,4).map((imp, i) => (
                        <li key={i} style={{fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e1', lineHeight: '1.5', display: 'flex', gap: '0.8rem'}}>
                          <span style={{color: 'var(--accent)'}}>✦</span> {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Improvement Tips 💡</h3>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {result.keywords_to_add.slice(0,4).map((key, i) => (
                        <li key={i} style={{fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e1', lineHeight: '1.5', display: 'flex', gap: '0.8rem'}}>
                          <span style={{color: 'var(--warning)'}}>+</span> Add "{key}"
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>

               <div className="card frosted-card" style={{padding: '3rem', background: 'rgba(15, 23, 42, 0.4)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                     <h3 style={{fontSize: '1.8rem', fontWeight: '900', fontFamily: 'var(--font-heading)'}}>Analysis Summary</h3>
                     <div style={{height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)'}}></div>
                  </div>
                  <div className="grid-2-cols" style={{gap: '3rem'}}>
                     <div style={{lineHeight: '1.8', color: '#94a3b8'}}>
                        <h4 style={{color: 'white', marginBottom: '1rem'}}>Market Standing</h4>
                        <p>Your profile aligns <strong>{result.match_label}</strong> with the <strong>{jobField}</strong> field. By adding the suggested keywords and highlighting your specific projects, you can improve your chances significantly.</p>
                     </div>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div style={{padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)'}}>
                           <h5 style={{fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Next Step</h5>
                           <p style={{fontSize: '0.95rem'}}>Focus on adding "<strong>{result.keywords_to_add[0]}</strong>" to your resume to pass automated checks more easily.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
