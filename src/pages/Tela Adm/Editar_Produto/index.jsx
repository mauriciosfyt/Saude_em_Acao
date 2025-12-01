import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProduto, getProdutoById } from '../../../services/produtoService';
import { useAuth } from '../../../contexts/AuthContext';

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Editado.css'; // Importação do estilo Laranja (Edição)
// -------------------------------

// Componentes Reutilizados
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import Modal from '../../../components/Administrador/AdicionarProduto/Modal';
import ControleQuantidade from '../../../components/Administrador/AdicionarProduto/ControleQuantidade';

import './EditarProduto.css'; 

// Ícone de Upload
const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Categorias com tipos de estoque definidos
const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', rotulo: 'Camisetas', tipoEstoque: 'tamanho', itens: ['P', 'M', 'G', 'GG'] },
  { valor: 'WHEY_PROTEIN', rotulo: 'Whey Protein', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'CREATINA', rotulo: 'Creatina', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'VITAMINAS', rotulo: 'Vitaminas', tipoEstoque: 'padrao', itens: [] },
];

const EditarProduto = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [produtoId, setProdutoId] = useState(null);
  const [dadosFormulario, setDadosFormulario] = useState({ 
    nome: '', 
    preco: '', 
    categoria: '', 
    descricao: '' 
  });
  const [estoquePorVariacao, setEstoquePorVariacao] = useState({});
  const [estoquePadrao, setEstoquePadrao] = useState(0);
  const [imagem, setImagem] = useState(null);
  const [previaImagem, setPreviaImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Controle do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});
  const [categoriaModal, setCategoriaModal] = useState('');

  const inputArquivoRef = useRef(null);

  const getCategoriaAtual = () => {
    return CATEGORIAS_PRODUTO.find(c => c.valor === dadosFormulario.categoria);
  };

  useEffect(() => {
    const carregarProduto = async () => {
      const produtoSalvo = localStorage.getItem('produtoParaEditar');
      if (!produtoSalvo) {
        // Alerta visual substituído por Toast, mantendo lógica de redirecionamento
        // alert('Nenhum produto selecionado para edição.');
        toast.error('Nenhum produto selecionado para edição.');
        navigate('/GerenciarProduto');
        return;
      }

      const produto = JSON.parse(produtoSalvo);
      setProdutoId(produto.id);

      try {
        const produtoCompleto = await getProdutoById(produto.id);
        console.log('📦 Dados completos do produto:', produtoCompleto);

        setDadosFormulario({
          nome: produtoCompleto.nome || '',
          preco: produtoCompleto.preco?.toString() || '',
          categoria: produtoCompleto.categoria || '',
          descricao: produtoCompleto.descricao || '',
        });

        // Configurar estoque baseado no tipo de categoria
        const categoriaInfo = CATEGORIAS_PRODUTO.find(c => c.valor === produtoCompleto.categoria);
        if (categoriaInfo) {
          console.log('🎯 Categoria encontrada:', categoriaInfo);
          
          switch (categoriaInfo.tipoEstoque) {
            case 'tamanho':
              const estoqueTamanho = produtoCompleto.estoquePorTamanho || {};
              console.log('👕 Estoque por tamanho:', estoqueTamanho);
              setEstoquePorVariacao(estoqueTamanho);
              break;
            case 'sabor':
              const estoqueSabor = produtoCompleto.estoquePorSabor || {};
              console.log('🍦 Estoque por sabor:', estoqueSabor);
              // MANTER EM MAIÚSCULAS para consistência
              const estoqueSaborFormatado = {};
              Object.entries(estoqueSabor).forEach(([sabor, quantidade]) => {
                estoqueSaborFormatado[sabor] = quantidade; // Manter original
              });
              setEstoquePorVariacao(estoqueSaborFormatado);
              break;
            case 'padrao':
              console.log('📦 Estoque padrão:', produtoCompleto.estoquePadrao);
              setEstoquePadrao(produtoCompleto.estoquePadrao || 0);
              break;
          }
        }

        if (produtoCompleto.imagem) {
          setPreviaImagem(produtoCompleto.imagem);
        }

      } catch (error) {
        console.error('❌ Erro ao carregar produto:', error);
        setError('Erro ao carregar dados do produto: ' + error.message);
        toast.error('Erro ao carregar dados do produto.');
      }
    };

    carregarProduto();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prevState => ({ ...prevState, [name]: value }));

    // Resetar estoque quando mudar categoria
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

  // Funções do Modal
  const abrirModalEstoque = () => {
    if (!dadosFormulario.categoria) {
      // alert('Por favor, selecione uma categoria primeiro.');
      toast.warn('Por favor, selecione uma categoria primeiro.');
      return;
    }
    
    console.log('📊 Estoque atual antes de abrir modal:', estoquePorVariacao);
    
    // SOLUÇÃO: Criar um novo objeto com TODOS os itens da categoria
    const categoriaInfo = getCategoriaAtual();
    const estoqueInicial = {};
    
    // Inicializar TODOS os itens da categoria, incluindo os com estoque 0
    categoriaInfo.itens.forEach(item => {
      estoqueInicial[item] = estoquePorVariacao[item] || 0;
    });
    
    setEstoqueTemporario(estoqueInicial);
    setCategoriaModal(dadosFormulario.categoria);
    setModalAberto(true);
    
    console.log('🎯 Modal aberto com estoque:', estoqueInicial);
  };

  const fecharModalEstoque = () => {
    setModalAberto(false);
    setCategoriaModal('');
  };

  const salvarEstoque = () => {
    console.log('💾 Salvando estoque do modal:', estoqueTemporario);
    setEstoquePorVariacao(estoqueTemporario);
    fecharModalEstoque();
  };

  // Funções para manipular estoque no modal
  const aumentarQuantidade = (item) => {
    setEstoqueTemporario(prev => ({
      ...prev,
      [item]: (prev[item] || 0) + 1
    }));
  };

  const diminuirQuantidade = (item) => {
    setEstoqueTemporario(prev => ({
      ...prev,
      [item]: Math.max(0, (prev[item] || 0) - 1)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!produtoId) return;

    setLoading(true);
    setError('');

    try {
      const { nome, preco, categoria, descricao } = dadosFormulario;
      const categoriaInfo = getCategoriaAtual();
      
      if (!nome || !preco || !categoriaInfo) {
        // alert('Por favor, preencha todos os campos obrigatórios.');
        toast.warn('Por favor, preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      // VALIDAÇÃO DE ESTOQUE
      let totalEstoque = 0;
      
      if (categoriaInfo.tipoEstoque === 'padrao') {
        totalEstoque = estoquePadrao;
      } else {
        totalEstoque = Object.values(estoquePorVariacao).reduce((sum, qtd) => sum + qtd, 0);
      }

      if (totalEstoque <= 0) {
        // alert(`O estoque total deve ser maior que zero para a categoria ${categoriaInfo.rotulo}`);
        toast.warn(`O estoque total deve ser maior que zero para a categoria ${categoriaInfo.rotulo}`);
        setLoading(false);
        return;
      }

      console.log('🔄 Iniciando edição do produto...');
      console.log('📦 Dados do formulário:', dadosFormulario);
      console.log('🍦 Estoque por variação:', estoquePorVariacao);
      console.log('📊 Estoque padrão:', estoquePadrao);

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('preco', parseFloat(preco.toString().replace(',', '.')));
      formData.append('categoria', categoria);
      formData.append('descricao', descricao);

      if (imagem) {
        formData.append('img', imagem);
      }

      // Enviar estoque no formato correto
      switch (categoriaInfo.tipoEstoque) {
        case 'tamanho':
          for (const [tamanho, quantidade] of Object.entries(estoquePorVariacao)) {
            if (quantidade > 0) {
              formData.append(`estoquePorTamanho[${tamanho}]`, quantidade);
              console.log(`👕 Tamanho ${tamanho}: ${quantidade}`);
            }
          }
          break;
        case 'sabor':
          for (const [sabor, quantidade] of Object.entries(estoquePorVariacao)) {
            if (quantidade > 0) {
              // Enviar sabor em maiúsculas conforme padrão da API
              formData.append(`estoquePorSabor[${sabor.toUpperCase()}]`, quantidade);
              console.log(`🍦 Sabor ${sabor}: ${quantidade}`);
            }
          }
          break;
        case 'padrao':
          formData.append('estoquePadrao', estoquePadrao);
          console.log(`📦 Estoque padrão: ${estoquePadrao}`);
          break;
      }

      await updateProduto(produtoId, formData);

      console.log('Editado com sucesso!');

      // --- IMPLEMENTAÇÃO DO TOAST DE EDIÇÃO ---
      // Usamos as classes do seu arquivo Editado.css
      toast.success("Produto editado com sucesso!", {
        className: "custom-edit-toast",
        progressClassName: "custom-edit-progress-bar",
        autoClose: 2000 // Sincronizado com o delay abaixo
      });

      localStorage.setItem('showProdutoEditado', 'true');
      
      // Delay adicionado para permitir a leitura do Toast antes de sair da tela
      setTimeout(() => {
        navigate('/GerenciarProduto');
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao editar produto:', error);
      setError(`Erro ao editar produto: ${error.message}`);
      // alert(`Ocorreu um erro ao editar o produto: ${error.message}`);
      toast.error(`Ocorreu um erro ao editar o produto: ${error.message}`);
    } finally {
      // Nota: Não defino loading(false) aqui se for sucesso, pois a navegação vai ocorrer
      // e queremos evitar que o usuário clique novamente no botão.
      if (error) setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate('/GerenciarProduto');
  };

  // Renderizar controle de estoque
  const renderizarControleEstoque = () => {
    const categoriaInfo = getCategoriaAtual();

    if (categoriaInfo && categoriaInfo.tipoEstoque === 'padrao') {
      return (
        <div className="editar-produto-form-group">
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

    const itens = Object.entries(estoquePorVariacao).filter(([, qtd]) => qtd > 0);
    const tipoEstoqueLabel = categoriaInfo ? `(${categoriaInfo.tipoEstoque})` : '';

    return (
      <div className="editar-produto-form-group-vertical">
        <label>Estoque por variação {tipoEstoqueLabel}</label>
        <div className="editar-produto-container-estoque">
          {itens.length === 0 ? (
            <span className="editar-produto-resumo-vazio">Nenhum estoque definido</span>
          ) : (
            <div className="editar-produto-resumo-estoque">
              {itens.map(([item, qtd]) => (
                <span key={item} className="editar-produto-resumo-item">
                  {`${item}: ${qtd}`}
                </span>
              ))}
            </div>
          )}
          <button 
            type="button" 
            className="editar-produto-btn-definir-estoque" 
            onClick={abrirModalEstoque}
          >
            Definir Estoque
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />
      <main className="editar-produto-container">
        <h1 className="editar-produto-main-title">Editar Produto</h1>

        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="editar-produto-form-layout">
            <div className="editar-produto-image-upload-section">
              <div className="editar-produto-image-placeholder" onClick={() => inputArquivoRef.current.click()}>
                {previaImagem ? (
                  <img src={previaImagem} alt="Pré-visualização" className="editar-produto-previa-imagem" />
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
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                {imagem ? 'Nova imagem selecionada' : 'Clique para alterar a imagem'}
              </div>
            </div>

            <div className="editar-produto-form-fields-section">
              <div className="editar-produto-form-group">
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
              
              <div className="editar-produto-form-group">
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
              
              <div className="editar-produto-form-group">
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
              
              {/* Controle de estoque dinâmico */}
              {renderizarControleEstoque()}
              
              <div className="editar-produto-form-group-vertical">
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

          <div className="editar-produto-action-buttons">
            <button 
              type="button" 
              className="editar-produto-cancel-button" 
              onClick={handleCancelar}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="editar-produto-save-button" 
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
        
        {/* Componente container para renderizar os Toasts de Edição */}
        <ToastContainer position="top-right" />
        
      </main>

      {/* Modal para estoque por variação */}
      <Modal titulo="Definir Estoque" aberto={modalAberto} aoFechar={fecharModalEstoque}>
        <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
          Categoria: {getCategoriaAtual()?.rotulo}
          <br />
          Itens disponíveis: {getCategoriaAtual()?.itens?.join(', ')}
        </div>
        
        {(getCategoriaAtual()?.itens || []).map(item => (
          <ControleQuantidade
            key={item}
            label={item}
            quantidade={estoqueTemporario[item] || 0}
            onAumentar={() => aumentarQuantidade(item)}
            onDiminuir={() => diminuirQuantidade(item)}
          />
        ))}
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Debug Modal:</strong> {JSON.stringify(estoqueTemporario)}
        </div>
        
        <button 
          className="editar-produto-save-button modal-save-button" 
          onClick={salvarEstoque}
        >
          Salvar Estoque
        </button>
      </Modal>
    </div>
  );
};

export default EditarProduto;