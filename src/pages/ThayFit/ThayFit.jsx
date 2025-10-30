// src/pages/ThayFit/ThayFit.jsx

import React from 'react';
import './ThayFit.css';
import thayfitBanner from '../../assets/banners/banner_thayfit.svg';
import Header_nLogin from '../../components/header_nLogin';
import HeaderUser from '../../components/header';
import Footer from '../../components/footer';
import PlanosComponent from '../../components/Planos';
import { useAuth } from '../../contexts/AuthContext';



const ThayFit = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="thayfit-page">
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
    <main className="thayfit-page">
     
      {/* Banner principal (igual ao da Home) */}
      <div>
        <section className="banner_thayfit">
          <img src={thayfitBanner} alt="Banner Thay fit" />
        </section>
      </div>

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