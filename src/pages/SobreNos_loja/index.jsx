import React from "react";
import "./sobrenosLoja.css";
import produtos from "../..//assets/Suplementos.png";
import IconCorrida from "../../assets/icones/Boneco correndo.png";
import IconMusculo from "../../assets/icones/Tríceps-Azul.png";
import IconCapsula from "../../assets/icones/Pílula-Azul.png";
import IconGrafico from "../../assets/icones/gráfico-Azul.png";

import Header_nLogin from "../../components/header_loja_nLogin"
import Footer from "../../components/footer";

const SobrenosLoja = () => {
  return (
    <>

    <Header_nLogin />

    <section className="sobrenos-container">
      <div className="sobrenos-content">
        <div className="sobrenos-circle">
          <h2 className="sobrenos-title">A marca oficial da Saúde em ação</h2>
          <div className="sobrenos-text-wrapper">
            <p className="sobrenos-paragraph">
              Na nossa loja, saúde, estilo e performance caminham juntos. Oferecemos
              uma seleção especial de produtos pensados para quem busca evolução física e
              qualidade de vida. Aqui você encontra roupas esportivas confortáveis e modernas,
              de alta qualidade e acessórios que completam sua rotina de treino.
            </p>
            <p className="sobrenos-paragraph">
              Cada item foi escolhido com foco no bem-estar, no conforto e nos resultados
              de quem treina e se dedica. Mais do que vender produtos, queremos estimular
              você a alcançar seu melhor estilo de vida saudável, motivador e cheio de atitude.
              <br /><br />
              <strong>SAÚDE EM AÇÃO É A SUA OPÇÃO INTELIGENTE DE SUPLEMENTAÇÃO.</strong>
            </p>
          </div>
        </div>
        <div className="sobrenos-image-wrapper">
          <img src={produtos} alt="Produtos de suplemento" className="sobrenos-image" />
        </div>
      </div>
    </section>

    {/* Onda separadora entre o azul e a seção escura */}
    <div className="sobrenos-wave">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0,256L60,240C120,224,240,192,360,181.3C480,171,600,181,720,197.3C840,213,960,235,1080,229.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" fill="#242525" />
      </svg>
    </div>

     <section className="beneficios-container">
      <h2 className="beneficios-title">Porque utilizar os suplementos?</h2>
      <div className="beneficios-grid">
        <div className="beneficio-item">
          <img src={IconCorrida} alt="Ícone corrida" className="beneficio-icon" />
          <p>Facilitar o consumo de nutrientes essenciais para aumento de performance.</p>
        </div>
        <div className="beneficio-item">
          <img src={IconMusculo} alt="Ícone músculo" className="beneficio-icon" />
          <p>Promover uma recuperação muscular mais rápida e efetiva.</p>
        </div>
        <div className="beneficio-item">
          <img src={IconCapsula} alt="Ícone cápsula" className="beneficio-icon" />
          <p>Praticidade <br /> (shakes, barras, gel, bebidas).</p>
        </div>
        <div className="beneficio-item">
          <img src={IconGrafico} alt="Ícone gráfico" className="beneficio-icon" />
          <p>
            Fornecer alta concentração de nutrientes, proteínas,
            aminoácidos, vitaminas, minerais, carboidratos.
          </p>
        </div>
      </div>
    </section>

    <Footer />
    </>
  );
};

export default SobrenosLoja;
