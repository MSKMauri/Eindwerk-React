const WaterSector = ({ level, sectorClass }) => {
    const percentage = (level / 10) * 100;
  
    return (
      <div className={`sector ${sectorClass}`} style={{ position: "relative" }}>
        <div className="water-text">{level} cm</div>
        <div className="water-level" style={{ height: `${percentage}%` }}></div>
      </div>
    );
  };
  
  export default WaterSector;
  