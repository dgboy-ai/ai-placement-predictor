import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import GithubVerification from './pages/GithubVerification';
import PlacementPredictor from './pages/PlacementPredictor';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    // Check auth status on load and storage changes
    const checkAuth = () => {
      setIsAuth(localStorage.getItem('isAuthenticated') === 'true');
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <div className="app-shell" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <Navbar />
        <main className="main-content" style={{paddingTop: isAuth ? '85px' : '0px', flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isAuth ? <Navigate to="/" /> : <Register />} />

            {/* Protected Application Routes */}
            <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
            <Route path="/predictor" element={isAuth ? <PlacementPredictor /> : <Navigate to="/login" />} />
            <Route path="/analyzer" element={isAuth ? <ResumeAnalyzer /> : <Navigate to="/login" />} />
            <Route path="/github" element={isAuth ? <GithubVerification /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/about" element={isAuth ? <About /> : <Navigate to="/login" />} />
            
            {/* Global Redirect */}
            <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} />} />
          </Routes>
        </main>
        {isAuth && <Footer />}
      </div>
    </Router>
  );
}

export default App;
