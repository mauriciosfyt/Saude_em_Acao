import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProdutoById } from '../../services/produtoService';
import { fixImageUrl } from '../../utils/image';
import { createReserva } from '../../services/reservasService';

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/Mensagem/Sucesso.css';
import '../../components/Mensagem/Cancelado.css';
// -------------------------------

// Importações originais
import './Carrinho.css';
import Footer from '../../components/footer';
import Header from '../../components/header_loja';
import ProdutosSection from '../../components/produtos';

// --- 1. CONFIGURAÇÃO DE CATEGORIAS ---
const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', rotulo: 'Camisetas', tipoEstoque: 'tamanho', itens: ['P', 'M', 'G', 'GG'] },
  { valor: 'WHEY_PROTEIN', rotulo: 'Whey Protein', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'CREATINA', rotulo: 'Creatina', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'VITAMINAS', rotulo: 'Vitaminas', tipoEstoque: 'padrao', itens: [] }, 
];
// ------------------------------------

const CART_STORAGE_KEY = 'carrinhoDeCompras';

const Carrinho = () => {
  const navigate = useNavigate(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const produtoIdParaAdicionar = searchParams.get('add');

  const [produtos, setProdutos] = useState(() => {
    try {
      const dadosSalvos = localStorage.getItem(CART_STORAGE_KEY);
      return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservaStatus, setReservaStatus] = useState({ loading: false, error: null });

  // --- 2. ESTADOS PARA O MODAL ---
  const [produtoParaSelecionar, setProdutoParaSelecionar] = useState(null);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState('');
  // --------------------------------

  // Efeito para salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(produtos));
    } catch (error) {
      console.error("Erro ao salvar carrinho no localStorage:", error);
    }
  }, [produtos]);

  // --- 3. EFEITO 'fetchAndAddProduto' ---
  useEffect(() => {
    if (!produtoIdParaAdicionar) {
      return;
    }

    const fetchAndAddProduto = async (id) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProdutoById(id);
        const categoriaInfo = CATEGORIAS_PRODUTO.find(c => c.valor === data.categoria);

        if (!categoriaInfo) {
          throw new Error(`Produto "${data.nome}" tem uma categoria desconhecida (${data.categoria}).`);
        }

        if (categoriaInfo.tipoEstoque === 'padrao') {
          setProdutos(prevProdutos => {
            const produtoExistente = prevProdutos.find(p => p.id === data.id && !p.variacaoValor);
            
            if (produtoExistente) {
              console.log("Produto padrão já existe. Incrementando.");
              return prevProdutos.map(p => 
                p.id === data.id ? { ...p, quantidade: p.quantidade + 1 } : p
              );
            } else {
              console.log("Adicionando produto padrão.");
              const novoProduto = {
                id: data.id,
                nome: data.nome,
                preco: data.preco,
                quantidade: 1,
                imagem: data.img,
                selecionado: true,
                categoria: data.categoria,
                variacaoTipo: 'padrao',
                variacaoValor: null
              };
              return [...prevProdutos, novoProduto];
            }
          });
        } else {
          console.log("Produto requer seleção de variação. Abrindo modal...");
          setProdutoParaSelecionar({ ...data, categoriaInfo });
          setVariacaoSelecionada(categoriaInfo.itens[0]);
        }

        setSearchParams({}, { replace: true });

      } catch (err) {
        console.error("Falha ao buscar ou adicionar produto:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAddProduto(produtoIdParaAdicionar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtoIdParaAdicionar, setSearchParams]);

  
  // Efeito de Travar Scroll
  useEffect(() => {
    if (produtoParaSelecionar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [produtoParaSelecionar]);


  // --- 4. FUNÇÕES DO MODAL ---

  const fecharModalVariacao = () => {
    setProdutoParaSelecionar(null);
    setVariacaoSelecionada('');
  };

  const handleConfirmarVariacao = () => {
    if (!produtoParaSelecionar || !variacaoSelecionada) return;

    const { categoriaInfo } = produtoParaSelecionar;

    setProdutos(prevProdutos => {
      const produtoExistente = prevProdutos.find(p => 
        p.id === produtoParaSelecionar.id && 
        p.variacaoValor === variacaoSelecionada
      );

      if (produtoExistente) {
        return prevProdutos.map(p =>
          (p.id === produtoParaSelecionar.id && p.variacaoValor === variacaoSelecionada)
            ? { ...p, quantidade: p.quantidade + 1 }
            : p
        );
      } else {
        const novoProduto = {
          id: produtoParaSelecionar.id,
          nome: produtoParaSelecionar.nome,
          preco: produtoParaSelecionar.preco,
          quantidade: 1,
          imagem: produtoParaSelecionar.img,
          selecionado: true,
          categoria: produtoParaSelecionar.categoria,
          variacaoTipo: categoriaInfo.tipoEstoque,
          variacaoValor: variacaoSelecionada
        };
        return [...prevProdutos, novoProduto];
      }
    });

    fecharModalVariacao();
  };

  // --- 5. FUNÇÃO DE RESERVA (ATUALIZADA) ---
  const handleReservarProdutos = async () => {
    const produtosParaReservar = produtos.filter(p => p.selecionado);
    if (produtosParaReservar.length === 0) return;

    setReservaStatus({ loading: true, error: null });

    try {
      const produtoInvalido = produtosParaReservar.find(p => p.categoria && !p.variacaoTipo);
      if (produtoInvalido) {
        throw new Error(`O produto "${produtoInvalido.nome}" está em um formato antigo. Remova-o e adicione-o novamente.`);
      }

      // Mapeamos os produtos para promessas, mas interceptamos erros individuais para saber QUEM falhou
      const promessasDeReserva = produtosParaReservar.map(async (p) => {
        const payload = {
          produtoId: p.id,
          quantidade: p.quantidade,
          categoriaProduto: p.categoria
        };

        if (p.variacaoTipo === 'tamanho') {
          payload.tamanho = p.variacaoValor;
        } else if (p.variacaoTipo === 'sabor') {
          payload.sabor = p.variacaoValor;
        }

        try {
          // Tenta reservar este produto específico
          return await createReserva(payload);
        } catch (apiErr) {
          // Se falhar, lança um objeto com o contexto do produto + o erro original
          throw { isCustom: true, produto: p, error: apiErr };
        }
      });

      console.log("Enviando reservas...");
      await Promise.all(promessasDeReserva);

      setReservaStatus({ loading: false, error: null });

      const idsReservados = new Set(produtosParaReservar.map(p => `${p.id}-${p.variacaoValor}`));
      setProdutos(prevProdutos => 
        prevProdutos.filter(p => !idsReservados.has(`${p.id}-${p.variacaoValor}`))
      );
      
      toast.success('Produtos reservados com sucesso!', {
        className: 'custom-success-toast',
      });

      setTimeout(() => {
        navigate('/Reservas');
      }, 1000);

    } catch (err) {
      console.error("Erro ao reservar produtos:", err);
      
      let displayMsg = "";
      let rawMsg = "";
      let produtoNome = "";

      // Verifica se é o nosso erro "enriquecido" com os dados do produto
      if (err.isCustom) {
        produtoNome = err.produto.nome;
        rawMsg = err.error.message || JSON.stringify(err.error);
        
        // Tenta extrair mensagem limpa se for JSON
        try {
          const erroJson = JSON.parse(rawMsg);
          if (erroJson.categoriaProduto) rawMsg = erroJson.categoriaProduto;
          else if (erroJson.tamanho) rawMsg = erroJson.tamanho;
          else if (erroJson.sabor) rawMsg = erroJson.sabor;
        } catch (e) { /* não é json, segue a vida */ }

      } else {
        // Erro genérico (ex: validação inicial ou erro de rede geral)
        rawMsg = err.message || 'Falha ao reservar um ou mais produtos.';
      }

      // Lógica de Identificação de Estoque
      const match = rawMsg.match(/Disponível:\s*(\d+)/i);
      
      if (match) {
        const qtdDisponivel = parseInt(match[1], 10);
        
        if (qtdDisponivel === 0) {
          // CASO 1: Indisponível total
          displayMsg = `O produto ${produtoNome} está indisponível.`;
        } else {
          // CASO 2: Disponível parcial
          displayMsg = `Estoque insuficiente para ${produtoNome}. Apenas ${qtdDisponivel} disponível(is).`;
        }
      } else {
        // Fallback: Se não achar o padrão "Disponível: X", mostra o erro com o nome (se tiver) ou só o erro
        if (produtoNome) {
           displayMsg = `Erro em ${produtoNome}: ${rawMsg}`;
        } else {
           displayMsg = rawMsg;
        }
      }

      // Exibe no Toast
      toast.error(displayMsg, {
        className: 'custom-cancel-toast',
        progressClassName: 'custom-cancel-progress-bar'
      });

      setReservaStatus({ loading: false, error: displayMsg });
    }
  };


  // --- Funções de Gerenciamento do Carrinho ---

  const handleToggleTodos = () => {
    const allSelecionados = produtos.length > 0 && produtos.every((p) => p.selecionado);
    const atualizados = produtos.map((p) => ({ ...p, selecionado: !allSelecionados }));
    setProdutos(atualizados);
  };

  const toggleProduto = (id, variacao) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id && p.variacaoValor === variacao ? { ...p, selecionado: !p.selecionado } : p))
    );
  };

  const alterarQuantidade = (id, variacao, delta) => {
    setProdutos((prevProdutos) =>
      prevProdutos.reduce((acc, produto) => {
        if (produto.id === id && produto.variacaoValor === variacao) {
          const novaQuantidade = produto.quantidade + delta;
          if (novaQuantidade > 0) {
            acc.push({ ...produto, quantidade: novaQuantidade });
          }
        } else {
          acc.push(produto);
        }
        return acc;
      }, [])
    );
  };

  const excluirProduto = (id, variacao) => {
    setProdutos((prev) => prev.filter((p) => !(p.id === id && p.variacaoValor === variacao)));
  };
  
  const irParaLoja = () => navigate('/Loja');

  // --- Cálculos ---
  const total = produtos.filter(p => p.selecionado).reduce((acc, p) => acc + p.preco * p.quantidade, 0).toFixed(2);
  const selecionados = produtos.filter(p => p.selecionado).length;

  // --- 6. RENDERIZAÇÃO (JSX) ---

  const ModalSelecaoVariacao = () => {
    if (!produtoParaSelecionar) return null;
    
    const { nome, categoriaInfo, img } = produtoParaSelecionar;

    return (
      <div className="modalcarrinho-overlay">
        <div className="modalcarrinho-content">
          <img 
            src={fixImageUrl(img)}
            alt={nome} 
            className="modalcarrinho-imagem"
          />
          <h3>Selecione uma opção para:</h3>
          <h4>{nome}</h4>
          <div className="modalcarrinho-form-group">
            <label htmlFor="variacao">{categoriaInfo.tipoEstoque === 'tamanho' ? 'Tamanho' : 'Sabor'}:</label>
            <select
              id="variacao"
              value={variacaoSelecionada}
              onChange={(e) => setVariacaoSelecionada(e.target.value)}
            >
              {categoriaInfo.itens.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="modalcarrinho-buttons">
            <button className="modalcarrinho-btn-cancelar" onClick={fecharModalVariacao}>Cancelar</button>
            <button className="modalcarrinho-btn-confirmar" onClick={handleConfirmarVariacao}>Confirmar</button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const perfil = sessionStorage.getItem('userPerfil');
    if (perfil !== 'ALUNO') {
      navigate('/nao-autorizado');
      return;
    }
  }, [navigate]);

  return (
    <div className="carrinho-background">
      <ModalSelecaoVariacao />
      <Header />

      <div className="container-carrinho">
        <div className="carrinho-esquerda">
          
          {error && <p className="carrinho-aviso-erro">Erro: {error}</p>}

          {produtos.length > 0 ? (
            <div className="selecionar-todos">
              <input
                type="checkbox"
                checked={produtos.length > 0 && produtos.every((p) => p.selecionado)}
                onChange={handleToggleTodos}
              />
              <span>Todos os produtos</span>
            </div>
          ) : (
            !loading && !produtoParaSelecionar && (
              <div className="carrinho-vazio-box">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos da loja para vê-los aqui.</p>
                <button 
                  className="btn-continuar"
                  onClick={irParaLoja}
                >
                  Ver produtos
                </button>
              </div>
            )
          )}

          {produtos.map((produto) => (
            
            <div key={`${produto.id}-${produto.variacaoValor}`} className="carrinho-produto-card">
              
              <input
                type="checkbox"
                checked={produto.selecionado}
                onChange={() => toggleProduto(produto.id, produto.variacaoValor)}
              />
              <img src={fixImageUrl(produto.imagem)} alt={produto.nome} />
              
              <div className="detalhes-produto">
                <p>{produto.nome}</p>
                {produto.variacaoValor && (
                  <span className="detalhe-variacao">
                    {produto.variacaoTipo === 'tamanho' ? 'Tamanho:' : 'Sabor:'} {produto.variacaoValor}
                  </span>
                )}
              
              </div>
              <div className="quantidade">
                <button onClick={() => alterarQuantidade(produto.id, produto.variacaoValor, -1)}>-</button>
                <span>{produto.quantidade}</span>
                <button onClick={() => alterarQuantidade(produto.id, produto.variacaoValor, 1)}>+</button>
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

          {reservaStatus.loading && (
            <div className="carrinho-loading-inline">
              <div className="loading-spinner-inline"></div>
              <span>Reservando produtos...</span>
            </div>
          )}
          
          
          <button className="btn-continuar" onClick={irParaLoja}>
            Continuar comprando
          </button>
          
          <button 
            className="btn-reservar-carrinho" 
            disabled={selecionados === 0 || reservaStatus.loading || !!produtoParaSelecionar}
            onClick={handleReservarProdutos}
          >
            {reservaStatus.loading ? 'Reservando...' : 'Reservar produto'}
          </button>
        </div>
      </div>

      <ProdutosSection />
      <Footer />
      
      <ToastContainer position="top-right" autoClose={3000} />
      
    </div>
  );
};

export default Carrinho;