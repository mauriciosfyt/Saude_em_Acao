import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import ControleQuantidade from './ControleQuantidade';
import './FormularioProduto.css';

// O estado inicial agora não tem mais sabor, tamanho e quantidade únicos
const ESTADO_INICIAL_FORMULARIO = {
  nome: '',
  preco: '',
  categoria: '',
  descricao: '',
};

// Define os itens de estoque com base na categoria
const ITENS_POR_CATEGORIA = {
  'Camisetas': ['P', 'M', 'G', 'GG', 'G1', 'G2'],
  'Whey Protein': ['Morango', 'Chocolate', 'Baunilha'],
  'Creatina': ['Morango', 'Chocolate', 'Baunilha'],
  'Vitaminas': ['Morango', 'Chocolate', 'Baunilha'],
};

const FormularioProduto = () => {
  const [dadosFormulario, setDadosFormulario] = useState(ESTADO_INICIAL_FORMULARIO);
  const [estoque, setEstoque] = useState({}); // Ex: { P: 2, M: 5 } ou { Morango: 10 }
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});

  const [previaImagem, setPreviaImagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('Selecione um arquivo...');
  const inputArquivoRef = useRef(null);

  // Zera o estoque sempre que a categoria mudar
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
    // Inicia o modal com o estoque atual salvo
    const itens = ITENS_POR_CATEGORIA[dadosFormulario.categoria] || [];
    const estoqueInicial = { ...estoque };
    itens.forEach(item => {
      if (!(item in estoqueInicial)) {
        estoqueInicial[item] = 0;
      }
    });
    setEstoqueTemporario(estoqueInicial);
    setModalAberto(true);
  };
  
  const aoMudarEstoqueTemporario = (item, valor) => {
    setEstoqueTemporario(estadoAnterior => ({
      ...estadoAnterior,
      [item]: Math.max(0, estadoAnterior[item] + valor)
    }));
  };
  
  const confirmarEstoque = () => {
    setEstoque(estoqueTemporario);
    setModalAberto(false);
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();
    const dadosCompletos = {
      ...dadosFormulario,
      estoque,
      nomeArquivo
    };
    console.log('Dados do formulário enviados:', dadosCompletos);
    alert('Produto adicionado! Verifique o console para ver os dados.');
  };

  const limparFormulario = () => {
    setDadosFormulario(ESTADO_INICIAL_FORMULARIO);
    setEstoque({});
    setPreviaImagem(null);
    setNomeArquivo('Selecione um arquivo...');
    if (inputArquivoRef.current) {
      inputArquivoRef.current.value = "";
    }
  };

  // Lógica para renderizar o corpo do modal
  const renderizarCorpoModal = () => {
    const itens = ITENS_POR_CATEGORIA[dadosFormulario.categoria] || [];
    return (
      <>
        {itens.map(item => (
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
  };

  // Lógica para exibir um resumo do estoque no formulário
  const renderizarResumoEstoque = () => {
    const itensEstoque = Object.entries(estoque).filter(([, qtd]) => qtd > 0);
    if (itensEstoque.length === 0) {
      return <span className="resumo-estoque-vazio">Nenhum item em estoque</span>;
    }
    return (
      <div className="resumo-estoque">
        {itensEstoque.map(([item, qtd]) => (
          <span key={item} className="resumo-item">{`${item}: ${qtd}`}</span>
        ))}
      </div>
    );
  };

  return (
    <>
      <Modal
        titulo={`Definir Quantidades - ${dadosFormulario.categoria}`}
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
      >
        {renderizarCorpoModal()}
      </Modal>

      <div className="formulario-container">
        <h1 className="formulario-titulo">Cadastro de produtos</h1>
        <form onSubmit={enviarFormulario} noValidate>
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
                    {Object.keys(ITENS_POR_CATEGORIA).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grupo-campo">
                <label>Estoque por Variação:</label>
                <div className="container-estoque">
                  {renderizarResumoEstoque()}
                  <button type="button" className="btn btn-definir-estoque" onClick={abrirModalEstoque}>
                    Definir Estoque
                  </button>
                </div>
              </div>
              <div className="grupo-campo">
                <label htmlFor="descricao">Descrição:</label>
                <textarea id="descricao" name="descricao" rows="4" className="campo-controle" value={dadosFormulario.descricao} onChange={aoMudar}></textarea>
              </div>
            </div>

            <div className="coluna-imagem">
              {/* O código do uploader de imagem permanece o mesmo */}
            </div>
          </div>
          <div className="formulario-acoes">
            <button type="button" className="btn btn-perigo" onClick={limparFormulario}>LIMPAR</button>
            <button type="submit" className="btn btn-primario">ADICIONAR</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormularioProduto;