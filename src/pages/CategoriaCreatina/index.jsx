import React from "react";
import { useNavigate } from "react-router-dom";  // <-- Importa useNavigate
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_creatina.svg";
import product1 from "../../assets/IMG PRODUTO.jpg";
import product2 from "../../assets/IMG PRODUTO2.jpg";
import product3 from "../../assets/IMG PRODUTO3.jpg";
import "../../pages/CategoriaVitaminas/Categorias.css";
import Header_nLogin from "../../components/header_loja_nLogin";
import Header_Login from "../../components/header_loja";

const CategoriaCamisa = () => {
  const navigate = useNavigate();  // <-- Inicializa o hook

  const produtos = [
    {
      id: 1,
      nome: "Creatina Monohidratada 250g",
      preco: "R$ 148,00",
      imagem: product1,
    },
    {
      id: 2,
      nome: "Vitamina D3-120 cápsulas",
      preco: "R$ 148,00",
      imagem: product2,
    },
    {
      id: 3,
      nome: "Whey Protein",
      preco: "R$ 148,00",
      imagem: product3,
    },
  ];

  const listaProdutos = [
    {
      id: 101,
      nome: "(TOP) Whey Protein Concentrado (1KG) - Growth Supplements",
      preco: "R$ 120,00",
      imagem: product3,
    },
    {
      id: 102,
      nome: "(TOP) Whey Protein Concentrado (1KG) - Growth Supplements",
      preco: "R$ 120,00",
      imagem: product3,
    },
    {
      id: 103,
      nome: "(TOP) Whey Protein Concentrado (1KG) - Growth Supplements",
      preco: "R$ 120,00",
      imagem: product3,
    },
    {
      id: 104,
      nome: "(TOP) Whey Protein Concentrado (1KG) - Growth Supplements",
      preco: "R$ 120,00",
      imagem: product3,
    },
  ];

  const irParaDetalhes = () => {
    navigate("/LojaProduto");
  };

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
              <div
                className="produto-card"
                key={produto.id}
                onClick={(e) => {
                  if (e.target.closest(".btn-reservar")) return; // Ignora clique no botão
                  irParaDetalhes();
                }}
                style={{ cursor: "pointer" }}
              >
                <img src={produto.imagem} alt={produto.nome} className="produto-img" />
                <div className="produto-card-content">
                  <h3 className="produto-nome">{produto.nome}</h3>
                </div>
                <div className="produto-card-footer">
                  <p className="produto-preco">{produto.preco}</p>
                  <button className="btn-reservar">Reservar</button> {/* Mantém botão */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista inferior */}
      <section className="lista-produtos">
        <div className="lista-wrapper">
          {listaProdutos.map((produto, idx) => (
            <div
              className={`lista-linha${idx !== listaProdutos.length - 1 ? " com-divisor" : ""}`}
              key={produto.id}
              onClick={irParaDetalhes}
              style={{ cursor: "pointer" }}
            >
              <img src={produto.imagem} alt={produto.nome} className="lista-img" />
              <div className="lista-info">
                <h4 className="lista-nome">{produto.nome}</h4>
                <p className="lista-preco">{produto.preco}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoriaCamisa;
