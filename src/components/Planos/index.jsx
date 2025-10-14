import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./styles.css";

function PlanosComponent({ cardBg }) {
  const altClass = cardBg === "d9d9" ? "alt-bg" : "";

  return (
    <section className={`planos ${altClass}`}>
      <h2>PLANOS</h2>
      <div className="plano-cards">
        <div className="plano-card">
          <h3>Plano Básico</h3>
          <p className="descricao">O plano de academia ideal para quem quer ter resultados pagando pouco!</p>
          <p className="preco destaque-preco">R$ 120,00</p>
          <a href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">
            <button className="plano-btn full">Contratar</button>
          </a>
          <p className="modalidade-titulo">Escolher umas das funcionalidades:</p>
          <ul>
            <li><span className="icons"><FaCheckCircle /></span>Thay fit</li>
            <li><span className="icons"><FaCheckCircle /></span>Pilates</li>
            <li><span className="icons"><FaCheckCircle /></span>Funcional</li>
          </ul>
        </div>

        <div className="plano-card">
          <h3>Plano Essencial</h3>
          <p className="descricao">O plano ideal para quem busca mais opções e flexibilidade nos treinos, aproveitando todas as modalidades com ótimo custo-benefício e estrutura completa!</p>
          <p className="preco destaque-preco">R$ 159,90</p>
          <a href="https://api.whatsapp.com/message/7SFQMRX2M76KG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">
            <button className="plano-btn full">Contratar</button>
          </a>
          <p className="modalidade-titulo">Todas as modalidades:</p>
          <ul>
            <li><span className="icons"><FaCheckCircle /></span>Thay fit</li>
            <li><span className="icons"><FaCheckCircle /></span>Pilates</li>
            <li><span className="icons"><FaCheckCircle /></span>Funcional</li>
            <li><span className="icons cross"><FaTimesCircle /></span>Personal</li>
          </ul>
        </div>

        <div className="plano-card destaque dark">
          <span className="tag">o mais vantajoso</span>
          <h3>Plano Gold</h3>
          <p className="descricao">O plano mais completo, com personal, acesso total a todas as modalidades e suporte exclusivo.</p>
          <p className="preco destaque-preco branco">R$ 300,00</p>
          <Link to="/Planos">
            <button className="plano-btn full inverted">Saiba mais</button>
          </Link>
          <ul>
            <li><span className="icons"><FaCheckCircle /></span>Personal</li>
            <li><span className="icons"><FaCheckCircle /></span>Funcional</li>
            <li><span className="icons"><FaCheckCircle /></span>Thay fit</li>
            <li><span className="icons"><FaCheckCircle /></span>Pilates</li>
            <li className="valor-a-partir"><span className="icons"><FaCheckCircle /></span>Valores a partir de R$ 300,00</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PlanosComponent;
