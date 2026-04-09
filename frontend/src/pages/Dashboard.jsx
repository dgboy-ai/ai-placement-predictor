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
            <h2>Profile Details</h2>
            <form onSubmit={handleSubmit} className="input-form">
              {/* --- SECTION: Academic Details --- */}
              <div className="form-section">
                <h3 className="section-title">Academic Details</h3>
                
                <div className="form-group mb-4">
                  <div className="label-row">
                    <label>CGPA</label>
                    <span className="live-value">{formData.cgpa || 0}</span>
                  </div>
                  <input type="range" name="cgpa" value={formData.cgpa} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                </div>

                <div className="grid-2-cols mb-4">
                  <div className="form-group">
                    <div className="label-row">
                      <label>Attendance (%)</label>
                      <span className="live-value">{formData.attendance || 0}%</span>
                    </div>
                    <input type="range" name="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" className="styled-slider" />
                  </div>
                  <div className="form-group">
                    <label>Backlogs</label>
                    <select name="backlogs" value={formData.backlogs} onChange={handleChange} className="styled-select">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- SECTION: Skills & Experience --- */}
              <div className="form-section mb-5">
                <h3 className="section-title">Skills &amp; Experience</h3>
                
                <div className="grid-2-cols mb-4">
                  <div className="form-group">
                    <div className="label-row">
                      <label>Technical Skills Level</label>
                      <span className="live-value">{formData.skills_score || 0}</span>
                    </div>
                    <input type="range" name="skills_score" value={formData.skills_score} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                  </div>
                  <div className="form-group">
                    <div className="label-row">
                      <label>Communication Skills</label>
                      <span className="live-value">{formData.communication_score || 0}</span>
                    </div>
                    <input type="range" name="communication_score" value={formData.communication_score} onChange={handleChange} min="0" max="10" step="0.1" className="styled-slider" />
                  </div>
                </div>

                <div className="grid-2-cols">
                  <div className="form-group">
                    <label>Internships</label>
                    <select name="internships" value={formData.internships} onChange={handleChange} className="styled-select">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Projects</label>
                    <select name="projects" value={formData.projects} onChange={handleChange} className="styled-select">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="spinner"></span> Analyzing...</>
                ) : (
                  'Predict Placement'
                )}
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        </section>

        <section className="dashboard-results">
          {!result && !loading && (
            <div className="placeholder-result card fade-in">
              <div className="placeholder-icon">🚀</div>
              <h3>Awaiting Input</h3>
              <p>Fill out the form on the left and click predict to generate your comprehensive analysis.</p>
            </div>
          )}
          
          {loading && !result && (
            <div className="placeholder-result loading-result card fade-in">
              <span className="spinner large-spinner"></span>
              <h3>Processing Profile...</h3>
              <p>The AI model is generating predictions, insights, and your personalized roadmap.</p>
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
