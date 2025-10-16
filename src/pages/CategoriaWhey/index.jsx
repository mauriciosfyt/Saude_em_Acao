import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_whey.svg";
import product1 from "../../assets/IMG PRODUTO.jpg";
import product2 from "../../assets/IMG PRODUTO2.jpg";
import product3 from "../../assets/IMG PRODUTO3.jpg";
import "../../pages/CategoriaVitaminas/Categorias.css";
import Header_nLogin from "../../components/header_loja_nLogin";
import Header_Login from "../../components/header_loja";

const CategoriaWhey = () => {
  const navigate = useNavigate();

  // Array de produtos unificado e expandido para preencher o grid
  const todosOsProdutos = [
    { id: 1, nome: "Regata Machão Branca", preco: "R$ 89,90", imagem: product1 },
    { id: 2, nome: "Regata Machão Preta", preco: "R$ 89,90", imagem: product2 },
    { id: 3, nome: "Camisa Manga Longa Preta", preco: "R$ 119,90", imagem: product3 },
    { id: 4, nome: "Camisa Manga Longa Verde", preco: "R$ 119,90", imagem: product1 },
    { id: 5, nome: "Camisa Dry Fit Verde", preco: "R$ 99,90", imagem: product2 },
    { id: 6, nome: "Camisa Manga Longa Branca", preco: "R$ 119,90", imagem: product3 },
    { id: 7, nome: "Regata Cavada Branca", preco: "R$ 79,90", imagem: product1 },
    { id: 8, nome: "Regata Cavada Roxa", preco: "R$ 79,90", imagem: product2 },
    { id: 9, nome: "Regata Machão Cinza", preco: "R$ 89,90", imagem: product3 },
    { id: 10, nome: "Regata de Basquete Branca", preco: "R$ 129,90", imagem: product1 },
    { id: 11, nome: "Camisa Dry Fit Verde Musgo", preco: "R$ 99,90", imagem: product2 },
    { id: 12, nome: "Camisa Manga Longa Rosa", preco: "R$ 119,90", imagem: product3 },
    { id: 13, nome: "Camisa Manga Longa Rosa", preco: "R$ 119,90", imagem: product1 },
    { id: 14, nome: "Regata de Basquete Preta", preco: "R$ 129,90", imagem: product2 },
    { id: 15, nome: "Regata Machão Preta", preco: "R$ 89,90", imagem: product3 },
    { id: 16, nome: "Camisa Manga Longa Preta", preco: "R$ 119,90", imagem: product1 },
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

        {/* Grid de produtos principal e único */}
        <div className="categoria-container">
          <div className="produtos-grid">
            {todosOsProdutos.map((produto) => (
              <div
                className="produto-card"
                key={produto.id}
                onClick={(e) => {
                  // Previne a navegação se o clique for no botão
                  if (e.target.closest(".btn-reservar")) return;
                  irParaDetalhes();
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="produto-img"
                />
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
      <Footer />
    </div>
  );
};

export default CategoriaWhey;