import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import CardFlip from "../../components/CardFlip";
import "./SobreNos.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import banner from "../../assets/banners/banner_sobreNos.svg";
import img1 from "../../assets/academia.jpeg";
import img2 from "../../assets/academia2.jpeg";
import cardImg1 from "../../assets/academia.jpeg";
import cardImg2 from "../../assets/academia2.jpeg";
import cardImg3 from "../../assets/academia3.jpeg";
import cardImg4 from "../../assets/academia4.jpeg";
import cardImg5 from "../../assets/academia5.jpeg";

// 🔹 Lista de dicas
const DICAS = [
  {
    imagem: cardImg1,
    verso: "A constância é a sua maior aliada. Um treino ruim ainda é melhor que nenhum treino. Foque em aparecer, o resto acontece!",
  },
  {
    imagem: cardImg2,
    verso: "Sem energia para treinar? Tente um lanche leve de pré-treino! Uma banana, um iogurte ou algumas castanhas podem fazer a diferença.",
  },
  {
    imagem: cardImg3,
    verso: "Hidrate-se! A água é fundamental para o seu desempenho na academia e para a recuperação muscular. Beba água antes, durante e depois do treino.",
  },
  {
    imagem: cardImg4,
    verso: "O descanso é parte do treino. Dar tempo para os seus músculos se recuperarem é crucial para o crescimento e para evitar lesões.",
  },
  {
    imagem: cardImg5,
    verso: "Parabéns, você fez o seu melhor hoje! O sentimento de dever cumprido depois do treino é a melhor recompensa. Continue assim!",
  },
];

const SobreNos = () => {
  const navigate = useNavigate();

  // 🔹 Estado para controlar quais cartas estão viradas
  const [flippedCards, setFlippedCards] = useState(
    Array(DICAS.length).fill(false)
  );

  const handleFlip = (index) => {
    setFlippedCards((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // 🔹 Animações de entrada das imagens
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

  return (
    <div className="sobre-nos">
      <HeaderUser />

      <div className="banner-gradient-sobrenos">
        <section className="banner">
          <img src={banner} alt="Banner Saúde em Ação" />
        </section>
      </div>

      <main className="conteudo-principal">
        {/* Bloco 1 */}
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

        {/* Bloco 2 */}
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

        {/* Bloco 3 - Carrossel */}
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

            {/* 🔹 Carrossel de cartas */}
            <div className="carrossel-wrapper">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
                pauseOnHover={true}
                centerMode={true}
                centerPadding="40px"
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: { slidesToShow: 2, centerPadding: "30px" },
                  },
                  {
                    breakpoint: 600,
                    settings: { slidesToShow: 1, centerPadding: "20px" },
                  },
                ]}
              >
                {DICAS.map((dica, index) => (
                  <div key={index} className="carrossel-item">
                    <CardFlip
                      data={dica}
                      isFlipped={flippedCards[index]}
                      onFlip={() => handleFlip(index)}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <Link to={"/"} state={{ scrollTo: "planos" }}>
              <button className="btn-sobre">
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
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobreNos;
