import React, { useState, useRef } from 'react';

// Componentes Reutilizados do formulário
import Modal from '../../../components/Administrador/AdicionarProduto/Modal';
import ControleQuantidade from '../../../components/Administrador/AdicionarProduto/ControleQuantidade';

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
  { valor: 'CAMISETAS', rotulo: 'Camisetas', tipoEstoque: 'tamanho', itens: ['P', 'M', 'G', 'GG'] },
  { valor: 'WHEY_PROTEIN', rotulo: 'Whey Protein', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'CREATINA', rotulo: 'Creatina', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'VITAMINAS', rotulo: 'Vitaminas', tipoEstoque: 'padrao', itens: [] }, 
];

const FormularioProduto = ({ onFormSubmit, onCancel }) => {
  const [dadosFormulario, setDadosFormulario] = useState(ESTADO_INICIAL_FORMULARIO);
  
  const [estoquePorVariacao, setEstoquePorVariacao] = useState({});
  const [estoquePadrao, setEstoquePadrao] = useState(0);

  const [imagem, setImagem] = useState(null);
  const [previaImagem, setPreviaImagem] = useState(null);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});

  const inputArquivoRef = useRef(null);

  const getCategoriaAtual = () => {
    return CATEGORIAS_PRODUTO.find(c => c.valor === dadosFormulario.categoria);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prevState => ({ ...prevState, [name]: value }));

    if (name === 'categoria') {
      setEstoquePorVariacao({});
      setEstoquePadrao(0);
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
    // A lógica de submit permanece a mesma e já está correta.
    const { nome, preco, categoria } = dadosFormulario;
    const categoriaInfo = getCategoriaAtual();
    
    if (!nome || !preco || !categoriaInfo || !imagem) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', dadosFormulario.nome);
    formData.append('preco', parseFloat(preco.replace(',', '.')));
    formData.append('categoria', dadosFormulario.categoria);
    formData.append('descricao', dadosFormulario.descricao);
    formData.append('img', imagem);

    let totalEstoque = 0;

    switch (categoriaInfo.tipoEstoque) {
      case 'tamanho':
        for (const [tamanho, quantidade] of Object.entries(estoquePorVariacao)) {
            if (quantidade > 0) {
                formData.append(`estoquePorTamanho[${tamanho}]`, quantidade);
                totalEstoque += quantidade;
            }
        }
        break;
      case 'sabor':
        for (const [sabor, quantidade] of Object.entries(estoquePorVariacao)) {
            if (quantidade > 0) {
                formData.append(`estoquePorSabor[${sabor.toUpperCase()}]`, quantidade);
                totalEstoque += quantidade;
            }
        }
        break;
      case 'padrao':
        formData.append('estoquePadrao', estoquePadrao);
        totalEstoque = Number(estoquePadrao);
        break;
      default:
        alert('Tipo de estoque desconhecido para a categoria selecionada.');
        return;
    }

    if (totalEstoque <= 0) {
        alert(`A quantidade total em estoque para a categoria '${categoriaInfo.rotulo}' deve ser maior que zero.`);
        return;
    }

    onFormSubmit(formData);
  };

  const abrirModalEstoque = () => {
    // Esta validação crucial foi mantida
    if (!dadosFormulario.categoria) {
      alert('Por favor, selecione uma categoria primeiro.');
      return;
    }
    setEstoqueTemporario(estoquePorVariacao);
    setModalAberto(true);
  };

  const fecharModalEstoque = () => setModalAberto(false);

  const salvarEstoque = () => {
    setEstoquePorVariacao(estoqueTemporario);
    fecharModalEstoque();
  };

  // ## ALTERAÇÃO PRINCIPAL AQUI ##
  // Esta função foi ajustada para atender ao seu pedido.
  const renderizarControleEstoque = () => {
    const categoriaInfo = getCategoriaAtual();

    // Se a categoria selecionada for do tipo "padrão", mostramos o input numérico.
    if (categoriaInfo && categoriaInfo.tipoEstoque === 'padrao') {
      return (
        <div className="produto-form-group">
          <label htmlFor="estoquePadrao">Estoque Padrão</label>
          <input 
            type="number" 
            id="estoquePadrao" 
            name="estoquePadrao" 
            value={estoquePadrao} 
            onChange={(e) => setEstoquePadrao(Math.max(0, parseInt(e.target.value, 10) || 0))} 
            min="0"
          />
        </div>
      );
    }

    // Caso contrário (nenhuma categoria selecionada OU uma categoria com variações),
    // mostramos a seção de estoque por variação.
    const itens = Object.entries(estoquePorVariacao).filter(([, qtd]) => qtd > 0);
    const tipoEstoqueLabel = categoriaInfo ? `(${categoriaInfo.tipoEstoque})` : '';

    return (
      <div className="produto-form-group-vertical">
        <label>Estoque por variação {tipoEstoqueLabel}</label>
        <div className="container-estoque">
          {itens.length === 0 ? (
            <span className="resumo-estoque-vazio">Nenhum estoque definido</span>
          ) : (
            <div className="resumo-estoque">
              {itens.map(([item, qtd]) => <span key={item} className="resumo-item">{`${item}: ${qtd}`}</span>)}
            </div>
          )}
          <button type="button" className="btn-definir-estoque" onClick={abrirModalEstoque}>
            Definir Estoque
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="produto-form-layout">
          <div className="produto-image-upload-section">
            <div className="produto-image-placeholder" onClick={() => inputArquivoRef.current.click()}>
              {previaImagem ? (
                <img src={previaImagem} alt="Pré-visualização" className="produto-previa-imagem" />
              ) : (
                <PlusIcon />
              )}
            </div>
            <input type="file" ref={inputArquivoRef} onChange={handleImagemChange} accept="image/*" style={{ display: 'none' }} />
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
            
            {/* O controle de estoque agora aparece desde o início */}
            {renderizarControleEstoque()}

            <div className="produto-form-group-vertical">
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" name="descricao" value={dadosFormulario.descricao} onChange={handleChange} rows="4" />
            </div>
          </div>
        </div>

        <div className="produto-action-buttons">
          <button type="button" className="produto-cancel-button" onClick={onCancel}>cancelar</button>
          <button type="submit" className="produto-save-button">Salvar</button>
        </div>
      </form>
      
      <Modal titulo="Definir Estoque" aberto={modalAberto} aoFechar={fecharModalEstoque}>
        {(getCategoriaAtual()?.itens || []).map(item => (
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
    </>
  );
};

export default FormularioProduto;