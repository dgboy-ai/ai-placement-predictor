import { useState } from 'react';
import axios from 'axios';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          <span className="header-badge">Document Intelligence</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>ATS <span className="text-gradient">Resume</span> Optimization</h1>
          <p className="hero-subtitle" style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            Extract technical identifiers, identify skill gaps, and benchmark your resume against industry-leading ATS algorithms.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-form">
          <div className="card">
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
               <span style={{fontSize: '2rem'}}>📄</span> Precision Scan
            </h2>
            <p className="text-muted mb-4">Upload your PDF resume. Our AI will parse the structure and extract skill vectors automatically.</p>
            
            <form onSubmit={handleSubmit} className="input-form">
              <div className="form-section">
                <h3 className="section-title">Resume Source</h3>
                
                <div className="form-group mb-4">
                  <label className="file-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }}
                    />
                    <div className="file-upload-box" style={{ padding: '3rem 2rem', border: '2px dashed var(--border-color)', borderRadius: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{file ? '✅' : '📤'}</div>
                      {file ? (
                        <div style={{ fontWeight: '700', color: 'var(--success)' }}>{file.name}</div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)' }}>Click to drop your PDF here</div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading || !file} style={{padding: '1.5rem'}}>
                {loading ? (
                  <><span className="spinner"></span> Parsing Vectors...</>
                ) : (
                  'Start Intelligence Scan'
                )}
              </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}
          </div>
        </section>

        <section className="dashboard-results">
          {!result && !loading && (
             <div className="placeholder-result card fade-in" style={{height: '100%', borderStyle: 'solid'}}>
                <div className="placeholder-icon">📊</div>
                <h3>Extracting Insights</h3>
                <p>Submit your document to see detailed skill detection, experience validation, and weighted ATS scoring.</p>
             </div>
          )}
          
          {loading && !result && (
             <div className="placeholder-result loading-result card fade-in" style={{height: '100%'}}>
               <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent-secondary)'}}></span>
               <h3>Processing Data...</h3>
               <p>Our NLP engine is semanticly analyzing your work history and skills.</p>
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
                  <h3 className="prediction-status" style={{fontSize: '2rem'}}>ATS Integrity</h3>
                  <div className="badges">
                     <span className={`badge ${result.ats_status === 'Ready' ? 'risk-low' : 'risk-high'}`} style={{fontSize: '0.8rem'}}>Status: {result.ats_status}</span>
                     <span className="badge confidence" style={{fontSize: '0.8rem'}}>Efficiency: {result.resume_score}%</span>
                  </div>
                </div>
              </div>

              {/* Unique Feature: Match Analytics */}
              <div className="grid-2-cols mb-4">
                 <div className="card pop-in" style={{flex: 1, padding: '1.5rem', textAlign: 'center'}}>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px'}}>Product Tier Match</div>
                    <div style={{fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent)', margin: '0.5rem 0'}}>{result.match_analytics.product_firm}%</div>
                    <div style={{height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden'}}>
                       <div style={{width: `${result.match_analytics.product_firm}%`, height: '100%', background: 'var(--accent)'}}></div>
                    </div>
                 </div>
                 <div className="card pop-in" style={{flex: 1, padding: '1.5rem', textAlign: 'center'}}>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px'}}>Service Tier Match</div>
                    <div style={{fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-secondary)', margin: '0.5rem 0'}}>{result.match_analytics.service_firm}%</div>
                    <div style={{height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden'}}>
                       <div style={{width: `${result.match_analytics.service_firm}%`, height: '100%', background: 'var(--accent-secondary)'}}></div>
                    </div>
                 </div>
              </div>

              <div className="details-stack">
                <div className="card pop-in" style={{animationDelay: '0.1s'}}>
                  <h3 className="section-title">Extracted Skill DNA</h3>
                  {result.detected_skills && result.detected_skills.length > 0 ? (
                    <div className="badges" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {result.detected_skills.map((skill, idx) => (
                        <span key={idx} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'white', border: '1px solid var(--primary)', fontSize: '0.8rem' }}>{skill}</span>
                      ))}
                    </div>
                  ) : <p className="text-muted">No specific identifiers found.</p>}
                </div>
                
                <div className="card insights-card pop-in" style={{animationDelay: '0.3s'}}>
                  <h3>Key Strengths</h3>
                  <ul className="bullet-list">
                    {result.strengths.map((st, idx) => (
                      <li key={idx} style={{background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.1)'}}>{st}</li>
                    ))}
                  </ul>
                </div>
                
                {result.ats_issues && result.ats_issues.length > 0 && (
                  <div className="card pop-in" style={{ borderLeft: '5px solid var(--danger)', animationDelay: '0.4s' }}>
                    <h3 style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>ATS Parsing Risks</h3>
                    <ul className="bullet-list" style={{ marginTop: '1rem' }}>
                      {result.ats_issues.map((iss, idx) => (
                        <li key={idx} style={{borderColor: 'rgba(239, 68, 68, 0.1)', fontSize: '0.9rem', padding: '0.8rem 1rem 0.8rem 2.5rem'}}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="card explanation-card pop-in" style={{animationDelay: '0.5s'}}>
                  <h3 style={{color: 'var(--accent-secondary)', fontSize: '1.2rem'}}>Strategic Optimization</h3>
                  <ul className="bullet-list">
                    {result.suggestions.map((sg, idx) => (
                      <li key={idx} style={{borderColor: 'rgba(168, 85, 247, 0.1)', fontSize: '0.9rem', padding: '0.8rem 1rem 0.8rem 2.5rem'}}>{sg}</li>
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

