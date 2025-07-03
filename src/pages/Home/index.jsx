// src/pages/Home/index.jsx

import "./styles.css"; // Este caminho está correto se styles.css estiver em src/pages/Home ou em src/ e você o importa de outra forma no App.js
// Corrija os caminhos das imagens aqui:
import logo from "../../assets/logo_dia.png"; // CORRIGIDO
import banner_home from "../../assets/banner_home.jpeg"; // CORRIGIDO
import img_abaixo_banner from "../../assets/img_home.jpeg"; // CORRIGIDO
import Footer from "../../components/footer";
import academia1 from "../../assets/academia.jpeg"; // CORRIGIDO
import academia2 from "../../assets/academia2.jpeg"; // CORRIGIDO
import academia3 from "../../assets/academia3.jpeg"; // CORRIGIDO

import { Link } from 'react-router-dom';


import React, { useRef, useEffect, useState } from "react";



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
    // ESTE É O ÚNICO E PRINCIPAL home-container QUE DEVE ENVOLVER TODO O SEU CONTEÚDO
    <div className="home-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-container">
          {/* Corrigido o src da imagem para usar a variável importada 'logo' */}
          <img src={logo} alt="Logo da Empresa" className="logo" />
          <button className="login-button">Fazer login</button>
        </div>
      </header>

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
                A Saúde em Ação nasceu com um propósito: transformar vidas
                através do movimento.
                <br />
                Aqui, cada treino é um passo rumo à sua melhor versão.
              </p>
              <button className="historia-btn">saiba mais sobre nós</button>
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
              <button className="plano-btn">Saiba Mais</button>
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
              <button className="plano-btn">Saiba Mais</button>
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
              <button className="plano-btn">Saiba Mais</button>
            </div>
          </div>
        </section>

    
    <section className="instagram">
  <div className="insta-images">
    <Link to="/professores">
      <div>
        <img src={academia2} alt="Academia 2" />
        <p>Professores</p>
      </div>
    </Link>

    <Link to="/Loja">
      <div>
        <img src={academia1} alt="Academia 1" />
        <p>Loja</p>
      </div>
    </Link>

    <Link to="/suporte">
      <div>
        <img src={academia3} alt="Academia 3" />
        <p>Suporte</p>
      </div>
    </Link>

    <Link to="/suporte">
      <div>
        <img src={academia3} alt="Academia 3" />
        <p>Suporte</p>
      </div>
    </Link>
  </div>
</section>


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