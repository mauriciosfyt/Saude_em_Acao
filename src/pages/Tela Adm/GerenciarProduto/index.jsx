
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './GerenciarProduto.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";
import { getAllProdutos, deleteProduto } from '../../../services/produtoService';

// Dados de Exemplo (Mock). Em uma aplicação real, isso viria de uma API.
const mockProdutos = [
  {
    id: 1,
    nome: 'Shake Protein Growth',
    categoria: 'WheyProtein',
    status: 'Ativo',
    preco: 10.00,
    estoque: 175,
    imagem: 'https://i.imgur.com/gO0ySNa.png',
  },
  {
    id: 2,
    nome: 'Camiseta Preta Growth',
    categoria: 'Camiseta',
    status: 'Ativo',
    preco: 50.00,
    estoque: 80,
    imagem: 'https://i.imgur.com/SzGacad.png',
  },
  {
    id: 3,
    nome: 'Whey Protein Growth',
    categoria: 'Inativo',
    status: 'Inativo',
    preco: 124.00,
    estoque: 110,
    imagem: 'https://i.imgur.com/Ahd2Jj8.png',
  },
];

const GerenciarProduto = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState(() => {
    const salvos = localStorage.getItem('produtos');
    return salvos ? JSON.parse(salvos) : mockProdutos;
  });
  const [termoBusca, setTermoBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Persistir lista ao alterar
  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  // Detectar quando um produto foi adicionado ou editado
  useEffect(() => {
    if (localStorage.getItem('showProdutoAdicionado') === 'true') {
      setShowToast(true);
      setToastMessage('Produto adicionado com sucesso!');
      localStorage.removeItem('showProdutoAdicionado');
      setTimeout(() => setShowToast(false), 2000);
    }
    
    if (localStorage.getItem('showProdutoEditado') === 'true') {
      setShowToast(true);
      setToastMessage('Produto editado com sucesso!');
      localStorage.removeItem('showProdutoEditado');
      setTimeout(() => setShowToast(false), 2000);
    }
  }, []);

  // Buscar produtos na API ao montar o componente
  useEffect(() => {
    let mounted = true;
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const data = await getAllProdutos();

        // Mapear o formato da API para o formato usado no componente
        const mapped = data.map((p) => ({
          id: p.id,
          nome: p.nome,
          categoria: p.categoria || p.categoria,
          status: p.status || 'Ativo',
          preco: p.preco ?? p.precoPromocional ?? 0,
          estoque: p.estoqueTotal ?? (p.estoquePorTamanho ? Object.values(p.estoquePorTamanho).reduce((a, b) => a + b, 0) : 0),
          imagem: p.img || p.imagem || '',
        }));

        if (mounted) {
          setProdutos(mapped);
          setProdutosFiltrados(mapped);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos da API:', err);
        setError('Não foi possível carregar produtos da API. Usando dados locais.');
        setShowToast(true);
        setToastMessage('Erro ao carregar produtos. Usando dados locais.');
        // fallback: mantém os dados locais já carregados (localStorage/mock)
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
    return () => { mounted = false; };
  }, []);

  const handleEditClick = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
      localStorage.setItem('produtoParaEditar', JSON.stringify(produto));
      navigate('/EditarProduto');
    }
  };

  const handleAdicionarProduto = () => {
    // Marcar que a pessoa veio da tela de gerenciar produtos
    localStorage.setItem('veioDoGerenciarProduto', 'true');
    navigate('/CadastrarProduto');
  };

  const handleDeleteClick = async (produtoId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    setLoading(true);
    setError(null);

    try {
      // Tentar obter token (se existir) para autenticação Admin
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || null;

      await deleteProduto(produtoId, token);

      const atualizados = produtos.filter((p) => p.id !== produtoId);
      setProdutos(atualizados);

      // Mostrar notificação de exclusão
      setShowToast(true);
      setToastMessage('Produto excluído com sucesso!');
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      setError('Erro ao excluir produto. Veja o console para detalhes.');
      setShowToast(true);
      setToastMessage('Erro ao excluir produto.');
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
    <div className="container-gerenciar-produto">
      <h1 className="titulo-principal">Gerenciar Produtos</h1>
      
      {showToast && (
        <div className="modal-termos-notification">
          {toastMessage}
        </div>
      )}

      <div className="barra-filtros">
        <div className="filtros-esquerda">
          <input
            type="text"
            className="input-busca-produto"
            placeholder="Camiseta/Preta"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <select
            className="select-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Categoria</option>
            <option value="WheyProtein">WheyProtein</option>
            <option value="CAMISETAS">Camiseta</option>
            <option value="Inativo">Inativo</option>
          </select>
          <button className="btn-pesquisar">Pesquisar</button>
        </div>
        <button className="btn-adicionar" onClick={handleAdicionarProduto}>
          <FaPlus size={14} /> ADICIONAR PRODUTO
        </button>
      </div>

      {/* Wrapper que cria a barra de rolagem horizontal quando necessário */}
      <div className="tabela-wrapper">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria/Status</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id}>
                <td>
                  <div className="info-produto">
                    <img src={produto.imagem} alt={produto.nome} className="imagem-produto" />
                    <span>{produto.nome}</span>
                  </div>
                </td>
                <td>
                  <span className={produto.status === 'Inativo' ? 'status-inativo' : 'status-ativo'}>
                    {produto.categoria}
                  </span>
                </td>
                <td>{`R$ ${produto.preco.toFixed(2).replace('.', ',')}`}</td>
                <td>{produto.estoque}</td>
                <td>
                  <button className="btn-editar" onClick={() => handleEditClick(produto.id)}>
                    Editar
                  </button>
                  <button className="btn-excluir" style={{ marginLeft: 8 }} onClick={() => handleDeleteClick(produto.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default GerenciarProduto;
