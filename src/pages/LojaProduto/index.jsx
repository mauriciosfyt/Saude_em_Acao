import React from "react";
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import "./LojaProduto.css";
import produto1 from "../../assets/IMG PRODUTO.jpg";
import produto2 from "../../assets/IMG PRODUTO2.jpg";
import produto3 from "../../assets/IMG PRODUTO3.jpg";

import mainProduct from "../../assets/IMG PRODUTO3.jpg"; // ajuste o path conforme seu projeto
import thumb from "../../assets/icones/Whey protain.png"; // ajuste o path conforme necessário

const LojaProduto = () => {
  return (
    <>
      <Header_nLogin />

      <section className="product-hero">
        <div className="left-section">
          <img src={mainProduct} alt="Whey Protein" className="main-product" />
          <div className="thumbs">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={thumb}
                alt="Miniatura Produto"
                className="thumb"
              />
            ))}
          </div>
        </div>

        <div className="right-section">
          <h2 className="product-title">
            (TOP) Whey Protein Concentrado (1KG) - Growth Supplements
          </h2>

          <p className="price">R$124,90</p>

          <select className="select-flavor">
            <option>Sabor</option>
            <option>Chocolate</option>
            <option>Baunilha</option>
          </select>

          <button className="reserve-button">
            RESERVAR <span className="cart-icon">🛒</span>
          </button>
        </div>
      </section>

      <section className="description-section">
        <div className="description-container">
          <h2 className="description-title">
            WHEY PROTEIN E O AUMENTO DO VOLUME MUSCULAR
          </h2>
          <p>
            O consumo de Whey Protein 80% pode ser feito após o treino, por quem
            busca aumento da massa magra e precisa de auxílio para seus músculos
            crescerem. Para alcançar a hipertrofia precisamos fornecer proteínas
            quantidade e com qualidade adequada, as proteínas são transformadas
            em aminoácidos, estes nutrientes essenciais são usados no processo
            de construção muscular. Por essa razão, o whey protein é utilizado,
            principalmente, por praticantes de atividade física e atletas de
            alto desempenho. Praticantes de exercício de força como musculação
            podem ter aumento nas necessidades de nutrientes inclusive
            proteínas, quando comparados com indivíduos sedentários. A proteína
            presente no soro do leite é uma excelente fonte de aminoácidos
            essenciais, como os BCAA’s. A proteína concentrada é uma das mais
            indicadas para quem está focado na hipertrofia e precisa de uma boa
            quantidade de proteínas na dieta para suprir as necessidades do
            treino.
          </p>
        </div>
      </section>

      {/* Cards de produtos */}
      <section className="products-section">
      <h2 className="section-title">Destaques da Loja</h2>
      <div className="cards-container">
        <div className="product-card">
          <img src={produto1} alt="Produto 1" />
          <h3>Produto 1</h3>
          <p>R$ 199,90</p>
          <div className="botoes-produto">
            <button className="buy-button">Comprar</button>
            <button className="detalhes-button">Detalhes</button>
          </div>
        </div>
        <div className="product-card">
          <img src={produto2} alt="Produto 2" />
          <h3>Produto 2</h3>
          <p>R$ 299,90</p>
          <div className="botoes-produto">
            <button className="buy-button">Comprar</button>
            <button className="detalhes-button">Detalhes</button>
          </div>
        </div>
        <div className="product-card">
          <img src={produto3} alt="Produto 3" />
          <h3>Produto 3</h3>
          <p>R$ 399,90</p>
          <div className="botoes-produto">
            <button className="buy-button">Comprar</button>
            <button className="detalhes-button">Detalhes</button>
          </div>
        </div>
      </div>
    </section>

      <section className="descriptionproduto-section">
        <div className="descriptionproduto-container">
          <h2 className="descriptionproduto-title">
            WHEY PROTEIN E A SUA RELAÇÃO COM O CRESCIMENTO MUSCULAR
          </h2>
          <p>
            O consumo de Whey Protein 80% pode ser feito após o treino, por quem
            busca aumento da massa magra e precisa de auxílio para seus músculos
            crescerem. Para alcançar a hipertrofia precisamos fornecer proteínas
            quantidade e com qualidade adequada, as proteínas são transformadas
            em aminoácidos, estes nutrientes essenciais são usados no processo
            de construção muscular. Por essa razão, o whey protein é utilizado,
            principalmente, por praticantes de atividade física e atletas de
            alto desempenho. Praticantes de exercício de força como musculação
            podem ter aumento nas necessidades de nutrientes inclusive
            proteínas, quando comparados com indivíduos sedentários. A proteína
            presente no soro do leite é uma excelente fonte de aminoácidos
            essenciais, como os BCAA’s. A proteína concentrada é uma das mais
            indicadas para quem está focado na hipertrofia e precisa de uma boa
            quantidade de proteínas na dieta para suprir as necessidades do
            treino.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LojaProduto;
