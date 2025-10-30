import React, { useState, useEffect } from "react"; // 1. Importar useEffect
import { useNavigate } from "react-router-dom";
import Header_Login from "../../components/header_loja";
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import banner from "../../assets/banners/banner_camisetas.svg";
import { useAuth } from "../../contexts/AuthContext";

// 2. Importar o serviço da API
import { getProdutosByCategoria } from "../../services/produtoService";

// 3. As imagens estáticas não são mais necessárias
// ...

// Seus estilos importados
import "../../pages/CategoriaVitaminas/Categorias.css";
import "./CategoriaCamisa.css";

const CategoriaCamisa = () => {
  const navigate = useNavigate();
  // 4. Renomear 'loading' para evitar conflitos
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 5. Estados para produtos da API, loading e erro
  const [produtos, setProdutos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // 6. Remover o array estático 'todosOsProdutos'
  // const todosOsProdutos = [ ... ]; // <-- REMOVIDO

  // 7. useEffect CORRIGIDO para buscar e FILTRAR dados da API
  useEffect(() => {
    const fetchProdutos = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        // 1. Chama a API (que sabemos que retorna todos os 15 produtos)
        const data = await getProdutosByCategoria("CAMISETAS");

        // 2. FILTRO NO FRONTEND (A SOLUÇÃO)
        // Filtra a lista 'data' para manter apenas produtos da categoria "CAMISETAS"
        const produtosFiltrados = data.filter(
          (p) => p.categoria === "CAMISETAS"
        );

        // Log de debug para ajudar
        console.log(`API retornou ${data.length} produtos.`);
        console.log(
          `Filtrados no frontend para ${produtosFiltrados.length} (categoria CAMISETAS).`
        );

        // 3. Mapeia e formata APENAS os produtos filtrados
        const produtosFormatados = produtosFiltrados.map((prod) => ({
          ...prod,

          // CORREÇÃO: O JSON da API usa 'img', não 'imagemUrl'
          imagem: prod.img,

          // Formata o preço (que vem como número, ex: 100)
          precoFormatado: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(prod.preco),
        }));

        // 4. Seta o estado com os produtos corretos
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
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // 8. Atualizar a função de navegação para usar o ID
  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`); // Navega para a rota de detalhes do produto
  };

  // 9. Paginação agora usa o estado 'produtos'
  const totalPages = Math.max(1, Math.ceil(produtos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = produtos.slice(startIndex, startIndex + itemsPerPage);

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    const el = document.querySelector(".categoria-container");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrev = () => gotoPage(currentPage - 1);
  const handleNext = () => gotoPage(currentPage + 1);

  // Helper de estilo para centralizar mensagens
  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh", // Altura menor pois o header/footer estão fora
    fontSize: "18px",
    color: "#333",
  };

  // 10. Lidar com o loading de autenticação
  if (authLoading) {
    return (
      <div className="categoria-camisa">
        <div style={{ ...centerStyle, height: "100vh" }}>Carregando...</div>
      </div>
    );
  }

  // 11. Renderização principal
  return (
    <div className="categoria-camisa">
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
      <div className="banner-gradient-categoria-camisa">
        <section className="banner">
          <img src={banner} alt="Banner Categoria Camisa" />
        </section>

        <div className="categoria-container">
          {/* 12. Lidar com loading de DADOS e ERROS */}
          {isDataLoading ? (
            <div style={centerStyle}>Carregando produtos...</div>
          ) : error ? (
            <div style={centerStyle}>{error}</div>
          ) : (
            <>
              {/* Grid de produtos */}
              <div className="produtos-grid">
                {visibleProducts.map((produto) => (
                  <div
                    className="produto-card"
                    key={produto.id}
                    onClick={(e) => {
                      if (e.target.closest(".btn-reservar")) return;
                      // 13. Passar o ID do produto para a navegação
                      irParaDetalhes(produto.id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      // 14. Usar a propriedade de imagem vinda da API
                      src={produto.imagem} // (Agora mapeado de 'produto.img')
                      alt={produto.nome}
                      className="produto-img"
                    />
                    <div className="produto-card-content">
                      <h3 className="produto-nome">{produto.nome}</h3>
                    </div>
                    <div className="produto-card-footer">
                      {/* 15. Usar o preço formatado */}
                      <p className="produto-preco">{produto.precoFormatado}</p>
                      <button className="btn-reservar">Reservar</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controles de paginação (só mostra se houver mais de 1 página) */}
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
                          onClick={() => gotoPage(p)}
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
