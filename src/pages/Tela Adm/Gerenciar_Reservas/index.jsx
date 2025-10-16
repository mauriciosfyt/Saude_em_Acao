import React, { useState } from 'react';
import './GerenciarReservas.css'; // Aponta para o novo CSS

// Componentes e Ícones
import MenuAdm from '../../../components/MenuAdm/MenuAdm'; 
import { FaSearch } from "react-icons/fa";

// Mock de dados
const mockReservas = [
    { id: 1, nome: "Roberto Alves", produto: "Camiseta preta growth", quantidade: "3X", tamanho: "M", preco: "R$50,00", data: "01/01/2025", email: "roberto@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Efetuada" },
    { id: 2, nome: "Maria Inacia", produto: "Shake protein 15g", quantidade: "1X", tamanho: "G", preco: "R$10,50", data: "25/03/2025", email: "mariainacia@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/JzJ9zL1.png", status: "Efetuada" },
    { id: 3, nome: "Renato Garcia", produto: "Shorts preto growth", quantidade: "2X", tamanho: "P", preco: "R$75,00", data: "14/02/2025", email: "renatogarcia@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Cancelada" },
    { id: 4, nome: "Renato Garcia", produto: "Shorts preto growth", quantidade: "1X", tamanho: "G", preco: "R$100,00", data: "14/02/2025", email: "renatogarcia@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Cancelada" },
];

const GerenciarReservas = () => {
    const [reservas] = useState(mockReservas);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState('Todos'); // Estado para o filtro de status

    // Lógica de filtro combinada (status e depois pesquisa)
    const filteredReservas = reservas
        .filter(reserva => {
            if (statusFilter === 'Todos') {
                return true; // Se for 'Todos', não filtra por status
            }
            return reserva.status === statusFilter; // Filtra pelo status selecionado
        })
        .filter(reserva =>
            reserva.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reserva.produto.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div style={{ display: 'flex' }}>
            <MenuAdm />
            <main className="reservas-content-wrapper">
                {/* Cabeçalho */}
                <div className="reservas-header">
                    <h1 className="reservas-title">Histórico</h1>
                    <div className="reservas-search-container">
                        <FaSearch className="reservas-search-icon" />
                        <input
                            className="reservas-search-input"
                            type="text"
                            placeholder="Pesquisa por nome ou produto"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Botões de filtro de status */}
                    <div className="reservas-filter-group">
                        <button 
                            className={`filter-btn ${statusFilter === 'Todos' ? 'active' : ''}`} 
                            onClick={() => setStatusFilter('Todos')}>
                            Todos
                        </button>
                        <button 
                            className={`filter-btn ${statusFilter === 'Efetuada' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Efetuada')}>
                            Efetuadas
                        </button>
                        <button 
                            className={`filter-btn ${statusFilter === 'Cancelada' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Cancelada')}>
                            Canceladas
                        </button>
                    </div>
                </div>

                {/* Lista de Cards */}
                <div className="reservas-list">
                    {filteredReservas.length > 0 ? (
                        filteredReservas.map(reserva => (
                            <div key={reserva.id} className="reserva-card">
                                <img src={reserva.imagem} alt={reserva.produto} className="reserva-card-image" />
                                
                                <div className="reserva-card-info">
                                    <p><strong>Nome:</strong> {reserva.nome}</p>
                                    <p><strong>Produto:</strong> {reserva.produto}</p>
                                    <p><strong>Email:</strong> {reserva.email}</p>
                                    <p><strong>Telefone:</strong> {reserva.telefone}</p>
                                </div>

                                <div className="reserva-card-details">
                                    <p><strong>Status:</strong> <span className={`status-${reserva.status.toLowerCase()}`}>{reserva.status}</span></p>
                                    <p><strong>Quantidade:</strong> {reserva.quantidade}</p>
                                    <p><strong>Tamanho:</strong> {reserva.tamanho}</p>
                                </div>

                                <div className="reserva-card-actions">
                                    <p className="reserva-price">{reserva.preco}</p>
                                    <p className="reserva-date">Data: {reserva.data}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="nenhuma-reserva">Nenhuma reserva encontrada para os filtros aplicados.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GerenciarReservas;