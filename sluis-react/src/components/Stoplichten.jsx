import React from 'react';

const Stoplichten = ({ isOpen }) => {
  return (
    <div className="stoplicht">
      <div className={`licht rood ${!isOpen ? 'actief' : ''}`}></div>
      <div className={`licht groen ${isOpen ? 'actief' : ''}`}></div>
    </div>
  );
};

export default Stoplichten;
  