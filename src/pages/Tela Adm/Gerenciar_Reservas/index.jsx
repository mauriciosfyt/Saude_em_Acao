import React, { useState, useEffect } from 'react';
import './GerenciarReservas.css';

import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";
import { setAuthToken } from '../../../services/api';
import { fetchReservas, fetchReservaStats, aprovarRetirada } from '../../../services/reservasService';
import { getProdutoById, updateProduto } from '../../../services/produtoService';
import { fixImageUrl } from '../../../utils/image';

// --- ALTERAÇÃO 1: Importações do Toastify e do seu CSS personalizado ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Sucesso.css'; 
// -----------------------------------------------------------------------

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
    } catch {
        return dataString;
    }
};

const GerenciarReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('APROVADA'); 
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const carregarReservas = async () => {
            setLoading(true);
            setErro('');
            try {
                const token = sessionStorage.getItem('token');
                if (token) setAuthToken(token);

                const statsResp = await fetchReservaStats();
                setStats(statsResp);

                const listaResp = await fetchReservas({});
                const lista = Array.isArray(listaResp?.content) ? listaResp.content : Array.isArray(listaResp) ? listaResp : [];

                const normalizado = lista.map((r) => {
                    const produtoObj = r?.produto || {};
                    const produtoId = produtoObj.id || r.produtoId || null;
                    const produtoNome = produtoObj.nome || r.produtoNome || 'Produto';
                    
                    const usuarioObj = r?.usuario || {};
                    const cliente = usuarioObj.nome || r.cliente || 'Cliente';
                    const email = usuarioObj.email || r.email || '';
                    const telefone = usuarioObj.telefone || r.telefone || '';
                    
                    const quantidadeNum = r?.quantidade || 1;
                    const quantidade = `${quantidadeNum}X`;
                    
                    const tamanho = r?.tamanho || 'N/A';
                    const sabor = r?.sabor || 'N/A';

                    const preco = r?.precoUnitario || r?.preco || '';
                    const data = r?.dataSolicitacao || r?.data || r?.criadoEm || r?.createdAt || new Date().toISOString();
                    const status = (r?.status || '').toUpperCase();

                    return {
                        id: r?.id || Math.random().toString(36).slice(2),
                        produtoId,
                        nome: cliente,
                        produto: produtoNome,
                        categoria: r.categoria || produtoObj.categoria || '',
                        quantidade,
                        quantidadeNum,
                        tamanho,
                        sabor,
                        preco: typeof preco === 'number' ? preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : String(preco || ''),
                        data,
                        email,
                        telefone,
                        imagem: produtoObj.img || produtoObj.imagem || r.img || r.imagem || '',
                        status,
                    };
                });

                const filtradas = normalizado.filter(r =>
                    ['APROVADA', 'CANCELADA', 'CONCLUIDA', 'RETIRADO'].includes(r.status)
                );

                const time = (d) => { const t = new Date(d).getTime(); return isNaN(t) ? 0 : t; };
                const ordenadas = filtradas.sort((a, b) => time(b.data) - time(a.data));

                setReservas(ordenadas);
            } catch (e) {
                const msg = e?.message || 'Erro ao carregar reservas.';
                setErro(msg);
            } finally {
                setLoading(false);
            }
        };
        carregarReservas();
    }, []);

    const filteredReservas = reservas
        .filter((r) => {
            if (statusFilter === 'Todos') return true;
            if (statusFilter === 'CONCLUIDA') {
                return r.status === 'CONCLUIDA' || r.status === 'RETIRADO';
            }
            return r.status === statusFilter;
        })
        .filter((r) =>
            r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.produto.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // --- FUNÇÃO CORRIGIDA PARA USAR FORMDATA ---
    const handleMarcarRetirado = async (id) => {
        const reservaAtual = reservas.find(r => r.id === id);
        if (!reservaAtual) return;

        if (!window.confirm(`Confirmar retirada de "${reservaAtual.produto}"?\nO estoque será reduzido em ${reservaAtual.quantidadeNum} unidade(s).`)) return;
        
        setProcessingId(id);

        try {
            // 1. Atualiza Status da Reserva
            const resp = await aprovarRetirada(id);
            
            // 2. Atualiza Estoque do Produto
            if (reservaAtual.produtoId) {
                try {
                    const produtoDados = await getProdutoById(reservaAtual.produtoId);
                    
                    const estoqueAtual = parseInt(produtoDados.quantidade || produtoDados.estoque || 0);
                    const qtdRetirada = parseInt(reservaAtual.quantidadeNum || 1);
                    let novoEstoque = estoqueAtual - qtdRetirada;
                    if (novoEstoque < 0) novoEstoque = 0;

                    // --- CORREÇÃO: Criar FormData ao invés de JSON ---
                    // Como o backend rejeita JSON, empacotamos os dados como se fosse um formulário
                    const formData = new FormData();
                    formData.append('nome', produtoDados.nome || '');
                    formData.append('preco', produtoDados.preco || 0);
                    formData.append('categoria', produtoDados.categoria || '');
                    formData.append('descricao', produtoDados.descricao || '');
                    formData.append('quantidade', novoEstoque); // Novo estoque
                    // formData.append('estoque', novoEstoque); // Descomente se seu backend usar 'estoque' e não 'quantidade'
                    
                    // IMPORTANTE: Não enviamos o campo 'img' se não houver nova imagem, 
                    // pois enviar string (URL) onde espera arquivo pode quebrar.
                    
                    await updateProduto(reservaAtual.produtoId, formData);
                    console.log(`Estoque atualizado via FormData: ${estoqueAtual} -> ${novoEstoque}`);

                } catch (stockError) {
                    console.error("Erro ao atualizar estoque:", stockError);
                    // Exibe mensagem amigável sem travar o fluxo
                    alert(`A reserva foi marcada como concluída, mas houve um erro ao atualizar o estoque: ${stockError.message}`);
                }
            } else {
                console.warn("ID do produto não encontrado na reserva.");
            }

            // 3. Atualiza Interface
            const statusDaApi = (resp?.status || '').toUpperCase();
            const novoStatus = (statusDaApi === 'RETIRADO' || statusDaApi === 'CONCLUIDA') 
                               ? statusDaApi 
                               : 'CONCLUIDA';

            setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, status: novoStatus } : r)));

            // --- ALTERAÇÃO 2: Disparo do Toast de Sucesso usando sua classe CSS ---
            toast.success(`Retirada de ${reservaAtual.produto} CONFIRMADA!`, {
                className: "custom-success-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // ----------------------------------------------------------------------

        } catch (error) {
            console.error('Erro ao aprovar retirada:', error);
            alert('Erro ao marcar como retirado: ' + (error?.message || error));
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <MenuAdm />
            <main className="reservas-content-wrapper">
                
                <div className="reservas-header" style={{ gap: '20px' }}>
                    <h1 className="reservas-title">Histórico</h1>

                    <div className="reservas-search-container">
                        <FaSearch className="reservas-search-icon" />
                        <input
                            className="reservas-search-input"
                            type="text"
                            placeholder="Pesquisar nome do usuário"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="reservas-filter-group">
                        <button
                            className={`filter-btn ${statusFilter === 'Todos' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Todos')}
                        >
                            Todos
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'APROVADA' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('APROVADA')}
                        >
                            Aprovadas
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'CANCELADA' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('CANCELADA')}
                        >
                            Canceladas
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'CONCLUIDA' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('CONCLUIDA')}
                        >
                            Retirado
                        </button>
                    </div>

                    {stats && (
                        <div style={{ position: 'absolute', right: 30, top: 8, display: 'flex', gap: 12, color: '#475569', fontSize: 14 }}>
                            {stats.aprovadas != null && (
                                <span>Aprovadas: {Number(stats.aprovadas).toLocaleString('pt-BR')}</span>
                            )}
                            {stats.canceladas != null && (
                                <span>Canceladas: {Number(stats.canceladas).toLocaleString('pt-BR')}</span>
                            )}
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="personal-loading">
                        <div className="loading-spinner"></div>
                        Carregando histórico...
                    </div>
                )}

                {!!erro && !loading && (
                    <div className="personal-error" style={{ padding: '20px', textAlign: 'center' }}>
                        <strong>Erro:</strong> {erro}
                    </div>
                )}

                {!loading && !erro && (
                    <div className="reservas-list">
                        {filteredReservas.length > 0 ? (
                            filteredReservas.map((reserva) => (
                                <div key={reserva.id} className="reserva-card">
                                    <img
                                        src={fixImageUrl(reserva.imagem)}
                                        alt={reserva.produto}
                                        className="reserva-card-image"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/100x100/f0f0f0/ccc?text=Sem+Img';
                                        }}
                                    />

                                    <div className="reserva-card-info">
                                        <p><strong>Nome:</strong> {reserva.nome}</p>
                                        <p><strong>Produto:</strong> {reserva.produto}</p>
                                        <p><strong>Email:</strong> {reserva.email}</p>
                                        <p><strong>Telefone:</strong> {reserva.telefone}</p>
                                    </div>

                                    <div className="reserva-card-details">
                                        <p>
                                            <strong>Status:</strong>{' '}
                                            <span className={`status-${(reserva.status === 'RETIRADO' ? 'CONCLUIDA' : reserva.status).toLowerCase()}`}>
                                                {reserva.status === 'RETIRADO' ? 'CONCLUÍDA' : reserva.status}
                                            </span>
                                        </p>
                                        <p><strong>Quantidade:</strong> {reserva.quantidade}</p>
                                        <p><strong>Tamanho:</strong> {reserva.tamanho}</p>
                                        <p><strong>Sabor:</strong> {reserva.sabor}</p>
                                    </div>

                                    <div className="reserva-card-actions">
                                        <p className="reserva-price">{reserva.preco}</p>
                                        <p className="reserva-date">Data: {formatarData(reserva.data)}</p>

                                        {reserva.status === 'APROVADA' ? (
                                            <button
                                                className="retirado-btn"
                                                onClick={() => handleMarcarRetirado(reserva.id)}
                                                disabled={processingId === reserva.id}
                                            >
                                                {processingId === reserva.id ? 'Processando...' : 'Retirado'}
                                            </button>
                                        ) : (reserva.status === 'CONCLUIDA' || reserva.status === 'RETIRADO') ? (
                                            <span className="status-concluida">Concluída</span>
                                        ) : null}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="nenhuma-reserva">
                                Nenhuma reserva encontrada para os filtros aplicados.
                            </p>
                        )}
                    </div>
                )}
                
                {/* --- ALTERAÇÃO 3: Componente ToastContainer para renderizar os alertas --- */}
                <ToastContainer />
            </main>
        </div>
    );
};

export default GerenciarReservas;