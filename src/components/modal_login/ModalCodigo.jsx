import React, { useState, useEffect } from "react";
import logo from "../../assets/logo1.png";
import { loginComToken, setAuthToken } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { getMeuPerfil } from "../../services/usuarioService";
import ErrorMessage from "./ErrorMessage";

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

  // Estado local para evitar acoplamento entre modais
  const [localCode, setLocalCode] = React.useState(() => Array(5).fill(""));
  const codeFields = localCode;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sincroniza apenas inicialmente (se props.code existir)
  useEffect(() => {
    if (code && Array.isArray(code)) {
      const next = Array.from({ length: 5 }, (_, i) => code[i] || "");
      setLocalCode(next);
    }
  }, [code]);

  useEffect(() => {
    const el = document.getElementById("code-input-0");
    el?.focus?.();
  }, []);

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && idx > 0) {
      e.preventDefault();
      setLocalCode((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
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

    const codigo = (localCode || []).join("");
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
      sessionStorage.setItem("token", jwtToken);
      sessionStorage.setItem("userEmail", email);
      setAuthToken(jwtToken);

      // 🔹 Busca os dados do usuário para salvar no sessionStorage
      try {
        const perfil = await getMeuPerfil();
        console.log('Dados do perfil após login:', perfil);

        // Extrai os dados
        const nome = perfil.nome || perfil.name || perfil.usuario?.nome || perfil.user?.nome || perfil.fullName || perfil.nome_completo || perfil.nomeCompleto || "Usuário";
        const emailPerfil = perfil.email || perfil.usuario?.email || perfil.user?.email || perfil.login || email;
        const numero = perfil.numero || perfil.telefone || perfil.phone || perfil.celular || perfil.phoneNumber || "";
        const perfilTipo = perfil.perfil || perfil.role || perfil.userRole || "USUARIO";

        // Salva no sessionStorage (genérico)
        sessionStorage.setItem('userName', nome);
        sessionStorage.setItem('userEmail', emailPerfil);
        sessionStorage.setItem('userNumero', numero);
        sessionStorage.setItem('userPerfil', perfilTipo);

        // Salva também com nome específico de cada tipo de usuário
        if (perfilTipo.toUpperCase().includes('ADMIN')) {
          sessionStorage.setItem('adminName', nome);
          sessionStorage.setItem('adminEmail', emailPerfil);
          sessionStorage.setItem('adminPerfil', perfilTipo);
        } else if (perfilTipo.toUpperCase().includes('PERSONAL')) {
          sessionStorage.setItem('personalName', nome);
          sessionStorage.setItem('personalEmail', emailPerfil);
          sessionStorage.setItem('personalNumero', numero);
          sessionStorage.setItem('personalPerfil', perfilTipo);
        } else {
          // Usuário comum (aluno)
          sessionStorage.setItem('alunoName', nome);
          sessionStorage.setItem('alunoEmail', emailPerfil);
          sessionStorage.setItem('alunoNumero', numero);
          sessionStorage.setItem('alunoPerfil', perfilTipo);
        }
      } catch (perfilErr) {
        console.warn('Não foi possível buscar o perfil completo:', perfilErr);
        // Salva pelo menos o email no sessionStorage se falhar
        sessionStorage.setItem('userEmail', email);
      }

      // Agora que gravamos o perfil no sessionStorage, chamamos login para que o AuthContext
      // possa derivar corretamente o userType a partir dos dados salvos.
      try {
        login(jwtToken);
      } catch (e) {
        // não bloqueia o fluxo do modal — apenas loga o erro
        console.warn('login() disparou erro:', e);
      }

      if (onValidate) onValidate(data);
      onClose();

      // 🔹 Limpa apenas o estado local após sucesso
      setLocalCode(Array(5).fill(""));
    } catch (err) {
      console.error("Erro na validação do token:", err);
      setError(err?.message || "Código inválido, tente novamente.");
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
                // Atualiza apenas o estado local para evitar acoplamento entre modais
                setLocalCode((prev) => {
                  const next = [...prev];
                  next[idx] = value.slice(-1) || "";
                  return next;
                });
                if (value && idx < codeFields.length - 1) {
                  setTimeout(() => {
                    const nextField = document.getElementById(`code-input-${idx + 1}`);
                    nextField?.focus();
                  }, 0);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
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

        <ErrorMessage message={error} />

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
