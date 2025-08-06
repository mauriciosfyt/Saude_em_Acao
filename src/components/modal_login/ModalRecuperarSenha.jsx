import React from "react";
import logo from "../../assets/logo1.png";

export default function RecoverModal({ onClose, onSend }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
        <img src={logo} alt="Logo" className="modal-logo" />
                <h4 className="modal-boasvindas" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
          Seja muito bem-vindo(a) à <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde sua transformação começa
        </h4>
        <p className="modal-subtexto" style={{ textAlign: "center", marginBottom: "8px", fontSize: "0.9rem", color: "#808080" }}>Prepare-se para viver sua melhor versão.</p>
        <label htmlFor="recover-email" className="modal-label">
          Email de Recuperação
        </label>
        <input id="recover-email" type="email" className="modal-input" placeholder="Digite seu e-mail" />
        <button
          className="modal-btn"
          onClick={onSend}
        >
          ENVIAR
        </button>
      </div>
    </div>
  );
}