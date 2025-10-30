// src/components/HeaderUser/index.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HeaderUser.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../../assets/logo_dia.png";

const HeaderUser = () => {
  const navigate = useNavigate();

  // Obtém o token de forma robusta
  const getRawTokenFromLocalStorage = () => {
    try {
      const candidates = [
        "token",
        "authToken",
        "accessToken",
        "userToken",
        "tokeneyJ", // se alguém salvou literal
      ];

      for (const key of candidates) {
        const v = localStorage.getItem(key);
        if (v) return v;
      }

      // Varre todas as chaves procurando algo que pareça um JWT
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (
          typeof value === "string" &&
          (value.includes("eyJ") || value.split(".").length === 3)
        ) {
          return value;
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // Limpa prefixos e devolve o token puro
  const normalizeToken = (raw) => {
    if (!raw || typeof raw !== "string") return null;
    let token = raw.trim();
    if (token.toLowerCase().startsWith("bearer ")) token = token.slice(7);
    if (token.toLowerCase().startsWith("token"))
      token = token.replace(/^token\s*/i, "");
    return token;
  };

  // Decodifica o JWT
  const decodeJwtPayload = (jwt) => {
    try {
      const parts = jwt.split(".");
      if (parts.length < 2) return null;
      let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      const jsonPayload = atob(b64);
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Redireciona o usuário com base no perfil do token
  const handleProfileClick = (e) => {
    e.preventDefault();
    const raw = getRawTokenFromLocalStorage();
    const token = normalizeToken(raw);

    if (!token) {
      navigate("/Perfil");
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      navigate("/Perfil");
      return;
    }

    const profileFieldCandidates = [
      payload.perfil,
      payload.role,
      payload.roles,
      payload.profile,
      payload.userRole,
      payload.tipo,
    ];

    let perfil = null;
    for (const p of profileFieldCandidates) {
      if (!p) continue;
      perfil = Array.isArray(p) ? String(p[0]).toUpperCase() : String(p).toUpperCase();
      break;
    }

    if (!perfil && payload.user && payload.user.perfil) {
      perfil = String(payload.user.perfil).toUpperCase();
    }

    const map = {
      ADMIN: "/PerfilAdm",
      PROFESSOR: "/PerfilPersonal",
      PROFESSORAL: "/PerfilPersonal",
      PROFESSOR_PERSONAL: "/PerfilPersonal",
      PERSONAL: "/PerfilPersonal",
      ALUNO: "/Perfil",
      STUDENT: "/Perfil",
      USER: "/Perfil",
    };

    const target = (perfil && map[perfil]) ? map[perfil] : "/Perfil";
    navigate(target);
  };

  // Rola até a seção "planos" da Home
  const handleScrollToPlanos = (e) => {
    e.preventDefault();

    if (window.location.pathname === "/") {
      const section = document.getElementById("planos");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { scrollTo: "planos" } });
    }
  };

  return (
    <>
      <header className="header-user-container">
        <div className="logo-area">
          <img src={logo} alt="Logo da Empresa" className="logo-img" />
        </div>

        <div className="header-actions">
          {/* Ícone do perfil */}
          <button
            onClick={handleProfileClick}
            className="icon-button"
            aria-label="Abrir perfil"
            title="Perfil"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              margin: 0,
            }}
          >
            <FaUser className="icon" />
          </button>

          {/* Carrinho */}
          <Link to="/Carrinho" aria-label="Carrinho" title="Carrinho" className="icon-link">
            <FaShoppingCart className="icon" />
          </Link>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="nav-links">
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/Loja">Loja</Link>
          <Link to="#" onClick={handleScrollToPlanos}>
            Planos
          </Link>
          <Link to="/Professores">Personal</Link>
          <Link to="/SobreNos">Sobre nós</Link>
        </div>
      </nav>
    </>
  );
};

export default HeaderUser;