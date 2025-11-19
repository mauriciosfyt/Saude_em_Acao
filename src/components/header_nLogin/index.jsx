import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo_dia.png";
import "./styles.css";
import { useAuth } from "../../contexts/AuthContext";

// Importando os modais
import ModalLogin from "../modal_login/ModalLogin";
import ModalCodigo from "../modal_login/ModalCodigo";
import ModalRecuperarSenha from "../modal_login/ModalRecuperarSenha";
import ModalCodigoRecuperacao from "../modal_login/ModalCodigoRecuperacao";
import ModalAlterarSenha from "../modal_login/ModalAlterarSenha";

function HomeHeader() {
  const { isAuthenticated, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showRecoverCodeModal, setShowRecoverCodeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [loginEmail, setLoginEmail] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverToken, setRecoverToken] = useState("");

  // Controla o scroll do body quando qualquer modal está aberto
  useEffect(() => {
    const isAnyModalOpen = showModal || showCodeModal || showRecoverModal || showRecoverCodeModal || showChangePasswordModal;
    
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function para remover a classe quando o componente for desmontado
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showModal, showCodeModal, showRecoverModal, showRecoverCodeModal, showChangePasswordModal]);

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

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo da Empresa" className="logo" />
          {isAuthenticated ? (
            <button className="login-button" onClick={logout}>
              Sair
            </button>
          ) : (
            <button className="login-button" onClick={() => setShowModal(true)}>
              Fazer login
            </button>
          )}
        </div>
        
      </header>

      {/* Menu horizontal */}
      <nav className="nav-links">
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/Loja">Loja</Link>
          <Link to="/" state={{ scrollTo: 'planos' }}>Planos</Link>
          <Link to="/Professores">Personal</Link>
          <Link to="/SobreNos">Sobre nós</Link>
        </div>
      </nav>

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
    </>
  );
}

export default HomeHeader;
