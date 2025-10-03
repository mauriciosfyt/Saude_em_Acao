import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProdutos } from '../../services/produtoService'; // ⬅️ Importa nossa função
import './produto.css';

const ProdutosSection = () => {
  const navigate = useNavigate();

  // Estados para armazenar os produtos, o status de carregamento e erros
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados da API quando o componente for montado
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await getAllProdutos();
        setProdutos(data); // Armazena os produtos no estado
      } catch (err) {
        setError(err.message); // Armazena a mensagem de erro
      } finally {
        setLoading(false); // Finaliza o carregamento, com sucesso ou erro
      }
    };

    fetchProdutos();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Função de navegação agora recebe o ID do produto
  const irParaDetalhes = (produtoId) => {
    navigate(`/LojaProduto/${produtoId}`); // ⬅️ Navega para uma rota dinâmica
  };

  // Renderização condicional com base no estado
  if (loading) {
    return <section className="products-section"><h2 className="section-title">Carregando produtos...</h2></section>;
  }

  if (error) {
    return <section className="products-section"><h2 className="section-title" style={{color: 'red'}}>Erro: {error}</h2></section>;
  }

  return (
    <section className="products-section">
      <h2 className="section-title">Destaques da Loja</h2>
      <div className="cards-container">
        {/* Mapeia o array de produtos vindo da API */}
        {produtos.map((produto) => (
          <div className="product-card" key={produto.id}> {/* ⬅️ Usa o ID do produto como key */}
            {/* ATENÇÃO: Verifique se os nomes dos campos (ex: 'imagemUrl', 'nome', 'preco') correspondem aos da sua API */}
           <img src={produto.img} alt={produto.nome} />
            <h3>{produto.nome}</h3>
            <hr className="linha-produto" />
            {/* Formata o preço para o padrão brasileiro */}
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