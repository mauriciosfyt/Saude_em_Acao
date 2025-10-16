// src/pages/Pilates/Pilates.jsx

import React from 'react';
import './Pilates.css'; // Importando o novo arquivo CSS
import Header from '../../components/header_nLogin';
import Footer from '../../components/footer';
import PlanosComponent from '../../components/Planos';
import pilatesBanner from '../../assets/banners/banner_pilates.svg';


const Pilates = () => {
  return (
    <>
      <Header />
      <main className="pilates-page">
        
      {/* Banner principal (igual ao da Home) */}
      <div>
        <section className="banner_thayfit">
          <img src={pilatesBanner} alt="Banner Thay fit" />
        </section>
      </div>

        {/* Seção de Texto Introdutório */}
        <section className="pilates-intro">
          <div className="pilates-intro__content">
            <p>
            Nossa academia saúde em ação oferece atividades de Pilates! È um método de exercício que une corpo e mente para fortalecer o corpo de forma equilibrada, aumentar a flexibilidade, aprimorar a postura e a consciência corporal através de movimentos controlados, respiração consciente e foco nos músculos do "core". A prática serve para melhorar a saúde física e mental, podendo ser adaptada para pessoas de todas as idades e condições físicas, sendo útil na reabilitação de lesões e na prevenção de futuras.
            </p>
          </div>
        </section>

        <h3 className="pilates-cta">Contrate um plano e venha fazer parte da família saúde em ação!</h3>
      </main>

  <PlanosComponent cardBg="d9d9" />
      <Footer />
    </>
  );
};

export default Pilates;