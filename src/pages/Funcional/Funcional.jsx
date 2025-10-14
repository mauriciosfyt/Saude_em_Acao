// src/pages/Funcional/Funcional.jsx

import React from 'react';
import './Funcional.css'; // Importando o CSS específico da página
import Header from '../../components/header_loja';
import Footer from '../../components/footer';
import PlanosComponent from '../../components/Planos';

const Funcional = () => {
  return (
    <>
      <Header />
      <main className="funcional-page">
        
        {/* Seção do Banner Principal */}
        <header className="funcional-banner">
          {/* A imagem de fundo será definida no CSS */}
        </header>

        {/* Seção de Texto Introdutório */}
        <section className="funcional-intro">
          <div className="funcional-intro__content">
            <p>
             Nossa academia saúde em ação oferece atividades fisicas funcionais um método de exercício que foca em movimentos naturais do corpo, como agachar, correr e pular, para melhorar a força, equilíbrio, agilidade e resistência, simulando atividades do dia a dia. Ele trabalha vários grupos musculares ao mesmo tempo, sem necessidade de muitos aparelhos, utilizando o peso do próprio corpo e acessórios simples para aumentar o condicionamento físico e a saúde geral.
            </p>
          </div>
        </section>

        <h3 className="funcional-cta">Contrate um plano e venha fazer parte da família saúde em ação!</h3>
      </main>

      <PlanosComponent />
      <Footer />
    </>
  );
};

export default Funcional;