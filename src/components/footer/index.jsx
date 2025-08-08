import React from "react";
import "./Footer.css";
import logo from "../../assets/logo1.png"; // ajuste o caminho conforme sua estrutura
import tiktokIcon from "../../assets/icones/Email.png";
import facebookIcon from "../../assets/icones/icons8-instagram-50.png";
import instagramIcon from "../../assets/icones/icons8-whatsapp-50.png";

const Footer = () => {
  return (
    <footer className="footer-root">
      {/* Logo */}
      <div className="footer-logo-container">
        <img
          src={logo}
          alt="Logo Saúde em Ação"
          className="footer-logo"
        />
      </div>
      {/* Frase */}
      <h2 className="footer-title">
        Siga a Saúde em ação
      </h2>

        <hr className="footer-divider" />
      {/* Social Icons */}
      <div className="footer-social-icons">
        <a href="#" className="footer-icon-link" aria-label="TikTok">
          <img src={tiktokIcon} alt="TikTok" className="footer-icon-img" />
        </a>
        <a href="#" className="footer-icon-link" aria-label="Facebook">
          <img src={facebookIcon} alt="Facebook" className="footer-icon-img" />
        </a>
        <a href="#" className="footer-icon-link" aria-label="Instagram">
          <img src={instagramIcon} alt="Instagram" className="footer-icon-img" />
        </a>
      </div>
      {/* Linha separadora */}
      <hr className="footer-divider" />
      {/* Links do site */}
      <div className="footer-section-title">
        Nosso site
      </div>
      <div className="footer-site-links">
        <div>
          <div><a href="/" className="footer-link">Home</a></div>
          <div><a href="/Loja" className="footer-link">Loja</a></div>
          <div><a href="#" className="footer-link">Reservas</a></div>
        </div>
        <div>
          <div><a href="#" className="footer-link">Personal</a></div>
          <div><a href="/Planos" className="footer-link">Planos</a></div>
          <div><a href="/SobreNos" className="footer-link">Sobre nós</a></div>
        </div>
      </div>
      {/* Linha separadora */}
      <hr className="footer-divider" />
      {/* Contatos */}
      <div className="footer-contact">
        <div>Email: <a href="mailto:otavio.personal@hotmail.com" className="footer-link">otavio.personal@hotmail.com</a></div>
        <div>Instagram: <a href="https://instagram.com/equipesaudeemacao" className="footer-link">@equipesaudeemacao</a></div>
        <div>Contato: <a href="tel:00123456789" className="footer-link">(00) 12345-6789</a></div>
      </div>
      {/* Termos e Política */}
      <div className="footer-bottom-links">
        <a href="#" className="footer-link">Termos de Uso</a>
        <a href="#" className="footer-link">Política de Privacidade</a>
      </div>
    </footer>
  );
};

export default Footer;