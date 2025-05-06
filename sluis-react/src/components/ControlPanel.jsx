import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WaterSector from './WaterSector';
import SluisDeur from './SluisDeur';
import Stoplichten from './Stoplichten';

const ControlPanel = () => {
  const navigate = useNavigate();
  const useDummyData = true;
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Add initial theme setup
  useEffect(() => {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  }, []);

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

  useEffect(() => {
    if (useDummyData) {
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
  }, [useDummyData]);

  const addLog = (message) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("nl-NL", { hour12: false });
    setLogs((prev) => [...prev, `[${currentTime}] ${message}`]);
  };

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