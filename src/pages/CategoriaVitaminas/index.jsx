import React, { useState, useEffect, useCallback } from "react"; // 1. Importar useCallback
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_vitaminas.svg";
import "./Categorias.css"; // Estilo compartilhado (já deve ter o CSS do spinner)
import Header_nLogin from "../../components/header_loja_nLogin";
import Header_Login from "../../components/header_loja";
import { useAuth } from "../../contexts/AuthContext";
import { getProdutosByCategoria } from "../../services/produtoService";

// --- Função Helper de Estoque (Sem alterações) ---
const calcularEstoqueTotal = (produto) => {
  if (typeof produto.estoquePadrao === 'number') {
    return produto.estoquePadrao;
  }
  if (produto.estoquePorSabor && typeof produto.estoquePorSabor === 'object') {
    return Object.values(produto.estoquePorSabor).reduce((total, qtd) => total + (Number(qtd) || 0), 0);
  }
  if (produto.estoquePorTamanho && typeof produto.estoquePorTamanho === 'object') {
    return Object.values(produto.estoquePorTamanho).reduce((total, qtd) => total + (Number(qtd) || 0), 0);
  }
  return 0;
};
// --- Fim da Função Helper ---


const CategoriaVitaminas = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [produtos, setProdutos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. fetchProdutos MOVIDO PARA FORA DO useEffect ---
  // Envolvido com useCallback para ser chamado pelo useEffect e pelo botão "Tentar Novamente"
  const fetchProdutos = useCallback(async () => {
    setIsDataLoading(true); // Mostra o spinner
    setError(null);
    try {
      const data = await getProdutosByCategoria("VITAMINAS");

      const produtosFiltrados = data.filter((p) => {
        const categoriaCorreta = p.categoria === "VITAMINAS";
        const temEstoque = calcularEstoqueTotal(p) > 0;
        return categoriaCorreta && temEstoque;
      });

      console.log(`API retornou ${data.length} produtos.`);
      console.log(
        `Filtrados no frontend para ${produtosFiltrados.length} (categoria VITAMINAS e com estoque > 0).`
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
      console.error("Erro ao buscar produtos da categoria 'VITAMINAS':", err);
      setError(
        "Não foi possível carregar os produtos. Tente novamente mais tarde."
      );
    } finally {
      setIsDataLoading(false); // Esconde o spinner
    }
  }, []); // O array vazio [] significa que esta função nunca mudará

  // useEffect agora apenas chama a função
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]); // Depende da função fetchProdutos definida acima

  // --- Funções de Paginação e Navegação (Sem alterações) ---
  const totalPages = Math.max(1, Math.ceil(produtos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = produtos.slice(startIndex, startIndex + itemsPerPage);

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    const el = document.querySelector(".categoria-container");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  
  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`);
  };

  const handleAdicionarAoCarrinho = (produtoId) => {
    navigate(`/carrinho?add=${produtoId}`);
  };
  // --- Fim das Funções de Paginação ---

  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "18px",
    color: "#333",
  };

  // Loading de autenticação (sem alterações)
  if (authLoading) {
    return (
      <div className="categoria-camisa">
        <div style={{ ...centerStyle, height: "100vh" }}>Carregando...</div>
      </div>
    );
  }

  // --- 3. RENDERIZAÇÃO PRINCIPAL ATUALIZADA ---
  return (
    <div className="categoria-camisa">
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
      <div className="banner-gradient-categoria-camisa">
        <section className="banner">
          <img src={banner} alt="Banner Categoria Vitaminas" />
        </section>

        <div className="categoria-container">
          
          {/* === INÍCIO DA LÓGICA DE LOADING/ERROR (ESTILO GerenciarPersonal) === */}
          
          {isDataLoading && (
            // Usando as mesmas classes do GerenciarPersonal
            <div className="categoria-vitamina-loading"> 
              <div className="loading-spinner"></div>
              Carregando produtos...
            </div>
          )}

          {error && (
            // Usando as mesmas classes do GerenciarPersonal
            <div className="categoria-vitamina-error">
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

              {/* Mensagem de "Nenhum produto" (agora dentro do wrapper !loading && !error) */}
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
                          <p className="produto-preco">
                            {produto.precoFormatado}
                          </p>
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

export default CategoriaVitaminas;