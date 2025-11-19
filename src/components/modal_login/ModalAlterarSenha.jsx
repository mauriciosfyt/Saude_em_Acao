import React from "react";
import { redefinirSenhaEsquecida } from "../../services/api";
import logo from "../../assets/logo1.png";
import ErrorMessage from "./ErrorMessage";
import EyeIcon from "../EyeIcon/EyeIcon";

export default function ChangePasswordModal({ onClose, onChangePassword, token, onOpenLogin }) {
  // Adiciona a classe 'modal-open' ao body do documento quando o componente é montado
  React.useEffect(() => {
    document.body.classList.add('modal-open');
    const scrollY = window.scrollY || window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    // Remove a classe 'modal-open' do body do documento quando o componente é desmontado
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Foca o campo de nova senha ao abrir
  React.useEffect(() => {
    const el = document.getElementById('new-password');
    el?.focus?.();
  }, []);

  const [newPwd, setNewPwd] = React.useState("");
  const [confirmPwd, setConfirmPwd] = React.useState("");
  const [showNewPwd, setShowNewPwd] = React.useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");

  const handleChange = async () => {
    setErro("");
    setMensagem("");
    if (!token) {
      setErro("Token ausente.");
      return;
    }
    if (!newPwd || !confirmPwd) {
      setErro("Preencha a nova senha e a confirmação.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const data = await redefinirSenhaEsquecida(token, newPwd);
      setMensagem(data?.message || "Senha alterada com sucesso.");
      if (typeof onChangePassword === "function") onChangePassword(data);
      // Fecha este modal e abre o modal de login, se a prop existir
      if (typeof onClose === "function") onClose();
      if (typeof onOpenLogin === "function") onOpenLogin();
    } catch (e) {
      const msg = typeof e === "string" ? e : (e?.message || "Falha ao alterar senha.");
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
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
        >
          &times;
        </button>
        <img src={logo} alt="Logo" className="modal-logo" />
                <h4 className="modal-boasvindas" style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
          Seja muito bem-vindo(a) à <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde sua transformação começa
        </h4>
        <p className="modal-subtexto" style={{ textAlign: "center", marginBottom: "8px", fontSize: "0.9rem", color: "#808080" }}>Prepare-se para viver sua melhor versão.</p>
        <h2 className="modal-title">ALTERAR SENHA</h2>
        <label htmlFor="new-password" className="modal-label">Nova Senha</label>
        <div className="password-input-wrapper">
          <input
            id="new-password"
            type={showNewPwd ? 'text' : 'password'}
            className="modal-input"
            placeholder="Nova senha"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const confirm = document.getElementById('confirm-password');
                if (confirm) confirm.focus(); else handleChange();
              }
            }}
          />
          <span
            className="password-toggle-eye"
            onClick={() => setShowNewPwd(s => !s)}
            title={showNewPwd ? 'Ocultar senha' : 'Mostrar senha'}
            onMouseDown={e => e.preventDefault()}
          >
            <EyeIcon visible={showNewPwd} />
          </span>
        </div>
        <label htmlFor="confirm-password" className="modal-label">Confirmar Senha</label>
        <div className="password-input-wrapper">
          <input
            id="confirm-password"
            type={showConfirmPwd ? 'text' : 'password'}
            className="modal-input"
            placeholder="Confirmar senha"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleChange();
              }
            }}
          />
          <span
            className="password-toggle-eye"
            onClick={() => setShowConfirmPwd(s => !s)}
            title={showConfirmPwd ? 'Ocultar senha' : 'Mostrar senha'}
            onMouseDown={e => e.preventDefault()}
          >
            <EyeIcon visible={showConfirmPwd} />
          </span>
        </div>
        <ErrorMessage message={erro} />
        <button
          className="modal-btn"
          onClick={handleChange}
          disabled={loading}
        >
          {loading ? "ALTERANDO..." : "ALTERAR"}
        </button>
      </div>
    </div>
  );
}
