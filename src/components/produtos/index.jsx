import { useState, useEffect, useCallback } from 'react'; // 1. Importar useCallback
import { useNavigate } from 'react-router-dom';
import { getAllProdutos } from '../../services/produtoService';
import './produto.css';
import { fixImageUrl } from '../../utils/image';

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


const ProdutosSection = () => {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. fetchProdutos refatorado com useCallback ---
  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProdutos();
      
      const grouped = new Map();
      
      data.forEach(produto => {
        const categoria = produto.categoria;
        if (!grouped.has(categoria)) {
          grouped.set(categoria, []);
        }
        grouped.get(categoria).push(produto);
      });

      const limitedProducts = [];
      for (const categoryArray of grouped.values()) {
        
        // --- 4. ALTERAÇÃO PRINCIPAL: FILTRO DE ESTOQUE APLICADO ---
        // 1. Filtra o array da categoria para conter apenas produtos com estoque
        const produtosComEstoque = categoryArray.filter(p => calcularEstoqueTotal(p) > 0);

        // 2. Se houver produtos com estoque nessa categoria...
        if (produtosComEstoque.length > 0) {
          // 3. Pega o primeiro item *da lista já filtrada* (A LÓGICA DE 1 POR CATEGORIA)
          const firstOne = produtosComEstoque.slice(0, 1); 
          limitedProducts.push(...firstOne);
        }
        // Se 'produtosComEstoque' estiver vazio, nada desta categoria será adicionado.
        // --- FIM DA ALTERAÇÃO ---
      }

      setProdutos(limitedProducts); 

    } catch (err) {
      console.error("Erro ao buscar produtos em destaque:", err);
      setError(err.message || "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, []); // Array de dependência vazio

  // useEffect agora apenas chama a função
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]); 

  // --- Funções de Navegação (sem alterações) ---
  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`);
  };

  const adicionarAoCarrinho = (produtoId) => {
    navigate(`/carrinho?add=${produtoId}`);
  };
  // --- Fim das Funções de Navegação ---


  // --- 5. RENDERIZAÇÃO ATUALIZADA (Spinner e Erro) ---
  return (
    <section className="products-section">
      <h2 className="section-title">Destaques da Loja</h2>

      {/* === INÍCIO DA LÓGICA DE LOADING/ERROR (Padrão GerenciarPersonal) === */}
      
      {loading && (
        <div 
          className="personal-loading" 
          style={{ 
            minHeight: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <div className="loading-spinner"></div>
          Carregando produtos...
        </div>
      )}

      {error && (
        <div style={{ minHeight: '200px' }}>
          <div className="personal-error" style={{ padding: '20px', margin: '0 20px' }}>
            <strong>Erro:</strong> {error}
            <button 
              onClick={fetchProdutos}
              className="retry-button"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* 6. Adicionando mensagem de "nenhum produto" */}
          {produtos.length === 0 ? (
            <div style={{ 
              minHeight: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#555',
              padding: '20px'
            }}>
              Nenhum produto em destaque disponível no momento.
            </div>
          ) : (
            <div className="cards-container">
              {/* Mapeia o array (1 por categoria, COM estoque) */}
              {produtos.map((produto) => (
                <div className="product-card" key={produto.id}>
                  <img src={fixImageUrl(produto.img)} alt={produto.nome} />
                  <h3>{produto.nome}</h3>
                  <hr className="linha-produto" />
                  <div className="preco-produto">POR {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}</div>
                  <div className="pagamento-produto">{produto.formaDePagamento || 'Consulte as opções de pagamento'}</div>
                  <div className="botoes-produto">
                    <button 
                      className="buy-button" 
                      onClick={() => adicionarAoCarrinho(produto.id)}
                    >
                      Adicionar ao carrinho
                    </button>
                    <button className="detalhes-button" onClick={() => irParaDetalhes(produto.id)}>
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* === FIM DA LÓGICA DE LOADING/ERROR === */}

    </section>
  );
};

export default ProdutosSection;