import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    attendance: 85,
    cgpa: 8.2,
    internships: 1,
    projects: 2,
    skills_score: 8.5,
    communication_score: 8.0,
    backlogs: 0
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [engineStatus, setEngineStatus] = useState('Standby');

  useEffect(() => {
    if (loading) setEngineStatus('Analyzing Vectors...');
    else if (result) setEngineStatus('Inference Complete');
    else setEngineStatus('Ready for Scan');
  }, [loading, result]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Predictive Node Failure: Connection to the DL Engine was interrupted.');
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
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <section className="dashboard-form">
                <div className="card shadow-glass">
              <h2 style={{fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                <span style={{fontSize: '1.8rem'}}>🎓</span> Student Profile
              </h2>
              
              <form onSubmit={handleSubmit} className="input-form">
                <div className="form-section">
                  <div className="form-group mb-4">
                    <div className="label-row">
                      <label>Academic Marks (CGPA)</label>
                      <span className="live-value">{formData.cgpa}</span>
                    </div>
                    <input type="range" name="cgpa" value={formData.cgpa} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                  </div>

                  <div className="grid-2-cols mb-4">
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem', opacity: 0.7}}>Attendance (%)</label>
                      <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} className="styled-input" />
                    </div>
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem', opacity: 0.7}}>Previous Backlogs</label>
                      <select name="backlogs" value={formData.backlogs} onChange={handleChange} className="styled-select">
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <div className="label-row">
                      <label>Technical Skill Score</label>
                      <span className="live-value" style={{color: 'var(--accent)'}}>{formData.skills_score}</span>
                    </div>
                    <input type="range" name="skills_score" value={formData.skills_score} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                  </div>

                  <div className="grid-2-cols mb-5">
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem'}}>Internships</label>
                      <select name="internships" value={formData.internships} onChange={handleChange} className="styled-select">
                        {[0,1,2,3,4].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{fontSize: '0.8rem'}}>Projects Done</label>
                      <select name="projects" value={formData.projects} onChange={handleChange} className="styled-select">
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.2rem', fontSize: '1.2rem'}}>
                  {loading ? <><span className="spinner"></span> Running Prediction...</> : 'Check My Placement Chances'}
                </button>
              </form>
              {error && <div className="error-message mt-4">{error}</div>}
            </div>
          </section>

          {/* --- ENGINE DETAILS --- */}
          <div className="card" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
             <h4 style={{fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.2rem', letterSpacing: '1px'}}>Prediction Engine Info</h4>
             <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                  <span style={{color: '#94a3b8'}}>App Status</span>
                  <span style={{color: 'var(--success)', fontWeight: 'bold'}}>{engineStatus}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                  <span style={{color: '#94a3b8'}}>Profiles Analyzed</span>
                  <span style={{color: 'white'}}>7,500 students</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                  <span style={{color: '#94a3b8'}}>Model Type</span>
                  <span style={{color: 'white'}}>Deep Learning</span>
                </div>
             </div>
          </div>
        </aside>

        <section className="dashboard-results">
          {!result && !loading && (
            <div className="placeholder-result card pop-in">
              <div className="placeholder-icon" style={{fontSize: '5rem'}}>📊</div>
              <h3 style={{fontSize: '3rem', fontWeight: '900', color: 'white'}}>Placement Prediction</h3>
              <p style={{maxWidth: '500px', margin: '1.5rem auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8'}}>
                Enter your details on the left to see your placement chances and get a personalized roadmap for the next 6 months.
              </p>
            </div>
          )}
          
          {loading && (
            <div className="placeholder-result card pop-in">
              <span className="spinner large-spinner" style={{borderTopColor: 'var(--accent)'}}></span>
              <h3 style={{fontSize: '2rem', marginTop: '2rem'}}>Calculating Chances...</h3>
              <p>Reviewing thousands of similar student profiles.</p>
            </div>
          )}

          {result && (
            <div className="results-wrapper fade-in">
              <div className="card overview-card mb-4 mt-0" style={{borderLeft: '10px solid var(--accent)', padding: '3rem'}}>
                <div className="probability-wrapper">
                  <div className={`probability-circle ${getRiskColor(result.risk)}`} style={{borderWidth: '15px'}}></div>
                  <div className="probability-value" style={{fontSize: '4.5rem'}}>
                    {Math.round(result.probability)}<span>%</span>
                  </div>
                </div>
                <div style={{flex: 1}}>
                  <span style={{fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px'}}>Results</span>
                  <h3 className="prediction-status" style={{fontSize: '2.5rem', marginTop: '0.5rem'}}>{result.prediction}</h3>
                  <div className="badges mt-3">
                    <span className={`badge ${getRiskColor(result.risk)}`}>Risk Level: {result.risk}</span>
                    <span className="badge confidence">System Accuracy: {result.confidence}</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-cols mb-4">
                <div className="card" style={{flex: 1.5}}>
                  <h3 className="section-title" style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>Why this prediction?</h3>
                  <ul className="bullet-list">
                    {result.explanation.map((exp, i) => (
                      <li key={i} style={{fontSize: '0.95rem', marginBottom: '1rem', color: '#e2e8f0'}}>{exp}</li>
                    ))}
                  </ul>
                </div>
                <div className="card" style={{flex: 1}}>
                   <h3 className="section-title" style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>Quick Tips</h3>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                      {result.insights.map((ins, i) => (
                        <div key={i} style={{padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.05)'}}>
                          {ins}
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="roadmap-container">
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                   <h3 style={{fontSize: '2.2rem', fontWeight: '900'}}>Career Roadmap</h3>
                   <div style={{height: '2px', flex: 1, background: 'linear-gradient(90deg, var(--accent), transparent)'}}></div>
                </div>
                
                <div className="roadmap-stack">
                  {result.roadmap.map((rm, idx) => (
                    <div className="card roadmap-card pop-in" style={{animationDelay: `${idx * 0.15}s`}} key={idx}>
                      <div className="rm-header">
                        <span className="rm-month">{rm.month}</span>
                        <h4 className="rm-focus">{rm.focus}</h4>
                        <div style={{fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)'}}>Time: {rm.weekly_hours}</div>
                      </div>
                      <div className="rm-body">
                        <div className="rm-tasks">
                          <h5>Main Tasks</h5>
                          <ul>
                            {rm.tasks.map((t, idx2) => <li key={idx2}>{t}</li>)}
                          </ul>
                        </div>
                        <div className="rm-checkpoint">
                          <strong>Goal:</strong> {rm.checkpoint}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
