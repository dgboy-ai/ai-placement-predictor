import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'New Student');
    window.location.href = '/';
  };

  const handleDemo = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Demo Student');
    window.location.href = '/';
  };

  return (
    <div className="page-container fade-in" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '4rem 0'}}>
      <div className="card frosted-card" style={{width: '500px', padding: '3.5rem'}}>
         <div style={{textAlign: 'center', marginBottom: '3rem'}}>
           <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌱</div>
           <h1 style={{fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem'}}>Get Started</h1>
           <p style={{color: '#64748b', fontSize: '0.95rem'}}>Join students building their future with Nextora AI.</p>
         </div>

         <form className="input-form" onSubmit={handleRegister}>
            <div className="form-group mb-4">
              <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Full Name</label>
              <input type="text" className="styled-input" placeholder="Enter your name" required />
            </div>
            <div className="form-group mb-4">
               <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Academic Email</label>
               <input type="email" className="styled-input" placeholder="yourname@edu.com" required />
            </div>
            <div className="form-group mb-5">
              <label style={{fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px'}}>Security Phrase</label>
              <input type="password" className="styled-input" placeholder="••••••••" required />
            </div>

            <button type="submit" className="submit-btn" style={{padding: '1.2rem', fontSize: '1.1rem', background: 'var(--accent)', fontWeight: '700', marginBottom: '1rem'}}>
               Create Account 🚀
            </button>
         </form>

         <button onClick={handleDemo} style={{
            width: '100%', 
            padding: '1rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px', 
            color: 'var(--primary)', 
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '2rem'
         }}>
           Quick Demo Access ⚡
         </button>

         <div style={{textAlign: 'center', fontSize: '0.9rem', color: '#64748b'}}>
            Already on the journey? <Link to="/login" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold'}}>Sign In</Link>
         </div>
      </div>
    </div>
  );
}
