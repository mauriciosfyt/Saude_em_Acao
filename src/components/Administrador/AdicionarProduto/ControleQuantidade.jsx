import React from 'react';

const ControleQuantidade = ({ label, quantidade, onDiminuir, onAumentar }) => {
  return (
    <div className="controle-quantidade">
      <span className="controle-label">{label}</span>
      <div className="controle-botoes">
        <button type="button" onClick={onDiminuir}>-</button>
        <span className="controle-valor">{quantidade}</span>
        <button type="button" onClick={onAumentar}>+</button>
      </div>
    </div>
  );
};

export default ControleQuantidade;