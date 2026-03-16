import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { DataProvider, usePortfolioData } from './context/DataContext';

import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import TerminalHero from './components/TerminalHero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import SEO from './components/SEO';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

/* ──────────────────────────────────────────────
   Public portfolio page
─────────────────────────────────────────────── */
function PortfolioPage() {
  const { data, loading, error } = usePortfolioData();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0a0a0a',
        color: 'var(--accent-cyan)',
        fontFamily: 'monospace'
      }}>
        <div className="animate-pulse">Initializing System... [FETCHING_CORE_DATA]</div>
      </div>
    );
  }

  if (error) {
     return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#0a0a0a',
          color: '#ef4444',
          fontFamily: 'monospace',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div>[CRITICAL_FAILURE] Failed to establish secure connection with backend.</div>
          <div style={{ color: '#6b7280', marginTop: '1rem', fontSize: '0.8rem' }}>Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '2rem', 
              padding: '0.5rem 1rem', 
              border: '1px solid #ef4444', 
              background: 'transparent',
              color: '#ef4444',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      );
  }

  return (
    <>
      <SEO data={data} />
      <Background3D />
      <Navbar />
      <AnimatePresence>
        <main>
          <TerminalHero />
          <About />
          <Projects />
          <Contact />
        </main>
      </AnimatePresence>
      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-mono)',
        color: '#6b7280',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,10,0.6)'
      }}>
        <p>&copy; {new Date().getFullYear()} — Engineered with React & Three.js</p>
        <p style={{ marginTop: '0.5rem', color: 'var(--accent-cyan)', opacity: 0.4 }}>System Status: 200 OK</p>
      </footer>
    </>
  );
}

/* ──────────────────────────────────────────────
   App with Router
─────────────────────────────────────────────── */
function App() {
  return (
    <HelmetProvider>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1f1f1f',
          color: '#fff',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          fontFamily: 'monospace'
        }
      }} />
      <BrowserRouter>
        <Routes>
          {/* Public portfolio */}
          <Route
            path="/"
            element={
              <DataProvider>
                <PortfolioPage />
              </DataProvider>
            }
          />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
