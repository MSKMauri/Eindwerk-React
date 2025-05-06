import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ControlPanel from './components/ControlPanel';
import "./styled.css";
import "./light-styled.css";
import WaterSector from "./components/WaterSector";
import SluisDeur from "./components/SluisDeur";
import Stoplichten from "./components/Stoplichten";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/control" element={<ControlPanel />} />
      </Routes>
    </Router>
  );
}
