import { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';


export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [fieldSelection, setFieldSelection] = useState('General Software Engineering');
  const [customField, setCustomField] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDownloadImproved = async () => {
    if (!file) return;
    
    setImproving(true);
    const finalField = fieldSelection === 'Other' ? customField : fieldSelection;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_field', finalField);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/improve-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Improved_Resume_${finalField.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      setError('Failed to generate improved resume PDF.');
    } finally {
      setImproving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF resume first.');
      return;
    }
    
    const finalField = fieldSelection === 'Other' ? customField : fieldSelection;
    if (!finalField) {
      setError('Please provide a target job field.');
      return;
    }

    setLoading(true);
    setResult(null); // Clear previous results
    setError('');
    
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
                 {loading ? <><span className="spinner"></span> Analyzing...</> : 'Analyze Resume 🚀'}
              </button>
            </form>
            {error && <div className="error-message mt-3">{error}</div>}
          </div>
        </aside>

        <main className="dashboard-results" style={{flex: 1, minWidth: 0}}>
          {!result && !loading && (
             <div className="placeholder-result card frosted-card" style={{marginTop: 0, minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '5rem', marginBottom: '2rem'}}>📄</div>
                <h3 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white', fontFamily: 'var(--font-heading)'}}>Ready to Scan</h3>
                <p style={{maxWidth: '500px', margin: '1.5rem auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
                  Upload your PDF resume to see your readiness score, strengths, and areas for growth tailored to your target field.
                </p>
             </div>
          )}

          {loading && (
            <div className="placeholder-result card frosted-card" style={{marginTop: 0, minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
               <span className="spinner large-spinner"></span>
               <h3 style={{fontSize: '2rem', marginTop: '2rem', fontFamily: 'var(--font-heading)'}}>Analyzing Resume Intelligence...</h3>
               <p className="text-muted">Extraction of technical identifiers and career alignment metrics in progress.</p>
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
                    <div style={{fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)'}}>{result.resume_score}<span style={{fontSize: '1rem', verticalAlign: 'middle'}}>%</span></div>
                 </div>
                  <div style={{flex: 1}}>
                     <span style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px'}}>Readiness Score</span>
                     <h3 style={{fontSize: '3rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)'}}>{result.ats_status}</h3>
                     <div className="badges mt-3" style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                       <span className="badge" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                         Target: {result.job_field}
                       </span>
                       <button 
                         onClick={handleDownloadImproved} 
                         disabled={improving}
                         className="btn-link"
                         style={{
                           background: 'var(--primary)',
                           color: 'white',
                           border: 'none',
                           padding: '0.6rem 1.2rem',
                           borderRadius: '8px',
                           fontSize: '0.85rem',
                           fontWeight: '700',
                           cursor: 'pointer',
                           display: 'flex',
                           gap: '0.5rem',
                           alignItems: 'center',
                           marginLeft: 'auto',
                           boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)'
                         }}
                       >
                         {improving ? <><span className="spinner" style={{width: '14px', height: '14px'}}></span> Improving...</> : <>✨ Download Improved Resume (ATS Focus)</>}
                       </button>
                     </div>
                  </div>
               </div>

               <div className="features-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Detected Skills ✨</h3>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {result.detected_skills && result.detected_skills.length > 0 ? result.detected_skills.slice(0,5).map((str, i) => (
                        <li key={i} style={{fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e1', lineHeight: '1.5', display: 'flex', gap: '0.8rem'}}>
                          <span style={{color: 'var(--success)'}}>✓</span> {str}
                        </li>
                      )) : <li style={{color: '#64748b'}}>No specific skills detected.</li>}
                    </ul>
                  </div>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Improvements 🌱</h3>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {result.improvements && result.improvements.length > 0 ? result.improvements.slice(0,5).map((imp, i) => (
                        <li key={i} style={{fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e1', lineHeight: '1.5', display: 'flex', gap: '0.8rem'}}>
                          <span style={{color: 'var(--accent)'}}>✦</span> {imp}
                        </li>
                      )) : <li style={{color: '#64748b'}}>No critical improvements identified.</li>}
                    </ul>
                  </div>
                  <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                    <h3 style={{fontSize: '0.9rem', color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px'}}>Structural Check 💡</h3>
                    <div style={{padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                       <p style={{fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6'}}>
                         {result.weak_points && result.weak_points[0] ? result.weak_points[0] : "Resume structure is well-optimized for parsing."}
                       </p>
                    </div>
                  </div>
               </div>

                {/* VISUAL CHART SECTION */}
                <div className="card frosted-card" style={{padding: '2rem'}}>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-heading)'}}>Impact Analytics 📊</h3>
                  <div style={{width: '100%', height: '280px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { metric: 'Overall Match', score: result.field_match_index, fill: '#10b981' },
                        { metric: 'Action Verbs', score: Math.min((result.impact_telemetry?.action_velocity || 0) * 10, 100), fill: '#38bdf8' },
                        { metric: 'Metrics Density', score: Math.min((result.impact_telemetry?.metric_density || 0) * 20, 100), fill: '#0ea5e9' },
                        { metric: 'ATS Readiness', score: result.resume_score, fill: '#8b5cf6' }
                      ]} margin={{top: 10, right: 10, bottom: 20, left: -20}}>
                        <XAxis dataKey="metric" tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {
                            [
                              { metric: 'Overall Match', score: result.field_match_index, fill: '#10b981' },
                              { metric: 'Action Verbs', score: Math.min((result.impact_telemetry?.action_velocity || 0) * 10, 100), fill: '#38bdf8' },
                              { metric: 'Metrics Density', score: Math.min((result.impact_telemetry?.metric_density || 0) * 20, 100), fill: '#0ea5e9' },
                              { metric: 'ATS Readiness', score: result.resume_score, fill: '#8b5cf6' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

               <div className="card frosted-card" style={{padding: '3rem', background: 'rgba(15, 23, 42, 0.4)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem'}}>
                     <h3 style={{fontSize: '1.8rem', fontWeight: '900'}}>Platform Verified Roadmap</h3>
                     <div style={{height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)'}}></div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                     {result.suggestions && result.suggestions.length > 0 ? result.suggestions.map((step, idx) => (
                       <div key={idx} style={{padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                          <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0}}>
                            {idx + 1}
                          </div>
                          <div style={{fontSize: '1rem', color: '#e2e8f0'}}>{step}</div>
                       </div>
                     )) : <p style={{color: '#64748b'}}>No specific roadmap steps available. Refine your resume to get deeper insights.</p>}
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
