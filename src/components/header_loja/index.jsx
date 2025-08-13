import React, { useState, useEffect, } from 'react';
import "../header_loja_nLogin/Header_Login.css";

import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo_dia.png";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 799);

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
              <FaUser className="icon" />
              <FaShoppingCart className="icon" />
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
              <FaUser className="icon" />
              <FaShoppingCart className="icon" />
            </div>
          </>
        )}
      </header>

      {/* Navegação secundária */}
      <nav className="nav-links">
        <div className="nav-left">
          <GiHamburgerMenu className="menu-icon" />
        </div>
        <div className="nav-center">
          <a href="/CategoriaCreatina">Whey Protein</a>
          <a href="/CategoriaCreatina">Creatina</a>
          <a href="/CategoriaCreatina">Vitaminas</a>
          <a href="/CategoriaCamisa">Camisetas</a>
        </div>
      </nav>
    </>
  );
};

export default Header;
