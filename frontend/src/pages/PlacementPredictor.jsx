import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlacementPredictor() {
  const [formData, setFormData] = useState({
    attendance: 75,
    cgpa: 0,
    internships: 0,
    projects: 0,
    skills_score: 5,
    communication_score: 5,
    backlogs: 0
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [engineStatus, setEngineStatus] = useState('Standby');

  useEffect(() => {
    if (loading) setEngineStatus('Analyzing details...');
    else if (result) setEngineStatus('Report Ready');
    else setEngineStatus('Ready to predict');
  }, [loading, result]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.cgpa === 0) {
      setError('Please provide your CGPA to help the predictor.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Connection Error: Unable to reach the predictor service.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return 'risk-medium';
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="dashboard-grid" style={{alignItems: 'flex-start', gap: '3rem'}}>
        <aside className="dashboard-sidebar" style={{position: 'sticky', top: '2rem', width: '380px', flexShrink: 0}}>
          <section className="dashboard-form">
            <div className="card shadow-glass frosted-card" style={{marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--font-heading)'}}>
                 Your Details 📝
              </h2>
              
              <form onSubmit={handleSubmit} className="input-form">
                <div className="form-section">
                  <div className="grid-2-cols mb-4">
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Current CGPA</label>
                      <input 
                        type="number" 
                        name="cgpa" 
                        value={formData.cgpa === 0 ? '' : formData.cgpa} 
                        onChange={handleChange} 
                        min="0" max="10" step="0.01"
                        placeholder="e.g. 8.5"
                        className="styled-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Attendance (%)</label>
                      <input 
                        type="number" 
                        name="attendance" 
                        value={formData.attendance} 
                        onChange={handleChange} 
                        className="styled-input" 
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <div className="label-row">
                      <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase'}}>Skills Score (1-10)</label>
                      <span className="live-value" style={{color: 'var(--accent)', fontWeight: 'bold'}}>{formData.skills_score}</span>
                    </div>
                    <input type="range" name="skills_score" value={formData.skills_score} onChange={handleChange} min="0" max="10" step="0.5" className="styled-slider" />
                  </div>

                  <div className="form-group mb-4">
                    <div className="label-row">
                      <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase'}}>Communication (1-10)</label>
                      <span className="live-value" style={{color: 'var(--primary)', fontWeight: 'bold'}}>{formData.communication_score}</span>
                    </div>
                    <input type="range" name="communication_score" value={formData.communication_score} onChange={handleChange} min="0" max="10" step="0.5" className="styled-slider" />
                  </div>

                  <div className="grid-2-cols mb-4">
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem', opacity: 0.7}}>Internships</label>
                      <select name="internships" value={formData.internships} onChange={handleChange} className="styled-select">
                        <option value="0">None</option>
                        <option value="1">1 Completed</option>
                        <option value="2">2 Completed</option>
                        <option value="3">3+ Experience</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem', opacity: 0.7}}>Projects</label>
                      <select name="projects" value={formData.projects} onChange={handleChange} className="styled-select">
                        <option value="0">0 Projects</option>
                        <option value="1">1-2 Projects</option>
                        <option value="2">3-4 Projects</option>
                        <option value="3">5+ Projects</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group mb-5">
                    <label style={{fontSize: '0.8rem', opacity: 0.7}}>History of Backlogs?</label>
                    <select name="backlogs" value={formData.backlogs} onChange={handleChange} className="styled-select">
                      <option value="0">None (0)</option>
                      <option value="1">Currently 1</option>
                      <option value="2">Currently 2</option>
                      <option value="3">3 or more</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.2rem', fontSize: '1.1rem', background: 'var(--primary)', fontWeight: '700'}}>
                  {loading ? <><span className="spinner"></span> Predicting...</> : 'Check My Prediction 🚀'}
                </button>
              </form>
              {error && <div className="error-message mt-3">{error}</div>}
            </div>

            <div className="card frosted-card" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)'}}>
               <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.2rem', letterSpacing: '1.5px', fontWeight: '900'}}>App Performance</h4>
               <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                    <span style={{color: '#64748b'}}>Current Status</span>
                    <span style={{color: result ? 'var(--success)' : 'white'}}>{engineStatus}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                    <span style={{color: '#64748b'}}>Success Accuracy</span>
                    <span style={{color: 'white', fontWeight: 'bold'}}>98.4%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                    <span style={{color: '#64748b'}}>Insights Foundation</span>
                    <span style={{color: 'white'}}>7,500 Profiles</span>
                  </div>
               </div>
            </div>
          </section>
        </aside>

        <main className="dashboard-results" style={{flex: 1, minWidth: 0}}>
          {!result && !loading && (
            <div className="placeholder-result card pop-in frosted-card" style={{marginTop: 0, minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div style={{fontSize: '5rem', marginBottom: '2rem'}}>📊</div>
              <h3 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white', fontFamily: 'var(--font-heading)'}}>Ready to Start</h3>
              <p style={{maxWidth: '500px', margin: '1.5rem auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
                Enter your details to calculate your placement probability and receive a personalized guidance report.
              </p>
            </div>
          )}
          
          {loading && (
            <div className="placeholder-result card pop-in frosted-card" style={{marginTop: 0, minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent)'}}></span>
              <h3 style={{fontSize: '2rem', marginTop: '2rem', fontFamily: 'var(--font-heading)'}}>Working on your report...</h3>
              <p className="text-muted">Comparing your details with our career success dataset.</p>
            </div>
          )}

          {result && (
            <div className="results-wrapper fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
              <div className="card overview-card mt-0 frosted-card" style={{borderLeft: '10px solid var(--accent)', padding: '3rem', display: 'flex', alignItems: 'center', gap: '3rem'}}>
                <div className="probability-wrapper">
                  <div className={`probability-circle ${getRiskColor(result.risk)}`} style={{borderWidth: '14px'}}></div>
                  <div className="probability-value" style={{fontSize: '4.5rem', fontWeight: '900'}}>
                    {Math.round(result.probability)}<span>%</span>
                  </div>
                </div>
                <div style={{flex: 1}}>
                  <span style={{fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px'}}>Placement Probability</span>
                  <h3 className="prediction-status" style={{fontSize: '3rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)'}}>{result.prediction}</h3>
                  <div className="badges mt-3" style={{display: 'flex', gap: '1rem'}}>
                    <span className={`badge ${getRiskColor(result.risk)}`} style={{padding: '0.5rem 1.2rem', fontSize: '0.9rem'}}>Stability: {result.risk}</span>
                    <span className="badge confidence" style={{background: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.5rem 1.2rem', fontSize: '0.9rem'}}>Confidence Score: {result.confidence}</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols" style={{alignItems: 'stretch', gap: '2.5rem'}}>
                <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                  <h3 className="section-title" style={{fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px'}}>Prediction breakdown 📊</h3>
                  <ul className="bullet-list" style={{listStyle: 'none', padding: 0}}>
                    {result.explanation.map((exp, i) => (
                      <li key={i} style={{fontSize: '0.95rem', marginBottom: '1rem', color: '#cbd5e1', lineHeight: '1.6', display: 'flex', gap: '0.8rem'}}>
                        <span style={{color: 'var(--accent)'}}>✦</span> {exp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card frosted-card" style={{margin: 0, padding: '2rem'}}>
                   <h3 className="section-title" style={{fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px'}}>Helpful Tips 💡</h3>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                      {result.insights.map((ins, i) => (
                        <div key={i} style={{padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--primary)', fontSize: '0.9rem', color: '#cbd5e1'}}>
                           {ins}
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="roadmap-container card" style={{background: 'rgba(15, 23, 42, 0.4)', padding: '2.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem'}}>
                   <h3 style={{fontSize: '1.8rem', fontWeight: '900'}}>6-Month Preparation Plan</h3>
                   <div style={{height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)'}}></div>
                </div>
                
                <div className="roadmap-stack" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                  {result.roadmap.map((rm, idx) => (
                    <div className="card roadmap-card pop-in" style={{animationDelay: `${idx * 0.15}s`, background: 'rgba(15, 23, 42, 0.6)'}} key={idx}>
                      <div className="rm-header" style={{padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <span className="rm-month">{rm.month}</span>
                        <h4 className="rm-focus" style={{fontSize: '1.1rem'}}>{rm.focus}</h4>
                        <div style={{fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--text-muted)'}}>{rm.weekly_hours} Effort</div>
                      </div>
                      <div className="rm-body" style={{padding: '1.5rem'}}>
                        <div className="rm-tasks">
                          <h5 style={{fontSize: '0.8rem', color: 'var(--accent)'}}>Recommended Tasks</h5>
                          <ul style={{marginBottom: '1.5rem', listStyle: 'none', padding: 0}}>
                            {rm.tasks.slice(0, 3).map((t, idx2) => <li key={idx2} style={{fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem'}}><span style={{color: 'var(--primary)'}}>→</span> {t}</li>)}
                          </ul>
                        </div>
                        <div className="rm-checkpoint" style={{fontSize: '0.8rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px'}}>
                          <strong style={{color: 'var(--success)'}}>Target:</strong> {rm.checkpoint}
                        </div>
                      </div>
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
