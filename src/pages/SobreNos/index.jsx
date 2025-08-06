import React from "react";
import Slider from "react-slick";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import "./SobreNos.css";

// Estilos do slick-carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import banner from "../../assets/banner_loja.jpeg";
import img1 from "../../assets/academia.jpeg";
import img2 from "../../assets/academia2.jpeg";
import img4 from "../../assets/navegacao_loja.png";
import img5 from "../../assets/navegacao_suporte.png";
import img6 from "../../assets/navegacao_Ntem.png";

const SobreNos = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="sobre-nos">
      <HeaderUser />

      {/* Banner com gradiente e chamada */}
      <section className="hero-banner faixa-gradiente">
        <img src={banner} alt="Banner Saúde em Ação" className="banner-img" />
      </section>

      <main className="conteudo-principal">

        {/* Seção 1 */}
        <section className="bloco sobre-cinza">
          <div className="conteudo-bloco">
            <div className="texto">
              <h2>Tornar a Saúde uma Ação Acessível!</h2>
              <p>
                Nossa missão é tornar a saúde acessível a todos, oferecendo uma
                estrutura moderna, atendimento profissional qualificado e um
                ambiente acolhedor. Acreditamos que cada pessoa merece um espaço
                onde possa evoluir com segurança e motivação, seja qual for seu
                objetivo. Aqui, unimos tecnologia, conforto e dedicação para
                garantir uma experiência completa de bem-estar físico e mental.
              </p>
            </div>
            <div className="imagem">
              <img src={img1} alt="Academia moderna" />
            </div>
          </div>
        </section>

        {/* Seção com fundo azul */}
        <section className="bloco sobre-azul">
          <div className="conteudo-bloco invertido">
            <div className="imagem">
              <img src={img2} alt="Equipamentos de ponta" />
            </div>
            <div className="texto texto-claro">
              <p>
                Mais do que uma academia, somos um espaço de acolhimento e
                transformação. Entendemos que cada pessoa carrega uma história, um
                desafio e uma meta, por isso criamos um ambiente onde você se
                sinta motivado, respeitado e acompanhado em cada etapa da sua
                jornada. Treinar aqui é fazer parte de uma comunidade que valoriza
                esforço, dedicação e conquista.
              </p>
            </div>
          </div>
        </section>

        {/* Seção final com destaques */}
        <section className="bloco sobre-cinza destaque-final">
          <div className="texto centralizado">
            <h2>POR QUE TREINAR CONOSCO?</h2>
            <p>
              Acreditamos que saúde é resultado de ação, e cada treino é um
              passo em direção à sua melhor versão. Não importa se você está
              começando agora ou já tem experiência, nosso compromisso é
              oferecer os recursos certos para que você alcance seus objetivos.
              Com suporte profissional, equipamentos de ponta e um ambiente que
              inspira, sua transformação começa hoje, sem desculpas.
            </p>

         <div className="carrossel-wrapper">
  <Slider {...settings}>
    <div className="carrossel-item">
      <img src={img4} alt="Roupas" className="carrossel-img" />
      <p className="carrossel-legend">Roupas</p>
    </div>
    <div className="carrossel-item">
      <img src={img5} alt="Suporte" className="carrossel-img" />
      <p className="carrossel-legend">Suporte</p>
    </div>
    <div className="carrossel-item">
      <img src={img6} alt="Personal" className="carrossel-img" />
      <p className="carrossel-legend">Professores</p>
    </div>
  </Slider>
</div>


            <button className="btn-sobre">Saiba Mais</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobreNos;
