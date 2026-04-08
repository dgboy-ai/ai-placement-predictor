import { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    attendance: '',
    cgpa: '',
    internships: '',
    projects: '',
    skills_score: '',
    communication_score: '',
    backlogs: ''
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
              <div className="form-group mb-4">
                <label>Attendance (%)</label>
                <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} required min="0" max="100" placeholder="e.g. 85" />
              </div>
              <div className="form-group mb-4">
                <label>CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} required min="0" max="10" placeholder="e.g. 8.5" />
              </div>
              <div className="grid-2-cols mb-4">
                <div className="form-group">
                  <label>Internships</label>
                  <input type="number" name="internships" value={formData.internships} onChange={handleChange} required min="0" placeholder="e.g. 2" />
                </div>
                <div className="form-group">
                  <label>Projects</label>
                  <input type="number" name="projects" value={formData.projects} onChange={handleChange} required min="0" placeholder="e.g. 3" />
                </div>
              </div>
              <div className="grid-2-cols mb-4">
                <div className="form-group">
                  <label>Skills (0-10)</label>
                  <input type="number" name="skills_score" step="0.1" value={formData.skills_score} onChange={handleChange} required min="0" max="10" placeholder="e.g. 8.0" />
                </div>
                <div className="form-group">
                  <label>Communication (0-10)</label>
                  <input type="number" name="communication_score" step="0.1" value={formData.communication_score} onChange={handleChange} required min="0" max="10" placeholder="e.g. 7.5" />
                </div>
              </div>
              <div className="form-group mb-5">
                <label>Backlogs</label>
                <input type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} required min="0" placeholder="e.g. 0" />
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
            <div className="results-section fade-in">
              <div className="card overview-card">
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
              <div className="card roadmap-card" key={idx}>
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
