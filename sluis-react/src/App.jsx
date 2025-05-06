import { useEffect, useState } from "react";
// import "./style.css";
import "./styled.css";
import "./light-styled.css";
import WaterSector from "./components/WaterSector";
import SluisDeur from "./components/SluisDeur";
import Stoplichten from "./components/Stoplichten";

export default function App() {
  const useDummyData = true;
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Add initial theme setup
  useEffect(() => {
    // Apply dark mode by default
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

  // Dummy data voor waterstanden
  const dummyWaterstanden = [
    { sector: 'Boven', niveau: 2.5 },
    { sector: 'Midden', niveau: 1.8 },
    { sector: 'Beneden', niveau: 0.5 }
  ];

  // Dummy data voor logs
  const dummyLogs = [
    { tijd: '08:00', actie: 'Sluis gestart', details: 'Systeem opgestart en geïnitialiseerd' },
    { tijd: '08:05', actie: 'Waterstand gecontroleerd', details: 'Alle waterstanden binnen normale waarden' },
    { tijd: '08:10', actie: 'Deur 1 geopend', details: 'Deur 1 geopend voor schip "MS Antwerpia"' },
    { tijd: '08:15', actie: 'Waterstand aangepast', details: 'Waterstand sector 1 verhoogd naar 2.5m' },
    { tijd: '08:20', actie: 'Deur 2 geopend', details: 'Deur 2 geopend voor schip "MS Antwerpia"' },
    { tijd: '08:25', actie: 'Waterstand aangepast', details: 'Waterstand sector 2 verlaagd naar 1.8m' },
    { tijd: '08:30', actie: 'Deur 3 geopend', details: 'Deur 3 geopend voor schip "MS Antwerpia"' },
    { tijd: '08:35', actie: 'Waterstand aangepast', details: 'Waterstand sector 3 verlaagd naar 0.5m' },
    { tijd: '08:40', actie: 'Deur 3 gesloten', details: 'Deur 3 gesloten na passage "MS Antwerpia"' },
    { tijd: '08:45', actie: 'Systeem status', details: 'Alle systemen functioneren normaal' }
  ];

  // Dummy data voor deur statussen
  const dummyDeurStatussen = {
    deur1: { isOpen: false, isInBeweging: false },
    deur2: { isOpen: false, isInBeweging: false },
    deur3: { isOpen: false, isInBeweging: false }
  };

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
    
    // Start de beweging
    setDeurBeweging(true);
    addLog(`Sluisdeur ${deurNummer} ${isOpenen ? 'opent' : 'sluit'}...`);

    // Simuleer de bewegingstijd (3 seconden)
    setTimeout(() => {
      setDeurOpen(isOpenen);
      setDeurBeweging(false);
      addLog(`Sluisdeur ${deurNummer} ${isOpenen ? 'geopend' : 'gesloten'}`);
    }, 3000);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Licht' : '🌙 Donker'}
      </button>
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
}
