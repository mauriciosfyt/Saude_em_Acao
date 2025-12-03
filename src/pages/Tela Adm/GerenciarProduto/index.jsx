import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './GerenciarProduto.css';

import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { getAllProdutos, deleteProduto } from '../../../services/produtoService';

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Excluido.css'; // Estilo para sucesso (criação)
// -------------------------------

// --- NOVO: IMPORTAÇÃO DO COMPONENTE MODAL E LOGO ---
import ModalConfirmacao from '../../../components/ModalConfirmacao/ModalConfirmacao';
import logoEmpresa from '../../../assets/logo.png'; // <--- Verifique se o caminho da imagem está correto
// ---------------------------------------------------

// ÍCONE DE BUSCA (igual ao do Personal)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const GerenciarProduto = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NOVO: ESTADOS PARA CONTROLE DO MODAL ---
  const [modalAberto, setModalAberto] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  // --------------------------------------------

  const fetchProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProdutos();
      const mapped = data.map((p) => ({
        id: p.id,
        nome: p.nome,
        categoria: p.categoria || 'Sem Categoria',
        preco: p.preco ?? p.precoPromocional ?? 0,
        estoque: p.estoqueTotal ?? (p.estoquePorTamanho ? Object.values(p.estoquePorTamanho).reduce((a, b) => a + b, 0) : 0),
        imagem: p.img || p.imagem || 'https://via.placeholder.com/150',
      }));
      setProdutos(mapped);
      setProdutosFiltrados(mapped);
    } catch (err) {
      console.error('Erro ao carregar produtos da API:', err);
      setError('Não foi possível carregar produtos.');
      toast.error('Não foi possível carregar produtos.'); // Feedback visual extra
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();

    // --- VERIFICAÇÃO DE FEEDBACK DE OUTRAS TELAS ---
    const showAdicionado = localStorage.getItem('showProdutoAdicionado');
    if (showAdicionado) {
      toast.success("Produto criado com sucesso!", {
        className: "custom-success-toast",
        progressClassName: "Toastify__progress-bar--success",
        icon: true 
      });
      localStorage.removeItem('showProdutoAdicionado');
    }
    
    const showEditado = localStorage.getItem('showProdutoEditado');
    if (showEditado) {
       localStorage.removeItem('showProdutoEditado');
    }
    // -----------------------------------------------

  }, []);

  useEffect(() => {
    let resultado = produtos;
    if (termoBusca) {
      resultado = resultado.filter(produto =>
        produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }
    if (categoria) {
      resultado = resultado.filter(
        produto => produto.categoria === categoria
      );
    }
    setProdutosFiltrados(resultado);
  }, [termoBusca, categoria, produtos]);

  const handleEditClick = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
      localStorage.setItem('produtoParaEditar', JSON.stringify(produto));
      navigate('/EditarProduto');
    }
  };

  // --- LÓGICA REFORMULADA PARA USAR O MODAL ---
  
  // 1. Apenas abre o modal (substitui o window.confirm)
  const handleDeleteClick = (produtoId) => {
    setIdParaExcluir(produtoId);
    setModalAberto(true);
  };

  // 2. Fecha o modal sem fazer nada
  const cancelarExclusao = () => {
    setModalAberto(false);
    setIdParaExcluir(null);
  };

  // 3. Executa a exclusão (Sua lógica original movida para cá)
  const confirmarExclusao = async () => {
    if (!idParaExcluir) return;

    setModalAberto(false); // Fecha o modal visualmente
    setLoading(true);      // Usa seu loading original
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || null;
      await deleteProduto(idParaExcluir, token);
      
      const atualizados = produtos.filter((p) => p.id !== idParaExcluir);
      setProdutos(atualizados);
      
      // --- IMPLEMENTAÇÃO DO TOAST DE EXCLUSÃO (Sua lógica original mantida) ---
      toast.success('Excluído com sucesso!', {
        className: "custom-delete-toast",
        progressClassName: "custom-delete-progress-bar"
      });
      // ------------------------------------------------------------------------

    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      toast.error('Erro ao excluir produto.');
      
    } finally {
      setLoading(false);
      setIdParaExcluir(null);
    }
  };
  // ---------------------------------------------

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="produto-content-wrapper">
        
        {showToast && (
          <div className="toast-notification">{toastMessage}</div>
        )}

        <div className="produto-header">
          <h1 className="produto-title">Produtos</h1>
          <div className="produto-filters">
            <div className="produto-search-container">
              <SearchIcon />
              <input
                className="produto-search-input"
                type="text"
                placeholder="Pesquisar nome do produto"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <select
              className="produto-category-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Categoria</option>
              <option value="WHEY_PROTEIN">Whey Protein</option>
              <option value="CAMISETAS">Camiseta</option>
              <option value="VITAMINAS">Vitaminas</option>
              <option value="CREATINA">Creatina</option>
            </select>
          </div>
          <Link to="/AdicionarProduto" className="produto-add-button-link">
            <button className="produto-add-button">Novo produto</button>
          </Link>
        </div>

        {loading && (
          <div className="personal-loading">
            <div className="loading-spinner"></div>
            Carregando produtos...
          </div>
        )}
        
        {error && (
          <div className="personal-error" style={{ padding: '20px', textAlign: 'center' }}>
            <strong>Erro:</strong> {error}
            <button 
              onClick={fetchProdutos}
              className="retry-button"
              style={{ display: 'block', margin: '10px auto' }}
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <table className="produto-table">
            <thead className="produto-thead">
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody className="produto-tbody">
                {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className={produto.estoque === 0 ? 'produto-sem-estoque' : ''}>
                    <td>
                      <div className="produto-info">
                        <img src={produto.imagem} alt={produto.nome} className="produto-imagem" />
                        <span>{produto.nome}</span>
                      </div>
                    </td>
                    <td>
                      <span className="produto-categoria-text">{produto.categoria}</span>
                    </td>
                    <td>{`R$ ${produto.preco.toFixed(2).replace('.', ',')}`}</td>
                    <td>{produto.estoque === 0 ? (<span className="produto-sem-estoque-label">Sem estoque</span>) : produto.estoque}</td>
                    <td>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(produto.id); }} className="produto-action-link-edit">Editar</a>
                      {/* Note que o handleDeleteClick aqui agora abre o modal em vez do confirm */}
                      <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(produto.id); }} className="produto-action-link-delete">Excluir</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum produto encontrado.</td></tr>
              )}
            </tbody>
          </table>
        )}

        <ToastContainer position="top-right" autoClose={3000} />

        {/* --- INSERÇÃO DO COMPONENTE REUTILIZÁVEL --- */}
        <ModalConfirmacao
          isOpen={modalAberto}
          onClose={cancelarExclusao}
          onConfirm={confirmarExclusao}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
          logoSrc={logoEmpresa}
          confirmLabel="Sim, Excluir"
          cancelLabel="Cancelar"
        />
        {/* ------------------------------------------- */}

      </main>
    </div>
  );
};

export default GerenciarProduto;