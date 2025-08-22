
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './GerenciarProduto.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

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
  const [produtos] = useState(mockProdutos);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos);

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
    alert(`Funcionalidade para editar o produto ID: ${produtoId} a ser implementada.`);
  };

  const handleAdicionarProduto = () => {
    navigate('/CadastrarProduto');
  };

  return (
    <>
      <AdminHeader />
    <div className="container-gerenciar-produto">
      <h1 className="titulo-principal">Gerenciar Produtos</h1>

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
            <option value="Camiseta">Camiseta</option>
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
