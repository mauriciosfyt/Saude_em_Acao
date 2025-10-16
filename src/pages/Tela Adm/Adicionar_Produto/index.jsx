import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduto } from '../../../services/produtoService';

// Componentes Reutilizados
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import Modal from '../../../components/Administrador/AdicionarProduto/Modal';
import ControleQuantidade from '../../../components/Administrador/AdicionarProduto/ControleQuantidade';

// Estilo
import './CadastroProduto.css';

// Ícone de upload
const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Configurações do Formulário ---
const ESTADO_INICIAL_FORMULARIO = {
  nome: '',
  preco: '',
  categoria: '',
  descricao: '',
};

const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', rotulo: 'Camisetas', itens: ['P', 'M', 'G', 'GG'] },
  { valor: 'WHEY_PROTEIN', rotulo: 'Whey Protein', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'CREATINA', rotulo: 'Creatina', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'VITAMINAS', rotulo: 'Vitaminas', itens: ['Morango', 'Chocolate', 'Baunilha'] },
];

const AdicionarProduto = () => {
  const navigate = useNavigate();
  const [dadosFormulario, setDadosFormulario] = useState(ESTADO_INICIAL_FORMULARIO);
  const [estoque, setEstoque] = useState({});
  const [imagem, setImagem] = useState(null);
  const [previaImagem, setPreviaImagem] = useState(null);
  
  // Controle do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});

  const inputArquivoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prevState => ({ ...prevState, [name]: value }));
    if (name === 'categoria') {
      setEstoque({});
    }
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviaImagem(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, preco, categoria } = dadosFormulario;
    
    if (!nome || !preco || !categoria || !imagem) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione uma imagem.');
      return;
    }

    // ================================================================= //
    // ## DEPURAÇÃO E VALIDAÇÃO FINAL ##
    // ================================================================= //
    
    // 1. Logs para depuração: Veremos isso no console do navegador (F12)
    console.log('--- Verificando antes de enviar ---');
    console.log('Categoria selecionada:', categoria);
    console.log('Estado ATUAL do estoque:', estoque);

    // 2. Validação definitiva
    const categoriasExigemEstoque = ['CREATINA', 'WHEY_PROTEIN', 'CAMISETAS', 'VITAMINAS'];
    if (categoriasExigemEstoque.includes(categoria)) {
      const totalEstoque = Object.values(estoque).reduce((soma, qtd) => soma + qtd, 0);
      console.log('Total em estoque calculado:', totalEstoque);

      if (totalEstoque <= 0) {
        alert(`Para a categoria '${dadosFormulario.categoria}', a quantidade total em estoque deve ser maior que zero.`);
        return; // Impede o envio do formulário
      }
    }

    const formData = new FormData();
    formData.append('nome', dadosFormulario.nome);
    formData.append('preco', parseFloat(preco.replace(',', '.')));
    formData.append('categoria', dadosFormulario.categoria);
    formData.append('descricao', dadosFormulario.descricao);
    formData.append('img', imagem);

    for (const [tamanho, quantidade] of Object.entries(estoque)) {
        if(quantidade > 0) { // Garante que apenas itens com estoque sejam enviados
            formData.append(`estoquePorTamanho[${tamanho}]`, quantidade);
        }
    }

    try {
      await createProduto(formData);
      localStorage.setItem('showProdutoAdicionado', 'true');
      navigate('/GerenciarProduto');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert(`Ocorreu um erro ao criar o produto: ${error.message}`);
    }
  };

  const handleCancelar = () => {
    navigate('/GerenciarProduto');
  };

  const abrirModalEstoque = () => {
    if (!dadosFormulario.categoria) {
      alert('Por favor, selecione uma categoria primeiro.');
      return;
    }
    setEstoqueTemporario(estoque);
    setModalAberto(true);
  };

  const fecharModalEstoque = () => setModalAberto(false);

  const salvarEstoque = () => {
    setEstoque(estoqueTemporario);
    fecharModalEstoque();
  };

  const renderizarResumoEstoque = () => {
    const itens = Object.entries(estoque).filter(([, qtd]) => qtd > 0);
    if (itens.length === 0) {
      return <span className="resumo-estoque-vazio">Nenhum estoque definido</span>;
    }
    return (
      <div className="resumo-estoque">
        {itens.map(([item, qtd]) => <span key={item} className="resumo-item">{`${item}: ${qtd}`}</span>)}
      </div>
    );
  };
  
  const getItensCategoriaAtual = () => {
    const categoriaSelecionada = CATEGORIAS_PRODUTO.find(c => c.valor === dadosFormulario.categoria);
    return categoriaSelecionada ? categoriaSelecionada.itens : [];
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />
      <main className="adicionar-produto-container">
        <h1 className="produto-main-title">Adicionar Produto</h1>
        <form onSubmit={handleSubmit}>
          {/* O restante do seu JSX continua o mesmo... */}
          <div className="produto-form-layout">
            <div className="produto-image-upload-section">
              <div className="produto-image-placeholder" onClick={() => inputArquivoRef.current.click()}>
                {previaImagem ? (
                  <img src={previaImagem} alt="Pré-visualização" className="produto-previa-imagem" />
                ) : (
                  <PlusIcon />
                )}
              </div>
              <input
                type="file"
                ref={inputArquivoRef}
                onChange={handleImagemChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            <div className="produto-form-fields-section">
              <div className="produto-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={dadosFormulario.nome} onChange={handleChange} required />
              </div>
              <div className="produto-form-group">
                <label htmlFor="preco">Preço</label>
                <input type="text" id="preco" name="preco" value={dadosFormulario.preco} onChange={handleChange} placeholder="ex: 99,90" required />
              </div>
              <div className="produto-form-group">
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" name="categoria" value={dadosFormulario.categoria} onChange={handleChange} required>
                  <option value="" disabled>Selecione...</option>
                  {CATEGORIAS_PRODUTO.map(cat => <option key={cat.valor} value={cat.valor}>{cat.rotulo}</option>)}
                </select>
              </div>
              <div className="produto-form-group-vertical">
                <label>Estoque por variação</label>
                <div className="container-estoque">
                  {renderizarResumoEstoque()}
                  <button type="button" className="btn-definir-estoque" onClick={abrirModalEstoque}>
                    Definir Estoque
                  </button>
                </div>
              </div>
              <div className="produto-form-group-vertical">
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" name="descricao" value={dadosFormulario.descricao} onChange={handleChange} rows="4" />
              </div>
            </div>
          </div>

          <div className="produto-action-buttons">
            <button type="button" className="produto-cancel-button" onClick={handleCancelar}>cancelar</button>
            <button type="submit" className="produto-save-button">Salvar</button>
          </div>
        </form>
      </main>

      <Modal titulo="Definir Estoque" aberto={modalAberto} aoFechar={fecharModalEstoque}>
        {getItensCategoriaAtual().map(item => (
          <ControleQuantidade
            key={item}
            label={item}
            quantidade={estoqueTemporario[item] || 0}
            onAumentar={() => setEstoqueTemporario(p => ({ ...p, [item]: (p[item] || 0) + 1 }))}
            onDiminuir={() => setEstoqueTemporario(p => ({ ...p, [item]: Math.max(0, (p[item] || 0) - 1) }))}
          />
        ))}
        <button className="produto-save-button modal-save-button" onClick={salvarEstoque}>Salvar Estoque</button>
      </Modal>
    </div>
  );
};

export default AdicionarProduto;