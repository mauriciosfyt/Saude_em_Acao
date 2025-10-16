import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProduto } from '../../../services/produtoService'; // Verifique se o caminho está correto

// Componentes Reutilizados
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import Modal from '../../../components/Administrador/AdicionarProduto/Modal';
import ControleQuantidade from '../../../components/Administrador/AdicionarProduto/ControleQuantidade';

// IMPORTANTE: Certifique-se de que o import aponta para o novo arquivo CSS
import './EditarProduto.css'; 

// Ícone de Upload (para consistência)
const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Categorias (mantendo a mesma estrutura da tela de Adicionar)
const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', rotulo: 'Camisetas', itens: ['P', 'M', 'G', 'GG'] },
  { valor: 'WHEY_PROTEIN', rotulo: 'Whey Protein', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'CREATINA', rotulo: 'Creatina', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'VITAMINAS', rotulo: 'Vitaminas', itens: ['Morango', 'Chocolate', 'Baunilha'] },
];

const EditarProduto = () => {
  const navigate = useNavigate();
  const [produtoId, setProdutoId] = useState(null);
  const [dadosFormulario, setDadosFormulario] = useState({ nome: '', preco: '', categoria: '', descricao: '' });
  const [estoque, setEstoque] = useState({});
  const [imagem, setImagem] = useState(null); // Armazena o NOVO arquivo de imagem
  const [previaImagem, setPreviaImagem] = useState(null); // Exibe a imagem atual ou a prévia da nova
  
  // Controle do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueTemporario, setEstoqueTemporario] = useState({});
  const estoqueRef = useRef(estoque);

  const inputArquivoRef = useRef(null);

  // Carrega os dados do produto do localStorage quando o componente é montado
  useEffect(() => {
    const produtoSalvo = localStorage.getItem('produtoParaEditar');
    if (!produtoSalvo) {
      alert('Nenhum produto selecionado para edição.');
      navigate('/GerenciarProduto');
      return;
    }
    const produto = JSON.parse(produtoSalvo);
    
    setProdutoId(produto.id);
    setDadosFormulario({
      nome: produto.nome || '',
      preco: produto.preco || '',
      categoria: produto.categoria || '',
      descricao: produto.descricao || '',
    });
    
    const estoqueExistente = produto.estoquePorTamanho || {};
    setEstoque(estoqueExistente);
    estoqueRef.current = estoqueExistente;

    if (produto.imagem) {
      setPreviaImagem(produto.imagem);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file); // Guarda o novo arquivo de imagem para ser enviado
      setPreviaImagem(URL.createObjectURL(file)); // Gera uma prévia local da nova imagem
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!produtoId) return;

    const formData = new FormData();
    formData.append('nome', dadosFormulario.nome);
    formData.append('preco', parseFloat(dadosFormulario.preco.toString().replace(',', '.')));
    formData.append('categoria', dadosFormulario.categoria);
    formData.append('descricao', dadosFormulario.descricao);

    if (imagem) {
      formData.append('img', imagem);
    }

    for (const [tamanho, quantidade] of Object.entries(estoqueRef.current)) {
      if (quantidade > 0) {
        formData.append(`estoquePorTamanho[${tamanho}]`, quantidade);
      }
    }

    try {
      // **Ação Futura**: Descomente a linha abaixo para conectar com a API
       await updateProduto(produtoId, formData);
    

      localStorage.setItem('showProdutoEditado', 'true');
      navigate('/GerenciarProduto');
    } catch (error) { // O erro de sintaxe estava aqui. Corrigido para a forma padrão.
      console.error('Erro ao editar produto:', error);
      alert(`Ocorreu um erro ao editar o produto: ${error.message}`);
    }
  };
  
  const handleCancelar = () => {
    navigate('/GerenciarProduto');
  };

  // --- Lógica do Modal de Estoque ---
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
    estoqueRef.current = estoqueTemporario;
    fecharModalEstoque();
  };
  
  const renderizarResumoEstoque = () => {
    const itens = Object.entries(estoqueRef.current).filter(([, qtd]) => qtd > 0);
    if (itens.length === 0) {
      return <span className="editar-produto-resumo-vazio">Nenhum estoque definido</span>;
    }
    return (
      <div className="editar-produto-resumo-estoque">
        {itens.map(([item, qtd]) => <span key={item} className="editar-produto-resumo-item">{`${item}: ${qtd}`}</span>)}
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
      <main className="editar-produto-container">
        <h1 className="editar-produto-main-title">Editar Produto</h1>

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
            </div>

            <div className="editar-produto-form-fields-section">
              <div className="editar-produto-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={dadosFormulario.nome} onChange={handleChange} required />
              </div>
              <div className="editar-produto-form-group">
                <label htmlFor="preco">Preço</label>
                <input type="text" id="preco" name="preco" value={dadosFormulario.preco} onChange={handleChange} placeholder="ex: 99,90" required />
              </div>
              <div className="editar-produto-form-group">
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" name="categoria" value={dadosFormulario.categoria} onChange={handleChange} required>
                  <option value="" disabled>Selecione...</option>
                  {CATEGORIAS_PRODUTO.map(cat => <option key={cat.valor} value={cat.valor}>{cat.rotulo}</option>)}
                </select>
              </div>
              <div className="editar-produto-form-group-vertical">
                <label>Estoque por variação</label>
                <div className="editar-produto-container-estoque">
                  {renderizarResumoEstoque()}
                  <button type="button" className="editar-produto-btn-definir-estoque" onClick={abrirModalEstoque}>
                    Definir Estoque
                  </button>
                </div>
              </div>
              <div className="editar-produto-form-group-vertical">
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" name="descricao" value={dadosFormulario.descricao} onChange={handleChange} rows="4" />
              </div>
            </div>
          </div>

          <div className="editar-produto-action-buttons">
            <button type="button" className="editar-produto-cancel-button" onClick={handleCancelar}>cancelar</button>
            <button type="submit" className="editar-produto-save-button">Salvar</button>
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
        <button className="editar-produto-save-button modal-save-button" onClick={salvarEstoque}>Salvar Estoque</button>
      </Modal>
    </div>
  );
};

export default EditarProduto;