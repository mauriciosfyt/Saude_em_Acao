import React from "react";
import { solicitarEsqueciSenha } from "../../services/api";
import logo from "../../assets/logo1.png";
import ErrorMessage from "./ErrorMessage";

export default function RecoverModal({ onClose, onSend }) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [mensagem, setMensagem] = React.useState("");
  const [erro, setErro] = React.useState("");
  React.useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Foca o campo de email de recuperação ao abrir
  React.useEffect(() => {
    const el = document.getElementById('recover-email');
    el?.focus?.();
  }, []);

  const handleSend = async () => {
    setMensagem("");
    setErro("");
    if (!email) {
      setErro("Por favor, digite seu e-mail.");
      return;
    }
    setLoading(true);
    try {
      const data = await solicitarEsqueciSenha(email);
      setMensagem(data?.message || "Se existir uma conta, enviaremos instruções por e-mail.");
      if (typeof onSend === "function") {
        onSend(email, data);
      }
    } catch (e) {
      console.error("Erro ao solicitar recuperação de senha:", e);
      const status = e?.response?.status || e?.status;
      if (status === 400) {
        setErro("Requisição inválida (400). Digite um email valido.");
      } else {
        const msg = typeof e === "string" ? e : (e?.response?.data?.message || e?.message || "Não foi possível solicitar a recuperação agora.");
        setErro(msg);
      }
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
        <label htmlFor="recover-email" className="modal-label">
          Email de Recuperação
        </label>
        <input
          id="recover-email"
          type="email"
          className="modal-input"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <ErrorMessage message={erro} />
        {mensagem && (
          <p style={{ color: "#28a745", marginTop: 8, fontSize: "0.9rem", textAlign: "center" }}>
            {mensagem}
          </p>
        )}
        <button
          className="modal-btn"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "ENVIANDO..." : "ENVIAR"}
        </button>
      </div>
    </div>
  );
}