import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WaterSector from './WaterSector';
import SluisDeur from './SluisDeur';
import Stoplichten from './Stoplichten';

// Simpele boolean om te wisselen tussen WebSocket en dummy data
const USE_WEBSOCKET = true; // Zet op true voor WebSocket data, false voor dummy data

const ControlPanel = () => {
  const navigate = useNavigate();
  const ws = useRef(null);
  const [useWebSocket, setUseWebSocket] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true;
  };
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Sluit settings menu als er buiten wordt geklikt
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const [waterLevels, setWaterLevels] = useState({
    Sensor1: 5,
    Sensor2: 5,
    Sensor3: 5,
  });

  const [logs, setLogs] = useState([]);
  const [time, setTime] = useState("");
  const [deur1Open, setDeur1Open] = useState(false);
  const [deur2Open, setDeur2Open] = useState(false);
  const [deur1InBeweging, setDeur1InBeweging] = useState(false);
  const [deur2InBeweging, setDeur2InBeweging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("nl-NL", { hour12: false });
      setTime(formattedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket effect
  useEffect(() => {
    if (USE_WEBSOCKET) {
      ws.current = new WebSocket('ws://localhost:8000/ws/ac/');
      
      ws.current.onopen = () => {
        addLog('WebSocket verbinding geopend');
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setWaterLevels({
          Sensor1: data.Sensor1,
          Sensor2: data.Sensor2,
          Sensor3: data.Sensor3,
        });
        addLog(`WebSocket data ontvangen: Sensor1=${data.Sensor1}, Sensor2=${data.Sensor2}, Sensor3=${data.Sensor3}`);
      };

      ws.current.onerror = (error) => {
        addLog('WebSocket error: ' + error.message);
      };

      ws.current.onclose = () => {
        addLog('WebSocket verbinding gesloten');
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, []);

  // Dummy data effect
  useEffect(() => {
    if (!USE_WEBSOCKET) {
      const dummyInterval = setInterval(() => {
        const base = Math.floor(Math.random() * 6) + 3;
        const variation = Math.floor(Math.random() * 3) - 1;

        const dummyData = {
          Sensor1: base,
          Sensor2: base + variation,
          Sensor3: base - variation,
        };
        setWaterLevels(dummyData);
        addLog(
          `Dummy data: Sensor1=${dummyData.Sensor1}, Sensor2=${dummyData.Sensor2}, Sensor3=${dummyData.Sensor3}`
        );
      }, 1000);
      return () => clearInterval(dummyInterval);
    }
  }, []);

  const addLog = (message) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("nl-NL", { hour12: false });
    setLogs((prev) => [...prev, `[${currentTime}] ${message}`]);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleDataSource = () => {
    setUseWebSocket(prev => !prev);
    addLog(`Gewisseld naar ${!useWebSocket ? 'WebSocket' : 'dummy'} data`);
  };

  const handleDeurActie = (deurNummer, actie) => {
    const isOpenen = actie === 'openen';
    const setDeurOpen = deurNummer === 1 ? setDeur1Open : setDeur2Open;
    const setDeurBeweging = deurNummer === 1 ? setDeur1InBeweging : setDeur2InBeweging;
    
    setDeurBeweging(true);
    addLog(`Sluisdeur ${deurNummer} ${isOpenen ? 'opent' : 'sluit'}...`);

    setTimeout(() => {
      setDeurOpen(isOpenen);
      setDeurBeweging(false);
      addLog(`Sluisdeur ${deurNummer} ${isOpenen ? 'geopend' : 'gesloten'}`);
    }, 3000);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="control-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Terug naar Home
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️ Licht' : '🌙 Donker'}
        </button>
      </div>

      <div className="screen">
        <h1>{time}</h1>
        <div className="sluis-container">
          <WaterSector level={waterLevels.Sensor1} sectorClass="sector1" />
          <div className="sluis">
            <Stoplichten isOpen={deur1Open} />
            <div
              className="sluisdeur"
              style={{ 
                opacity: deur1Open ? 0.3 : 1,
                transition: 'opacity 3s ease'
              }}
            ></div>
            <div className="knoppen">
              <button
                className="openen"
                onClick={() => handleDeurActie(1, 'openen')}
                disabled={deur1Open || deur1InBeweging}
              >
                Openen
              </button>
              <button
                className="sluiten"
                onClick={() => handleDeurActie(1, 'sluiten')}
                disabled={!deur1Open || deur1InBeweging}
              >
                Sluiten
              </button>
            </div>
          </div>
          <WaterSector level={waterLevels.Sensor2} sectorClass="sector2" />
          <div className="sluis">
            <Stoplichten isOpen={deur2Open} />
            <div
              className="sluisdeur"
              style={{ 
                opacity: deur2Open ? 0.3 : 1,
                transition: 'opacity 3s ease'
              }}
            ></div>
            <div className="knoppen">
              <button
                className="openen"
                onClick={() => handleDeurActie(2, 'openen')}
                disabled={deur2Open || deur2InBeweging}
              >
                Openen
              </button>
              <button
                className="sluiten"
                onClick={() => handleDeurActie(2, 'sluiten')}
                disabled={!deur2Open || deur2InBeweging}
              >
                Sluiten
              </button>
            </div>
          </div>
          <WaterSector level={waterLevels.Sensor3} sectorClass="sector3" />
        </div>
      </div>

      <div className="logs-container">
        <h2>Sluis Logs</h2>
        <div className="logs">
          {logs.map((log, idx) => (
            <p key={idx}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 