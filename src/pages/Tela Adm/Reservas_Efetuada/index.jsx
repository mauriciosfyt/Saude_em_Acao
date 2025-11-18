// 1. Importe o FaFilter junto com o FaSearch
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa"; // <-- MUDANÇA AQUI
import "./ReservasEfetuadas.css";
import HeaderAdmin from "../../../components/header_admin";
import { aprovarRetirada } from '../../../services/reservasService';

// Importando imagens específicas
import camiseta from "../../../assets/IMG PRODUTO.jpg";
import shake from "../../../assets/IMG PRODUTO.jpg";
import shorts from "../../../assets/IMG PRODUTO.jpg";
import Footer from "../../../components/footer";

const mockReservas = [
    { id: 1, nome: "Roberto Alves", produto: "Camiseta preta growth", quantidade: "3X", tamanho: "M", preco: "R$50,00", data: "01/01/2025", email: "roberto@gmail.com", telefone: "(11) 12345-6789", imagem: camiseta, status: "Pendente" },
    { id: 2, nome: "Maria Inacia", produto: "Shake protein 15g", quantidade: "1X", tamanho: "G", preco: "R$10,50", data: "25/03/2025", email: "mariainacia@gmail.com", telefone: "(11) 12345-6789", imagem: shake, status: "Efetuada" },
    { id: 3, nome: "Renato Garcia", produto: "Shorts preto growth", quantidade: "2X", tamanho: "P", preco: "R$55,00", data: "01/11/2025", email: "garciarenato@gmail.com", telefone: "(11) 12345-6789", imagem: shorts, status: "Cancelada" },
    { id: 4, nome: "Ana Souza", produto: "Legging fitness preta", quantidade: "2X", tamanho: "M", preco: "R$70,00", data: "10/02/2025", email: "anasouza@gmail.com", telefone: "(11) 98765-4321", imagem: shorts, status: "Pendente" },
    { id: 5, nome: "Carlos Mendes", produto: "Camiseta branca", quantidade: "1X", tamanho: "G", preco: "R$45,00", data: "15/03/2025", email: "carlosmendes@gmail.com", telefone: "(11) 91234-5678", imagem: camiseta, status: "Efetuada" }
];

export default function ReservasEfetuadas() {
  const [reservas, setReservas] = useState(mockReservas);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const handleStatusChange = (reservaId, novoStatus, mensagem) => {
    if (window.confirm(`Tem certeza que deseja ${mensagem.toLowerCase()} esta reserva?`)) {
      setReservas(reservas.map(reserva =>
        reserva.id === reservaId ? { ...reserva, status: novoStatus } : reserva
      ));
      setShowToast(true);
      setToastMessage(`Reserva ${mensagem.toLowerCase()} com sucesso!`);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // Chama a rota /reservas/{id}/concluir para marcar retirada
  const handleMarcarRetirado = async (reservaId) => {
    if (!window.confirm('Confirma marcar esta reserva como retirada?')) return;
    setProcessingId(reservaId);
    try {
      const resp = await aprovarRetirada(reservaId);
      const novoStatus = resp?.status || 'Retirado';
      setReservas((prev) => prev.map(r => r.id === reservaId ? { ...r, status: novoStatus } : r));
      setShowToast(true);
      setToastMessage('Reserva marcada como retirada.');
      setTimeout(() => setShowToast(false), 2000);
    } catch (e) {
      console.error('Erro ao marcar retirada:', e);
      alert('Erro ao marcar como retirado: ' + (e?.message || e));
    } finally {
      setProcessingId(null);
    }
  };

  const reservasFiltradas = reservas.filter(reserva => {
    const condicaoStatus = filtroStatus === '' || reserva.status === filtroStatus;
    const condicaoBusca = termoBusca === '' ||
                          reserva.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                          reserva.produto.toLowerCase().includes(termoBusca.toLowerCase());
    return condicaoStatus && condicaoBusca;
  });

  // Ordena reservas filtradas por data decrescente (mais recentes primeiro)
  const ordenarPorDataDesc = (arr) => {
    const time = (d) => {
      const t = new Date(d).getTime();
      return isNaN(t) ? 0 : t;
    };
    return arr.slice().sort((a, b) => time(b.data) - time(a.data));
  };

  return (
    <div>
      <HeaderAdmin />
      <main className="content">
        <h1 className="titulo">RESERVAS</h1>

        {showToast && (
          <div className="modal-termos-notification">{toastMessage}</div>
        )}

        <div className="barra-acoes">
            <div className="barra-pesquisa">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou produto..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                />
            </div>

            {/* 2. Container para o filtro e o ícone */}
            <div className="container-filtro">
                <FaFilter className="filtro-icon" /> {/* <-- ÍCONE ADICIONADO */}
                <select
                    className="filtro-reservas"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                >
                    <option value="">Todas as Reservas</option>
                    <option value="Pendente">Pendentes</option>
                    <option value="Efetuada">Efetuadas</option>
                    <option value="Cancelada">Canceladas</option>
                </select>
            </div>
        </div>

        <div className="lista-reservas">
          {ordenarPorDataDesc(reservasFiltradas).map((reserva) => (
            <div className="reserva-item" key={reserva.id}>
              <img src={reserva.imagem} alt={reserva.produto} className="produto-img" />

              <div className="reserva-info">
                <p className="nome">Nome: {reserva.nome}</p>
                <p>Produto: {reserva.produto}</p>
                <p>Email: {reserva.email}</p>
                <p>Telefone: {reserva.telefone}</p>
              </div>

              <div className="reserva-detalhes">
                <p className="status"><strong>Status: <span className={`status-${reserva.status.toLowerCase()}`}>{reserva.status}</span></strong></p>
                <p className="quantidade">Quantidade: {reserva.quantidade}</p>
                <p className="tamanho">Tamanho: {reserva.tamanho}</p>
              </div>

              <div className="reserva-preco">
                <p className="preco-reserva">{reserva.preco}</p>
                <p className="data">Data: {reserva.data}</p>

                <div className="botoes">
                  {reserva.status === 'Pendente' && (
                    <>
                      <button className="btn-cancelar" onClick={() => handleStatusChange(reserva.id, 'Cancelada', 'Cancelar')}>CANCELAR</button>
                      <button className="btn-aprovar" onClick={() => handleStatusChange(reserva.id, 'Efetuada', 'Aprovar')}>APROVAR</button>
                    </>
                  )}

                  {/* Botão 'Retirado' apenas para reservas já efetuadas/aprovadas */}
                  {(reserva.status.toLowerCase() === 'efetuada' || reserva.status.toLowerCase() === 'aprovada') && (
                    <>
                      <button
                        className="btn-retirado"
                        onClick={() => handleMarcarRetirado(reserva.id)}
                        disabled={processingId === reserva.id}
                      >
                        {processingId === reserva.id ? 'Processando...' : 'Retirado'}
                      </button>
                    </>
                  )}
                  {/* Rótulo estático caso já esteja retirado/concluído */}
                  {(reserva.status.toLowerCase().includes('retir') || reserva.status.toLowerCase().includes('concl')) && (
                    <span className="status-retirado">Retirado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}