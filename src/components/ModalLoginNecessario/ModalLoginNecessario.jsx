import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalLoginNecessario.css';
import { FaLock } from 'react-icons/fa';

const ModalLoginNecessario = ({ onClose }) => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  return (
    <div className="modal-login-necessario-overlay">
      <div className="modal-login-necessario-content">
        <div className="modal-icon">
          <FaLock />
        </div>
        <h2>Acesso Restrito</h2>
        <p>É necessário estar logado para acessar esta página.</p>
        
        <div className="modal-buttons">
          <button 
            className="btn-voltar"
            onClick={handleVoltar}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginNecessario;
