import React from 'react';
import "./HeaderUser.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";

const HeaderUser = () => {
  return (
    <>
      {/* Header principal (simplificado, sem lógica mobile) */}
      <header className="header-user-container">
        <div className="logo-area">
          <img src={logo} alt="Logo da Empresa" className="logo-img" />
        </div>
        <div className="header-actions">
          <Link to="/Perfil"><FaUser className="icon" /></Link>
          <Link to="/Carrinho"><FaShoppingCart className="icon" /></Link>
        </div>
      </header>

      {/* Menu horizontal (sempre visível) */}
      <nav className="nav-links">
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/Loja">Loja</Link>
          <Link to="/" state={{ scrollTo: 'planos' }}>Planos</Link>
          <Link to="/Professores">Personal</Link>
          <Link to="/SobreNos">Sobre nós</Link>
        </div>
      </nav>
    </>
  );
};

export default HeaderUser;