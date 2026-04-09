import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate Login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Alex Johnson');
    window.location.href = '/'; // Refresh to update auth state
  };

  const handleDemo = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Demo Student');
    window.location.href = '/';
  };

  return (
    <div className="page-container fade-in" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="card frosted-card" style={{width: '450px', padding: '3.5rem'}}>
         <div style={{textAlign: 'center', marginBottom: '3rem'}}>
           <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✨</div>
           <h1 style={{fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem'}}>Welcome Back</h1>
           <p style={{color: '#64748b', fontSize: '0.95rem'}}>Access your professional career hub.</p>
         </div>

         <form className="input-form" onSubmit={handleLogin}>
            <div className="form-group mb-4">
              <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Academic Email</label>
              <input 
                type="email" 
                className="styled-input" 
                placeholder="yourname@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-5">
              <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Password</label>
              <input 
                type="password" 
                className="styled-input" 
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn" style={{padding: '1.2rem', fontSize: '1.1rem', background: 'var(--primary)', fontWeight: '700', marginBottom: '1rem'}}>
               Sign In 🚀
            </button>
         </form>

         <button onClick={handleDemo} style={{
            width: '100%', 
            padding: '1rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px', 
            color: 'var(--accent)', 
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '2rem'
         }}>
           Quick Demo Access ⚡
         </button>

         <div style={{textAlign: 'center', fontSize: '0.9rem', color: '#64748b'}}>
            New student? <Link to="/register" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold'}}>Get Started</Link>
         </div>
      </div>
    </div>
  );
}
