import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import GithubVerification from './pages/GithubVerification';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="main-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/github" element={<GithubVerification />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
