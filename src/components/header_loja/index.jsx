import React, { useState, useEffect } from 'react';
import "../header_loja_nLogin/Header_Login.css";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 799);
  
  // --- ADIÇÃO 1: Estado para controlar o valor da barra de pesquisa ---
  const [termoBusca, setTermoBusca] = useState('');
  // -------------------------------------------------------------------

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 799);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- ADIÇÃO 2: Função para lidar com a pesquisa ---
  const handleSearch = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    const query = termoBusca.trim();
    if (query) {
      // Navega para a PÁGINA DE BUSCA com o termo
      navigate(`/busca?nome=${encodeURIComponent(query)}`);
      // Opcional: setTermoBusca('');
    }
  };
  // ---------------------------------------------------

  return (
    <>
      {/* Cabeçalho principal */}
      <header className="header-container">
        {isMobile ? (
          // JSX para telas menores
          <div className="top-row">
            <div className="logo-area">
              <img src={logo} alt="Logo da Empresa" className="logo-img" />
            </div>

            <div className="header-actions">
              
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

              <Link to="/Carrinho">
              <FaShoppingCart className="icon" />
              </Link>
            </div>

            {/* --- MUDANÇA (Mobile): "div" virou "form" --- */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar pelo nome do produto"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch className="icon_navegacao" />
              </button>
            </form>
          </div>
        ) : (
          // JSX para telas maiores
          <>
            <div className="logo-area">
              <img src={logo} alt="Logo da Empresa" className="logo-img" />
            </div>

            {/* --- MUDANÇA (Desktop): "div" virou "form" --- */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar pelo nome do produto"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch className="icon_navegacao" />
              </button>
            </form>
            {/* --- FIM DA MUDANÇA --- */}

            <div className="header-actions">
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

              <Link to="/Carrinho">
              <FaShoppingCart className="icon" />
              </Link>
            </div>
          </>
        )}
      </header>

      {/* Navegação secundária */}
      <nav className="nav-links">
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/Reservas">Reservas</Link>
          <Link to="/CategoriaWhey">Whey Protein</Link>
          <Link to="/CategoriaCreatina">Creatina</Link>
          <Link to="/CategoriaVitaminas">Vitaminas</Link>
          <Link to="/CategoriaCamisa">Camisetas</Link>
        </div>
      </nav>
    </>
  );
};

export default Header;