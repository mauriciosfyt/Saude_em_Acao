import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalLoginNecessario.css';
import { FaLock } from 'react-icons/fa';

/**
 * Props:
 * - onClose: function to call when modal closes
 * - reason: string indicating reason: 'not_logged' | 'plan_insufficient' | 'unauthorized' | 'default'
 * - customMessage: optional string to override message
 */
const ModalLoginNecessario = ({ onClose, reason = 'not_logged', customMessage }) => {
  const navigate = useNavigate();

  // Define title, message and primary button action based on reason
  const defaultMap = {
    not_logged: {
      title: 'Acesso Restrito',
      message: 'É necessário estar logado para acessar esta página.',
      buttonText: 'Voltar',
      onButtonClick: () => navigate('/'),
    },
    plan_insufficient: {
      title: 'Plano Insuficiente',
      message: 'Seu plano atual não permite o acesso a esta página. Faça o upgrade para o plano Gold e desbloqueie todas as funcionalidades.',
      buttonText: 'Ver Planos',
      onButtonClick: () => navigate('/Planos'),
    },
    unauthorized: {
      title: 'Acesso Negado',
      message: 'Você não tem autorização para acessar esta página.',
      buttonText: 'Voltar',
      onButtonClick: () => navigate('/'),
    },
    default: {
      title: 'Acesso Restrito',
      message: 'É necessário estar logado para acessar esta página.',
      buttonText: 'Voltar',
      onButtonClick: () => navigate('/'),
    }
  };

  const cfg = defaultMap[reason] || defaultMap.default;

  useEffect(() => {
    // Lock background scrolling and preserve scroll position while modal is open
    document.body.classList.add('modal-open');
    const scrollY = window.scrollY || window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleButtonClick = () => {
    if (onClose) onClose();
    if (typeof cfg.onButtonClick === 'function') cfg.onButtonClick();
  };

  return (
    <div className="modal-login-necessario-overlay" onClick={onClose}>
      <div className="modal-login-necessario-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <FaLock />
        </div>
        <h2>{cfg.title}</h2>
        <p>{customMessage || cfg.message}</p>
        
        <div className="modal-buttons">
          <button 
            className="btn-voltar"
            onClick={handleButtonClick}
          >
            {cfg.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginNecessario;
