import React, { useState } from 'react';
import axios from 'axios';

export default function ResumeAnalyzer() {
  const [jobField, setJobField] = useState('Full Stack Development');
  const [customField, setCustomField] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [file, setFile] = useState(null);
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalField = showCustom ? customField : jobField;
    
    if (!finalField) {
      setError('Please select or type a job field.');
      return;
    }
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_field', finalField);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Backend error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
       <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">Resume Analysis</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>Check Your <span className="text-gradient">Resume</span></h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            Upload your resume and tell us what job you want. We'll tell you if you're ready and how to improve.
          </p>
        </div>
      </div>

      <div className="dashboard-grid mb-5">
        <section className="dashboard-form">
          <div className="card shadow-glass">
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
               <span style={{fontSize: '2rem'}}>🎯</span> Job Details
            </h2>
            
            <form onSubmit={handleSubmit} className="input-form">
              <div className="form-group mb-4">
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

                <div className="form-group mb-5">
                  <label style={{marginBottom: '1rem', display: 'block'}}>Upload Resume (PDF)</label>
                  <label className="file-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    <div className={`file-upload-box ${file ? 'has-file' : ''}`} style={{ 
                      padding: '2rem', 
                      border: '2px dashed var(--border-color)', 
                      borderRadius: '16px', 
                      textAlign: 'center', 
                      background: 'rgba(255,255,255,0.02)', 
                      transition: 'all 0.3s' 
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{file ? '✅' : '📄'}</div>
                      {file ? (
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--success)' }}>{file.name}</p>
                          <span style={{fontSize: '0.8rem', opacity: 0.6}}>Ready to scan</span>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Click to upload PDF</p>
                      )}
                    </div>
                  </label>
                </div>
              
                <button type="submit" className="submit-btn" disabled={loading || !file} style={{padding: '1.2rem', width: '100%'}}>
                  {loading ? <><span className="spinner"></span> Working...</> : 'Scan My Resume'}
                </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}
          </div>
        </section>

        <section className="industry-context" style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--accent)', background: 'rgba(129, 140, 248, 0.05)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent)'}}>📄 Why scan your resume?</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Most big companies use systems to filter resumes before a human sees them. We show you exactly how to pass those filters.
            </p>
          </div>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--accent-secondary)', animationDelay: '0.1s', background: 'rgba(168, 85, 247, 0.05)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)'}}>🔑 Keywords Matter</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              A <b>{showCustom ? customField || 'Custom Job' : jobField}</b> resume needs specific skills. We check if you have the right words for this role.
            </p>
          </div>
          <div className="card pop-in" style={{borderLeft: '4px solid var(--success)', animationDelay: '0.2s', background: 'rgba(16, 185, 129, 0.05)'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--success)'}}>💡 Get Tips</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Don't just upload and wait. Read our "Winning Refinements" after the scan to see what projects or skills you should add.
            </p>
          </div>
        </section>
      </div>

      <div className="results-container">
        {!result && !loading && (
             <div className="placeholder-result card fade-in" style={{height: '300px', borderStyle: 'solid'}}>
                <div className="placeholder-icon" style={{fontSize: '3rem', marginBottom: '1rem'}}>📄</div>
                <h3>Result will appear here</h3>
                <p>Submit your resume to get your score and detailed tips.</p>
             </div>
          )}
          
          {loading && (
             <div className="placeholder-result loading-result card fade-in" style={{height: '300px'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent-secondary)'}}></span>
               <h3>Reading Resume...</h3>
               <p>Comparing your skills against {showCustom ? customField : jobField} requirements.</p>
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
                     <span className="badge confidence" style={{fontSize: '0.8rem'}}>Job Match: {result.field_match_index}%</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                 <div className="card pop-in" style={{padding: '1.5rem', textAlign: 'center'}}>
                    <p className="text-muted" style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Job Match Score</p>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: 'var(--accent)', margin: '0.5rem 0'}}>{result.field_match_index}%</div>
                 </div>
                 <div className="card pop-in" style={{padding: '1.5rem', textAlign: 'center'}}>
                    <p className="text-muted" style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Company Alignment</p>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: 'var(--accent-secondary)', margin: '0.5rem 0'}}>{result.product_match}%</div>
                 </div>
              </div>

              <div className="details-stack">
                <div className="card pop-in mb-4">
                  <h3 className="section-title" style={{fontSize: '1rem'}}>Keywords Found</h3>
                  <div className="badges" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {result.detected_skills.length > 0 ? result.detected_skills.map((skill, idx) => (
                      <span key={idx} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'white', border: '1px solid var(--primary)' }}>{skill}</span>
                    )) : <span className="text-muted">No specific skills detected.</span>}
                  </div>
                </div>
                
                <div className="grid-2-cols">
                  <div className="card pop-in mb-4" style={{borderLeft: '5px solid var(--danger)'}}>
                    <h3 style={{color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '1rem'}}>What's Missing?</h3>
                    <ul className="bullet-list">
                      {result.weak_points.map((pt, idx) => (
                        <li key={idx} style={{fontSize: '0.85rem', marginBottom: '0.5rem'}}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="card pop-in mb-4" style={{borderLeft: '5px solid var(--accent-secondary)'}}>
                    <h3 style={{color: 'var(--accent-secondary)', fontSize: '1.1rem', marginBottom: '1rem'}}>How to Improve</h3>
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

