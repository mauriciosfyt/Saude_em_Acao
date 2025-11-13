import React, { useState, useEffect, useCallback } from "react"; // 1. Importar useCallback
import { useNavigate } from "react-router-dom";
import Header_Login from "../../components/header_loja";
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_camisetas.svg";
import { useAuth } from "../../contexts/AuthContext";

import { getProdutosByCategoria } from "../../services/produtoService";

import "../../pages/CategoriaVitaminas/Categorias.css"; // Estilo compartilhado (deve conter o CSS do spinner)
import "./CategoriaCamisa.css";

// --- 2. NOVA FUNÇÃO HELPER PARA CALCULAR ESTOQUE TOTAL ---
/**
 * Calcula o estoque total de um produto, independentemente do seu tipo.
 */
const calcularEstoqueTotal = (produto) => {
  // 1. Estoque Padrão (ex: Vitaminas)
  if (typeof produto.estoquePadrao === 'number') {
    return produto.estoquePadrao;
  }
  // 2. Estoque por Sabor (ex: Whey, Creatina)
  if (produto.estoquePorSabor && typeof produto.estoquePorSabor === 'object') {
    return Object.values(produto.estoquePorSabor).reduce((total, qtd) => total + (Number(qtd) || 0), 0);
  }
  // 3. Estoque por Tamanho (ex: Camisetas)
  if (produto.estoquePorTamanho && typeof produto.estoquePorTamanho === 'object') {
    return Object.values(produto.estoquePorTamanho).reduce((total, qtd) => total + (Number(qtd) || 0), 0);
  }
  // 4. Fallback
  return 0;
};
// --- FIM DA FUNÇÃO HELPER ---


const CategoriaCamisa = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [produtos, setProdutos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. fetchProdutos MOVIDO PARA FORA DO useEffect (com useCallback) ---
  const fetchProdutos = useCallback(async () => {
    setIsDataLoading(true);
    setError(null);
    try {
      const data = await getProdutosByCategoria("CAMISETAS");

      // --- 4. FILTRO DE ESTOQUE ADICIONADO ---
      const produtosFiltrados = data.filter((p) => {
          const categoriaCorreta = p.categoria === "CAMISETAS";
          const temEstoque = calcularEstoqueTotal(p) > 0; // Usando a helper
          return categoriaCorreta && temEstoque;
        });

      console.log(`API retornou ${data.length} produtos.`);
      console.log(
        `Filtrados no frontend para ${produtosFiltrados.length} (categoria CAMISETAS e com estoque > 0).` // Log atualizado
      );

      const produtosFormatados = produtosFiltrados.map((prod) => ({
        ...prod,
        imagem: prod.img,
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
  }, []); // Array de dependência vazio

  // useEffect agora apenas chama a função
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // --- Funções de Navegação e Paginação (Sem alterações) ---
  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`);
  };

  const handleAdicionarAoCarrinho = (produtoId) => {
    navigate(`/carrinho?add=${produtoId}`);
  };

  const totalPages = Math.max(1, Math.ceil(produtos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = produtos.slice(startIndex, startIndex + itemsPerPage);

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    const el = document.querySelector(".categoria-container");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // --- Fim das Funções (Sem alterações) ---

  // Helper de estilo para centralizar (usado no auth loading e no "nenhum produto")
  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "18px",
    color: "#333",
  };

  if (authLoading) {
    return (
      <div className="categoria-camisa">
        <div style={{ ...centerStyle, height: "100vh" }}>Carregando...</div>
      </div>
    );
  }

  // --- 5. RENDERIZAÇÃO PRINCIPAL ATUALIZADA (com loading/error) ---
  return (
    <div className="categoria-camisa">
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
      <div className="banner-gradient-categoria-camisa">
        <section className="banner">
          <img src={banner} alt="Banner Categoria Camisa" />
        </section>

        <div className="categoria-container">
          
          {/* === INÍCIO DA LÓGICA DE LOADING/ERROR (ESTILO GerenciarPersonal) === */}
          
          {isDataLoading && (
            <div className="personal-loading"> 
              <div className="loading-spinner"></div>
              Carregando produtos...
            </div>
          )}

          {error && (
            <div className="personal-error">
              <strong>Erro:</strong> {error}
              <button 
                onClick={fetchProdutos} // Chama a função refatorada
                className="retry-button"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {!isDataLoading && !error && (
            <>
              {/* === FIM DA LÓGICA DE LOADING/ERROR === */}

              {/* 6. Mensagem de "Nenhum produto" adicionada */}
              {produtos.length === 0 ? (
                 <div style={centerStyle}>Nenhum produto disponível nesta categoria no momento.</div>
              ) : (
                <>
                  {/* Grid de produtos (sem alterações) */}
                  <div className="produtos-grid">
                    {visibleProducts.map((produto) => (
                      <div
                        className="produto-card"
                        key={produto.id}
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
                          <button 
                            className="btn-adicionar"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdicionarAoCarrinho(produto.id);
                            }}
                          >
                            Adicionar ao carrinho
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginação (sem alterações) */}
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
                                e.stopPropagation();
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
            </>
          )} 
          {/* Fim do wrapper !isDataLoading && !error */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriaCamisa;