import React from "react";
import logo from "../../assets/logo1.png";
import { validarCodigoEsqueciSenha } from "../../services/api";
import ErrorMessage from "./ErrorMessage";

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

  // Estado local para evitar acoplamento entre modais
  const [localCode, setLocalCode] = React.useState(() => Array(5).fill(""));
  const codeFields = localCode;

  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState("");

  // Sincroniza apenas inicialmente (se props.code existir)
  React.useEffect(() => {
    if (code && Array.isArray(code)) {
      const next = Array.from({ length: 5 }, (_, i) => code[i] || "");
      setLocalCode(next);
    }
  }, [code]);

  React.useEffect(() => {
    const el = document.getElementById("recover-code-input-0");
    el?.focus?.();
  }, []);

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setLocalCode((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = "";
          return next;
        }
        if (idx > 0) next[idx - 1] = "";
        return next;
      });
      if (idx > 0) {
        const prevField = document.getElementById(`recover-code-input-${idx - 1}`);
        prevField?.focus();
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const codigo = (localCode || []).join("");
      if (codigo.length >= codeFields.length) {
        // dispara o clique do botão VALIDAR
        const validateBtn = document.querySelector('.modal-login .modal-btn');
        validateBtn?.click();
      } else if (idx < codeFields.length - 1) {
        const nextField = document.getElementById(`recover-code-input-${idx + 1}`);
        nextField?.focus();
      }
    }
  };

  const handlePaste = (e, idx) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("Text") || "";
    const chars = paste.toUpperCase().replace(/\s+/g, "").split("");
    if (!chars.length) return;
    setLocalCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < chars.length && idx + i < next.length; i++) {
        next[idx + i] = chars[i].slice(-1);
      }
      return next;
    });
    setTimeout(() => {
      const end = Math.min(codeFields.length - 1, idx + chars.length - 1);
      const endField = document.getElementById(`recover-code-input-${end}`);
      endField?.focus();
      const currentValue = (Array.isArray(localCode) ? localCode.join("") : "") + (chars || []).join("");
      if (currentValue.length >= codeFields.length) {
        const validateBtn = document.querySelector('.modal-login .modal-btn');
        validateBtn?.click();
      }
    }, 0);
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
                // Atualiza apenas o estado local para evitar acoplamento entre modais
                setLocalCode((prev) => {
                  const next = [...prev];
                  next[idx] = value.slice(-1) || "";
                  return next;
                });
                if (value && idx < codeFields.length - 1) {
                  setTimeout(() => {
                    const nextField = document.getElementById(`recover-code-input-${idx + 1}`);
                    nextField?.focus();
                  }, 0);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={(e) => handlePaste(e, idx)}
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

        <ErrorMessage message={erro} />

        <button
          className="modal-btn"
          disabled={loading}
          onClick={async () => {
            setErro("");
            if (!email) {
              setErro("E-mail não informado.");
              return;
            }
            const codigo = localCode.join("");
            if (!codigo || codigo.length < codeFields.length) {
              setErro("Preencha todos os campos do código.");
              return;
            }
            try {
              await validarCodigoEsqueciSenha(codigo);
              if (typeof onValidate === "function") onValidate(email, codigo);
              // 🔹 Limpa apenas o estado local após sucesso (não altera o pai)
              setLocalCode(Array(5).fill(""));
            } catch (e) {
              setErro(e?.message || "Código inválido, tente novamente.");
            }
          }}
        >
          VALIDAR
        </button>

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
