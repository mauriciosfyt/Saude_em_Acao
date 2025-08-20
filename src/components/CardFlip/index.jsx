import React from "react";
import "./CardFlip.css";

const CardFlip = ({ data, isFlipped, onFlip }) => {
  return (
    <div className="card-dica" onClick={onFlip}>
      <div className={`card-inner ${isFlipped ? "is-flipped" : ""}`}>
        <div className="card-face card-front">
          <img src={data.imagem} alt="Dica de treino" className="card-image" />
        </div>
        <div className="card-face card-back">
          <p id="card-text" className="card-text">{data.verso}</p>
        </div>
      </div>
    </div>
  );
};

export default CardFlip;
