// src/pages/Funcional/Funcional.jsx

import React from 'react';
import './Funcional.css'; // Importando o CSS específico da página
import Header_nLogin from '../../components/header_nLogin';
import HeaderUser from '../../components/header';
import Footer from '../../components/footer';
import PlanosComponent from '../../components/Planos';
import funcionalBanner from '../../assets/banners/banner_funcional.svg';
import { useAuth } from '../../contexts/AuthContext';


const Funcional = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="funcional-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px'
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <HeaderUser /> : <Header_nLogin />}
      <main className="funcional-page">
        
      {/* Banner principal (igual ao da Home) */}
      <div>
        <section className="banner_thayfit">
          <img src={funcionalBanner} alt="Banner Funcional" />
        </section>
      </div>

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

  <PlanosComponent cardBg="d9d9" />
      <Footer />
    </>
  );
};

export default Funcional;