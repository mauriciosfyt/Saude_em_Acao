import React from "react";
import "./sobrenosLoja.css";
import produtos from "../../assets/icones/Whey protain.png";
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
        <div className="sobrenos-image-wrapper">
          <img src={produtos} alt="Produtos de suplemento" className="sobrenos-image" />
        </div>
      </div>
    </section>

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
