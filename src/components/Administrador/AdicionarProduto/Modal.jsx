import React from 'react';
import './Modal.css';

const Modal = ({ titulo, aberto, aoFechar, children }) => {
  if (!aberto) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <h2 className="modal-titulo">{titulo}</h2>
          <button className="modal-botao-fechar" onClick={aoFechar}>×</button>
        </div>
        <div className="modal-corpo">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;