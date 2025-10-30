import React, { useState, useEffect } from "react";
import logo from "../../assets/logo1.png";
import { loginComToken, setAuthToken } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function CodeModal({
  code,
  onChange,
  onClose,
  onValidate,
  email,
}) {
  const { login } = useAuth();

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const codeFields = Array.from({ length: 5 }, (_, idx) => code[idx] || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = document.getElementById("code-input-0");
    el?.focus?.();
  }, []);

  // ✅ Corrigido: agora preenche todos os campos corretamente ao colar
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData?.getData("text") || "";
    const chars = paste.replace(/[^0-9a-zA-Z]/g, "").toUpperCase().split("");

    // Atualiza todos os campos de uma vez
    for (let i = 0; i < 5; i++) {
      onChange(chars[i] || "", i);
    }

    // Foca no último campo preenchido
    const nextFocus = Math.min(chars.length, 5) - 1;
    setTimeout(() => {
      document.getElementById(`code-input-${nextFocus}`)?.focus();
    }, 0);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && idx > 0) {
      e.preventDefault();
      onChange("", idx);
      const prevField = document.getElementById(`code-input-${idx - 1}`);
      prevField?.focus();
    }
  };

  const handleValidateClick = async () => {
    setError("");
    if (!email) {
      setError("Email não informado. Reinicie o login.");
      return;
    }

    const codigo = (code || []).join("");
    if (codigo.length < 5) {
      setError("Digite o código completo de 5 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginComToken(email, codigo);
      const jwtToken = data;

      if (!jwtToken || typeof jwtToken !== "string" || jwtToken.length < 50) {
        throw new Error("A API não retornou um Token JWT válido. Resposta: " + data);
      }

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("userEmail", email);
      setAuthToken(jwtToken);
      login(jwtToken, email);

      if (onValidate) onValidate(data);
      onClose();

      // 🔹 Limpa todos os campos após sucesso
      for (let i = 0; i < 5; i++) onChange("", i);
    } catch (err) {
      console.error("Erro na validação do token:", err);
      setError(err?.message || "Código inválido ou erro na verificação.");
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

        <h2 className="modal-title" style={{ marginTop: "5%", marginBottom: "10%" }}>
          DIGITE O CÓDIGO
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          {codeFields.map((digit, idx) => (
            <input
              key={idx}
              id={`code-input-${idx}`}
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
                    const nextField = document.getElementById(`code-input-${idx + 1}`);
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

        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

        <button className="modal-btn" onClick={handleValidateClick} disabled={loading}>
          {loading ? "Validando..." : "VALIDAR"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "8px",
            fontSize: "0.9rem",
            color: "#808080",
          }}
        >
          Este código expirará em 15 minutos. Se você não o recebeu,
          verifique sua caixa de spam ou solicite um novo código.
        </p>
      </div>
    </div>
  );
}
