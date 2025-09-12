import React, { useState } from 'react';
import BarraDeBusca from '../../components/BarraPesquisa/BarraDeBusca';
import './Reservas.css'; // Importa TODOS os estilos necessários para a página

import Footer from '../../components/footer';
import Header from '../../components/header_loja';

const mockPedidos = [
  { id: 1, data: '11/10/2025', nome: 'Whey Protein Concentrado', status: 'Em Análise' },
  { id: 2, data: '11/10/2025', nome: 'Vitamina D3 2000 UI', status: 'Retirado' },
  { id: 3, data: '11/10/2025', nome: 'Creatina Monohidratada', status: 'Cancelado' },
  { id: 4, data: '11/09/2025', nome: 'Combo Whey + Creatina', status: 'Retirado' },
];

import imagemUrl from '../../assets/IMG PRODUTO.jpg';

const agruparPedidosPorData = (pedidos) => {
  return pedidos.reduce((acc, pedido) => {
    const data = pedido.data;
    if (!acc[data]) acc[data] = [];
    acc[data].push(pedido);
    return acc;
  }, {});
};

const getStatusClassName = (status) => {
  switch (status) {
    case 'Em Análise': return 'status-em-analise';
    case 'Retirado': return 'status-retirado';
    case 'Cancelado': return 'status-cancelado';
    default: return '';
  }
};

const Reservas = () => {
  const [termoBusca, setTermoBusca] = useState('');

  const pedidosFiltrados = mockPedidos.filter(p =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const pedidosAgrupados = agruparPedidosPorData(pedidosFiltrados);
  const datasOrdenadas = Object.keys(pedidosAgrupados).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));

  return (
    <>
      <Header/>

      <div className="pagina-reservas">
        <main className="main-content">
          <div className="container-barra-busca">
            <BarraDeBusca
              valorBusca={termoBusca}
              aoAlterarValor={setTermoBusca}
              aoClicarFiltro={() => alert('Filtro clicado!')}
            />
          </div>

          <div className="container-pedidos">
            {datasOrdenadas.map(data => (
              <section key={data} className="grupo-data">
                <header className="grupo-header">
                  <span className="data-label">{data}</span>
                  <button className="botao-adicionar-todos">Adicionar todos ao carrinho</button>
                </header>
                
                <div className="lista-de-itens">
                  {pedidosAgrupados[data].map(pedido => (
                    <div key={pedido.id} className="pedido-card">
                      <img src={imagemUrl} alt={pedido.nome} className="pedido-imagem" />
                      <div className="pedido-info">
                        <span className={`pedido-status ${getStatusClassName(pedido.status)}`}>
                          {pedido.status}
                        </span>
                        <p className="pedido-nome">{pedido.nome}</p>
                      </div>
                      <div className="pedido-acoes">
                        <button className="botao-ver-produto">Ver produto</button>
                        <button className="botao-comprar-novamente">Compra novamente</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="container-promocional">
            <div className="promo-card">
              <div className="promo-texto-container">
                <h3 className="promo-titulo">Nossa Loja</h3>
                <p className="promo-descricao">xxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxx</p>
              </div>
              <img src="https://i.imgur.com/6Jt5iA8.png" alt="Nossa Loja" className="promo-imagem" />
            </div>
            <div className="promo-card">
              <div className="promo-texto-container">
                <h3 className="promo-titulo">Creatinas</h3>
                <p className="promo-descricao">xxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxx</p>
              </div>
              <img src="https://i.imgur.com/2s3VZQ5.png" alt="Creatinas" className="promo-imagem" />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Reservas;