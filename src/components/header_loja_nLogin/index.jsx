import React, { useState, useEffect } from "react";
import "./Header_Login.css";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo_dia.png";

// Importando os modais refatorados (nomes corrigidos sem espaços)
import ModalLogin from "../../components/modal_login/ModalLogin";
import ModalCodigo from "../../components/modal_login/ModalCodigo";
import ModalRecuperarSenha from "../../components/modal_login/ModalRecuperarSenha";
import ModalCodigoRecuperacao from "../../components/modal_login/ModalCodigoRecuperacao";
import ModalAlterarSenha from "../../components/modal_login/ModalAlterarSenha";

const Header_nLogin = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 799);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showRecoverCodeModal, setShowRecoverCodeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);

  // Removi o useEffect que usava historiaRef e setShowHistoria
  // Se quiser esse efeito depois, me avisa!

  const handleCodeChange = (value, idx) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[idx] = value.replace(/[^0-9]/g, "");
    setCode(newCode);
    if (value && idx < 3) {
      document.getElementById(`code-input-${idx + 1}`)?.focus();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowCodeModal(true);
  };

  const handleRecover = (e) => {
    e.preventDefault();
    setShowRecoverModal(false);
    setShowRecoverCodeModal(true);
    setCode(["", "", "", ""]);
  };

  const handleValidateRecoverCode = (e) => {
    e.preventDefault();
    setShowRecoverCodeModal(false);
    setShowChangePasswordModal(true);
  };

  const closeAllModals = () => {
    setShowModal(false);
    setShowCodeModal(false);
    setShowRecoverModal(false);
    setShowRecoverCodeModal(false);
    setShowChangePasswordModal(false);
    setCode(["", "", "", ""]);
  };

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

            <button
              className="login-button_loja"
              onClick={() => setShowModal(true)}
            >
              Fazer login
            </button>
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

            <button
              className="login-button_loja"
              onClick={() => setShowModal(true)}
            >
              Fazer login
            </button>
          </>
        )}
      </header>

      {/* Modais separados */}
      {showModal && (
        <ModalLogin
          onClose={closeAllModals}
          onLogin={handleLogin}
          onRecover={() => {
            setShowModal(false);
            setShowRecoverModal(true);
          }}
        />
      )}

      {showCodeModal && (
        <ModalCodigo
          code={code}
          onClose={() => setShowCodeModal(false)}
          onChange={handleCodeChange}
        />
      )}

      {showRecoverModal && (
        <ModalRecuperarSenha
          onClose={() => setShowRecoverModal(false)}
          onSend={handleRecover}
        />
      )}

      {showRecoverCodeModal && (
        <ModalCodigoRecuperacao
          code={code}
          onClose={() => setShowRecoverCodeModal(false)}
          onChange={handleCodeChange}
          onValidate={handleValidateRecoverCode}
        />
      )}

      {showChangePasswordModal && (
        <ModalAlterarSenha
          onClose={() => setShowChangePasswordModal(false)}
          onChangePassword={() => {}}
        />
      )}

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

export default Header_nLogin;
