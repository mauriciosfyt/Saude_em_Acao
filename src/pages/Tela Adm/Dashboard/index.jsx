import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaBoxes, FaWarehouse, FaCalendarCheck, FaChartLine } from 'react-icons/fa';

import './Dashboard.css';
import StatCard from '../../../components/Administrador/Dasboard/StatCard';
import TabelaProdutosVendidos from '../../../components/Administrador/Dasboard/TabelaProdutosVendidos'; 

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

// Dados mockados para a tabela
const mockProdutos = [
  { id: 1, nome: 'Regata Branca Growth', vendidos: 70, estoque: 20, reservados: 43 },
  { id: 2, nome: 'Camiseta Preta Growth', vendidos: 50, estoque: 32, reservados: 32 },
  { id: 3, nome: 'Whey Protein 1(Kg)', vendidos: 30, estoque: 50, reservados: 24 },
];

const Dashboard = () => {
  return (
    <>
     <AdminHeader />

    <div className="dashboard-container">
      {/* O bloco branco central */}
      <main className="dashboard-content">
        <h1>Dashboard</h1>
        
        {/* Seção dos cards de estatísticas */}
        <section className="stats-grid">
          <StatCard icon={<FaUserGraduate />} title="Alunos" value="120" />
          <StatCard icon={<FaWarehouse />} title="Estoque" value="135" />
          <StatCard icon={<FaChalkboardTeacher />} title="Professores" value="16" />
          <StatCard icon={<FaCalendarCheck />} title="Reservas" value="49" />
          <StatCard icon={<FaBoxes />} title="Produtos Ativo" value="30" />
          <StatCard icon={<FaChartLine />} title="Vendas (Total)" value="110" />
        </section>

        {/* Seção da tabela */}
        <section className="tabela-section">
          <h2>Produtos mais vendidos</h2>
          <TabelaProdutosVendidos produtos={mockProdutos} />
        </section>
      </main>
    </div>
     <Footer />
  </>
  );
};

export default Dashboard;