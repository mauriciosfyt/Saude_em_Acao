import React from "react";
import logo from "../../assets/logo1.png";
import { validarCodigoEsqueciSenha } from "../../services/api";

export default function RecoverCodeModal({
  code,
  email,
  onChange,
  onClose,
  onValidate,
}) {
  React.useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const codeFields = Array.from({ length: 5 }, (_, idx) => code[idx] || "");
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState("");

  React.useEffect(() => {
    const el = document.getElementById("recover-code-input-0");
    el?.focus?.();
  }, []);

  // ✅ Corrigido: agora preenche todos os campos corretamente
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData?.getData("text") || "";
    const chars = paste.replace(/[^0-9a-zA-Z]/g, "").toUpperCase().split("");

    for (let i = 0; i < 5; i++) onChange(chars[i] || "", i);

    const nextFocus = Math.min(chars.length, 5) - 1;
    setTimeout(() => {
      document.getElementById(`recover-code-input-${nextFocus}`)?.focus();
    }, 0);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && idx > 0) {
      e.preventDefault();
      onChange("", idx);
      const prevField = document.getElementById(`recover-code-input-${idx - 1}`);
      prevField?.focus();
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
            boxShadow: "none",
          }}
          aria-label="Fechar modal"
        >
          &times;
        </button>
        <img src={logo} alt="Logo" className="modal-logo" />

        <h4
          className="modal-boasvindas"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Seja muito bem-vindo(a) à{" "}
          <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde
          sua transformação começa
        </h4>

        <p
          className="modal-subtexto"
          style={{
            textAlign: "center",
            marginBottom: "8px",
            fontSize: "0.9rem",
            color: "#808080",
          }}
        >
          Prepare-se para viver sua melhor versão.
        </p>

        <h2 className="modal-title">DIGITE O CÓDIGO</h2>
        <p style={{ textAlign: "center", marginBottom: 24 }}>
          Digite o código que acabamos de enviar no seu email
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          {codeFields.map((digit, idx) => (
            <input
              key={idx}
              id={`recover-code-input-${idx}`}
              type="text"
              inputMode="text"
              maxLength={1}
              className="modal-code-input"
              value={digit}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onChange(value, idx);
                if (value && idx < codeFields.length - 1) {
                  setTimeout(() => {
                    const nextField = document.getElementById(`recover-code-input-${idx + 1}`);
                    nextField?.focus();
                  }, 0);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              style={{
                textAlign: "center",
                fontSize: "2rem",
                width: 48,
                height: 48,
                border: "2px solid #1062fe",
                borderRadius: 8,
              }}
            />
          ))}
        </div>

        <button
          className="modal-btn"
          disabled={loading}
          onClick={async () => {
            setErro("");
            if (!email) {
              setErro("E-mail não informado.");
              return;
            }
            const codigo = codeFields.join("");
            if (!codigo || codigo.length < codeFields.length) {
              setErro("Preencha todos os campos do código.");
              return;
            }
            try {
              await validarCodigoEsqueciSenha(codigo);
              if (typeof onValidate === "function") onValidate(email, codigo);
              // 🔹 Limpa todos os campos após sucesso
              for (let i = 0; i < 5; i++) onChange("", i);
            } catch (e) {
              setErro(e?.message || "Código inválido ou erro na validação.");
            }
          }}
        >
          VALIDAR
        </button>

        {erro && (
          <p style={{ color: "#d9534f", marginTop: "8px", fontSize: "0.9rem", textAlign: "center" }}>
            {erro}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "8px",
            fontSize: "0.9rem",
            color: "#808080",
          }}
        >
          Este código expirará em 15 minutos. Se você não o recebeu, verifique
          sua caixa de spam ou solicite um novo código.
        </p>
      </div>
    </div>
  );
}
