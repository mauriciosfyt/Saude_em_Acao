import React, { useState, useEffect } from "react";
import "./Header_Login.css";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo_dia.png";
import { useAuth } from "../../contexts/AuthContext";
// --- ADIÇÃO 1: Importar Link e useNavigate ---
import { Link, useNavigate } from "react-router-dom";

// Importando os modais refatorados (nomes corrigidos sem espaços)
import ModalLogin from "../../components/modal_login/ModalLogin";
import ModalCodigo from "../../components/modal_login/ModalCodigo";
import ModalRecuperarSenha from "../../components/modal_login/ModalRecuperarSenha";
import ModalCodigoRecuperacao from "../../components/modal_login/ModalCodigoRecuperacao";
import ModalAlterarSenha from "../../components/modal_login/ModalAlterarSenha";

const Header_nLogin = () => {
  const { isAuthenticated, logout } = useAuth();
  // --- ADIÇÃO 2: Instanciar o useNavigate ---
  const navigate = useNavigate(); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 799);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showRecoverCodeModal, setShowRecoverCodeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [loginEmail, setLoginEmail] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverToken, setRecoverToken] = useState("");

  // --- ADIÇÃO 3: Estado para a barra de pesquisa ---
  const [termoBusca, setTermoBusca] = useState('');
  // -------------------------------------------------

  const handleCodeChange = (value, idx) => {
    // Aceita letras e números (alphanumeric). Mantém em maiúsculas para
    // consistência e evita que caracteres inválidos limpem o campo.
    if (value.length > 1) return;
    const sanitized = value.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();
    const newCode = [...code];
    newCode[idx] = sanitized;
    setCode(newCode);
    if (sanitized && idx < 4) {
      document.getElementById(`code-input-${idx + 1}`)?.focus();
    }
  };
  // Chamado quando o ModalLogin chama `onLogin(email)`.
  // Recebe o email e abre o modal de código.
  const handleLogin = (emailParam) => {
    if (emailParam) setLoginEmail(emailParam);
    setShowModal(false);
    setShowCodeModal(true);
  };

  const handleRecover = (emailParam, _data) => {
    if (emailParam) setRecoverEmail(emailParam);
    setShowRecoverModal(false);
    setShowRecoverCodeModal(true);
    setCode(["", "", "", "", ""]);
  };

  const handleValidateRecoverCode = (_email, token) => {
    if (token) setRecoverToken(token);
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

  // --- ADIÇÃO 4: Função para lidar com a pesquisa ---
  const handleSearch = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    const query = termoBusca.trim();
    if (query) {
      // Navega para a página de busca com o termo
      navigate(`/busca?nome=${encodeURIComponent(query)}`);
    }
  };
  // -------------------------------------------------

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
              onClick={isAuthenticated ? logout : () => setShowModal(true)}
            >
              {isAuthenticated ? 'Sair' : 'Fazer login'}
            </button>
            
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
            {/* --- FIM DA MUDANÇA --- */}
            
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

            <button
              className="login-button_loja"
              onClick={isAuthenticated ? logout : () => setShowModal(true)}
            >
              {isAuthenticated ? 'Sair' : 'Fazer login'}
            </button>
          </>
        )}
      </header>

      {/* Modais separados (Sem alterações) */}
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
          email={loginEmail}
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
          email={recoverEmail}
          onClose={() => setShowRecoverCodeModal(false)}
          onChange={handleCodeChange}
          onValidate={handleValidateRecoverCode}
        />
      )}

      {showChangePasswordModal && (
        <ModalAlterarSenha
          onClose={() => setShowChangePasswordModal(false)}
          token={recoverToken}
          onChangePassword={() => {}}
          onOpenLogin={() => {
            setShowChangePasswordModal(false);
            setShowModal(true);
          }}
        />
      )}

      {/* Navegação secundária (Sem alterações) */}
      <nav className="nav-links">
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/CategoriaWhey">Whey</Link>
          <Link to="/CategoriaCreatina">Creatina</Link>
          <Link to="/CategoriaVitaminas">Vitaminas</Link>
          <Link to="/CategoriaCamisa">Camisetas</Link>
        </div>
      </nav>
    </>
  );
};

export default Header_nLogin;