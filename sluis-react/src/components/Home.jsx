import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️ Licht' : '🌙 Donker'}
        </button>
      </div>
      <div className="home-content">
        <h1>Sluis Controle Systeem</h1>
        <p className="subtitle">Beheer en monitor uw sluis operaties</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Real-time Monitoring</h3>
            <p>Bekijk live waterstanden en deur status</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Directe Controle</h3>
            <p>Bedien de sluisdeuren met één klik</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📝</span>
            <h3>Gedetailleerde Logs</h3>
            <p>Bekijk alle activiteiten en gebeurtenissen</p>
          </div>
        </div>

        <button 
          className="start-button"
          onClick={() => navigate('/control')}
        >
          Start Controle Paneel
        </button>
      </div>
    </div>
  );
};

export default Home; 