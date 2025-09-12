import React, { useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import "./ReservasEfetuadas.css";
import HeaderAdmin from "../../../components/header_admin";

// Importando imagens específicas
import camiseta from "../../../assets/IMG PRODUTO.jpg";
import shake from "../../../assets/IMG PRODUTO.jpg";
import shorts from "../../../assets/IMG PRODUTO.jpg";
import Footer from "../../../components/footer";

export default function ReservasEfetuadas() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [reservas, setReservas] = useState([
  {
    id: 1,
    nome: "Roberto Alves",
    produto: "Camiseta preta growth",
    quantidade: "3X",
    tamanho: "M",
    preco: "R$50,00",
    data: "01/01/2025",
    email: "roberto@gmail.com",
    telefone: "(11) 12345-6789",
    imagem: camiseta,
  },
  {
    id: 2,
    nome: "Maria Inacia",
    produto: "Shake protein 15g",
    quantidade: "1X",
    tamanho: "G",
    preco: "R$10,50",
    data: "25/03/2025",
    email: "mariainacia@gmail.com",
    telefone: "(11) 12345-6789",
    imagem: shake,
  },
  {
    id: 3,
    nome: "Renato Garcia",
    produto: "Shorts preto growth",
    quantidade: "2X",
    tamanho: "P",
    preco: "R$55,00",
    data: "01/11/2025",
    email: "garciarenato@gmail.com",
    telefone: "(11) 12345-6789",
    imagem: shorts,
  },
  {
    id: 4,
    nome: "Ana Souza",
    produto: "Legging fitness preta",
    quantidade: "2X",
    tamanho: "M",
    preco: "R$70,00",
    data: "10/02/2025",
    email: "anasouza@gmail.com",
    telefone: "(11) 98765-4321",
    imagem: shorts,
  },
  {
    id: 5,
    nome: "Carlos Mendes",
    produto: "Camiseta branca",
    quantidade: "1X",
    tamanho: "G",
    preco: "R$45,00",
    data: "15/03/2025",
    email: "carlosmendes@gmail.com",
    telefone: "(11) 91234-5678",
    imagem: camiseta,
  },
  {
    id: 6,
    nome: "Juliana Lima",
    produto: "Shake chocolate 20g",
    quantidade: "3X",
    tamanho: "P",
    preco: "R$12,50",
    data: "20/04/2025",
    email: "julianalima@gmail.com",
    telefone: "(11) 99876-5432",
    imagem: shake,
  },
  {
    id: 7,
    nome: "Felipe Rocha",
    produto: "Bermuda azul",
    quantidade: "2X",
    tamanho: "M",
    preco: "R$60,00",
    data: "05/05/2025",
    email: "feliperocha@gmail.com",
    telefone: "(11) 92345-6789",
    imagem: shorts,
  }
]);

  // Handlers para os botões
  const handleCancelar = (reservaId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      const reservasAtualizadas = reservas.filter(reserva => reserva.id !== reservaId);
      setReservas(reservasAtualizadas);
      
      // Mostrar notificação de cancelamento
      setShowToast(true);
      setToastMessage('Reserva cancelada com sucesso!');
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleAprovar = (reservaId) => {
    if (window.confirm('Tem certeza que deseja aprovar esta reserva?')) {
      const reservasAtualizadas = reservas.filter(reserva => reserva.id !== reservaId);
      setReservas(reservasAtualizadas);
      
      // Mostrar notificação de aprovação
      setShowToast(true);
      setToastMessage('Reserva aprovada com sucesso!');
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
  
    <div >
     
     <HeaderAdmin/>
      <main className="content">
        <h1 className="titulo">RESERVAS EFETUADAS</h1>
        
        {showToast && (
          <div className="modal-termos-notification">
            {toastMessage}
          </div>
        )}

        {/* Barra de pesquisa */}
        <div className="barra-pesquisa">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Buscar" />
        </div>

        {/* Lista de reservas */}
        <div className="lista-reservas">
          {reservas.map((reserva) => (
            <div className="reserva-item" key={reserva.id}>
              <img src={reserva.imagem} alt={reserva.produto} className="produto-img" />

              <div className="reserva-info">
             
                <p className="nome">Nome: {reserva.nome}</p>

                <p>Produto: {reserva.produto}</p>

                <p>Email: {reserva.email}</p>

                <p>Telefone: {reserva.telefone}</p>
              </div>

              <div className="reserva-detalhes">
            
                <p className="quantidade">Quantidade: {reserva.quantidade}</p>

                <p className="tamanho">Tamanho: {reserva.tamanho}</p>
              </div>
              <div className="reserva-preco">
                <p className="preco-reserva">{reserva.preco}</p>
                <p className="data">Data: {reserva.data}</p>

                <div className="botoes">
                  <button className="btn-cancelar" onClick={() => handleCancelar(reserva.id)}>CANCELAR</button>
                  <button className="btn-aprovar" onClick={() => handleAprovar(reserva.id)}>APROVAR</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
