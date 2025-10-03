import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook para pegar o ID da URL
import Header_nLogin from "../../components/header_loja_nLogin";
import Footer from "../../components/footer";
import ProdutosSection from "../../components/produtos";
import { getProdutoById } from "../../services/produtoService"; // Importa a função do seu serviço
import "./LojaProduto.css";

const LojaProduto = () => {
  // Pega o parâmetro 'id' da URL (ex: /LojaProduto/12345)
  const { id } = useParams();

  // Cria estados para guardar os dados do produto, o status de carregamento e erros
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);

  // useEffect busca os dados da API quando o componente é montado
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        // Chama a função do seu serviço passando o ID da URL
        const data = await getProdutoById(id);
        setProduto(data); // Armazena os dados no estado
        // Se for camiseta, monta a lista de tamanhos disponíveis (estoque > 0)
        if (data && data.categoria === 'CAMISETAS' && data.estoquePorTamanho) {
          const sizes = Object.entries(data.estoquePorTamanho)
            .filter(([, qty]) => qty > 0)
            .map(([size]) => size);
          setAvailableSizes(sizes);
          // pré-seleciona quando houver apenas um tamanho disponível
          if (sizes.length === 1) setSelectedSize(sizes[0]);
        } else {
          setAvailableSizes([]);
          setSelectedSize("");
        }
      } catch (err) {
        setError(err.message); // Armazena uma mensagem de erro se a busca falhar
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    fetchProduto();
  }, [id]); // O [id] faz com que a busca seja refeita se o ID na URL mudar

  // Renderiza uma mensagem de "Carregando..." enquanto espera a API
  if (loading) {
    return (
      <>
        <Header_nLogin />
        <div style={{ textAlign: 'center', padding: '150px' }}>Carregando produto...</div>
        <Footer />
      </>
    );
  }

  // Renderiza uma mensagem de erro se a busca falhar
  if (error) {
    return (
      <>
        <Header_nLogin />
        <div style={{ textAlign: 'center', padding: '150px', color: 'red' }}>Erro: {error}</div>
        <Footer />
      </>
    );
  }
  
  // Se o produto não for encontrado na API
  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  // Renderiza o componente com os dados dinâmicos do produto
  return (
    <>
      <Header_nLogin />

      <section className="product-hero">
        <div className="left-section">
          {/* Usa a imagem vinda da API */}
          <img src={produto.img} alt={produto.nome} className="main-product" />
          <div className="thumbs">
            {/* Espaço para futuras imagens em miniatura */}
          </div>
        </div>

        <div className="right-section">
          {/* Usa o nome vindo da API */}
          <h2 className="product-title">
            {produto.nome}
          </h2>

          {/* Usa e formata o preço vindo da API */}
          <p className="price">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
          </p>

          {/* Se for camiseta, mostra seletor de tamanhos */}
          {produto.categoria === 'CAMISETAS' && produto.estoquePorTamanho && (
            <div className="size-selector" style={{ marginBottom: 12 }}>
              <label htmlFor="tamanho" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Tamanho: </label>
              <select
                id="tamanho"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 6 }}
              >
                <option value="">Selecione o tamanho</option>
                {availableSizes.map((t) => (
                  <option key={t} value={t}>{`Tamanho ${t} `}</option>
                ))}
              </select>
         
            </div>
          )}

          <button
            className="reserve-button"
            disabled={produto.categoria === 'CAMISETAS' && availableSizes.length > 0 && !selectedSize}
            title={produto.categoria === 'CAMISETAS' && availableSizes.length > 0 && !selectedSize ? 'Escolha um tamanho' : ''}
          >
            RESERVAR <span className="cart-icon">🛒</span>
          </button>
        </div>
      </section>

      <section className="description-section">
        <div className="description-container">
            <h2>{produto.nome}</h2>
          {/* Usa a descrição vinda da API */}
          <p>
            {produto.descricao}
          </p>
        </div>
      </section>

      <ProdutosSection/>

      {/* A segunda seção de descrição foi removida para evitar duplicidade */}

      <Footer />
    </>
  );
};

export default LojaProduto;