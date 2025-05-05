const Stoplichten = ({ isOpen }) => {
    return (
      <div className="stoplicht">
        <div className={`licht rood ${isOpen ? "uit" : ""}`}></div>
        <div className={`licht groen ${isOpen ? "" : "uit"}`}></div>
      </div>
    );
  };
  
  export default Stoplichten;
  