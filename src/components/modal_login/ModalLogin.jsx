import React from "react";
import logo from "../../assets/logo1.png";

export default function LoginModal({ onClose, onLogin, onRecover }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
        <img src={logo} alt="Logo" className="modal-logo" />
        <h4 className="modal-boasvindas" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
          Seja muito bem-vindo(a) à <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde sua transformação começa
        </h4>
        <p className="modal-subtexto" style={{ textAlign: "center", marginBottom: "8px", fontSize: "0.9rem", color: "#808080" }}>Prepare-se para viver sua melhor versão.</p>
        <h2 className="modal-title">LOGIN</h2>
        <label htmlFor="email" className="modal-label">
          EMAIL
        </label>
        <input id="email" type="email" className="modal-input" placeholder="Digite seu e-mail" />
        <label htmlFor="senha" className="modal-label">
          SENHA
        </label>
        <input id="senha" type="password" className="modal-input" placeholder="Digite sua senha" />
        <a href="#" className="modal-link" onClick={onRecover}>
          Esqueci minha senha
        </a>
        <button className="modal-btn" onClick={onLogin}>
          LOGIN
        </button>
      </div>
    </div>
  );
}