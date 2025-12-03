// components/ModalConfirmacao/ModalConfirmacao.jsx
import React from 'react';
import './ModalConfirmacao.css'; // Importa o CSS que criamos acima

const ModalConfirmacao = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  logoSrc, 
  confirmLabel = "Sim, confirmar", // Valor padrão
  cancelLabel = "Cancelar"         // Valor padrão
}) => {
  
  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="modal-confirmation-overlay">
      <div className="modal-confirmation-content">
        
        {/* Renderiza o logo apenas se passar o caminho da imagem */}
        {logoSrc && (
          <img 
            src={logoSrc} 
            alt="Logo" 
            className="modal-confirmation-logo" 
          />
        )}

        <h3 className="modal-confirmation-title">{title}</h3>
        <p className="modal-confirmation-text">{message}</p>
        
        <div className="modal-confirmation-actions">
          <button 
            className="modal-confirmation-btn modal-confirmation-btn-cancelar" 
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button 
            className="modal-confirmation-btn modal-confirmation-btn-confirmar" 
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;