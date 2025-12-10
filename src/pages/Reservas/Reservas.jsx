import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Importa seu serviço da API
import { fetchMinhasReservas, cancelarReserva } from '../../services/reservasService'; // Ajuste o caminho se necessário

// Importa o utilitário de imagem
import { fixImageUrl } from '../../utils/image'; // Ajuste o caminho se necessário

import BarraDeBusca from '../../components/BarraPesquisa/BarraDeBusca';
import './Reservas.css'; // Importa TODOS os estilos necessários para a página

import Footer from '../../components/footer';
import Header from '../../components/header_loja';

// A imagem estática que você usava (agora servirá como fallback)
import imagemUrlFallback from '../../assets/IMG PRODUTO.jpg';
import logoEmpresa from '../../assets/logo.png'; // Ajuste o caminho se necessário

// Imports do Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/Mensagem/Excluido.css'; // Seu CSS customizado para mensagens
import '../../components/Mensagem/Editado.css'; // Seu CSS customizado para mensagens de sucesso
import '../../components/Mensagem/Sucesso.css'; // Seu CSS customizado para mensagens de sucesso
import '../../components/Mensagem/Cancelado.css'; // Import do seu CSS de Cancelado

// Importação do Modal de Confirmação
import ModalConfirmacao from '../../components/ModalConfirmacao/ModalConfirmacao';

// == HELPER FUNCTIONS ==
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

const getStatusClassName = (status) => {
  switch (status) {
    case 'Em Análise': return 'status-em-analise';
    case 'Aprovado': return 'status-aprovado'; 
    case 'Retirado': return 'status-retirado'; 
    case 'Cancelado': return 'status-cancelado';
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
    case 'CONCLUIDA':
    case 'CONCLUIDO':
    case 'COMPLETED':
      return 'Retirado';
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

  // Estado para controlar a visibilidade do dropdown de filtro
  const [filtroAberto, setFiltroAberto] = useState(false);

  // Estados para controlar o Modal de Confirmação
  const [modalAberto, setModalAberto] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  // useEffect para travar o scroll da página quando o modal estiver aberto
  useEffect(() => {
    if (modalAberto) {
      // Trava o scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Libera o scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup: garante que o scroll seja liberado se o componente desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalAberto]);

  // useEffect para buscar os dados da API
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
  }, []); 

  // useMemo para processar e filtrar os dados da API
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

  }, [reservasApi, termoBusca, statusFiltro]); 

  // Lógica original para ordenar as datas
  const datasOrdenadas = Object.keys(pedidosProcessados).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));

  // Funções de clique
  const handleVerProduto = (produtoId) => {
    if (produtoId) {
      navigate(`/LojaProduto/${produtoId}`);
    } else {
      toast.error('ID do produto não encontrado.', {
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  const handleComprarNovamente = (produtoId) => {
    if (produtoId) {
      navigate(`/Carrinho?add=${produtoId}`);
    } else {
      toast.error('ID do produto não encontrado.', {
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Função para abrir o modal e salvar o ID
  const handleAbrirModalCancelamento = (reservaId) => {
    if (!reservaId) return toast.error('ID da reserva não encontrado.');
    setReservaSelecionada(reservaId);
    setModalAberto(true);
  };

  // Função para fechar o modal
  const handleFecharModal = () => {
    setModalAberto(false);
    setReservaSelecionada(null);
  };

  // Executa o cancelamento após confirmação no Modal
  const confirmarCancelamento = async () => {
    if (!reservaSelecionada) return;

    // 1. FECHA O MODAL IMEDIATAMENTE
    handleFecharModal();

    // 2. Toast de Carregando
    const idToast = toast.loading("Processando cancelamento...", { position: "top-right" });

    try {
      await cancelarReserva(reservaSelecionada);

      // 3. ATUALIZAÇÃO DO ESTADO CORRIGIDA
      // Usamos String() para garantir que a comparação de ID (que pode vir como número ou texto) funcione
      setReservasApi(prev => prev.map(r => {
        if (String(r?.id) === String(reservaSelecionada)) {
          return { ...r, status: 'CANCELADO' }; // Atualiza para o status que seu mapeador entende
        }
        return r;
      }));

      // 4. ATUALIZA o toast para SUCESSO
      toast.update(idToast, {
        render: "Reserva cancelada com sucesso.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        className: "custom-success-toast", 
        progressClassName: "Toastify__progress-bar--success",
        icon: true 
      });

    } catch (err) {
      console.error('Erro ao cancelar reserva:', err);
      
      // Se der erro, atualiza o toast para erro
      toast.update(idToast, {
        render: "Falha ao cancelar a reserva. Tente novamente.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
      });
    }
  };

  // Função para lidar com a seleção de filtro no dropdown
  const handleFiltroClick = (status) => {
    setStatusFiltro(status); 
    setFiltroAberto(false); 
  };

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

      {/* Modal de Confirmação */}
      <ModalConfirmacao 
        isOpen={modalAberto}
        onClose={handleFecharModal}
        onConfirm={confirmarCancelamento}
        title="Cancelar Reserva"
        message="Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita."
        logoSrc={logoEmpresa}
        confirmLabel="Sim, cancelar"
        cancelLabel="Voltar"
      />

      <div className="pagina-reservas">
        <main className="main-content">
          <div className="container-barra-busca">
            <BarraDeBusca
              valorBusca={termoBusca}
              aoAlterarValor={setTermoBusca}
              aoClicarFiltro={() => setFiltroAberto(prev => !prev)}
            />
            
            {filtroAberto && (
              <div className="reservas-filtro-dropdown">
                {filtrosStatus.map(status => (
                  <button
                    key={status}
                    className={`filtro-dropdown-item ${statusFiltro === status ? 'active' : ''}`}
                    onClick={() => handleFiltroClick(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="container-pedidos">
            {isLoading && ( 
              <div className="reservas-loading" style={{ padding: '80px 0' }}>
                <div className="loading-spinner"></div>
                <span>Carregando suas reservas...</span>
              </div>
            )}
            
            {error && <p className="erro-mensagem" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            
            {!isLoading && !error && datasOrdenadas.length === 0 && (
              <p style={{textAlign: 'center', margin: '2rem 0'}}>
                {(termoBusca || statusFiltro !== 'Todos')
                  ? 'Nenhuma reserva encontrada para os filtros aplicados.' 
                  : 'Você ainda não fez nenhuma reserva.'
                }
              </p>
            )}

            {!isLoading && !error && datasOrdenadas.map(data => (
              <section key={data} className="grupo-data">
                <header className="grupo-header">
                  <span className="data-label">{data}</span>
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
                        {(pedido.status === 'Em Análise' || pedido.status === 'Aprovado') && (
                          <button
                            className="botao-cancelar-reserva"
                            onClick={() => handleAbrirModalCancelamento(pedido.id)}
                          >
                            Cancelar reserva
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="container-promocional">
            {/* Cards promocionais */}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Reservas;