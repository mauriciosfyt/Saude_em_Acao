import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import Slider from "react-slick";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import "./SobreNos.css";

// Estilos do slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import banner from "../../assets/banners/banner_sobreNos.jpeg";
import img1 from "../../assets/academia.jpeg";
import img2 from "../../assets/academia2.jpeg";

const SobreNos = () => {
  const navigate = useNavigate(); // Inicialize o hook

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
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const imagemRef = useRef(null);
  const [showImagem, setShowImagem] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowImagem(true);
      },
      { threshold: 0.3 }
    );
    if (imagemRef.current) observer.observe(imagemRef.current);
    return () => observer.disconnect();
  }, []);

  const imagemRef2 = useRef(null);
  const [showImagem2, setShowImagem2] = useState(false);

  useEffect(() => {
    const observer2 = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowImagem2(true);
      },
      { threshold: 0.3 }
    );
    if (imagemRef2.current) observer2.observe(imagemRef2.current);
    return () => observer2.disconnect();
  }, []);

  // Função para navegar para a página de planos
  const handleNavigateToPlans = () => {
    navigate("/planos");
  };

  return (
    <div className="sobre-nos">
      <HeaderUser />

      {/* Banner igual ao da Home */}
      <div className="banner-gradient-sobrenos">
        <section className="banner">
          <img src={banner} alt="Banner Saúde em Ação" />
        </section>
      </div>

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
              <img
                src={img1}
                alt="Academia moderna"
                ref={imagemRef}
                className={`img-animada-sobre ${showImagem ? "show" : ""}`}
              />
            </div>
          </div>
        </section>

        {/* Seção com fundo azul */}
        <section className="bloco sobre-azul">
          <div className="conteudo-bloco invertido">
            <div className="imagem">
              <img
                src={img2}
                alt="Equipamentos de ponta"
                ref={imagemRef2}
                className={`img-animada-sobre-direita ${
                  showImagem2 ? "show" : ""
                }`}
              />
            </div>
            <div className="texto texto-claro">
              <p>
                Mais do que uma academia, somos um espaço de acolhimento e
                transformação. Entendemos que cada pessoa carrega uma história,
                um desafio e uma meta, por isso criamos um ambiente onde você se
                sinta motivado, respeitado e acompanhado em cada etapa da sua
                jornada. Treinar aqui é fazer parte de uma comunidade que
                valoriza esforço, dedicação e conquista.
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
                  <p className="carrossel-legend">
                    A constância é a sua maior aliada. Um treino ruim ainda é melhor que nenhum treino. Foque em aparecer, o resto acontece!
                  </p>
                </div>
                <div className="carrossel-item">
                  <p className="carrossel-legend">
                    Sem energia para treinar? Tente um lanche leve de pré-treino! Uma banana, um iogurte ou algumas castanhas podem fazer a diferença.
                  </p>
                </div>
                <div className="carrossel-item">
                  <p className="carrossel-legend">
                    Hidrate-se! A água é fundamental para o seu desempenho na academia e para a recuperação muscular.
                  </p>
                </div>
                <div className="carrossel-item">
                  <p className="carrossel-legend">
                    O descanso é parte do treino. Dar tempo para os seus músculos se recuperarem é crucial para o crescimento e para evitar lesões.
                  </p>
                </div>
                <div className="carrossel-item">
                  <p className="carrossel-legend">
                    Parabéns, você fez o seu melhor hoje! O sentimento de dever cumprido depois do treino é a melhor recompensa.
                  </p>
                </div>
              </Slider>
            </div>

            <button className="btn-sobre" onClick={handleNavigateToPlans}>
              VISUALIZAR PLANOS
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobreNos;