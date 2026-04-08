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
      setError(err?.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="dashboard-grid">
        <section className="dashboard-form">
          <div className="card">
            <h2>Resume Analyzer</h2>
            <p className="mt-2 text-muted">Upload your PDF resume to have it analyzed against key placement requirements.</p>
            <form onSubmit={handleSubmit} className="input-form mt-4">
              <div className="form-section">
                <h3 className="section-title">Upload File</h3>
                
                <div className="form-group mb-4">
                  <label className="file-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }}
                    />
                    <div className="file-upload-box" style={{ padding: '2rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                      {file ? <div style={{ color: '#4ade80' }}>Selected: {file.name}</div> : <div style={{ color: 'rgba(255,255,255,0.6)' }}>Click to select your PDF resume here</div>}
                    </div>
                  </label>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading || !file}>
                {loading ? (
                  <><span className="spinner"></span> Analyzing...</>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </form>
            {error && <div className="error-message mt-4">{error}</div>}
          </div>
        </section>

        <section className="dashboard-results">
          {!result && !loading && (
             <div className="placeholder-result card fade-in">
               <div className="placeholder-icon">🔍</div>
               <h3>Awaiting Upload</h3>
               <p>Upload your resume to extract skills, find missing requirements, and get actionable suggestions.</p>
             </div>
          )}
          
          {loading && !result && (
             <div className="placeholder-result loading-result card fade-in">
               <span className="spinner large-spinner"></span>
               <h3>Parsing PDF...</h3>
               <p>The analyzer is reading the document and extracting key skills.</p>
             </div>
          )}
          
          {result && (
            <div className="results-section fade-in">
              <div className="card overview-card mb-4" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                <div className="probability-wrapper">
                  <div className={`probability-circle ${result.resume_score >= 80 ? 'risk-low' : result.resume_score >= 50 ? 'risk-medium' : 'risk-high'}`}></div>
                  <div className="probability-value">{result.resume_score}<span>/100</span></div>
                </div>
                <div className="overview-details">
                  <h3 className="prediction-status">ATS Resume Score</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>Based on skills, projects, experience, and structural quality.</p>
                </div>
              </div>

              <div className="details-stack">
                <div className="card">
                  <h3>Detected Skills</h3>
                  {result.detected_skills && result.detected_skills.length > 0 ? (
                    <div className="badges" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {result.detected_skills.map((skill, idx) => (
                        <span key={idx} className="badge" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '6px 12px', borderRadius: '20px' }}>{skill}</span>
                      ))}
                    </div>
                  ) : <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>No key skills detected perfectly.</p>}
                </div>

                <div className="card">
                  <h3>Missing Requirements</h3>
                  {result.missing_skills && result.missing_skills.length > 0 ? (
                    <div className="badges" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                       {result.missing_skills.map((skill, idx) => (
                         <span key={idx} className="badge risk risk-high">{skill}</span>
                       ))}
                    </div>
                  ) : <p className="mt-2 text-success" style={{ color: '#4ade80' }}>All required skills were detected!</p>}
                </div>
                
                {result.strengths && result.strengths.length > 0 && (
                  <div className="card insights-card">
                    <h3>Resume Strengths</h3>
                    <ul className="bullet-list" style={{ marginTop: '1rem' }}>
                      {result.strengths.map((st, idx) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.issues && result.issues.length > 0 && (
                  <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ color: '#ef4444' }}>Critical Issues</h3>
                    <ul className="bullet-list" style={{ marginTop: '1rem' }}>
                      {result.issues.map((iss, idx) => (
                        <li key={idx}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="card explanation-card">
                  <h3>Actionable Suggestions</h3>
                  <ul className="bullet-list" style={{ marginTop: '1rem' }}>
                    {result.suggestions.map((sg, idx) => (
                      <li key={idx}>{sg}</li>
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
