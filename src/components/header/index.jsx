import React, { useState, useEffect,} from 'react';

import "./HeaderUser.css";

import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";

const HeaderUser = () => {
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
      <header className="header-user-container">
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
            
          </div>
        ) : (
          // JSX para telas maiores
          <>
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
          </>
        )}
      </header>

      {/* Navegação secundária */}
      <nav className="nav-links">
        <div className="nav-left">
          <GiHamburgerMenu className="menu-icon" />
        </div>
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/Loja">Loja</Link>
          <Link to="/planos">Planos</Link>
          <Link to="/personal">Personal</Link>
          <Link to="/SobreNos">Sobre nós</Link>
        </div>
      </nav>
    </>
  );
};

export default HeaderUser;
