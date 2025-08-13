import React from "react";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_catVitaminas.jpeg";
import camisaImg from "../../assets/IMG PRODUTO.jpg";
import "./CategoriaVitaminas.css";
import Header_nLogin from "../../components/header_loja_nLogin";
import Header_Login from "../../components/header_loja";


const CategoriaCamisa = () => {
  const produtos = [
    {
      id: 1,
      nome: "Camiseta Preta (Dry Fit) - Growth Supplements",
      preco: "R$ 99,00",
      imagem: camisaImg,
    },
    {
      id: 2,
      nome: "Camiseta Dark Lab (Algodão)",
      preco: "R$ 89,00",
      imagem: camisaImg,
    },
    {
      id: 3,
      nome: "Camiseta Branca (Dry Fit)",
      preco: "R$ 89,00",
      imagem: camisaImg,
    },
  ];

  return (
    <div className="categoria-camisa">
      <Header_Login />
      <div className="banner-gradient-categoria-camisa">
        <section className="banner">
          <img src={banner} alt="Banner Categoria Camisa" />
        </section>

        {/* Grid de produtos */}
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

      </div>

      {/* Lista de produtos (opcional) FORA do degradê */}
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
    </div>
  );
};

export default CategoriaCamisa;
