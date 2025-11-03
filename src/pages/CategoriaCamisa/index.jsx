import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header_Login from "../../components/header_loja";
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_camisetas.svg";
import { useAuth } from "../../contexts/AuthContext";

import { getProdutosByCategoria } from "../../services/produtoService";

import "../../pages/CategoriaVitaminas/Categorias.css";
import "./CategoriaCamisa.css";

const CategoriaCamisa = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [produtos, setProdutos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        const data = await getProdutosByCategoria("CAMISETAS");

        // (O filtro no frontend estava correto, vamos mantê-lo)
        const produtosFiltrados = data.filter(
          (p) => p.categoria === "CAMISETAS"
        );

        console.log(`API retornou ${data.length} produtos.`);
        console.log(
          `Filtrados no frontend para ${produtosFiltrados.length} (categoria CAMISETAS).`
        );

        const produtosFormatados = produtosFiltrados.map((prod) => ({
          ...prod,
          imagem: prod.img, // Correção da API
          precoFormatado: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(prod.preco),
        }));

        setProdutos(produtosFormatados);
        
      } catch (err) {
        console.error(
          "Erro ao buscar produtos da categoria 'CAMISETAS':",
          err
        );
        setError(
          "Não foi possível carregar os produtos. Tente novamente mais tarde."
        );
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`);
  };

  // --- NOVA FUNÇÃO ADICIONADA ---
  /**
   * Navega para a página de carrinho, passando o ID do produto
   * como um query param 'add'.
   */
  const handleAdicionarAoCarrinho = (produtoId) => {
    navigate(`/carrinho?add=${produtoId}`);
  };
  // --- FIM DA NOVA FUNÇÃO ---

  // Lógica de Paginação (sem alteração)
  const totalPages = Math.max(1, Math.ceil(produtos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = produtos.slice(startIndex, startIndex + itemsPerPage);

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    const el = document.querySelector(".categoria-container");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ... (handlePrev, handleNext, centerStyle - sem alteração)

  if (authLoading) {
    return (
      <div className="categoria-camisa">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Carregando...</div>
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

        <div className="categoria-container">
          {isDataLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>Carregando produtos...</div>
          ) : error ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>{error}</div>
          ) : (
            <>
              <div className="produtos-grid">
                {visibleProducts.map((produto) => (
                  <div
                    className="produto-card"
                    key={produto.id}
                    // --- ONCLICK DO CARD SIMPLIFICADO ---
                    // Agora ele só se preocupa em ir para os detalhes
                    onClick={() => irParaDetalhes(produto.id)}
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
                      <p className="produto-preco">{produto.precoFormatado}</p>
                      
                      {/* --- BOTÃO MODIFICADO --- */}
                      <button 
                        className="btn-adicionar" // Classe atualizada
                        onClick={(e) => {
                          e.stopPropagation(); // Impede o clique de ir para o card
                          handleAdicionarAoCarrinho(produto.id); // Chama a função do carrinho
                        }}
                      >
                        Adicionar ao carrinho {/* Texto atualizado */}
                      </button>
                      {/* --- FIM DA MODIFICAÇÃO --- */}

                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação (sem alteração) */}
              {totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          className={`pagination-number ${
                            p === currentPage ? "active" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation(); // Previne o clique do card aqui também
                            gotoPage(p);
                          }}
                          aria-current={p === currentPage ? "page" : undefined}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriaCamisa;