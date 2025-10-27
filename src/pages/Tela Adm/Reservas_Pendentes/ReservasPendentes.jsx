import React, { useState, useEffect } from 'react'; // Importei o useEffect
import './ReservasPendentes.css'; // Aponta para o CSS com as classes renomeadas

// Componentes e Ícones
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";

// Mock de dados ATUALIZADO com as novas categorias
const mockReservasInicial = [
    { id: 1, nome: "Roberto Alves", produto: "Camiseta preta growth", categoria: "Camisetas", quantidade: "3X", tamanho: "M", preco: "R$50,00", data: "01/01/2025", email: "roberto@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Pendente" },
    { id: 4, nome: "Ana Souza", produto: "Legging fitness preta", categoria: "Camisetas", quantidade: "2X", tamanho: "M", preco: "R$70,00", data: "10/02/2025", email: "anasouza@gmail.com", telefone: "(11) 98765-4321", imagem: "https://i.imgur.com/JzJ9zL1.png", status: "Pendente" },
    { id: 3, nome: "Roberto Alves", produto: "Camiseta preta growth", categoria: "Camisetas", quantidade: "2X", tamanho: "G", preco: "R$150,00", data: "01/01/2025", email: "roberto@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Pendente" },
    { id: 5, nome: "Carlos Lima", produto: "Whey Protein 1kg", categoria: "Whey Protein", quantidade: "1X", tamanho: "N/A", preco: "R$120,00", data: "12/02/2025", email: "carlos@gmail.com", telefone: "(11) 99999-8888", imagem: "https://i.imgur.com/example.png", status: "Pendente" },
    { id: 6, nome: "Maria Oliveira", produto: "Creatina Monohidratada", categoria: "Creatina", quantidade: "1X", tamanho: "N/A", preco: "R$80,00", data: "15/02/2025", email: "maria@gmail.com", telefone: "(11) 77777-6666", imagem: "https://i.imgur.com/example2.png", status: "Pendente" }
];

const ReservasPendentes = () => {
    const [reservas, setReservas] = useState(mockReservasInicial);
    const [termoBusca, setTermoBusca] = useState('');
    const [categoria, setCategoria] = useState(''); // NOVO STATE
    const [reservasFiltradas, setReservasFiltradas] = useState([]); // NOVO STATE

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
                </div>


                <div className="reservas-pendente-list">
                    {/* Renderiza as reservas FILTRADAS */}
                    {reservasFiltradas.length > 0 ? (
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