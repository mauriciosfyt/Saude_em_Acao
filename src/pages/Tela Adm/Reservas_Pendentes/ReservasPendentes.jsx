import React, { useState } from 'react';
import './ReservasPendentes.css'; // Aponta para o CSS com as classes renomeadas

// Componentes e Ícones
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { FaSearch } from "react-icons/fa";

// Mock de dados
const mockReservasInicial = [
    { id: 1, nome: "Roberto Alves", produto: "Camiseta preta growth", quantidade: "3X", tamanho: "M", preco: "R$50,00", data: "01/01/2025", email: "roberto@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Pendente" },
    { id: 4, nome: "Ana Souza", produto: "Legging fitness preta", quantidade: "2X", tamanho: "M", preco: "R$70,00", data: "10/02/2025", email: "anasouza@gmail.com", telefone: "(11) 98765-4321", imagem: "https://i.imgur.com/JzJ9zL1.png", status: "Pendente" },
    { id: 3, nome: "Roberto Alves", produto: "Camiseta preta growth", quantidade: "2X", tamanho: "G", preco: "R$150,00", data: "01/01/2025", email: "roberto@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/8L4m5p3.png", status: "Pendente" },
    { id: 5, nome: "Ana Souza", produto: "Legging fitness preta", quantidade: "1X", tamanho: "P", preco: "R$40,00", data: "10/02/2025", email: "anasouza@gmail.com", telefone: "(11) 98765-4321", imagem: "https://i.imgur.com/JzJ9zL1.png", status: "Pendente" },
    { id: 2, nome: "Maria Inacia", produto: "Shake protein 15g", quantidade: "1X", tamanho: "G", preco: "R$10,50", data: "25/03/2025", email: "mariainacia@gmail.com", telefone: "(11) 12345-6789", imagem: "https://i.imgur.com/JzJ9zL1.png", status: "Efetuada" },
];

const ReservasPendentes = () => {
    const [reservas, setReservas] = useState(mockReservasInicial);
    const [searchTerm, setSearchTerm] = useState("");

    const handleStatusChange = (reservaId, novoStatus) => {
        const acao = novoStatus === 'Efetuada' ? 'aprovar' : 'cancelar';
        if (window.confirm(`Tem certeza que deseja ${acao} esta reserva?`)) {
            setReservas(prevReservas =>
                prevReservas.map(reserva =>
                    reserva.id === reservaId ? { ...reserva, status: novoStatus } : reserva
                )
            );
        }
    };

    const filteredReservas = reservas
        .filter(reserva => reserva.status === 'Pendente')
        .filter(reserva =>
            reserva.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reserva.produto.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div style={{ display: 'flex' }}>
            <MenuAdm />
            <main className="reservas-pendente-content-wrapper">
                {/* Cabeçalho */}
                <div className="reservas-pendente-header">
                    <h1 className="reservas-pendente-title">Reservas Pendentes</h1>
                    <div className="reservas-pendente-search-container">
                        <FaSearch className="reservas-pendente-search-icon" />
                        <input
                            className="reservas-pendente-search-input"
                            type="text"
                            placeholder="Buscar em pendentes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Lista de Cards */}
                <div className="reservas-pendente-list">
                    {filteredReservas.length > 0 ? (
                        filteredReservas.map(reserva => (
                            <div key={reserva.id} className="reservas-pendente-card">
                                <img src={reserva.imagem} alt={reserva.produto} className="reservas-pendente-card-image" />
                                
                                <div className="reservas-pendente-card-info">
                                    <p><strong>Nome:</strong> {reserva.nome}</p>
                                    <p><strong>Produto:</strong> {reserva.produto}</p>
                                    <p><strong>Email:</strong> {reserva.email}</p>
                                    <p><strong>Telefone:</strong> {reserva.telefone}</p>
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