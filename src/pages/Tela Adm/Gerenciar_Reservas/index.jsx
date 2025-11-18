import React, { useState, useEffect } from 'react';
import './GerenciarReservas.css';

import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";
import { setAuthToken } from '../../../services/api';
import { fetchReservas, fetchReservaStats, aprovarRetirada } from '../../../services/reservasService';
import { fixImageUrl } from '../../../utils/image';

const formatarData = (dataString) => {
    if (!dataString) return 'Data indisponível';
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return dataString;
        // Retorna apenas a data (sem hora)
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
    const [statusFilter, setStatusFilter] = useState('APROVADA'); // padrão: aprovadas
    const [processingId, setProcessingId] = useState(null); // id da reserva em processamento

    useEffect(() => {
        const carregarReservas = async () => {
            setLoading(true);
            setErro('');
            try {
                const token = sessionStorage.getItem('token');
                if (token) setAuthToken(token);

                // Busca estatísticas gerais
                const statsResp = await fetchReservaStats();
                setStats(statsResp);

                // Busca todas as reservas
                const listaResp = await fetchReservas({});
                const lista = Array.isArray(listaResp?.content)
                    ? listaResp.content
                    : Array.isArray(listaResp)
                    ? listaResp
                    : [];

                const normalizado = lista.map((r) => {
                    const produtoNome = r?.produto?.nome || r?.produtoNome || 'Produto';
                    const categoriaNome = r?.produto?.categoria || r?.categoria || '';
                    const imagemUrl = r?.produto?.img || r?.produto?.imagem || r?.img || r?.imagem || '';
                    const cliente = r?.usuario?.nome || r?.cliente || 'Cliente';
                    const email = r?.usuario?.email || r?.email || '';
                    const telefone = r?.usuario?.telefone || r?.telefone || '';
                    const quantidade = r?.quantidade ? `${r.quantidade}X` : '1X';
                    const tamanho = r?.tamanho || 'N/A';
                    const preco = r?.precoUnitario || r?.preco || '';
                    const data = r?.dataSolicitacao || r?.data || r?.criadoEm || r?.createdAt || new Date().toISOString();
                    const status = (r?.status || '').toUpperCase();

                    return {
                        id: r?.id || Math.random().toString(36).slice(2),
                        nome: cliente,
                        produto: produtoNome,
                        categoria: categoriaNome,
                        quantidade,
                        tamanho,
                        preco:
                            typeof preco === 'number'
                                ? preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                : String(preco || ''),
                        data,
                        email,
                        telefone,
                        imagem: imagemUrl,
                        status,
                    };
                });

                // Filtra apenas aprovadas e canceladas
                const filtradas = normalizado.filter(r =>
                    ['APROVADA', 'CANCELADA'].includes(r.status)
                );

                // Ordena por data decrescente (mais recentes primeiro)
                const time = (d) => {
                    const t = new Date(d).getTime();
                    return isNaN(t) ? 0 : t;
                };

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
            return r.status === statusFilter;
        })
        .filter(
            (r) =>
                r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.produto.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Marca uma reserva como RETIRADO via API e atualiza o estado com o retorno
        const handleMarcarRetirado = async (id) => {
            if (!window.confirm('Confirma marcar esta reserva como retirada?')) return;
            setProcessingId(id);
            try {
                const resp = await aprovarRetirada(id);
                // A API pode retornar o objeto atualizado ou texto; tentamos extrair o status
                const novoStatus = (resp?.status || 'RETIRADO').toString().toUpperCase();
                setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, status: novoStatus } : r)));
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
                <div className="reservas-header">
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

                {/* ======================= MODIFICAÇÃO AQUI ======================= */}
                {loading && (
                  <div className="personal-loading"> {/* Classe do GerenciarPersonal */}
                    <div className="loading-spinner"></div> {/* Spinner */}
                    Carregando histórico...
                  </div>
                )}
                
                {!!erro && !loading && (
                    <div className="personal-error" style={{ padding: '20px', textAlign: 'center' }}> {/* Estilo de erro similar */}
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
                                            <span className={`status-${reserva.status.toLowerCase()}`}>{reserva.status}</span>
                                        </p>
                                        <p><strong>Quantidade:</strong> {reserva.quantidade}</p>
                                        <p><strong>Tamanho:</strong> {reserva.tamanho}</p>
                                    </div>

                                    <div className="reserva-card-actions">
                                        <p className="reserva-price">{reserva.preco}</p>
                                        <p className="reserva-date">Data: {formatarData(reserva.data)}</p>

                                        {/* Botão de marcar como RETIRADO: exibir apenas para reservas aprovadas */}
                                        {reserva.status === 'APROVADA' ? (
                                            <button
                                                className="retirado-btn"
                                                onClick={() => handleMarcarRetirado(reserva.id)}
                                                disabled={processingId === reserva.id}
                                            >
                                                {processingId === reserva.id ? 'Processando...' : 'Retirado'}
                                            </button>
                                        ) : reserva.status === 'RETIRADO' ? (
                                            <span className="status-retirado">Retirado</span>
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
                {/* ================================================================ */}

            </main>
        </div>
    );
};

export default GerenciarReservas;