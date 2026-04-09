import React from 'react';

export default function Dashboard() {
  return (
    <div className="page-container fade-in" style={{ padding: '2rem' }}>
      <div className="card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Dashboard</h1>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          Placement prediction dashboard is ready. Use the sidebar controls to run the model.
        </p>
      </div>
    </div>
  );
}
