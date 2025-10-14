// src/pages/Home/index.jsx
import "./styles.css";
import banner_home from "../../assets/banners/banner_home.svg";
import img_abaixo_banner from "../../assets/img_home.jpeg";
import modalidade1 from "../../assets/banners/banner_thayfit.jpg";
import modalidade2 from "../../assets/banners/banner_pilates.jpg";
import modalidade3 from "../../assets/banners/banner_funcional.webp";
import Footer from "../../components/footer";
// navegação removida — imagens não mais necessárias
import tela_app from "../../assets/banners/banner_app.svg";
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// ícones não utilizados removidos
import Header_nLogin from "../../components/header_nLogin/index.jsx";
import Planos from "../../components/Planos";

function Home() {
  const historiaRef = useRef(null);
  const [showHistoria, setShowHistoria] = useState(false);
  const location = useLocation();

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

  // Se a navegação indicar que devemos rolar até 'planos', executa o scroll suave
  useEffect(() => {
    if (location && location.state && location.state.scrollTo === "planos") {
      const el = document.getElementById("planos");
      if (el) {
        // pequeno timeout para garantir que a Home foi carregada/renderizada
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      }
    }
  }, [location]);

  return (
    <div className="home-container">
      <Header_nLogin />

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
        <div id="planos">
          <Planos />
        </div>

        {/* Nossas modalidades (substitui a navegação) */}
        <section className="modalidades">
          <div className="modalidades-header">
            <div className="modalidades-left">
              <h2 className="modalidades-titulo">Nossas <span className="azul">modalidades</span></h2>
            </div>

            <div className="modalidades-divider" />

            <div className="modalidades-right">
              <p className="modalidades-descricao">Temos como missão ajudar todos os nossos alunos a atingir os seus resultados, seja com qual modalidade escolher, confira:</p>
            </div>
          </div>

          <div className="modalidades-grid">
            <Link to="/ThayFit" className="modalidade-card">
              <img src={modalidade1} alt="Thay fit" />
              <div className="modalidade-overlay">
                <h3>Thay fit</h3>
                <span className="saiba-mais">Saiba mais →</span>
              </div>
            </Link>

            <Link to="/Pilates" className="modalidade-card">
              <img src={modalidade2} alt="Pilates" />
              <div className="modalidade-overlay">
                <h3>Pilates</h3>
                <span className="saiba-mais">Saiba mais →</span>
              </div>
            </Link>

            <Link to="/Funcional" className="modalidade-card">
              {/* imagem com classe específica para estilização apenas desta modalidade */}
              <img className="modalidade-funcional-img" src={modalidade3} alt="Funcional" />
              <div className="modalidade-overlay">
                <h3>Funcional</h3>
                <span className="saiba-mais">Saiba mais →</span>
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
                  <span className="bullet"></span> Confira seu treino personalizado completo
                </li>
                <li>
                  <span className="bullet"></span> Veja a execução dos exercícios em vídeo
                </li>
                <li>
                  <span className="bullet"></span> Acompanhe o progresso de carga
                </li>
                <li>
                  <span className="bullet"></span> Compre ou faça upgrade de plano gold
                </li>
              </ul>
              <div className="qr-section">
                <img src={null} alt="QR Code" />
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
