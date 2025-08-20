import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/logo1.png";
import tiktokIcon from "../../assets/icones/Email.png";
import facebookIcon from "../../assets/icones/icons8-instagram-50.png";
import instagramIcon from "../../assets/icones/icons8-whatsapp-50.png";
import ModalTermos from "../modal_termos/ModalTermos";
import ModalPrivacidade from "../modal_privacidade/ModalPrivacidade";

const Footer = () => {
  const [showModalTermos, setShowModalTermos] = useState(false);
  const [showModalPrivacidade, setShowModalPrivacidade] = useState(false);
  const [showToastTermos, setShowToastTermos] = useState(false);
  const [showToastPrivacidade, setShowToastPrivacidade] = useState(false);
  
  const location = useLocation();
  
  // Função para determinar se estamos em uma página da loja
  const isLojaPage = () => {
    const lojaRoutes = [
      '/Loja',
      '/LojaProduto',
      '/CategoriaCreatina',
      '/CategoriaCamisa',
      '/CategoriaVitaminas',
      '/CategoriaWhey',
      '/Carrinho'
    ];
    return lojaRoutes.includes(location.pathname);
  };
  
  // Função para obter o link correto do "Sobre nós"
  const getSobreNosLink = () => {
    return isLojaPage() ? '/SobrenosLoja' : '/SobreNos';
  };

  const handleConcordoTermos = () => {
    setShowModalTermos(false);
    setShowToastTermos(true);
    setTimeout(() => setShowToastTermos(false), 1500);
  };

  const handleConcordoPrivacidade = () => {
    setShowModalPrivacidade(false);
    setShowToastPrivacidade(true);
    setTimeout(() => setShowToastPrivacidade(false), 1500);
  };

  return (
    <>
      <footer className="footer-root">
        {/* Logo */}
        <div className="footer-logo-container">
          {logo && (
            <img src={logo} alt="Logo Saúde em Ação" className="footer-logo" />
          )}
        </div>

        {/* Frase */}
        <h2 className="footer-title">Siga a Saúde em Ação</h2>
        <hr className="footer-divider" />

        {/* Social Icons */}
        <div className="footer-social-icons">
          <a href="#" className="footer-icon-link" aria-label="TikTok">
            <img src={tiktokIcon} alt="TikTok" className="footer-icon-img" />
          </a>
          <a href="#" className="footer-icon-link" aria-label="Facebook">
            <img
              src={facebookIcon}
              alt="Facebook"
              className="footer-icon-img"
            />
          </a>
          <a href="#" className="footer-icon-link" aria-label="Instagram">
            <img
              src={instagramIcon}
              alt="Instagram"
              className="footer-icon-img"
            />
          </a>
        </div>

        {/* Linha separadora */}
        <hr className="footer-divider" />

        {/* Links do site */}
        <div className="footer-section-title">Nosso site</div>
        <div className="footer-site-links">
          <div>
            <div>
              <a href="/" className="footer-link">Home</a>
            </div>
            <div>
              <a href="/Loja" className="footer-link">Loja</a>
            </div>
            <div>
              <a href="#" className="footer-link">Reservas</a>
            </div>
          </div>
          <div>
            <div>
              <a href="#" className="footer-link">Personal</a>
            </div>
            <div>
              <a href="/Planos" className="footer-link">Planos</a>
            </div>
            <div>
              <a href={getSobreNosLink()} className="footer-link">Sobre nós</a>
            </div>
          </div>
        </div>

        {/* Linha separadora */}
        <hr className="footer-divider" />

        {/* Contatos */}
        <div className="footer-contact">
          <div>
            Email:{" "}
            <a href="mailto:otavio.personal@hotmail.com" className="footer-link">
              otavio.personal@hotmail.com
            </a>
          </div>
          <div>
            Instagram:{" "}
            <a
              href="https://instagram.com/equipesaudeemacao"
              className="footer-link"
            >
              @equipesaudeemacao
            </a>
          </div>
          <div>
            Contato: <a href="tel:00123456789" className="footer-link">(00) 12345-6789</a>
          </div>
        </div>

        {/* Termos e Política */}
        <div className="footer-bottom-links">
          <a
            href="#"
            className="footer-link"
            onClick={(e) => {
              e.preventDefault();
              setShowModalTermos(true);
            }}
          >
            Termos de Uso
          </a>
          {" | "}
          <a
            href="#"
            className="footer-link"
            onClick={(e) => {
              e.preventDefault();
              setShowModalPrivacidade(true);
            }}
          >
            Política de Privacidade
          </a>
        </div>

        {/* Modais */}
        {showModalTermos && (
          <ModalTermos
            onConcordo={handleConcordoTermos}
            onClose={() => setShowModalTermos(false)}
          />
        )}
        {showModalPrivacidade && (
          <ModalPrivacidade
            onConcordo={handleConcordoPrivacidade}
            onClose={() => setShowModalPrivacidade(false)}
          />
        )}

        {/* Notificações */}
        {showToastTermos && (
          <div className="modal-termos-notification">
            Termos aceitos com sucesso!
          </div>
        )}
        {showToastPrivacidade && (
          <div className="modal-termos-notification">
            Política de Privacidade aceita com sucesso!
          </div>
        )}
      </footer>
    </>
  );
};

export default Footer;
