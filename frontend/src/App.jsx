import { useState } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [formData, setFormData] = useState({
    attendance: '',
    cgpa: '',
    internships: '',
    projects: '',
    skills_score: '',
    communication_score: '',
    backlogs: ''
  })
  
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    
    // Validate inputs aren't completely empty when required
    // (Handled partially by the browser required & min/max, but just to be safe)
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError('Server error')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return '';
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Placement Copilot</h1>
        <p>Analyze your profile and get AI-driven placement insights.</p>
      </header>

      <main className="main-content">
        <section className="form-section card">
          <h2>Student Profile Details</h2>
          <form onSubmit={handleSubmit} className="input-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Attendance (%)</label>
                <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} required min="0" max="100" />
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} required min="0" max="10" />
              </div>
              <div className="form-group">
                <label>Internships</label>
                <input type="number" name="internships" value={formData.internships} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Projects</label>
                <input type="number" name="projects" value={formData.projects} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Skills Score (0-10)</label>
                <input type="number" name="skills_score" step="0.1" value={formData.skills_score} onChange={handleChange} required min="0" max="10" />
              </div>
              <div className="form-group">
                <label>Communication Score (0-10)</label>
                <input type="number" name="communication_score" step="0.1" value={formData.communication_score} onChange={handleChange} required min="0" max="10" />
              </div>
              <div className="form-group">
                <label>Backlogs</label>
                <input type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} required min="0" />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Analyzing...' : 'Predict'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </section>

        {result && (
          <section className="results-section">
            <div className="card overview-card">
              <div className={`probability-circle ${getRiskColor(result.risk)}`}>
                <span className="probability-value">{Math.round(result.probability)}%</span>
              </div>
              <div className="overview-details">
                <h3 className="prediction-status">{result.prediction}</h3>
                <div className="badges">
                  <span className={`badge risk ${getRiskColor(result.risk)}`}>Risk: {result.risk}</span>
                  {result.confidence && <span className="badge confidence">Confidence: {result.confidence}</span>}
                </div>
              </div>
            </div>

            <div className="details-grid">
              {result.insights && result.insights.length > 0 && (
                <div className="card insights-card">
                  <h3>Insights</h3>
                  <ul className="bullet-list">
                    {result.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.explanation && result.explanation.length > 0 && (
                <div className="card explanation-card">
                  <h3>Explanation</h3>
                  <ul className="bullet-list">
                    {result.explanation.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.roadmap && result.roadmap.length > 0 && (
              <div className="roadmap-section">
                <h3>Personalized Roadmap</h3>
                <div className="roadmap-grid">
                  {result.roadmap.map((rm, idx) => (
                    <div key={idx} className="card roadmap-card">
                      <div className="rm-header">
                        <span className="rm-month">{rm.month}</span>
                        <h4 className="rm-focus">{rm.focus}</h4>
                      </div>
                      <div className="rm-body">
                        {rm.tasks && rm.tasks.length > 0 && (
                          <div className="rm-tasks">
                            <h5>Tasks</h5>
                            <ul>
                              {rm.tasks.map((t, idx2) => <li key={idx2}>{t}</li>)}
                            </ul>
                          </div>
                        )}
                        {rm.kpi && rm.kpi.length > 0 && (
                          <div className="rm-kpis">
                            <h5>KPIs</h5>
                            <ul>
                              {rm.kpi.map((k, idx2) => <li key={idx2}>{k}</li>)}
                            </ul>
                          </div>
                        )}
                        {rm.checkpoint && (
                          <div className="rm-checkpoint">
                            <strong>Checkpoint:</strong> {rm.checkpoint}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
