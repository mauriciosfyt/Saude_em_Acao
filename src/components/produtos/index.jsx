import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProdutos } from '../../services/produtoService';
import './produto.css';
import { fixImageUrl } from '../../utils/image';

const ProdutosSection = () => {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await getAllProdutos();

        // --- LÓGICA CORRIGIDA: Pegar APENAS 1 de cada categoria ---
        
        const grouped = new Map();
        
        // 1. Agrupa todos os produtos pela 'categoria'
        data.forEach(produto => {
          const categoria = produto.categoria;
          if (!grouped.has(categoria)) {
            grouped.set(categoria, []);
          }
          grouped.get(categoria).push(produto);
        });

        // 2. Cria a lista final, pegando o PRIMEIRO (1) de cada grupo
        const limitedProducts = [];
        for (const categoryArray of grouped.values()) {
          
          // --- ESTA É A MUDANÇA ---
          // Pega apenas o primeiro item (0, 1) do array daquela categoria
          const firstOne = categoryArray.slice(0, 1); 
          // ------------------------

          // Adiciona esse item único à lista final
          limitedProducts.push(...firstOne);
        }
        // --- FIM DA LÓGICA ---

        // 3. Armazena a lista JÁ FILTRADA (1 por categoria) no estado
        // Se você quiser EXATAMENTE 4 produtos, descomente a linha abaixo:
        // setProdutos(limitedProducts.slice(0, 4));
        
        // Se você quiser 1 de CADA (o que parece ser o ideal):
        setProdutos(limitedProducts); 

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []); 

  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`);
  };

  if (loading) {
    return (
      <section className="products-section">
        <h2 className="section-title">Destaques da Loja</h2>
        <div className="cards-container">
          <p style={{ textAlign: 'center' }}>Carregando produtos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return <section className="products-section"><h2 className="section-title" style={{color: 'red'}}>Erro: {error}</h2></section>;
  }

  return (
    <section className="products-section">
      <h2 className="section-title">Destaques da Loja</h2>
      <div className="cards-container">
        {/* Mapeia o array de produtos (agora 1 por categoria) */}
        {produtos.map((produto) => (
          <div className="product-card" key={produto.id}>
           <img src={fixImageUrl(produto.img)} alt={produto.nome} />
            <h3>{produto.nome}</h3>
            <hr className="linha-produto" />
            <div className="preco-produto">POR {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}</div>
            <div className="pagamento-produto">{produto.formaDePagamento || 'Consulte as opções de pagamento'}</div>
            <div className="botoes-produto">
              <button className="buy-button">Adicionar ao carrinho</button>
              <button className="detalhes-button" onClick={() => irParaDetalhes(produto.id)}>
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProdutosSection;