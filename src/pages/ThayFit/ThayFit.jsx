// src/pages/ThayFit/ThayFit.jsx

import React from 'react';
import './ThayFit.css';
import bannerImg from '../../assets/banners/banner_thayfit.jpg';
import Header from '../../components/header_loja';
import Footer from '../../components/footer';
import PlanosComponent from '../../components/Planos';



const ThayFit = () => {
  return (
    <>
     <Header />
    <main className="thayfit-page">
     
      {/* Seção do Banner Principal - agora puramente um background image */}
      <header className="main-banner">
        <div className="banner-img">
          <img src={bannerImg} alt="Thay fit banner" />
        </div>
        <div className="banner-content">
          <h1>Thay fit</h1>
          <span className="banner-divider" aria-hidden="true"></span>
        </div>
      </header>

      {/* Seção de Texto Introdutório */}
      <section className="intro-section">
        <div className="intro-content">
          <p>
           Nossa academia saúde em ação oferece atividades Thai Fit é um tipo de aula de fitness baseada no Muay Thai, que combina movimentos de arte marcial com exercícios físicos intensos sem o confronto de luta entre os praticantes. O objetivo é melhorar o condicionamento físico, força, agilidade e queimar calorias, sendo uma atividade completa para o corpo e a mente.
          </p>
        </div>
      </section>

      <h3 className="contrate-plano">Contrate um plano e venha fazer parte da familia  saúde em ação!</h3>
    </main>

  <PlanosComponent cardBg="d9d9" />

    <Footer />
  </>

  );
};

export default ThayFit;