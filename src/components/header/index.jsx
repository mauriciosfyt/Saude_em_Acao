import React, { useState, useEffect } from 'react';
import "./HeaderUser.css";
import { FaShoppingCart, FaUser, FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";

const HeaderUser = () => {
  // Estado para controlar o menu lateral
  const [menuLateralAberto, setMenuLateralAberto] = useState(false);

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
        <div className="nav-left">
          {/* Ícone de hambúrguer sempre visível */}
          <GiHamburgerMenu className="user-menu-icon" onClick={() => setMenuLateralAberto(true)} />
        </div>
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/Loja">Loja</Link>
          <Link to="/Planos">Planos</Link>
          <Link to="/Professores">Personal</Link>
          <Link to="/SobreNos">Sobre nós</Link>
        </div>
      </nav>

      {/* Menu Lateral com classes únicas */}
      <nav className={`user-sidebar ${menuLateralAberto ? "is-open" : ""}`}>
        <div className="user-sidebar-header">
          <img src={logo} alt="Logo da Empresa" className="user-sidebar-logo" />
          <FaTimes className="user-sidebar-close-btn" onClick={() => setMenuLateralAberto(false)} />
        </div>
        <ul className="user-sidebar-navlist">
          <li><Link to="/" onClick={() => setMenuLateralAberto(false)}>Home</Link></li>
          <li><Link to="/Loja" onClick={() => setMenuLateralAberto(false)}>Loja</Link></li>
          <li><Link to="/Planos" onClick={() => setMenuLateralAberto(false)}>Planos</Link></li>
          <li><Link to="/Professores" onClick={() => setMenuLateralAberto(false)}>Personal</Link></li>
          <li><Link to="/SobreNos" onClick={() => setMenuLateralAberto(false)}>Sobre nós</Link></li>
          <li><Link to="/Reservas" onClick={() => setMenuLateralAberto(false)}>Reservas</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default HeaderUser;