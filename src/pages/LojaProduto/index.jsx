import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Header_nLogin from "../../components/header_loja_nLogin";
import Header_Login from "../../components/header_loja";
import Footer from "../../components/footer";
import ProdutosSection from "../../components/produtos";
import { getProdutoById } from "../../services/produtoService";
import { useAuth } from "../../contexts/AuthContext";
import "./LojaProduto.css";
import { fixImageUrl } from "../../utils/image"; 
// Importação atualizada para incluir o ToastContainer
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/Mensagem/Excluido.css';

const LojaProduto = () => {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate(); 
  
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await getProdutoById(id);
        setProduto(data); 
        if (data && data.categoria === 'CAMISETAS' && data.estoquePorTamanho) {
          const sizes = Object.entries(data.estoquePorTamanho)
            .filter(([, qty]) => qty > 0)
            .map(([size]) => size);
          setAvailableSizes(sizes);
          if (sizes.length === 1) setSelectedSize(sizes[0]);
        } else {
          setAvailableSizes([]);
          setSelectedSize("");
        }
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchProduto();
  }, [id]); 

  // --- FUNÇÃO DE RESERVA CORRIGIDA ---
  const handleReservarClick = () => {
    if (!produto) return;

    // Verifica se o usuário está autenticado
    if (isAuthenticated) {
      // 1. Usuário está logado: vá para o carrinho
      navigate(`/Carrinho?add=${produto.id}`);
    } else {
      // 2. Usuário NÃO está logado:
      // Dispara o toast com as classes do seu CSS (vermelho)
      toast.error('É necessário fazer login para reservar o produto.', {
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
        position: "top-right",
        autoClose: 4000, // Tempo ajustado para leitura
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Pequeno delay para garantir que o usuário leia a mensagem antes de sair da página
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };
  // -----------------------------------

  // Mostra loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <div className="personal-loading">
            <div className="loading-spinner"></div>
            Carregando...
        </div>
      </div>
    );
  }

  // Renderiza uma mensagem de "Carregando..." enquanto espera a API
  if (loading) {
    return (
      <>
        {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
        
        <div 
          className="personal-loading" 
          style={{ 
            padding: '150px', 
          }}
        >
          <div className="loading-spinner"></div>
          Carregando produto...
        </div>

        <Footer />
      </>
    );
  }

  // Renderiza uma mensagem de erro se a busca falhar
  if (error) {
    return (
      <>
        {isAuthenticated ? <Header_Login /> : <Header_nLogin />}
        <div 
          className="personal-error" 
          style={{ 
            padding: '150px', 
            textAlign: 'center' 
          }}
        >
          <strong>Erro:</strong> {error}
        </div>
        <Footer />
      </>
    );
  }
  
  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  // Renderiza o componente com os dados dinâmicos do produto
  return (
    <>
      {/* Componente essencial para exibir os Toasts */}
      <ToastContainer /> 
      
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}

      <section className="product-hero">
        <div className="left-section">
          <img src={fixImageUrl(produto.img)} alt={produto.nome} className="main-product" />
          <div className="thumbs">
            {/* Espaço para futuras imagens em miniatura */}
          </div>
        </div>

        <div className="right-section">
          <h2 className="product-title">
            {produto.nome}
          </h2>

          <p className="price">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
          </p>

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
            onClick={handleReservarClick} // onClick chama a nova função
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
          <p>
            {produto.descricao}
          </p>
        </div>
      </section>

      <ProdutosSection/>

      <Footer />
    </>
  );
};

export default LojaProduto;