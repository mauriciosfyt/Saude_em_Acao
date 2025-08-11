import React from "react";
import "./CategoriaCreatina.css";
import creatinaImg from "../../assets/IMG PRODUTO.jpg";
import bannerImg from "../../assets/banners/banner_loja.jpeg"; // substitua pelo caminho real da imagem
import Footer from '../../components/footer';
import Header_nLogin from '../../components/header_loja_nLogin';
const CategoriaCreatina = () => {
  const produtos = [
    {
      id: 1,
      nome: "(TOP) Whey Protein Concentrado (1KG) - Growth Supplements",
      preco: "R$ 149,00",
      imagem: creatinaImg,
    },
    {
      id: 2,
      nome: "(TOP) Whey Protein Concentrado (900g) - Growth Supplements",
      preco: "R$ 120,00",
      imagem: creatinaImg,
    },
    {
      id: 3,
      nome: "(TOP) Whey Protein Concentrado (1KG) - Growth Supplements",
      preco: "R$ 120,00",
      imagem: creatinaImg,
    },
  ];

  return (

    <>   

    <Header_nLogin />

  <section className="banner-container">
    <div className="banner-image">
      <img src={bannerImg} alt="Banner Creatina" />
    </div>
  </section>


<div className="categoria-container">
<div className="produtos-grid">
  {produtos.map((produto) => (
    <div className="produto-card" key={produto.id}>
      <img src={produto.imagem} alt={produto.nome} className="produto-img" />
      <div className="produto-card-content">
        <h3 className="produto-nome">{produto.nome}</h3>
      </div>
      <div className="produto-card-footer">
        <p className="produto-preco">{produto.preco}</p>
        <button className="btn-reservar">Reservar</button>
      </div>
    </div>
  ))}
</div>
</div>

     <div className="lista-produtos">
      {produtos.map((produto) => (
        <div className="produto-lista-card" key={produto.id}>
          <img src={produto.imagem} alt={produto.nome} className="produto-lista-img" />
          <div className="produto-lista-info">
            <h3 className="produto-lista-nome">{produto.nome}</h3>
            <p className="produto-lista-preco">{produto.preco}</p>
          </div>
        </div>
      ))}
    </div>

    <Footer />
    </>

  );
};

export default CategoriaCreatina;
