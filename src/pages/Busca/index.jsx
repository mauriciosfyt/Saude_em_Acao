import React, { useState, useEffect, useCallback } from "react"; // 1. Importar useCallback
import { useSearchParams, useNavigate } from "react-router-dom";

// Serviços e Utilitários
import { getAllProdutos } from "../../services/produtoService";

// Componentes de Layout
import Header_Login from "../../components/header_loja";
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import { useAuth } from "../../contexts/AuthContext";

// CSS
import "./Busca.css"; 
import '../../pages/Tela Adm/GerenciarPersonal/GerenciarPersonal.css'; 

// --- 2. FUNÇÃO HELPER DE ESTOQUE ADICIONADA ---
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


const ResultadosBusca = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const filtroNome = searchParams.get("nome");

  // Estados da página
  const [produtos, setProdutos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados da Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- 3. fetchProdutos REFATORADO COM useCallback ---
  const fetchProdutos = useCallback(async () => {
    if (!filtroNome) {
      setIsDataLoading(false);
      setProdutos([]);
      return;
    }

    setIsDataLoading(true);
    setError(null);
    try {
      const data = await getAllProdutos(filtroNome);

      // --- 4. ALTERAÇÃO PRINCIPAL: FILTRO DE ESTOQUE ADICIONADO ---
      // Filtra produtos com estoque > 0 ANTES de formatar
      const produtosComEstoque = data.filter(p => calcularEstoqueTotal(p) > 0);
      // --- FIM DA ALTERAÇÃO ---

      // Formata APENAS os produtos que passaram no filtro
      const produtosFormatados = produtosComEstoque.map((prod) => ({
        ...prod,
        imagem: prod.img,
        precoFormatado: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(prod.preco),
      }));

      setProdutos(produtosFormatados);

    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
    } finally {
      setIsDataLoading(false);
    }
  }, [filtroNome]); // A função depende do filtroNome

  // useEffect agora apenas chama a função
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]); // O useEffect depende da função

  // --- Lógica de Paginação e Navegação (Sem alterações) ---
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
  const adicionarAoCarrinho = (produtoId) => {
    navigate(`/carrinho?add=${produtoId}`);
  };
  // --- Fim da Lógica (Sem alterações) ---


  // Renderização do Loading de Autenticação (Sem alterações)
  if (authLoading) {
    return (
      <div className="categoria-camisa">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div className="personal-loading">
            <div className="loading-spinner"></div>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  // --- 5. RENDERIZAÇÃO PRINCIPAL ATUALIZADA ---
  return (
    <div className="categoria-camisa">
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
      
      <div className="categoria-container">
        
        {/* Título (só mostra se tiver filtro e não estiver carregando) */}
        {filtroNome && !isDataLoading && (
           <h2 className="titulo-categoria" style={{ textTransform: 'none' }}>
            Resultados para {filtroNome}
          </h2>
        )}

        {/* === INÍCIO DA LÓGICA DE LOADING/ERROR (Padrão GerenciarPersonal) === */}

        {isDataLoading && (
          <div className="personal-loading" style={{ minHeight: '300px', display: 'flex' }}>
            <div className="loading-spinner"></div>
            Buscando produtos...
          </div>
        )}

        {error && (
           <div className="personal-error" style={{ margin: '20px 0' }}>
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
            {/* CHECK DE PRODUTOS VAZIOS (Usa visibleProducts, o que está correto) */}
            {visibleProducts.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <h3 className="titulo-categoria" style={{ textTransform: 'none' }}>
                  Nenhum resultado encontrado para "{filtroNome}"
                </h3>
                <p>Tente verificar a ortografia ou usar termos mais gerais.</p>
              </div>
            ) : (
              <>
                {/* O GRID DE PRODUTOS (Sem alterações) */}
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
                            adicionarAoCarrinho(produto.id); 
                          }}
                        >
                          Adicionar ao carrinho
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* A PAGINAÇÃO (Sem alterações) */}
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
        {/* === FIM DA LÓGICA DE LOADING/ERROR === */}

      </div>
      <Footer />
    </div>
  );
};

export default ResultadosBusca;