import React from "react";
import Stoplichten from "./Stoplichten";

export default function SluisDeur({ isOpen, onOpen, onClose, deurId }) {
  return (
    <div className="sluis">
      <Stoplichten isOpen={isOpen} />
      <div className="sluisdeur" style={{ opacity: isOpen ? 0.3 : 1 }}></div>
      <div className="knoppen">
        <button
          className="openen"
          onClick={() => {
            onOpen();
            console.log(`Sluisdeur ${deurId} geopend`);
          }}
          disabled={isOpen}
        >
          Openen
        </button>
        <button
          className="sluiten"
          onClick={() => {
            onClose();
            console.log(`Sluisdeur ${deurId} gesloten`);
          }}
          disabled={!isOpen}
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}
