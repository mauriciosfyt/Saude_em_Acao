import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Serviços e Utilitários
import { getAllProdutos } from "../../services/produtoService";
// --- MUDANÇA 1: Remover a importação do fixImageUrl ---
// import { fixImageUrl } from "../../utils/image"; 

// Componentes de Layout
import Header_Login from "../../components/header_loja";
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import { useAuth } from "../../contexts/AuthContext";

// CSS
import "./Busca.css"; 
import '../../pages/Tela Adm/GerenciarPersonal/GerenciarPersonal.css'; 

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

  useEffect(() => {
    if (!filtroNome) {
      setIsDataLoading(false);
      setProdutos([]);
      return;
    }

    const fetchProdutos = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        const data = await getAllProdutos(filtroNome);

        // --- MUDANÇA 2: Formatar os dados IGUAL ao CategoriaCamisa ---
        const produtosFormatados = data.map((prod) => ({
          ...prod,
          imagem: prod.img, // <-- APENAS COPIAMOS O 'prod.img'
          precoFormatado: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(prod.preco),
        }));
        // --- FIM DA MUDANÇA ---

        setProdutos(produtosFormatados);

      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProdutos();
  }, [filtroNome]); 

  // Lógica de Paginação
  const totalPages = Math.max(1, Math.ceil(produtos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = produtos.slice(startIndex, startIndex + itemsPerPage);

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    const el = document.querySelector(".categoria-container");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Funções de Navegação dos Cards
  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`);
  };
  const adicionarAoCarrinho = (produtoId) => {
    navigate(`/carrinho?add=${produtoId}`);
  };

  // Renderização do Loading de Autenticação
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

  // Renderização Principal
  return (
    <div className="categoria-camisa">
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
      

      <div className="categoria-container">
        
        {filtroNome && !isDataLoading && (
           <h2 className="titulo-categoria" style={{ textTransform: 'none' }}>
            Resultados para {filtroNome}
          </h2>
        )}

        {/* --- Renderização do Conteúdo (Loading, Erro, Grid) --- */}
        {isDataLoading ? (
          <div className="personal-loading" style={{ minHeight: '300px', display: 'flex' }}>
            <div className="loading-spinner"></div>
            Buscando produtos...
          </div>
        ) : error ? (
           <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>{error}</div>
        ) : (
          <>
            {/* CHECK DE PRODUTOS VAZIOS */}
            {visibleProducts.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <h3 className="titulo-categoria" style={{ textTransform: 'none' }}>
                  Nenhum resultado encontrado para {filtroNome}
                </h3>
                <p>Tente verificar a ortografia ou usar termos mais gerais.</p>
              </div>
            ) : (
              <>
                {/* O GRID DE PRODUTOS */}
                <div className="produtos-grid">
                  {visibleProducts.map((produto) => (
                    // O CARD DE PRODUTO
                    <div
                      className="produto-card"
                      key={produto.id}
                      onClick={() => irParaDetalhes(produto.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={produto.imagem} // <-- Agora usa o 'produto.imagem' formatado
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

                {/* A PAGINAÇÃO */}
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
      </div>
      <Footer />
    </div>
  );
};

export default ResultadosBusca;