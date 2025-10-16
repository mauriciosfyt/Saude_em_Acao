import React, { useState, useEffect } from 'react';
import "../header_loja_nLogin/Header_Login.css";

import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";

const Header = () => {
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
                placeholder="Buscar por nome ou tipo de produto"
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
                placeholder="Buscar por nome ou tipo de produto"
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
          <a href="/">Home</a>
          <a href="/CategoriaWhey">Whey Protein</a>
          <a href="/CategoriaCreatina">Creatina</a>
          <a href="/CategoriaVitaminas">Vitaminas</a>
          <a href="/CategoriaCamisa">Camisetas</a>
        </div>
      </nav>
    </>
  );
};

export default Header;
