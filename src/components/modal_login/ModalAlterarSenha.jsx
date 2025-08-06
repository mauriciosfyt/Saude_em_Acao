import React from "react";
import logo from "../../assets/logo1.png";

export default function ChangePasswordModal({ onClose, onChangePassword }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
        <img src={logo} alt="Logo" className="modal-logo" />
                <h4 className="modal-boasvindas" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
          Seja muito bem-vindo(a) à <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde sua transformação começa
        </h4>
        <p className="modal-subtexto" style={{ textAlign: "center", marginBottom: "8px", fontSize: "0.9rem", color: "#808080" }}>Prepare-se para viver sua melhor versão.</p>
        <h2 className="modal-title">ALTERAR SENHA</h2>
        <label htmlFor="new-password" className="modal-label">Nova Senha</label>
        <input
          id="new-password"
          type="password"
          className="modal-input"
          placeholder="Nova senha"
        />
        <label htmlFor="confirm-password" className="modal-label">Confirmar Senha</label>
        <input
          id="confirm-password"
          type="password"
          className="modal-input"
          placeholder="Confirmar senha"
        />
        <button
          className="modal-btn"
          onClick={onChangePassword}
        >
          ALTERAR
        </button>
      </div>
    </div>
  );
}
