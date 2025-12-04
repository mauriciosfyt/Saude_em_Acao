import React, { useState, useRef, useEffect } from 'react';

// Imports do Toastify e Estilos Customizados
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Mensagem/Excluido.css'; // Importação das classes customizadas

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
  
  // Estados para controle de estoque
  const [estoquePorVariacao, setEstoquePorVariacao] = useState({});
  const [estoquePadrao, setEstoquePadrao] = useState(0);

  // Estados de imagem
  const [imagem, setImagem] = useState(null);
  const [previaImagem, setPreviaImagem] = useState(null);
  
  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});

  const inputArquivoRef = useRef(null);

  // Limpeza de memória da prévia de imagem (Correção de memory leak)
  useEffect(() => {
    return () => {
      if (previaImagem) {
        URL.revokeObjectURL(previaImagem);
      }
    };
  }, [previaImagem]);

  // Helper para pegar dados da categoria atual
  const getCategoriaAtual = () => {
    return CATEGORIAS_PRODUTO.find(c => c.valor === dadosFormulario.categoria);
  };

  // Manipulação de inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prevState => ({ ...prevState, [name]: value }));

    // Reseta o estoque se mudar a categoria para evitar conflitos de dados
    if (name === 'categoria') {
      setEstoquePorVariacao({});
      setEstoquePadrao(0);
    }
  };

  // Manipulação da imagem
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviaImagem(URL.createObjectURL(file));
    }
  };

  // SUBMIT DO FORMULÁRIO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { nome, preco, categoria, descricao } = dadosFormulario;
    const categoriaInfo = getCategoriaAtual();
    
    // Validação básica
    if (!nome || !preco || !categoriaInfo || !imagem) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione uma imagem.', {
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', parseFloat(preco.replace(',', '.')));
    formData.append('categoria', categoria);
    formData.append('descricao', descricao);
    formData.append('img', imagem);

    let totalEstoque = 0;

    // Lógica de Estoque baseada na categoria
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
        toast.error('Tipo de estoque desconhecido para a categoria selecionada.', {
            className: "custom-error-toast",
            progressClassName: "custom-error-progress-bar",
            position: "top-right",
            autoClose: 5000,
        });
        return;
    }

    // Validação de quantidade mínima
    if (totalEstoque <= 0) {
        toast.error(`A quantidade total em estoque para a categoria '${categoriaInfo.rotulo}' deve ser maior que zero.`, {
            className: "custom-error-toast",
            progressClassName: "custom-error-progress-bar",
            position: "top-right",
            autoClose: 5000,
        });
        return;
    }

    // Adicionamos o total geral como 'quantidade'
    formData.append('quantidade', totalEstoque);

    onFormSubmit(formData);
  };

  // Funções do Modal
  const abrirModalEstoque = () => {
    if (!dadosFormulario.categoria) {
      toast.error('Por favor, selecione uma categoria primeiro.', {
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
        position: "top-right",
        autoClose: 5000,
      });
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

  // Renderização Condicional do Campo de Estoque
  const renderizarControleEstoque = () => {
    const categoriaInfo = getCategoriaAtual();

    // Caso 1: Categoria Simples (Vitaminas) - Mostra Input
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

    // Caso 2: Categoria com Variações (Camisetas/Whey) - Mostra Botão + Resumo
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
              {itens.map(([item, qtd]) => (
                <span key={item} className="resumo-item">{`${item}: ${qtd}`}</span>
              ))}
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
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="produto-form-layout">
          {/* Coluna da Esquerda: Imagem */}
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

          {/* Coluna da Direita: Inputs */}
          <div className="produto-form-fields-section">
            <div className="produto-form-group">
              <label htmlFor="nome">Nome</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                value={dadosFormulario.nome} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="produto-form-group">
              <label htmlFor="preco">Preço</label>
              <input 
                type="text" 
                id="preco" 
                name="preco" 
                value={dadosFormulario.preco} 
                onChange={handleChange} 
                placeholder="ex: 99,90" 
                required 
              />
            </div>
            <div className="produto-form-group">
              <label htmlFor="categoria">Categoria</label>
              <select 
                id="categoria" 
                name="categoria" 
                value={dadosFormulario.categoria} 
                onChange={handleChange} 
                required
              >
                <option value="" disabled>Selecione...</option>
                {CATEGORIAS_PRODUTO.map(cat => (
                  <option key={cat.valor} value={cat.valor}>{cat.rotulo}</option>
                ))}
              </select>
            </div>
            
            {/* Componente de Estoque */}
            {renderizarControleEstoque()}

            <div className="produto-form-group-vertical">
              <label htmlFor="descricao">Descrição</label>
              <textarea 
                id="descricao" 
                name="descricao" 
                value={dadosFormulario.descricao} 
                onChange={handleChange} 
                rows="4" 
              />
            </div>
          </div>
        </div>

        <div className="produto-action-buttons">
          <button type="button" className="produto-cancel-button" onClick={onCancel}>cancelar</button>
          <button type="submit" className="produto-save-button">Salvar</button>
        </div>
      </form>
      
      {/* Modal de Estoque */}
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
        <button className="produto-save-button modal-save-button" onClick={salvarEstoque}>
            Salvar Estoque
        </button>
      </Modal>
    </>
  );
};

export default FormularioProduto;