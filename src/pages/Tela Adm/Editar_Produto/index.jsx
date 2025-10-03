import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/Administrador/AdicionarProduto/Modal';
import ControleQuantidade from '../../../components/Administrador/AdicionarProduto/ControleQuantidade';
import '../Adicionar_Produto/CadastroProduto.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const ITENS_POR_CATEGORIA = {
  'Camisetas': ['P', 'M', 'G', 'GG', 'G1', 'G2'],
};

const EditarProduto = () => {
  const navigate = useNavigate();
  const [dadosFormulario, setDadosFormulario] = useState({ nome: '', preco: '', categoria: '', descricao: '' });
  const [estoque, setEstoque] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});
  const [previaImagem, setPreviaImagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('Selecione um arquivo...');
  const inputArquivoRef = useRef(null);

  // Carregar produto do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem('produtoParaEditar');
    if (!salvo) return;
    const produto = JSON.parse(salvo);

    setDadosFormulario({
      nome: produto.nome || '',
      preco: produto.preco || '',
      categoria: produto.categoria || '',
      descricao: produto.descricao || '',
    });

    // Se tiver estrutura de estoque/variações salva no futuro, aqui seria carregada
    setPrevIaSeExistir(produto);
  }, []);

  const setPrevIaSeExistir = (produto) => {
    if (produto.imagem) setPreviaImagem(produto.imagem);
  };

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

  const salvarAlteracoes = (evento) => {
    evento.preventDefault();

    const produtoParaEditar = JSON.parse(localStorage.getItem('produtoParaEditar') || 'null');
    if (!produtoParaEditar?.id) {
      alert('Produto inválido.');
      return;
    }

    const lista = JSON.parse(localStorage.getItem('produtos') || '[]');
    const atualizada = lista.map(p => {
      if (p.id === produtoParaEditar.id) {
        return {
          ...p,
          ...dadosFormulario,
          preco: Number(dadosFormulario.preco) || 0,
          imagem: previaImagem || p.imagem,
        };
      }
      return p;
    });

    localStorage.setItem('produtos', JSON.stringify(atualizada));
    localStorage.removeItem('produtoParaEditar');

    // Seta a flag para mostrar notificação de edição
    localStorage.setItem('showProdutoEditado', 'true');

    // Navegar de volta para Gerenciar Produtos
    navigate('/GerenciarProduto');
  };

  const limpar = () => {
    // Não limpamos ID; apenas campos
    setDadosFormulario({ nome: '', preco: '', categoria: '', descricao: '' });
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

  return (
    <>
      <AdminHeader />

      <Modal
        titulo={`Definir Quantidades - ${dadosFormulario.categoria || 'Produto'}`}
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
      >
        {renderizarCorpoModal()}
      </Modal>

      <div className="formulario-container">
        <h1 className="formulario-titulo">Editar produto</h1>
        <form onSubmit={salvarAlteracoes} noValidate>
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
                {/* Reutilizando mesmo resumo do cadastro. Aqui pode exibir baseado em 'estoque' quando implementado */}
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
            <button type="button" className="btn btn-perigo" onClick={limpar}>LIMPAR</button>
            <button type="submit" className="btn btn-primario">SALVAR</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditarProduto;
