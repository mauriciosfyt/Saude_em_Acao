import React, { useState, useEffect } from 'react';
import './ReservasPendentes.css'; 

// Componentes e Ícones
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";
import { setAuthToken } from '../../../services/api';

// --- (MODIFICADO) Importa as funções de Ação corretas ---
import { 
    fetchReservas, 
    fetchReservaStats, 
    aprovarReserva, 
    cancelarReserva 
} from '../../../services/reservasService';
// (Note que não importamos 'rejeitarReserva' porque não há um botão para isso)

// --- (EXISTENTE) Importar o fixImageUrl ---
import { fixImageUrl } from '../../../utils/image';

// --- (EXISTENTE) Função para formatar a data ---
const formatarData = (dataString) => {
    if (!dataString) return 'Data indisponível';
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return dataString; 
        
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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

    // --- (MODIFICADO) handleStatusChange agora usa as funções da API ---
    // <-- MODIFICADO: Adicionado 'nomeProduto' como parâmetro
    const handleStatusChange = async (id, acao, nomeProduto) => {
        // Pega a ação (APROVADO ou CANCELADA) e confirma
        const acaoNormalizada = acao.toUpperCase();
        
        // <-- NOVO: Define o verbo (Aprovar/Cancelar) para a confirmação
        const verboAcao = acaoNormalizada === 'APROVADO' ? 'APROVAR' : 'CANCELAR';

        // <-- MODIFICADO: Mensagem de confirmação usa o nome do produto
        if (!window.confirm(`Tem certeza que deseja ${verboAcao} a reserva do produto "${nomeProduto}"?`)) {
            return; // Usuário cancelou
        }

        try {
            // 1. Chama a função de API correta basedo na 'acao'
            if (acaoNormalizada === 'APROVADO') {
                await aprovarReserva(id);
            } else if (acaoNormalizada === 'CANCELADA') {
                await cancelarReserva(id);
            } else {
                throw new Error(`Ação desconhecida: ${acaoNormalizada}`);
            }

            // 2. Se a API funcionou, remove o item da lista (pois não está mais pendente)
            setReservas(prevReservas =>
                prevReservas.filter(reserva => reserva.id !== id) 
            );
            
            // 3. Atualiza os contadores de stats
            fetchReservaStats().then(setStats); 

            // <-- NOVO: Define o status (Aprovada/Cancelada) para o alerta de sucesso
            const statusFinal = acaoNormalizada === 'APROVADO' ? 'APROVADA' : 'CANCELADA';

            // <-- MODIFICADO: Mensagem de sucesso usa o nome do produto
            alert(`A reserva do produto "${nomeProduto}" foi ${statusFinal} com sucesso!`);

        } catch (erro) {
            // 4. Se a API falhar, mostra o erro e NÃO muda nada na tela
            console.error(`Erro ao ${acaoNormalizada} reserva ${id} (${nomeProduto}):`, erro);
            // <-- MODIFICADO: Mensagem de falha também usa o nome
            alert(`Falha ao ${verboAcao.toLowerCase()} a reserva para "${nomeProduto}": ${erro.message}`);
        }
    };

    // useEffect de filtragem (sem alteração)
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

    // useEffect de carregamento (sem alteração, mas importante)
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
                
                // --- DEBUG (Se data/imagem falharem, verifique o console F12) ---
                console.log("LISTA A SER MAPEADA (lista):", JSON.stringify(listaResp?.content || listaResp, null, 2));

                const lista = Array.isArray(listaResp?.content) ? listaResp.content : (Array.isArray(listaResp) ? listaResp : []);

                const normalizado = lista.map((r) => {
                    // (Ajuste estes campos se os nomes no console.log forem diferentes)
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
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, []);

    // JSX (com as correções de imagem/data e os novos botões)
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
                    
                    {/* ======================= MODIFICAÇÃO AQUI ======================= */}
                    {loading && (
                      <div className="personal-loading"> {/* Classe do GerenciarPersonal */}
                        <div className="loading-spinner"></div> {/* Spinner */}
                        Carregando reservas...
                      </div>
                    )}
                    
                    {!!erro && !loading && (
                        <div className="personal-error" style={{ padding: '20px', textAlign: 'center' }}> {/* Estilo de erro similar */}
                            <strong>Erro:</strong> {erro}
                        </div>
                    )}
                    {/* ================================================================ */}
                    
                    
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

                                    {/* --- (MODIFICADO) Botões com os status corretos --- */}
                                    <div className="reservas-pendente-buttons">
                                        {/* <-- MODIFICADO: Passando 'reserva.produto' */}
                                        <button className="btn-cancelar" onClick={() => handleStatusChange(reserva.id, 'CANCELADA', reserva.produto)}>CANCELAR</button>
                                        {/* <-- MODIFICADO: Passando 'reserva.produto' */}
                                        <button className="btn-aprovar" onClick={() => handleStatusChange(reserva.id, 'APROVADO', reserva.produto)}>APROVAR</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && !erro && <p className="reservas-pendente-nenhuma-reserva">Nenhuma reserva pendente encontrada.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReservasPendentes;