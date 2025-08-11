import React, { useState } from 'react';
import './Carrinho.css';
import Footer from '../../components/footer';
import Header from '../../components/header_loja';
import produto1 from "../../assets/IMG PRODUTO.jpg";
import produto2 from "../../assets/IMG PRODUTO2.jpg";
import produto3 from "../../assets/IMG PRODUTO3.jpg";
import ProdutosSection from '../../components/produtos';

const Carrinho = () => {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'xxxxxxxxxxxxxxxxxxxx', preco: 50.99, quantidade: 1, imagem: produto1, selecionado: true },
    { id: 2, nome: 'xxxxxxxxxxxxxxxxxxxx', preco: 50.99, quantidade: 1, imagem: produto2, selecionado: true },




  ]);

  const handleToggleTodos = () => {
    const allSelecionados = produtos.every((p) => p.selecionado);

    const atualizados = produtos.map((p) => ({ ...p, selecionado: !allSelecionados }));
    setProdutos(atualizados);
  };

  const toggleProduto = (id) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selecionado: !p.selecionado } : p))
    );
  };

  const alterarQuantidade = (id, delta) => {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantidade: Math.max(1, p.quantidade + delta) }
          : p
      )
    );
  };

  const excluirProduto = (id) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const total = produtos
    .filter((p) => p.selecionado)
    .reduce((acc, p) => acc + p.preco * p.quantidade, 0)
    .toFixed(2);

  const selecionados = produtos.filter((p) => p.selecionado).length;

  return (
    <div className="carrinho-background">
    <Header/>

    <div className="container-carrinho">
      <div className="carrinho-esquerda">
        <div className="selecionar-todos">
          <input
            type="checkbox"
            checked={produtos.every((p) => p.selecionado)}
            onChange={handleToggleTodos}
          />
          <span>Todos os produtos</span>
        </div>

        {produtos.map((produto) => (
          <div key={produto.id} className="carrinho-produto-card">
            <input
              type="checkbox"
              checked={produto.selecionado}
              onChange={() => toggleProduto(produto.id)}
            />
            <img src={produto.imagem} alt="Produto" />
            <div className="detalhes-produto">
              <p>{produto.nome}</p>
              <a onClick={() => excluirProduto(produto.id)}>Excluir</a>
            </div>
            <div className="quantidade">
              <button onClick={() => alterarQuantidade(produto.id, -1)}>-</button>
              <span>{produto.quantidade}</span>
              <button onClick={() => alterarQuantidade(produto.id, 1)}>+</button>
            </div>
            <p className="preco">R$ {(produto.preco * produto.quantidade).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="carrinho-direita">
        <h3>Produtos ({selecionados})</h3>
        <div className="total">
          <span>Total</span>
          <span>R$ {total}</span>
        </div>
        <button className="btn-continuar">Continuar comprando</button>
      </div>
    </div>

    <ProdutosSection/>




      <Footer/>
    </div>
  );
};

export default Carrinho;