import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Importa seu serviço da API
import { fetchMinhasReservas } from '../../services/reservasService'; // Ajuste o caminho se necessário

// Importa o utilitário de imagem
import { fixImageUrl } from '../../utils/image'; // Ajuste o caminho se necessário

import BarraDeBusca from '../../components/BarraPesquisa/BarraDeBusca';
import './Reservas.css'; // Importa TODOS os estilos necessários para a página

import Footer from '../../components/footer';
import Header from '../../components/header_loja';

// A imagem estática que você usava (agora servirá como fallback)
import imagemUrlFallback from '../../assets/IMG PRODUTO.jpg';

// Imports do Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/Mensagem/Excluido.css'; // Seu CSS customizado para mensagens
import '../../components/Mensagem/Editado.css'; // Seu CSS customizado para mensagens de sucesso

// == HELPER FUNCTIONS ==
// (Funções de formatarDataParaDia, mapearStatusUI, getStatusClassName e agruparPedidosPorData - mantidas como antes)
// ---
const agruparPedidosPorData = (pedidos) => {
  return pedidos.reduce((acc, pedido) => {
    const data = pedido.data;
    if (!acc[data]) acc[data] = [];
    acc[data].push(pedido);
    return acc;
  }, {});
};

const formatarDataParaDia = (isoString) => {
  if (!isoString) return 'Data Indefinida';
  try {
    const data = new Date(isoString);
    const dataAjustada = new Date(data.valueOf() + data.getTimezoneOffset() * 60000);
    return dataAjustada.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
  } catch (e) {
    return 'Data Inválida';
  }
};
// --- Em Reservas.jsx ---

const getStatusClassName = (status) => {
  switch (status) {
    case 'Em Análise': return 'status-em-analise';
    case 'Aprovado': return 'status-aprovado'; 
    case 'Retirado': return 'status-retirado'; 
    case 'Cancelado': return 'status-cancelado';
    // ADICIONE ESTA LINHA:
    case 'Concluida': return 'status-concluida'; 
    default: return '';
  }
};

const mapearStatusUI = (apiStatus) => {
  switch (String(apiStatus).toUpperCase()) {
    case 'PENDENTE':
    case 'EM_ANALISE':
      return 'Em Análise';
    case 'APROVADA': 
    case 'APROVADO':
      return 'Aprovado';
    case 'RETIRADO':
      return 'Retirado';
    // ADICIONE ESTE BLOCO:
    case 'CONCLUIDA':
    case 'CONCLUIDO':
    case 'COMPLETED':
      return 'Retirado';
    // -------------------
    case 'CANCELADA': 
    case 'CANCELADO':
    case 'REJEITADO':
      return 'Cancelado';
    default:
      return apiStatus; 
  }
};

// == COMPONENTE PRINCIPAL ==

const Reservas = () => {
  const navigate = useNavigate();
  // Estados para dados da API, carregamento e erros
  const [reservasApi, setReservasApi] = useState([]); // Dados brutos da API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado da barra de busca
  const [termoBusca, setTermoBusca] = useState('');
  
  // Estado para o filtro de status
  const [statusFiltro, setStatusFiltro] = useState('Todos'); // 'Todos' é o padrão

  // NOVO: Estado para controlar a visibilidade do dropdown de filtro
  const [filtroAberto, setFiltroAberto] = useState(false);

  // useEffect para buscar os dados da API (sem alteração)
  useEffect(() => {
    const carregarReservas = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMinhasReservas(); // Chama a API do usuário
        const lista = Array.isArray(data?.content) 
          ? data.content 
          : Array.isArray(data) 
          ? data 
          : [];
        setReservasApi(lista);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar minhas reservas:", err);
        setError(err.message || 'Falha ao carregar suas reservas.');
      } finally {
        setIsLoading(false);
      }
    };

    carregarReservas();
  }, []); // O array vazio [] faz com que rode apenas uma vez

  // useMemo para processar e filtrar os dados da API (lógica interna sem alteração)
  const pedidosProcessados = useMemo(() => {
    // 1. Normalizar dados
    const pedidosFormatados = reservasApi.map(r => {
      const produtoNome = r?.produto?.nome || r?.produtoNome || 'Produto indisponível';
      const imagem = r?.produto?.img || r?.produto?.imagem || r?.img || r?.imagem || '';
      const dataApi = r?.dataReserva || r?.dataSolicitacao || r?.data || r?.criadoEm || r?.createdAt;
      const statusApi = (r?.status || '').toUpperCase();
      const produtoId = r?.produto?.id;

      return {
        id: r?.id || Math.random(), 
        data: formatarDataParaDia(dataApi), 
        nome: produtoNome,
        status: mapearStatusUI(statusApi), 
        produtoId: produtoId,
        imagemUrl: imagem, 
      };
    });

    // 2. Filtrar
    const pedidosFiltrados = pedidosFormatados.filter(p => {
      const matchBusca = p.nome.toLowerCase().includes(termoBusca.toLowerCase());
      const matchStatus = (statusFiltro === 'Todos') || (p.status === statusFiltro);
      return matchBusca && matchStatus; 
    });

    // 3. Agrupar
    return agruparPedidosPorData(pedidosFiltrados);

  }, [reservasApi, termoBusca, statusFiltro]); // Dependências corretas

  // Lógica original para ordenar as datas
  const datasOrdenadas = Object.keys(pedidosProcessados).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));

  // Funções de clique (sem alteração)
  const handleVerProduto = (produtoId) => {
    if (produtoId) {
      navigate(`/produto/${produtoId}`);
    } else {

      toast.error('ID do produto não encontrado.', {
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  const handleComprarNovamente = (produtoId) => {

    toast.info(`(WIP) Adicionar produto ${produtoId} ao carrinho.`, {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "custom-edit-toast",
      progressClassName: "custom-edit-progress-bar",
    });
  };

  // NOVO: Função para lidar com a seleção de filtro no dropdown
  const handleFiltroClick = (status) => {
    setStatusFiltro(status); // Define o filtro
    setFiltroAberto(false); // Fecha o dropdown
  };

  // Lista de filtros a serem exibidos no dropdown
  const filtrosStatus = ['Todos', 'Em Análise', 'Aprovado', 'Retirado', 'Cancelado'];

  useEffect(() => {
    const perfil = sessionStorage.getItem('userPerfil');
    if (perfil !== 'ALUNO') {
      navigate('/nao-autorizado');
      return;
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Header />

      <div className="pagina-reservas">
        <main className="main-content">
          <div className="container-barra-busca">
            <BarraDeBusca
              valorBusca={termoBusca}
              aoAlterarValor={setTermoBusca}
              // ATUALIZADO: Agora abre/fecha o dropdown
              aoClicarFiltro={() => setFiltroAberto(prev => !prev)}
            />
            
            {/* NOVO: Dropdown de Filtro (condicional) */}
            {filtroAberto && (
              <div className="reservas-filtro-dropdown">
                {filtrosStatus.map(status => (
                  <button
                    key={status}
                    // ATUALIZADO: Mostra qual item está ativo
                    className={`filtro-dropdown-item ${statusFiltro === status ? 'active' : ''}`}
                    onClick={() => handleFiltroClick(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* REMOVIDO: O container antigo .reservas-filtro-container foi removido daqui */}

          <div className="container-pedidos">
            {/* Feedback de Carregamento e Erro */}

{isLoading && ( 
  <div className="reservas-loading" style={{ padding: '80px 0' }}>
    <div className="loading-spinner"></div>
    <span>Carregando suas reservas...</span>
  </div>
)}
            {error && <p className="erro-mensagem" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            
            {/* Mensagem de 'nenhum pedido' agora considera os filtros */}
            {!isLoading && !error && datasOrdenadas.length === 0 && (
              <p style={{textAlign: 'center', margin: '2rem 0'}}>
                {(termoBusca || statusFiltro !== 'Todos')
                  ? 'Nenhuma reserva encontrada para os filtros aplicados.' 
                  : 'Você ainda não fez nenhuma reserva.'
                }
              </p>
            )}

            {/* Renderização dos pedidos (sem alteração) */}
            {!isLoading && !error && datasOrdenadas.map(data => (
              <section key={data} className="grupo-data">
                <header className="grupo-header">
                  <span className="data-label">{data}</span>
                  <button className="botao-adicionar-todos">Adicionar todos ao carrinho</button>
                </header>
                
                <div className="lista-de-itens">
                  {pedidosProcessados[data].map(pedido => (
                    <div key={pedido.id} className="pedido-card">
                      
                      <img 
                        src={fixImageUrl(pedido.imagemUrl)} 
                        alt={pedido.nome} 
                        className="pedido-imagem" 
                        onError={(e) => { e.target.src = imagemUrlFallback; }}
                      /> 
                      
                      <div className="pedido-info">
                        <span className={`pedido-status ${getStatusClassName(pedido.status)}`}>
                          {pedido.status}
                        </span>
                        <p className="pedido-nome">{pedido.nome}</p>
                      </div>
                      <div className="pedido-acoes">
                        <button 
                          className="botao-ver-produto"
                          onClick={() => handleVerProduto(pedido.produtoId)}
                        >
                          Ver produto
                        </button>
                        <button 
                          className="botao-comprar-novamente"
                          onClick={() => handleComprarNovamente(pedido.produtoId)}
                        >
                          Comprar novamente
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Seção promocional (Mantida intacta) */}
          <div className="container-promocional">
            {/* ...código dos cards promocionais... */}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Reservas;