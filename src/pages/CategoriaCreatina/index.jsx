import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_creatina.svg";
import product1 from "../../assets/IMG PRODUTO.jpg";
import product2 from "../../assets/IMG PRODUTO2.jpg";
import product3 from "../../assets/IMG PRODUTO3.jpg";
import "../../pages/CategoriaVitaminas/Categorias.css";
import Header_nLogin from "../../components/header_loja_nLogin";
import Header_Login from "../../components/header_loja";
import { useAuth } from "../../contexts/AuthContext";

const CategoriaCreatina = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
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
    { id: 17, nome: "Regata Machão Branca", preco: "R$ 89,90", imagem: product1 },
    { id: 18, nome: "Regata Machão Preta", preco: "R$ 89,90", imagem: product2 },
    { id: 19, nome: "Camisa Manga Longa Preta", preco: "R$ 119,90", imagem: product3 },
    { id: 20, nome: "Camisa Manga Longa Verde", preco: "R$ 119,90", imagem: product1 },
    { id: 21, nome: "Camisa Dry Fit Verde", preco: "R$ 99,90", imagem: product2 },
    { id: 22, nome: "Camisa Manga Longa Branca", preco: "R$ 119,90", imagem: product3 },
    { id: 23, nome: "Regata Cavada Branca", preco: "R$ 79,90", imagem: product1 },
    { id: 24, nome: "Regata Cavada Roxa", preco: "R$ 79,90", imagem: product2 },
    { id: 25, nome: "Regata Machão Cinza", preco: "R$ 89,90", imagem: product3 },
    { id: 26, nome: "Regata de Basquete Branca", preco: "R$ 129,90", imagem: product1 },
    { id: 27, nome: "Camisa Dry Fit Verde Musgo", preco: "R$ 99,90", imagem: product2 },
    { id: 28, nome: "Camisa Manga Longa Rosa", preco: "R$ 119,90", imagem: product3 },
    { id: 29, nome: "Camisa Manga Longa Rosa", preco: "R$ 119,90", imagem: product1 },
    { id: 30, nome: "Regata de Basquete Preta", preco: "R$ 129,90", imagem: product2 },
    { id: 31, nome: "Regata Machão Preta", preco: "R$ 89,90", imagem: product3 },
    { id: 32, nome: "Camisa Manga Longa Preta", preco: "R$ 119,90", imagem: product1 },
    { id: 33, nome: "Camisa Manga Longa Preta", preco: "R$ 119,90", imagem: product1 },
    { id: 34, nome: "Camisa Manga Longa Preta", preco: "R$ 119,90", imagem: product1 },
  ];

  const totalPages = Math.max(1, Math.ceil(todosOsProdutos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = todosOsProdutos.slice(startIndex, startIndex + itemsPerPage);

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    const el = document.querySelector('.categoria-container');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrev = () => gotoPage(currentPage - 1);
  const handleNext = () => gotoPage(currentPage + 1);

  const irParaDetalhes = () => {
    navigate("/LojaProduto");
  };

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="categoria-camisa">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px'
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="categoria-camisa">
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
      <div className="banner-gradient-categoria-camisa">
        <section className="banner">
          <img src={banner} alt="Banner Categoria Camisa" />
        </section>

        {/* Grid de produtos principal e único */}
        <div className="categoria-container">
          <div className="produtos-grid">
            {visibleProducts.map((produto) => (
              <div
                className="produto-card"
                key={produto.id}
                onClick={(e) => {
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

          {/* Controles de paginação */}
          <div className="pagination">
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-number ${p === currentPage ? 'active' : ''}`}
                  onClick={() => gotoPage(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriaCreatina;