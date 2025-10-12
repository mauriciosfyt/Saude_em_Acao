import React from "react";
import "./planos.css";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import ProdutosSection from "../../components/produtos";

const Planos = () => {
  return (
    <>
      <Header_nLogin />

      <section className="planos-container">
        <div className="planos-header">
          <h2>Compare os planos Saúde em Ação disponíveis</h2>
          <p>Planos acessíveis para você treinar em nossas academias de alto padrão</p>
        </div>

        <div className="planos-content">
          <div className="planos-grid">
            {/* Plano básico */}
            <article className="plano-card">
              <h3 className="plano-title-gold">Plano gold básico</h3>
                <div className="descricao-text">Ideal para quem está começando ou busca manter a forma com treinos eficazes e supervisionados.</div>

              <div className="plano-cta">
                <div className="plano-price">
                  <span className="currency">R$</span>
                  <span className="amount">359</span>
                </div>

                  <a className="plano-btn-gold" href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">Assinar agora</a>
              </div>

              <div className="descricao-box">
                <div className="descricao-label">DESCRIÇÃO</div>
                <div className="descricao-text">Treine 2x por semana com acompanhamento personalizado.</div>
              </div>
            </article>

            {/* Plano intermediario */}
            <article className="plano-card">
              <h3 className="plano-title-gold">Plano gold intermediario</h3>
                <div className="descricao-text">Perfeito para quem já tem uma rotina ativa e quer acelerar resultados, com foco em força, resistência e estética corporal.</div>

              <div className="plano-cta">
                <div className="plano-price">
                  <span className="currency">R$</span>
                  <span className="amount">500</span>
                </div>

                  <a className="plano-btn-gold" href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">Assinar agora</a>
              </div>

              <div className="descricao-box">
                <div className="descricao-label">DESCRIÇÃO</div>
                <div className="descricao-text">Treine 3x por semana com acompanhamento personalizado.</div>
              </div>
            </article>

            {/* Plano avançado */}
            <article className="plano-card">
              <h3 className="plano-title-gold">Plano gold avançado</h3>
                <div className="descricao-text">Ideal para quem busca resultados rápidos e treinos intensivos, com foco em performance e superação de limites.</div>

              <div className="plano-cta">
                <div className="plano-price">
                  <span className="currency">R$</span>
                  <span className="amount">649</span>
                </div>

                  <a className="plano-btn-gold" href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">Assinar agora</a>
              </div>

              <div className="descricao-box">
                <div className="descricao-label">DESCRIÇÃO</div>
                <div className="descricao-text">Treine 4x por semana com acompanhamento personalizado.</div>
              </div>
            </article>

          </div>
        </div>
      </section>

  <ProdutosSection />

      <Footer />
    </>
  );
};

export default Planos;
