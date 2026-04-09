import React from 'react';

export default function Profile() {
  // Simple state simulation for a student profile
  const user = {
    name: 'Alex Johnson',
    email: 'alex.j@university.edu',
    university: 'Global Technical University',
    joined: 'April 2026'
  };

  const appStats = [
    { label: 'Predictions', value: '4', icon: '📊' },
    { label: 'Resume Score', value: '82%', icon: '📄' },
    { label: 'GitHub Sync', value: 'Active', icon: '🛡️' }
  ];

  return (
    <div className="page-container fade-in">
      <div className="hero-section" style={{padding: '3rem 0', minHeight: 'auto'}}>
        <div className="hero-content">
          <span className="header-badge">My Account 👤</span>
          <h1 className="hero-title" style={{fontSize: '3.5rem', fontFamily: 'var(--font-heading)'}}>Welcome, <span className="text-gradient">{user.name.split(' ')[0]}</span></h1>
          <p className="hero-subtitle" style={{fontSize: '1.1rem', maxWidth: '600px', margin: '0.5rem auto'}}>
            Keep track of your placement progress and app activity here.
          </p>
        </div>
      </div>

      <div className="dashboard-grid" style={{maxWidth: '1000px', margin: '0 auto', gridTemplateColumns: '1fr 1.5fr', gap: '2rem'}}>
        {/* User Identity Details */}
        <section className="card frosted-card" style={{padding: '2.5rem'}}>
          <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: '5px solid rgba(255,255,255,0.05)'}}>
             👨‍🎓
          </div>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
             <h3 style={{fontSize: '1.5rem', marginBottom: '0.3rem'}}>{user.name}</h3>
             <p style={{color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold'}}>{user.university}</p>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                <span style={{color: '#64748b'}}>Email</span>
                <span style={{color: 'white'}}>{user.email}</span>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                <span style={{color: '#64748b'}}>Member Since</span>
                <span style={{color: 'white'}}>{user.joined}</span>
             </div>
          </div>
        </section>

        {/* App Activity Stats */}
        <section className="activity-details" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
           <div className="card frosted-card" style={{padding: '2rem'}}>
             <h4 style={{fontSize: '1.1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#cbd5e1'}}>App Activity</h4>
             <div className="grid-3-cols" style={{gap: '1rem'}}>
               {appStats.map((stat, idx) => (
                 <div key={idx} style={{padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>{stat.icon}</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>{stat.value}</div>
                    <p style={{fontSize: '0.7rem', color: '#64748b', marginTop: '0.3rem'}}>{stat.label}</p>
                 </div>
               ))}
             </div>
           </div>

           <div className="card frosted-card" style={{padding: '2rem'}}>
             <h4 style={{fontSize: '1.1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#cbd5e1'}}>Recent Steps</h4>
             <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                <div style={{padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                   <span style={{fontSize: '0.9rem'}}>Placement Prediction Result</span>
                   <span style={{fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold'}}>85% Ready</span>
                </div>
                <div style={{padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                   <span style={{fontSize: '0.9rem'}}>Resume Analysis</span>
                   <span style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold'}}>Success</span>
                </div>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}
