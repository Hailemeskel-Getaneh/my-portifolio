import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Terminal as TerminalIcon, RefreshCw } from 'lucide-react';
import { usePortfolioData } from '../context/DataContext';
import './TerminalHero.css';

export default function TerminalHero() {
  const { data } = usePortfolioData();
  const [logs, setLogs] = useState([]);
  const [showMain, setShowMain] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const hasStarted = React.useRef(false);

  useEffect(() => {
    let timeoutId;

    const streamLogs = async () => {
      if (!data || hasStarted.current) return;
      hasStarted.current = true;

      const logsToStream = data.terminalLogs || ['Booting system...', 'Loading modules...', 'System Ready.'];
      setLogs([]); // Reset logs at start

      // Show initial logs almost immediately
      for (let i = 0; i < logsToStream.length; i++) {
        setLogs(prev => [...prev, logsToStream[i]]);
        await new Promise(resolve => timeoutId = setTimeout(resolve, 50));
      }

      // Type out the final initialization line
      const finalLine = "System initialization complete.";
      let currentTyped = "";

      for (let j = 0; j < finalLine.length; j++) {
        await new Promise(resolve => timeoutId = setTimeout(resolve, 15));
        currentTyped += finalLine[j];
        setLogs(prev => {
          const next = [...prev];
          if (j === 0) next.push(currentTyped);
          else next[next.length - 1] = currentTyped;
          return next;
        });
      }

      await new Promise(resolve => timeoutId = setTimeout(resolve, 400));
      setShowMain(true);
    };

    if (data) streamLogs();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [data]);

  if (!data) return null;

  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        {/* Left Side: Content */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {showMain && (
            <>
              <h1 className="hero-title">
                Hi, I'm <span className="gradient-text">{data.personalInfo.name}</span>
              </h1>
              <h2 className="hero-subtitle">
                {data.personalInfo.title}
              </h2>
              <p className="hero-tagline">
                {data.personalInfo.tagline}
              </p>

              <div className="hero-actions">
                <a href="#projects" className="btn-primary">
                  GET /projects
                </a>
                <a href="#contact" className="btn-secondary">
                  POST /contact
                </a>
              </div>
            </>
          )}
        </motion.div>

        {/* Right Side: Terminal Card */}
        <AnimatePresence>
          {!isClosed && (
            <motion.div
              className={`terminal-window ${isMinimized ? 'minimized' : ''}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="terminal-header">
                <div className="terminal-controls">
                  <button className="control-btn close" onClick={() => setIsClosed(true)}><X size={15} /></button>
                  <button className="control-btn minimize" onClick={() => setIsMinimized(!isMinimized)}><Minus size={15} /></button>
                </div>
                <div className="terminal-title">
                  <TerminalIcon size={14} /> bash — {data.personalInfo.name.toLowerCase()}@portfolio
                </div>
              </div>

              {!isMinimized && (
                <div className="terminal-body">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="log-line"
                    >
                      <span className="log-prefix">{'>'}</span> {log}
                    </motion.div>
                  ))}
                  {!showMain && <span className="cursor-blink" />}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isClosed && (
          <button className="reopen-terminal" onClick={() => setIsClosed(false)}>
            <RefreshCw size={18} /> Restore Terminal
          </button>
        )}
      </div>
    </section>
  );
}
