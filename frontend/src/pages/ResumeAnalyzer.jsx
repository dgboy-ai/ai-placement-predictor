import React, { useState } from 'react';
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
      setError('');
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Analysis engine failed. Ensure the backend is running and the PDF is not encrypted.');
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

      <div className="dashboard-grid mb-5">
        <section className="dashboard-form">
          <div className="card shadow-glass">
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
               <span style={{fontSize: '2rem'}}>🎯</span> Domain Select
            </h2>
            
            <form onSubmit={handleSubmit} className="input-form">
              <div className="form-group mb-5">
                   <label>Focus Job Field</label>
                   <select 
                     value={jobField} 
                     onChange={(e) => setJobField(e.target.value)}
                     className="styled-input"
                     style={{cursor: 'pointer', background: 'rgba(255,255,255,0.03)'}}
                   >
                     {jobFields.map(field => (
                       <option key={field} value={field}>{field}</option>
                     ))}
                   </select>
                </div>

                <h3 className="section-title">Resume Source</h3>
                <div className="form-group mb-5">
                  <label className="file-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    <div className={`file-upload-box ${file ? 'has-file' : ''}`} style={{ 
                      padding: '3rem 2rem', 
                      border: '2px dashed var(--border-color)', 
                      borderRadius: '20px', 
                      textAlign: 'center', 
                      background: 'rgba(255,255,255,0.02)', 
                      transition: 'all 0.3s' 
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{file ? '📄' : '📤'}</div>
                      {file ? (
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--success)', marginBottom: '0.5rem' }}>{file.name}</p>
                          <span style={{fontSize: '0.75rem', opacity: 0.6}}>File ready for scanning</span>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Click to upload or drag & drop PDF</p>
                      )}
                    </div>
                  </label>
                </div>
              
                <button type="submit" className="submit-btn" disabled={loading || !file} style={{padding: '1.2rem', width: '100%'}}>
                  {loading ? <><span className="spinner"></span> Analyzing Intelligence Map...</> : 'Execute Sector Scan'}
                </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}
          </div>
        </section>

        <section className="industry-context" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--accent)', background: 'rgba(129, 140, 248, 0.02)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent)'}}>🧱 The ATS Wall</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Our engine helps bypass these automated filters.
            </p>
          </div>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--accent-secondary)', animationDelay: '0.2s', background: 'rgba(168, 85, 247, 0.02)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)'}}>🔍 Domain Specificity</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              A candidate for <b>{jobField}</b> must demonstrate specific technical dominance. We audit your keywords against live industry requirements for this niche.
            </p>
          </div>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--success)', animationDelay: '0.4s', background: 'rgba(16, 185, 129, 0.02)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--success)'}}>📈 Impact Analysis</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              We calculate your "Action Velocity" to ensure your experience sounds authoritative and results-driven, moving beyond simple task descriptions.
            </p>
          </div>
        </section>
      </div>

      <div className="results-container">
        {!result && !loading && (
             <div className="placeholder-result card fade-in" style={{height: '300px', borderStyle: 'solid'}}>
                <div className="placeholder-icon" style={{fontSize: '3rem', marginBottom: '1rem'}}>📊</div>
                <h3>Sector Scanning Offline</h3>
                <p>Submit your document to see detailed skill detection and weighted ATS scoring.</p>
             </div>
          )}
          
          {loading && (
             <div className="placeholder-result loading-result card fade-in" style={{height: '300px'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent-secondary)'}}></span>
               <h3>Initializing Intelligence...</h3>
               <p>Comparing your experience against {jobField} benchmarks.</p>
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
                  <h3 className="prediction-status" style={{fontSize: '1.8rem'}}>{result.job_field} Specialist</h3>
                  <div className="badges mt-2">
                     <span className={`badge ${result.ats_status === 'Optimized' ? 'risk-low' : 'risk-high'}`}>ATS {result.ats_status}</span>
                     <span className="badge confidence" style={{fontSize: '0.8rem'}}>Field Match: {result.field_match_index}%</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                 <div className="card pop-in" style={{padding: '1.5rem', textAlign: 'center'}}>
                    <p className="text-muted" style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Domain Mastery</p>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: 'var(--accent)', margin: '0.5rem 0'}}>{result.field_match_index}%</div>
                 </div>
                 <div className="card pop-in" style={{padding: '1.5rem', textAlign: 'center'}}>
                    <p className="text-muted" style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Firm Alignment</p>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: 'var(--accent-secondary)', margin: '0.5rem 0'}}>{result.product_match}%</div>
                 </div>
              </div>

              <div className="details-stack">
                <div className="card pop-in mb-4">
                  <h3 className="section-title">Detected Tech DNA</h3>
                  <div className="badges" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {result.detected_skills.length > 0 ? result.detected_skills.map((skill, idx) => (
                      <span key={idx} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'white', border: '1px solid var(--primary)' }}>{skill}</span>
                    )) : <span className="text-muted">No specific tech-stack markers detected.</span>}
                  </div>
                </div>
                
                <div className="grid-2-cols">
                  <div className="card pop-in mb-4" style={{borderLeft: '5px solid var(--danger)'}}>
                    <h3 style={{color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '1rem'}}>Niche Weak Points</h3>
                    <ul className="bullet-list">
                      {result.weak_points.map((pt, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', marginBottom: '0.5rem'}}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="card pop-in mb-4" style={{borderLeft: '5px solid var(--accent-secondary)'}}>
                    <h3 style={{color: 'var(--accent-secondary)', fontSize: '1.1rem', marginBottom: '1rem'}}>Winning Refinements</h3>
                    <ul className="bullet-list">
                      {result.improvements.map((im, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', marginBottom: '0.5rem'}}>{im}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

