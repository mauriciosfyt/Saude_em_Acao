// src/pages/Home/index.jsx
import "./styles.css";
import banner_home from "../../assets/banners/banner_home.svg";
import img_abaixo_banner from "../../assets/img_home.jpeg";
import Footer from "../../components/footer";
import navegacao_ntem from "../../assets/navegacao_Ntem.png";
import navegacao_suporte from "../../assets/navegacao_suporte.png";
import navegacao_prof from "../../assets/navegacao_professores.png";
import navegacao_loja from "../../assets/navegacao_loja.png";
import tela_app from "../../assets/tela_app.png";
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header_nLogin from "../../components/header_nLogin/index.jsx";

function Home() {
  const historiaRef = useRef(null);
  const [showHistoria, setShowHistoria] = useState(false);

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
        <section className="planos">
          <h2>PLANOS</h2>
          <div className="plano-cards branco">
            {/* PLANO BÁSICO */}
            <div className="plano-card">
              <h3>Plano Básico</h3>
              <p className="descricao">XXXXXXXXXX</p>
              <p className="preco">
                <b>R$ 119,00</b>
              </p>
              <a href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">
                <button className="plano-btn">Assinar agora</button>
              </a>
              <ul>
                <li>Escolha uma das modalidades a baixo:</li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Pilates
                </li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Thay fit
                </li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Funcional
                </li>
              </ul>
            </div>

            {/* PLANO ESSENCIAL */}
            <div className="plano-card">
              <h3>Plano Essencial</h3>
              <p className="descricao">XXXXXXXXXX</p>
              <p className="preco">
                <b>R$ 159,00</b>
              </p>
              <a href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">
                <button className="plano-btn">Assinar agora</button>
              </a>
              <ul>
                <li>Todas as modalidades a baixo:</li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Pilates
                </li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Thay fit
                </li>
                <li>
                  <span className="icons">
                    <FaCheckCircle />
                  </span>{" "}
                  Funcional
                </li>
              </ul>
            </div>
            {/* PLANO GOLD */}
            <div className="plano-card destaque">
              <span className="mais-vantajoso ">o mais vantajoso</span>
              <h3>Plano Gold</h3>
              <p className="descricao branco">XXXXXXXXXX</p>
              <p className="preco">
                <b>À partir de R$350,00</b>
              </p>
              <Link to="/Planos">
                <button className="plano-btn">saiba mais</button>
              </Link>
              <ul>
                <li>Todas as modalidades a baixo:</li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Pilates
                </li>
                <li>
                  <span className="icons ">
                    <FaCheckCircle />
                  </span>{" "}
                  Thay fit
                </li>
                <li>
                  <span className="icons">
                    <FaCheckCircle />
                  </span>{" "}
                  Funcional
                </li>
                <li>
                  <span className="icons">
                    <FaCheckCircle />
                  </span>{" "}
                  Treino Personalizado
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Navegação */}

        <section className="navegacao">
          <h2 className="navegacao-titulo">
            Experiência <span className="azul">Saúde em ação</span>
          </h2>
          <div className="navegacao-links">
            <Link to="/Professores">
              <div>
                <img src={navegacao_prof} alt="Tela professor" />
                <p>Personal</p>
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

            <Link to="/Planos">
              <div>
                <img src={navegacao_ntem} alt="Planos" />
                <p>Planos</p>
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
