import React, { useState } from "react";
import "./modal_login.css";
import logo from "../../assets/logo1.png";
import { solicitarToken } from "../../services/api";
import ErrorMessage from "./ErrorMessage";
import EyeIcon from "../EyeIcon/EyeIcon";

export default function LoginModal({ onClose, onLogin, onRecover }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Foca o campo de email ao abrir o modal
  React.useEffect(() => {
    const el = document.getElementById('email');
    el?.focus?.();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
  const data = await solicitarToken(email, senha);
  // Quando o login via API for bem-sucedido, enviamos o email
  // ao componente pai para que ele abra o modal de verificação
  // com o email já conhecido.
  if (onLogin) onLogin(email);
    } catch (err) {
        setError(err?.message || "Erro ao fazer login");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar (X) */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "-13px",
            background: "transparent",
            border: "none",
            fontSize: "2.5rem",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            outline: "none",
            boxShadow: "none"
          }}
          aria-label="Fechar modal"
          tabIndex={0}
          onMouseDown={e => e.preventDefault()}
        >
          &times;
        </button>
        <img src={logo} alt="Logo" className="modal-logo" />
        <h4 className="modal-boasvindas" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
          Seja muito bem-vindo(a) à <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde sua transformação começa
        </h4>
        <p className="modal-subtexto" style={{ textAlign: "center", marginBottom: "8px", fontSize: "0.9rem", color: "#808080" }}>Prepare-se para viver sua melhor versão.</p>
        <h2 className="modal-title">LOGIN</h2>
        <label htmlFor="email" className="modal-label">
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          className="modal-input"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              // Se houver senha focar o campo de senha, senão submeter
              const pwd = document.getElementById('senha');
              if (pwd) pwd.focus(); else handleLogin();
            }
          }}
        />
        <label htmlFor="senha" className="modal-label">
          SENHA
        </label>
        <div className="password-input-wrapper">
          <input
            id="senha"
            type={showSenha ? 'text' : 'password'}
            className="modal-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
          <span
            className="password-toggle password-toggleLogin"
            onClick={() => setShowSenha(s => !s)}
            title={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
            onMouseDown={e => e.preventDefault()}
          >
            <EyeIcon visible={showSenha} />
          </span>
        </div>
        <ErrorMessage message={error} />
        <a href="#" className="modal-link" onClick={onRecover}>
          Esqueci minha senha
        </a>
        <button className="modal-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "LOGIN"}
        </button>
      </div>
    </div>
  );
}