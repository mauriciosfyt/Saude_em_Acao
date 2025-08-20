// src/pages/Home/index.jsx
import "../../components/modal_login/modal_login.css";
import "./styles.css";
import logo from "../../assets/logo_dia.png";
import banner_home from "../../assets/banners/banner_home.jpeg";
import img_abaixo_banner from "../../assets/img_home.jpeg";
import Footer from "../../components/footer";
import navegacao_ntem from "../../assets/navegacao_Ntem.png";
import navegacao_suporte from "../../assets/navegacao_suporte.png";
import navegacao_prof from "../../assets/navegacao_professores.png";
import navegacao_loja from "../../assets/navegacao_loja.png";
import tela_app from "../../assets/tela_app.png";
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";

// Importando os modais refatorados (nomes corrigidos sem espaços)
import ModalLogin from "../../components/modal_login/ModalLogin";
import ModalCodigo from "../../components/modal_login/ModalCodigo";
import ModalRecuperarSenha from "../../components/modal_login/ModalRecuperarSenha";
import ModalCodigoRecuperacao from "../../components/modal_login/ModalCodigoRecuperacao";
import ModalAlterarSenha from "../../components/modal_login/ModalAlterarSenha";

function Home() {
  const historiaRef = useRef(null);
  const [showHistoria, setShowHistoria] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showRecoverCodeModal, setShowRecoverCodeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowHistoria(true);
      },
      { threshold: 0.3 }
    );
    if (historiaRef.current) observer.observe(historiaRef.current);
    return () => observer.disconnect();
  }, []);

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

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo da Empresa" className="logo" />
          <button className="login-button" onClick={() => setShowModal(true)}>
            Fazer login
          </button>
        </div>
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

      <main>
        {/* BANNER */}
        <div className="banner-gradient">
          <section className="banner">
            <img src={banner_home} alt="Banner" />
          </section>

          {/* Imagem em preto e branco + box de texto ao lado, abaixo do banner */}
          <div className="linha-abaixo-banner">
            <img
              src={img_abaixo_banner}
              alt="Destaque"
              className="img-abaixo-banner"
            />
            <div
              className={`historia-box${showHistoria ? " show" : ""}`}
              ref={historiaRef}
            >
              <h2>CONHEÇA NOSSA HISTÓRIA</h2>
              <p>
                A Saúde em Ação nasceu com um propósito de transformar vidas
                através do movimento.
                <br />
                Aqui, cada treino é um passo rumo à sua melhor versão.
              </p>
              <Link to="/SobreNos" style={{ alignSelf: "flex-end" }}>
                <button className="historia-btn">saiba mais sobre nós</button>
              </Link>
            </div>
          </div>

          {/* TÍTULO FINAL DO BANNER */}
          <div className="banner-titulo-final">
            <h2>
              <span className="bold">
                Venha treinar na{" "}
                <span className="azul">
                  Saúde em Ação, a academia
                  <br />
                  que mais cresce na região!
                </span>
              </span>
            </h2>
            <p className="subtitulo-final">
              ambiente motivador e planos que cabem no seu bolso
            </p>
          </div>
        </div>

        {/* PLANOS */}
        <section className="planos">
          <h2>PLANOS</h2>
          <div className="plano-cards">
            <div className="plano-card">
              <h3>BÁSICO</h3>
              <div className="linha-azul"></div>
              <p className="preco">
                <b>R$ 120,00</b>
              </p>
              <span className="modalidade-titulo">
                ESCOLHA UMA DAS MODALIDADES:
              </span>
              <ul>
                <li>FUNCIONAL</li>
                <li>THAY FIT</li>
                <li>PILATES</li>
              </ul>
              <Link to={"/Planos"}>
                <button className="plano-btn">Saiba Mais</button>
              </Link>
            </div>
            <div className="plano-card">
              <h3>ESSENCIAL</h3>
              <div className="linha-azul"></div>
              <p className="preco">
                <b>R$ 159,90</b>
              </p>
              <span className="modalidade-titulo">TODAS AS MODALIDADES:</span>
              <ul>
                <li>FUNCIONAL</li>
                <li>THAY FIT</li>
                <li>PILATES</li>
              </ul>
              <Link to={"/Planos"}>
                <button className="plano-btn">Saiba Mais</button>
              </Link>
            </div>
            <div className="plano-card">
              <h3>GOLD</h3>
              <div className="linha-azul"></div>
              <p className="preco">
                <b>R$ 300,00</b>
              </p>
              <span className="modalidade-titulo">TODAS AS MODALIDADES:</span>
              <ul>
                <li>FUNCIONAL</li>
                <li>THAY FIT</li>
                <li>PILATES</li>
              </ul>
              <Link to={"/Planos"}>
                <button className="plano-btn">Saiba Mais</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Navegação */}

        <section className="navegacao">
          <h2 className="navegacao-titulo">
            Experiência <span className="azul">Saúde em ação</span>
          </h2>
          <div className="navegacao-links">
            <Link to="/ReservasEfetuadas">
              <div>
                <img src={navegacao_prof} alt="Tela professor" />
                <p>ReservasEfetuadas</p>
              </div>
            </Link>

            <Link to="/Loja">
              <div>
                <img src={navegacao_loja} alt="Tela loja" />
                <p>Loja</p>
              </div>
            </Link>

            <Link to="/SobreNos">
              <div>
                <img src={navegacao_suporte} alt="Academia" />
                <p>Sobre Nós</p>
              </div>
            </Link>

            <Link to="/SobrenosLoja">
              <div>
                <img src={navegacao_ntem} alt="Academia 3" />
                <p>Sobre nos loja</p>
              </div>
            </Link>
          </div>
        </section>

        {/*App saude em acão*/}
        <section className="banner-app">
          <div className="banner-app-container">
            {/* COLUNA ESQUERDA */}
            <div className="banner-text">
              <h2>Saúde em ação app</h2>
              <h3>Seu aliado nos treinos!</h3>
              <ul>
                <li>
                  <span className="check"></span> Confira seu treino
                  personalizado completo
                </li>
                <li>
                  <span className="check"></span> Veja a execução dos exercícios
                  em vídeo
                </li>
                <li>
                  <span className="check"></span> Acompanhe o progresso de carga
                </li>
                <li>
                  <span className="check"></span> Acesse 60 treinos mesmo se não
                  for nosso aluno
                </li>
                <li>
                  <span className="check"></span> Compre ou faça upgrade de
                  plano
                </li>
              </ul>
              <div className="qr-section">
                <img src="" alt="QR Code" />
                <p>@EQUIPESAUDEEMACAO</p>
              </div>
            </div>

            {/* COLUNA DIREITA */}
            <div className="banner-image-box ">
              <img src={tela_app} alt="App Celulares" />
            </div>
          </div>
        </section>

        {/* Instagram */}
        {/* <section className="instagram">
            <h2>UM POUCO SOBRE NOSSO INSTAGRAM</h2>
  
            <div className="insta-embeds">
              <InstagramEmbed url="https://www.instagram.com/reel/DHgXrSLOyd0/?igsh=MW9wZDN4b3JoeTlnZQ" />
              <InstagramEmbed url="https://www.instagram.com/reel/CxfdL6JOEhJ/?igsh=MTFnZ3Q5YzAwczMxdw" />
              <InstagramEmbed url="https://www.instagram.com/p/DCl7YH1uBvr/?igsh=MWRoZDN2M2YwNWRiMA" />
              <InstagramEmbed url="https://www.instagram.com/reel/DJl5gxMxNc3/?igsh=ODUyZzM2cHRkNzdq" />
            </div>
          </section> */}

        {/* LOCALIZAÇÃO */}
        <section className="localizacao">
          <h2>NOSSA LOCALIZAÇÃO</h2>
          {/* CORRIGIDO: Use uma URL válida para incorporar o Google Maps. */}
          {/* Esta URL é um exemplo de incorporação da localização que você forneceu. */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.326372076211!2d-46.77259468502127!3d-23.59374098466657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce55a2c2b7e127%3A0x6b8f170c8a6f4e6e!2sR.%20Jos%C3%A9%20Pereira%20Bueno%2C%2068%20-%20Vila%20Franca%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005776-430!5e0!3m2!1spt-BR!2sbr!4v1719702206781!5m2!1spt-BR!2sbr"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            // Adicione referrerpolicy para melhor segurança e compatibilidade
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <p>
            R. José Pereira Bueno, 68 - Vila Franca - São Paulo - SP, 05776-430
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;
