import { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    attendance: 75,
    cgpa: 7.5,
    internships: 0,
    projects: 1,
    skills_score: 7.0,
    communication_score: 7.5,
    backlogs: 0
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'Failed to connect to the prediction server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return '';
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="dashboard-grid">
        <section className="dashboard-form">
          <div className="card">
            <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem'}}>
              <span style={{fontSize: '2.5rem'}}>📊</span> Profile Details
            </h2>
            <form onSubmit={handleSubmit} className="input-form">
              {/* --- SECTION: Academic Details --- */}
              <div className="form-section">
                <h3 className="section-title">Academic Details</h3>
                
                <div className="form-group mb-5">
                  <div className="label-row" style={{alignItems: 'flex-end', marginBottom: '0'}}>
                    <label style={{fontSize: '1rem', fontWeight: '700', color: 'white'}}>Current CGPA</label>
                    <span className="live-value">{formData.cgpa || 0}</span>
                  </div>
                  <input type="range" name="cgpa" value={formData.cgpa} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                </div>

                <div className="grid-2-cols mb-5">
                  <div className="form-group">
                    <div className="label-row" style={{alignItems: 'flex-end', marginBottom: '0'}}>
                      <label style={{fontSize: '0.9rem', fontWeight: '700'}}>Attendance</label>
                      <span className="live-value">{formData.attendance || 0}%</span>
                    </div>
                    <input type="range" name="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" className="styled-slider" />
                  </div>
                  <div className="form-group" style={{justifyContent: 'flex-end'}}>
                    <label style={{marginBottom: '0.8rem'}}>Backlogs</label>
                    <select name="backlogs" value={formData.backlogs} onChange={handleChange} className="styled-select">
                      <option value="0">Zero Backlogs</option>
                      <option value="1">1 Backlog</option>
                      <option value="2">2 Backlogs</option>
                      <option value="3">3+ Backlogs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- SECTION: Skills & Experience --- */}
              <div className="form-section mb-5">
                <h3 className="section-title">Skills &amp; Experience</h3>
                
                <div className="form-group mb-5">
                  <div className="label-row" style={{alignItems: 'flex-end', marginBottom: '0'}}>
                    <label style={{fontSize: '0.9rem', fontWeight: '700'}}>Technical Skills Level</label>
                    <span className="live-value" style={{background: 'rgba(168, 85, 247, 0.3)', borderColor: 'rgba(168, 85, 247, 0.5)'}}>{formData.skills_score || 0}</span>
                  </div>
                  <input type="range" name="skills_score" value={formData.skills_score} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                </div>

                <div className="form-group mb-5">
                  <div className="label-row" style={{alignItems: 'flex-end', marginBottom: '0'}}>
                    <label style={{fontSize: '0.9rem', fontWeight: '700'}}>Communication Proficiency</label>
                    <span className="live-value" style={{background: 'rgba(14, 165, 233, 0.3)', borderColor: 'rgba(14, 165, 233, 0.5)'}}>{formData.communication_score || 0}</span>
                  </div>
                  <input type="range" name="communication_score" value={formData.communication_score} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                </div>

                <div className="grid-2-cols">
                  <div className="form-group">
                    <label style={{marginBottom: '0.8rem'}}>Internships</label>
                    <select name="internships" value={formData.internships} onChange={handleChange} className="styled-select">
                      <option value="0">No Internships</option>
                      <option value="1">1 Internship</option>
                      <option value="2">2 Internships</option>
                      <option value="3">3+ Internships</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{marginBottom: '0.8rem'}}>Hands-on Projects</label>
                    <select name="projects" value={formData.projects} onChange={handleChange} className="styled-select">
                      <option value="0">No Projects</option>
                      <option value="1">1 Project</option>
                      <option value="2">2 Projects</option>
                      <option value="3">3+ Projects</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading} style={{padding: '1.5rem', fontSize: '1.4rem'}}>
                {loading ? (
                  <><span className="spinner"></span> Running AI Defense...</>
                ) : (
                  'Predict My Future'
                )}
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        </section>

        <section className="dashboard-results">
          {!result && !loading && (
            <div className="placeholder-result card fade-in" style={{borderStyle: 'solid', background: 'rgba(30, 41, 59, 0.3)', borderColor: 'rgba(255,255,255,0.05)'}}>
              <div className="placeholder-icon">📊</div>
              <h3 style={{fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px'}}>Ready to Transform?</h3>
              <p style={{maxWidth: '500px', margin: '0 auto', fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.8'}}>
                Complete your profile on the left to unlock deep learning powered insights into your placement probability and career roadmap.
              </p>
              <div style={{marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                 <span style={{padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.9rem'}}>8 Features Analyzed</span>
                 <span style={{padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.9rem'}}>Deterministic Results</span>
              </div>
            </div>
          )}
          
          {loading && !result && (
            <div className="placeholder-result loading-result card fade-in">
              <span className="spinner large-spinner" style={{borderColor: 'rgba(14, 165, 233, 0.2)', borderTopColor: 'var(--accent)'}}></span>
              <h3 style={{fontSize: '2.5rem', fontWeight: '900'}}>Simulating Scenarios...</h3>
              <p style={{fontSize: '1.2rem'}}>Our AI is crunching your data to find the optimal career path.</p>
            </div>
          )}

          
          {result && (
            <div className="results-section">
              <div className="card overview-card pop-in">
                <div className="probability-wrapper">
                  <div className={`probability-circle ${getRiskColor(result.risk)}`}></div>
                  <div className="probability-value">{Math.round(result.probability)}<span>%</span></div>
                </div>
                <div className="overview-details">
                  <h3 className="prediction-status">{result.prediction}</h3>
                  <div className="badges">
                    <span className={`badge risk ${getRiskColor(result.risk)}`}>Risk: {result.risk}</span>
                    {result.confidence && <span className="badge confidence">Confidence: {result.confidence}</span>}
                  </div>
                </div>
              </div>

              <div className="details-stack">
                {result.insights && result.insights.length > 0 && (
                  <div className="card insights-card">
                    <h3>Key Insights</h3>
                    <ul className="bullet-list">
                      {result.insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.explanation && result.explanation.length > 0 && (
                  <div className="card explanation-card">
                    <h3>Model Explanation</h3>
                    <ul className="bullet-list">
                      {result.explanation.map((exp, idx) => (
                        <li key={idx}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}
        </section>
      </div>

      {result && result.roadmap && result.roadmap.length > 0 && (
        <div className="roadmap-section fade-in">
          <h3>Your 6-Month Roadmap</h3>
          <div className="roadmap-stack">
            {result.roadmap.map((rm, idx) => (
              <div className="card roadmap-card pop-in" style={{animationDelay: `${idx * 0.15}s`}} key={idx}>
                <div className="rm-header">
                  <span className="rm-month">{rm.month}</span>
                  <h4 className="rm-focus">{rm.focus}</h4>
                </div>
                <div className="rm-body">
                  {rm.tasks && rm.tasks.length > 0 && (
                    <div className="rm-tasks">
                      <h5>Strategic Tasks</h5>
                      <ul>
                        {rm.tasks.map((t, idx2) => <li key={idx2}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                  {rm.kpi && rm.kpi.length > 0 && (
                    <div className="rm-kpis">
                      <h5>Target KPIs</h5>
                      <ul>
                        {rm.kpi.map((k, idx2) => <li key={idx2}>{k}</li>)}
                      </ul>
                    </div>
                  )}
                  {rm.checkpoint && (
                    <div className="rm-checkpoint">
                      <strong>Checkpoint</strong> 
                      {rm.checkpoint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
