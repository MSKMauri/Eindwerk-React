import { useEffect, useState } from "react";
import "./style.css";
import WaterSector from "./components/WaterSector";
import SluisDeur from "./components/SluisDeur";
import Stoplichten from "./components/Stoplichten";


export default function App() {
  const useDummyData = true;

  const [waterLevels, setWaterLevels] = useState({
    Sensor1: 5,
    Sensor2: 5,
    Sensor3: 5,
  });

  const [logs, setLogs] = useState([]);
  const [time, setTime] = useState("");
  const [deur1Open, setDeur1Open] = useState(false);
  const [deur2Open, setDeur2Open] = useState(false);

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
        addLog(`Dummy data: Sensor1=${dummyData.Sensor1}, Sensor2=${dummyData.Sensor2}, Sensor3=${dummyData.Sensor3}`);
      }, 1000);
      return () => clearInterval(dummyInterval);
    }
  }, [useDummyData]);

  const addLog = (message) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("nl-NL", { hour12: false });
    setLogs((prev) => [...prev, `[${currentTime}] ${message}`]);
  };

  return (
    <div>
      <div className="screen">
        <h1>{time}</h1>
        <div className="sluis-container">
          <WaterSector level={waterLevels.Sensor1} sectorClass="sector1" />
          <div className="sluis">
            <Stoplichten isOpen={deur1Open} />
            <div className="sluisdeur" style={{ opacity: deur1Open ? 0.3 : 1 }}></div>
            <div className="knoppen">
              <button className="openen" onClick={() => { setDeur1Open(true); addLog("Sluisdeur 1 geopend"); }} disabled={deur1Open}>
                Openen
              </button>
              <button className="sluiten" onClick={() => { setDeur1Open(false); addLog("Sluisdeur 1 gesloten"); }} disabled={!deur1Open}>
                Sluiten
              </button>
            </div>
          </div>
          <WaterSector level={waterLevels.Sensor2} sectorClass="sector2" />
          <div className="sluis">
            <Stoplichten isOpen={deur2Open} />
            <div className="sluisdeur" style={{ opacity: deur2Open ? 0.3 : 1 }}></div>
            <div className="knoppen">
              <button className="openen" onClick={() => { setDeur2Open(true); addLog("Sluisdeur 2 geopend"); }} disabled={deur2Open}>
                Openen
              </button>
              <button className="sluiten" onClick={() => { setDeur2Open(false); addLog("Sluisdeur 2 gesloten"); }} disabled={!deur2Open}>
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
