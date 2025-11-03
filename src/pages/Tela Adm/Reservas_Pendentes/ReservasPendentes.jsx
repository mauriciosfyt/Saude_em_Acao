import React, { useState, useEffect } from 'react'; // Importei o useEffect
import './ReservasPendentes.css'; // Aponta para o CSS com as classes renomeadas

// Componentes e Ícones
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";
import { setAuthToken } from '../../../services/api';
import { fetchReservas, fetchReservaStats } from '../../../services/reservasService';

// Estado inicial vazio; dados virão da API

const ReservasPendentes = () => {
    const [reservas, setReservas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [categoria, setCategoria] = useState(''); // NOVO STATE
    const [reservasFiltradas, setReservasFiltradas] = useState([]); // NOVO STATE
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [stats, setStats] = useState(null);

    const handleStatusChange = (id, novoStatus) => {
        setReservas(prevReservas =>
            prevReservas.map(reserva =>
                reserva.id === id ? { ...reserva, status: novoStatus } : reserva
            )
        );
    };

    // NOVO USEEFFECT PARA FILTRAGEM DUPLA
    useEffect(() => {
        let filtradas = reservas.filter(reserva => reserva.status === 'Pendente');

        // Filtro por Termo de Busca
        if (termoBusca) {
            filtradas = filtradas.filter(reserva =>
                reserva.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                reserva.produto.toLowerCase().includes(termoBusca.toLowerCase())
            );
        }

        // Filtro por Categoria
        if (categoria) {
            filtradas = filtradas.filter(reserva => reserva.categoria === categoria);
        }

        setReservasFiltradas(filtradas);
    }, [termoBusca, categoria, reservas]); // Dependências atualizadas

    // Carrega dados reais da API: stats e lista de reservas pendentes
    useEffect(() => {
        const carregar = async () => {
            setLoading(true);
            setErro('');
            try {
                // Fail-safe: configura Authorization a partir do sessionStorage
                try {
                    const token = sessionStorage.getItem('token');
                    if (token) setAuthToken(token);
                } catch (_) {}

                // Estatísticas gerais de reservas (pendentes, aprovadas, etc.)
                const statsResp = await fetchReservaStats();
                setStats(statsResp);

                // Lista de reservas pendentes
                const listaResp = await fetchReservas({ status: 'PENDENTE' });
                const lista = Array.isArray(listaResp?.content) ? listaResp.content : (Array.isArray(listaResp) ? listaResp : []);

                // Normaliza itens para o formato do componente
                const normalizado = lista.map((r) => {
                    const produtoNome = r?.produto?.nome || r?.produtoNome || r?.nome || 'Produto';
                    const categoriaNome = r?.produto?.categoria || r?.categoria || '';
                    const imagemUrl = r?.produto?.imagem || r?.imagem || '';
                    const cliente = r?.usuario?.nome || r?.cliente || r?.nomeUsuario || 'Cliente';
                    const email = r?.usuario?.email || r?.email || '';
                    const telefone = r?.usuario?.telefone || r?.telefone || '';
                    const quantidade = r?.quantidade ? `${r.quantidade}X` : '1X';
                    const tamanho = r?.tamanho || 'N/A';
                    const preco = r?.precoUnitario || r?.preco || '';
                    const data = r?.data || r?.criadoEm || r?.createdAt || '';
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

    return (
        <div style={{ display: 'flex' }}>
            <MenuAdm />
            <main className="reservas-pendente-content-wrapper">
                
                <div className="reservas-pendente-header">
                    <h1 className="reservas-pendente-title">Reservas</h1>

                    {/* Barra de pesquisa (permanece centralizada) */}
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
                    
                    {/* NOVO SELECT DE CATEGORIA (adicionado ao final) */}
                    <select 
                        className="reservas-pendente-filter-select" 
                        value={categoria} 
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">Todas Categorias</option>
                        <option value="Camisetas">Camisetas</option>
                        <option value="Whey Protein">Whey Protein</option>
                        <option value="Creatina">Creatina</option>
                        <option value="Vitaminas">Vitaminas</option>
                    </select>
                    {/* Exibe contadores básicos das stats, se disponíveis */}
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
                        <p className="reservas-pendente-nenhuma-reserva">Carregando reservas...</p>
                    )}
                    {!!erro && !loading && (
                        <p className="reservas-pendente-nenhuma-reserva">{erro}</p>
                    )}
                    {/* Renderiza as reservas FILTRADAS */}
                    {!loading && !erro && reservasFiltradas.length > 0 ? (
                        reservasFiltradas.map(reserva => (
                            <div key={reserva.id} className="reservas-pendente-card">
                                <img src={reserva.imagem} alt={reserva.produto} className="reservas-pendente-card-img" />
                                
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
                                    <p className="reservas-pendente-date">Data: {reserva.data}</p>
                                    <div className="reservas-pendente-buttons">
                                        <button className="btn-cancelar" onClick={() => handleStatusChange(reserva.id, 'Cancelada')}>CANCELAR</button>
                                        <button className="btn-aprovar" onClick={() => handleStatusChange(reserva.id, 'Efetuada')}>APROVAR</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="reservas-pendente-nenhuma-reserva">Nenhuma reserva pendente encontrada.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReservasPendentes;