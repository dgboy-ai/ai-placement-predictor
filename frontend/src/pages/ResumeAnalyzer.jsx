import { useState } from 'react';
import axios from 'axios';

export default function ResumeAnalyzer() {
  const [jobField, setJobField] = useState('Full Stack Development');
  const [file, setFile] = useState(null);
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_field', jobField);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'Failed to connect to analysis server. PDF may be too large or incompatible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
       <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Precision Benchmarking</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>Field <span className="text-gradient">Intelligence</span> Analyzer</h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            Analyze your resume against niche-specific industry standards. Select your domain to begin a specialized architecture scan.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-form">
          <div className="card">
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
               <span style={{fontSize: '2rem'}}>🎯</span> Domain Select
            </h2>
            
            <form onSubmit={handleSubmit} className="input-form">
              <div className="form-section">
                <div className="form-group mb-5">
                   <label>Focus Job Field</label>
                   <select 
                     value={jobField} 
                     onChange={(e) => setJobField(e.target.value)}
                     className="styled-input"
                     style={{appearance: 'none', cursor: 'pointer'}}
                   >
                     {jobFields.map(field => (
                       <option key={field} value={field}>{field}</option>
                     ))}
                   </select>
                </div>

                <h3 className="section-title">Resume Source</h3>
                <div className="form-group mb-4">
                  <label className="file-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    <div className="file-upload-box" style={{ padding: '3rem 2rem', border: '2px dashed var(--border-color)', borderRadius: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{file ? '✅' : '📤'}</div>
                      {file ? <div style={{ fontWeight: '700', color: 'var(--success)' }}>{file.name}</div> : <div style={{ color: 'var(--text-muted)' }}>Click to drop your PDF</div>}
                    </div>
                  </label>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading || !file} style={{padding: '1.5rem'}}>
                {loading ? <><span className="spinner"></span> Mapping Core Vectors...</> : 'Execute Sector Analysis'}
              </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}
          </div>
        </section>

        <section className="dashboard-results">
          {!result && !loading && (
             <div className="placeholder-result card fade-in" style={{height: '100%', borderStyle: 'solid'}}>
                <div className="placeholder-icon">📊</div>
                <h3>Sector Scanning Offline</h3>
                <p>Select your domain and upload a PDF to see how your profile benchmarks against top-tier tech firms.</p>
             </div>
          )}
          
          {loading && (
             <div className="placeholder-result loading-result card fade-in" style={{height: '100%'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent-secondary)'}}></span>
               <h3>Initializing Intelligence...</h3>
               <p>Our engine is comparing your experience against {jobField} benchmarks.</p>
             </div>
          )}
          
          {result && (
            <div className="results-section">
              <div className="card overview-card mb-4 pop-in" style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                <div className="probability-wrapper">
                  <div className={`probability-circle ${result.resume_score >= 80 ? 'risk-low' : result.resume_score >= 50 ? 'risk-medium' : 'risk-high'}`}></div>
                  <div className="probability-value" style={{fontSize: '4rem'}}>{result.resume_score}<span>pt</span></div>
                </div>
                <div className="overview-details">
                  <h3 className="prediction-status" style={{fontSize: '1.8rem'}}>{result.job_field}</h3>
                  <div className="badges">
                     <span className={`badge ${result.ats_status === 'Optimized' ? 'risk-low' : 'risk-high'}`}>ATS {result.ats_status}</span>
                     <span className="badge confidence" style={{fontSize: '0.8rem'}}>Field Match: {result.field_match_index}%</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                 <div className="card pop-in" style={{padding: '1.5rem', textAlign: 'center'}}>
                    <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px'}}>Domain Mastery</div>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: 'var(--accent)', margin: '0.5rem 0'}}>{result.field_match_index}%</div>
                 </div>
                 <div className="card pop-in" style={{padding: '1.5rem', textAlign: 'center'}}>
                    <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px'}}>Firm Alignment</div>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: 'var(--accent-secondary)', margin: '0.5rem 0'}}>{result.product_match}%</div>
                 </div>
              </div>

              <div className="details-stack">
                <div className="card pop-in">
                  <h3 className="section-title">Relevant Stack DNA</h3>
                  <div className="badges" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {result.detected_skills.map((skill, idx) => (
                      <span key={idx} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'white', border: '1px solid var(--primary)' }}>{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid-2-cols mb-4">
                  <div className="card pop-in" style={{borderLeft: '5px solid var(--danger)'}}>
                    <h3 style={{color: 'var(--danger)', fontSize: '1.1rem'}}>Niche Weak Points</h3>
                    <ul className="bullet-list" style={{marginTop: '1rem'}}>
                      {result.weak_points.map((pt, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', padding: '0.5rem 0.5rem 0.5rem 2rem'}}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="card pop-in" style={{borderLeft: '5px solid var(--accent-secondary)'}}>
                    <h3 style={{color: 'var(--accent-secondary)', fontSize: '1.1rem'}}>Winning Refinements</h3>
                    <ul className="bullet-list" style={{marginTop: '1rem'}}>
                      {result.improvements.map((im, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', padding: '0.5rem 0.5rem 0.5rem 2rem'}}>{im}</li>
                      ))}
                    </ul>
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

