import React, { useState, useRef, useEffect } from 'react';
// Mantive seus caminhos de importação. Se eles estiverem em outra pasta, ajuste conforme necessário.
import Modal from '../../../components/Administrador/AdicionarProduto/Modal';
import ControleQuantidade from '../../../components/Administrador/AdicionarProduto/ControleQuantidade';
import './CadastroProduto.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const ESTADO_INICIAL_FORMULARIO = {
  nome: '',
  preco: '',
  categoria: '',
  descricao: '',
};

const ITENS_POR_CATEGORIA = {
  'Camisetas': ['P', 'M', 'G', 'GG', 'G1', 'G2'],
  'Whey Protein': ['Morango', 'Chocolate', 'Baunilha'],
  'Creatina': ['Morango', 'Chocolate', 'Baunilha'],
  'Vitaminas': ['Morango', 'Chocolate', 'Baunilha'],
};

const AdicionarProduto = () => {
  const [dadosFormulario, setDadosFormulario] = useState(ESTADO_INICIAL_FORMULARIO);
  const [estoque, setEstoque] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});
  const [previaImagem, setPreviaImagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('Selecione um arquivo...');
  const inputArquivoRef = useRef(null);

  useEffect(() => {
    setEstoque({});
  }, [dadosFormulario.categoria]);

  const aoMudar = (evento) => {
    const { name, value } = evento.target;
    setDadosFormulario(estadoAnterior => ({ ...estadoAnterior, [name]: value }));
  };
  
  const abrirModalEstoque = () => {
    if (!dadosFormulario.categoria) {
      alert('Por favor, selecione uma categoria primeiro.');
      return;
    }
    const itens = ITENS_POR_CATEGORIA[dadosFormulario.categoria] || [];
    const estoqueInicial = { ...estoque };
    itens.forEach(item => {
      if (!(item in estoqueInicial)) estoqueInicial[item] = 0;
    });
    setEstoqueTemporario(estoqueInicial);
    setModalAberto(true);
  };
  
  const aoMudarEstoqueTemporario = (item, valor) => {
    setEstoqueTemporario(estadoAnterior => ({
      ...estadoAnterior,
      [item]: Math.max(0, (estadoAnterior[item] || 0) + valor)
    }));
  };
  
  const confirmarEstoque = () => {
    setEstoque(estoqueTemporario);
    setModalAberto(false);
  };
  
  const aoMudarImagem = (evento) => {
    const arquivo = evento.target.files[0];
    if (arquivo && arquivo.type.startsWith('image/')) {
        const leitor = new FileReader();
        leitor.onloadend = () => setPreviaImagem(leitor.result);
        leitor.readAsDataURL(arquivo);
        setNomeArquivo(arquivo.name);
    }
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();
    const dadosCompletos = { ...dadosFormulario, estoque, nomeArquivo };
    console.log('Dados do formulário enviados:', dadosCompletos);
    alert('Produto adicionado! Verifique o console para ver os dados.');
  };

  const limparFormulario = () => {
    setDadosFormulario(ESTADO_INICIAL_FORMULARIO);
    setEstoque({});
    setPreviaImagem(null);
    setNomeArquivo('Selecione um arquivo...');
    if (inputArquivoRef.current) inputArquivoRef.current.value = "";
  };
  
  const renderizarCorpoModal = () => (
    <>
      {(ITENS_POR_CATEGORIA[dadosFormulario.categoria] || []).map(item => (
        <ControleQuantidade
          key={item}
          label={item}
          quantidade={estoqueTemporario[item] || 0}
          onAumentar={() => aoMudarEstoqueTemporario(item, 1)}
          onDiminuir={() => aoMudarEstoqueTemporario(item, -1)}
        />
      ))}
      <div className="modal-acoes">
        <button className="btn btn-perigo" onClick={() => setModalAberto(false)}>Cancelar</button>
        <button className="btn btn-primario" onClick={confirmarEstoque}>Confirmar</button>
      </div>
    </>
  );

  // ▼▼▼ FUNÇÃO ATUALIZADA ▼▼▼
  const renderizarResumoEstoque = () => {
    const itensEstoque = Object.entries(estoque).filter(([, qtd]) => qtd > 0);
    if (itensEstoque.length === 0) return <span className="resumo-estoque-vazio">Nenhum item em estoque</span>;
    
    return (
      <div className="resumo-estoque">
        {itensEstoque.map(([item, qtd]) => (
          // Estrutura para o estilo "Pílula com Badge"
          <div key={item} className="resumo-item">
            <span className="resumo-item-nome">{item}</span>
            <span className="resumo-item-qtd">{qtd}</span>
          </div>
        ))}
      </div>
    );
  };

  // CÓDIGO ATUALIZADO COM HEADER E FOOTER
return (
  <>
    {/* 1. Adicione o Header aqui, no topo da página */}
    <AdminHeader />

    {/* O Modal pode continuar aqui, ele não interfere no layout visual */}
    <Modal
      titulo={`Definir Quantidades - ${dadosFormulario.categoria || 'Produto'}`}
      aberto={modalAberto}
      aoFechar={() => setModalAberto(false)}
    >
      {renderizarCorpoModal()}
    </Modal>
    
    {/* O seu formulário (conteúdo principal) permanece no meio */}
    <div className="formulario-container">
      <h1 className="formulario-titulo">Cadastro de produtos</h1>
      <form onSubmit={enviarFormulario} noValidate>
        {/* ... O resto do seu formulário continua igual ... */}
        {/* ... */}
        <div className="formulario-layout">
          <div className="coluna-campos">
            <div className="grupo-campo">
              <label htmlFor="nome">Nome:</label>
              <input id="nome" name="nome" type="text" className="campo-controle" value={dadosFormulario.nome} onChange={aoMudar} />
            </div>
            <div className="grupo-campo">
              <label htmlFor="preco">Preço:</label>
              <input id="preco" name="preco" type="number" className="campo-controle" value={dadosFormulario.preco} onChange={aoMudar} />
            </div>
            <div className="grupo-campo">
              <label htmlFor="categoria">Categoria:</label>
              <div className="select-container">
                <select id="categoria" name="categoria" className="campo-controle" value={dadosFormulario.categoria} onChange={aoMudar}>
                  <option value="" disabled>Selecione uma categoria...</option>
                  {Object.keys(ITENS_POR_CATEGORIA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="grupo-campo">
              <label>Estoque por Variação:</label>
              {renderizarResumoEstoque()}
              <button
                type="button"
                className="btn btn-definir-estoque"
                onClick={abrirModalEstoque}
              >
                Definir Estoque
              </button>
            </div>
            <div className="grupo-campo">
              <label htmlFor="descricao">Descrição:</label>
              <textarea id="descricao" name="descricao" rows="4" className="campo-controle" value={dadosFormulario.descricao} onChange={aoMudar}></textarea>
            </div>
          </div>
          <div className="coluna-imagem">
            <div className="grupo-campo">
              <label>Imagem:</label>
              <div className="caixa-previa-imagem" onClick={() => inputArquivoRef.current.click()}>
                {previaImagem ? (
                  <img src={previaImagem} alt="Pré-visualização" className="previa-imagem" />
                ) : (
                  <div className="placeholder-upload">
                    <div className="icone-mais">+</div>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={inputArquivoRef}
                onChange={aoMudarImagem}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="acoes-upload-imagem">
                <button type="button" className="btn btn-procurar" onClick={() => inputArquivoRef.current.click()}>
                  PROCURAR
                </button>
                <span className="info-arquivo">{nomeArquivo}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="formulario-acoes">
          <button type="button" className="btn btn-perigo" onClick={limparFormulario}>LIMPAR</button>
          <button type="submit" className="btn btn-primario">ADICIONAR</button>
        </div>
      </form>
    </div>

    {/* 3. E adicione o Footer aqui, no final da página */}
    <Footer />
  </>
);
};

export default AdicionarProduto;