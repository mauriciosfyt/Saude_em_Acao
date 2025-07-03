import React from 'react';
import './Header.css';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import logo from '../../assets/logo_dia.png';

const Header = () => {
  return (
    <>
      {/* Cabeçalho principal */}
      <header className="header-container">
        <div className="logo-area">
          <img src={logo} alt="Logo da Empresa" className="logo-img" />
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Buscar por nome ou tipo de produto" />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>

        <div className="header-actions">
          <FaUser className="icon" />
          <FaShoppingCart className="icon" />
        </div>
      </header>

      {/* Navegação secundária */}
      <nav className="nav-links">
        <div className="nav-left">
          <GiHamburgerMenu className="menu-icon" />
        </div>
        <div className="nav-center">
          <a href="#">Whey Protein</a>
          <a href="#">Creatina</a>
          <a href="#">Vitaminas</a>
          <a href="#">Camisetas</a>
        </div>
      </nav>
    </>
  );
};

export default Header;
