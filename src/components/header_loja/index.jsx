import React, { useState, useEffect } from 'react';
import "../header_loja_nLogin/Header_Login.css";
import { useAuth } from "../../contexts/AuthContext";

import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 799);
  // Estado para detectar mobile (mantido)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 799);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
              
              <Link to="/Perfil">
                <FaUser className="icon" />
              </Link>

              <Link to="/Carrinho">
              <FaShoppingCart className="icon" />
              </Link>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar pelo nome do produto"
              />
              <button className="search-button">
                <FaSearch className="icon_navegacao" />
              </button>
            </div>

          </div>
        ) : (
          // JSX para telas maiores
          <>
            <div className="logo-area">
              <img src={logo} alt="Logo da Empresa" className="logo-img" />
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar pelo nome do produto"
              />
              <button className="search-button">
                <FaSearch className="icon_navegacao" />
              </button>
            </div>

            <div className="header-actions">
              <Link to="/Perfil">
                <FaUser className="icon" />
              </Link>

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
