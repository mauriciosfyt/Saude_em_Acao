import React, { useState, useEffect } from 'react';
import './ReservasPendentes.css'; 

// Componentes e Ícones
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";
import { setAuthToken } from '../../../services/api';

// Funções de Ação
import { 
    fetchReservas, 
    fetchReservaStats, 
    aprovarReserva, 
    cancelarReserva 
} from '../../../services/reservasService';

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Sucesso.css'; // Estilo Verde (Aprovado)
import '../../../components/Mensagem/Cancelado.css'; // Estilo Vermelho (Cancelado)
import '../../../components/Mensagem/Excluido.css'; // Seu CSS customizado para mensagens
// -------------------------------

// Utils
import { fixImageUrl } from '../../../utils/image';

const formatarData = (dataString) => {
    if (!dataString) return 'Data indisponível';
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return dataString;
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(data);
    } catch (e) {
        return dataString;
    }
};

const ReservasPendentes = () => {
    const [reservas, setReservas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [stats, setStats] = useState(null);

    const handleStatusChange = async (id, acao, nomeProduto) => {
        const acaoNormalizada = acao.toUpperCase();
        
        // --- ALTERAÇÃO SOLICITADA: REMOÇÃO DA JANELA DE CONFIRMAÇÃO ---
        // Comentei a verificação abaixo para que a ação seja direta.
        /*
        const verboAcao = acaoNormalizada === 'APROVADO' ? 'APROVAR' : 'CANCELAR';
        if (!window.confirm(`Tem certeza que deseja ${verboAcao} a reserva do produto "${nomeProduto}"?`)) {
            return; 
        }
        */

        try {
            if (acaoNormalizada === 'APROVADO') {
                await aprovarReserva(id);
            } else if (acaoNormalizada === 'CANCELADA') {
                await cancelarReserva(id);
            } else {
                throw new Error(`Ação desconhecida: ${acaoNormalizada}`);
            }

            // Remove o item da lista visualmente
            setReservas(prevReservas =>
                prevReservas.filter(reserva => reserva.id !== id) 
            );
            
            // Atualiza stats em background
            fetchReservaStats().then(setStats); 

            // Exibe o Toast correspondente
            if (acaoNormalizada === 'APROVADO') {
                toast.success(`Produto ${nomeProduto} foi APROVADO!`, {
                    className: "custom-success-toast", 
                    progressClassName: "Toastify__progress-bar--success",
                    icon: true
                });
            } else {
                toast.error(`Produto ${nomeProduto} foi CANCELADO!`, {
                    className: "custom-cancel-toast",
                    progressClassName: "custom-cancel-progress-bar",
                    icon: true
                });
            }

        } catch (erro) {
            // Mantive apenas o erro no console caso algo crítico aconteça, mas removi logs desnecessários
            console.error(`Erro na ação ${acaoNormalizada}:`, erro);
            
            toast.error(`Falha ao processar a reserva: ${erro.message}`, {
                autoClose: 5000,
                className: "custom-error-toast",
                progressClassName: "custom-error-progress-bar",
            });
        }
    };

    useEffect(() => {
        let filtradas = reservas.filter(reserva => reserva.status === 'Pendente');
        if (termoBusca) {
            filtradas = filtradas.filter(reserva =>
                reserva.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                reserva.produto.toLowerCase().includes(termoBusca.toLowerCase())
            );
        }
        if (categoria) {
            filtradas = filtradas.filter(reserva => reserva.categoria === categoria);
        }
        setReservasFiltradas(filtradas);
    }, [termoBusca, categoria, reservas]); 

    useEffect(() => {
        const carregar = async () => {
            setLoading(true);
            setErro('');
            try {
                try {
                    const token = sessionStorage.getItem('token');
                    if (token) setAuthToken(token);
                } catch (_) {}

                const statsResp = await fetchReservaStats();
                setStats(statsResp);

                const listaResp = await fetchReservas({ status: 'PENDENTE' });
                
                // --- ALTERAÇÃO: Console.log de debug removido ---
                // console.log("LISTA A SER MAPEADA...", ...);

                const lista = Array.isArray(listaResp?.content) ? listaResp.content : (Array.isArray(listaResp) ? listaResp : []);

                const normalizado = lista.map((r) => {
                    const produtoNome = r?.produto?.nome || r?.produtoNome || r?.nome || 'Produto';
                    const categoriaNome = r?.produto?.categoria || r?.categoria || '';
                    const imagemUrl = r?.produto?.img || r?.produto?.imagem || r?.img || r?.imagem || '';
                    const cliente = r?.usuario?.nome || r?.cliente || r?.nomeUsuario || 'Cliente';
                    const email = r?.usuario?.email || r?.email || '';
                    const telefone = r?.usuario?.telefone || r?.telefone || '';
                    const quantidade = r?.quantidade ? `${r.quantidade}X` : '1X';
                    const tamanho = r?.tamanho || 'N/A';
                    const preco = r?.precoUnitario || r?.preco || '';
                    const data = r?.dataSolicitacao || r?.data || r?.criadoEm || r?.createdAt || new Date().toISOString();
                    const status = r?.status || 'Pendente';
                    
                    return {
                        id: r?.id || Math.random().toString(36).slice(2),
                        nome: cliente,
                        produto: produtoNome,
                        categoria: categoriaNome,
                        quantidade,
                        tamanho,
                        preco: typeof preco === 'number' ? preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : String(preco || ''),
                        data, 
                        email,
                        telefone,
                        imagem: imagemUrl, 
                        status: (status || '').charAt(0).toUpperCase() + (status || '').slice(1).toLowerCase(),
                    };
                });
                setReservas(normalizado);
            } catch (e) {
                const msg = typeof e === 'string' ? e : (e?.message || 'Erro ao carregar reservas.');
                setErro(msg);
                toast.error("Erro ao carregar lista de reservas." ,{
                    autoClose: 5000,
                    className: "custom-error-toast",
                    progressClassName: "custom-error-progress-bar",
                });
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <MenuAdm />
            <main className="reservas-pendente-content-wrapper">
                
                <div className="reservas-pendente-header">
                    <h1 className="reservas-pendente-title">Reservas</h1>
                    <div className="reservas-pendente-search-container">
                        <FaSearch style={{ color: '#6c757d', fontSize: '16px' }} />
                        <input
                            className="reservas-pendente-search-input"
                            type="text"
                            placeholder="Pesquisar nome do usuário"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </div>
                    <select 
                        className="reservas-pendente-filter-select" 
                        value={categoria} 
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">Todas Categorias</option>
                        <option value="CAMISETAS">Camisetas</option>
                        <option value="WHEY_PROTEIN">Whey Protein</option>
                        <option value="CREATINA">Creatina</option>
                        <option value="VITAMINAS">Vitaminas</option>
                    </select>
                    {stats && (
                        <div style={{ position: 'absolute', right: 30, top: 8, display: 'flex', gap: 12, color: '#475569', fontSize: 14 }}>
                            {stats.pendentes != null && <span>Pendentes: {Number(stats.pendentes).toLocaleString('pt-BR')}</span>}
                            {stats.aprovadas != null && <span>Aprovadas: {Number(stats.aprovadas).toLocaleString('pt-BR')}</span>}
                            {stats.rejeitadas != null && <span>Rejeitadas: {Number(stats.rejeitadas).toLocaleString('pt-BR')}</span>}
                        </div>
                    )}
                </div>

                <div className="reservas-pendente-list">
                    
                    {loading && (
                      <div className="personal-loading">
                        <div className="loading-spinner"></div>
                        Carregando reservas...
                      </div>
                    )}
                    
                    {!!erro && !loading && (
                        <div className="personal-error" style={{ padding: '20px', textAlign: 'center' }}>
                            <strong>Erro:</strong> {erro}
                        </div>
                    )}
                    
                    {!loading && !erro && reservasFiltradas.length > 0 ? (
                        reservasFiltradas.map(reserva => (
                            <div key={reserva.id} className="reservas-pendente-card">
                                
                                <img 
                                    src={fixImageUrl(reserva.imagem)} 
                                    alt={reserva.produto} 
                                    className="reservas-pendente-card-img" 
                                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/f0f0f0/ccc?text=Sem+Img'; }}
                                />
                                
                                <div className="reservas-pendente-card-info">
                                    <p><strong>{reserva.produto}</strong></p>
                                    <p>Cliente: {reserva.nome}</p>
                                    <p>Email: {reserva.email}</p>
                                    <p>Telefone: {reserva.telefone}</p>
                                </div>

                                <div className="reservas-pendente-card-details">
                                    <p><strong>Status:</strong> <span className="status-pendente">{reserva.status}</span></p>
                                    <p><strong>Quantidade:</strong> {reserva.quantidade}</p>
                                    <p><strong>Tamanho:</strong> {reserva.tamanho}</p>
                                </div>

                                <div className="reservas-pendente-card-actions">
                                    <p className="reservas-pendente-price">{reserva.preco}</p>
                                    <p className="reservas-pendente-date">
                                        Data: {formatarData(reserva.data)}
                                    </p>

                                    <div className="reservas-pendente-buttons">
                                        <button className="btn-cancelar" onClick={() => handleStatusChange(reserva.id, 'CANCELADA', reserva.produto)}>CANCELAR</button>
                                        <button className="btn-aprovar" onClick={() => handleStatusChange(reserva.id, 'APROVADO', reserva.produto)}>APROVAR</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && !erro && <p className="reservas-pendente-nenhuma-reserva">Nenhuma reserva pendente encontrada.</p>
                    )}
                </div>

                <ToastContainer position="top-right" autoClose={3000} />

            </main>
        </div>
    );
};

export default ReservasPendentes;