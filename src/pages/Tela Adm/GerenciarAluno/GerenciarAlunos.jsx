import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import './GerenciarAlunos.css';
import AlunoCard from '../../../components/Administrador/AlunoCard/AlunoCard'; // Ajuste o caminho conforme sua estrutura

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

// Dados de exemplo
const mockAlunos = [
  { id: 1, nome: 'Ana Beatriz Costa', email: 'ana.costa@email.com', senha: '', numero: '(11) 98765-4321' },
  { id: 2, nome: 'Bruno Dias Lima', email: 'bruno.lima@email.com', senha: '', numero: '(21) 91234-5678' },
  { id: 3, nome: 'Carla Martins', email: 'carla.martins@email.com', senha: '', numero: '(31) 95555-4444' },
  { id: 4, nome: 'Daniel Fogaça', email: 'daniel.fogaca@email.com', senha: '', numero: '(41) 93333-2222' },
];

const GerenciarAlunos = () => {
  const [alunos, setAlunos] = useState(mockAlunos);
  const [termoBusca, setTermoBusca] = useState('');

  // Lógica de filtro (pode ser por nome ou email)
  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    aluno.email.toLowerCase().includes(termoBusca.toLowerCase())
  );
  
  // Funções de exemplo para os botões do card
  const handleExcluir = (alunoId) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setAlunos(alunos.filter(aluno => aluno.id !== alunoId));
      alert(`Aluno com ID ${alunoId} excluído!`);
    }
  };

  const handleEditar = (alunoId) => {
    alert(`Implementar edição para o aluno com ID ${alunoId}.`);
  };

  const handleAdicionar = () => {
    alert('Implementar tela para adicionar novo aluno.');
  };

  return (
    <>
      <AdminHeader />
    <div className="alunos-container">
      <main className="alunos-content">
        <h1>Gerenciamento de alunos</h1>
        
        <div className="search-bar-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="input-busca"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar"
          />
        </div>

        <div className="header-actions_aluno">
          <div className="count-display">
            TOTAL DE ALUNOS: <strong>{alunos.length}</strong>
          </div>
          <button className="add-button" onClick={handleAdicionar}>
            <FaPlus size={14} /> ADICIONAR
          </button>
        </div>

        <div className="aluno-list">
          {alunosFiltrados.map((aluno) => (
            <AlunoCard 
              key={aluno.id} 
              aluno={aluno} 
              onExcluir={() => handleExcluir(aluno.id)}
              onEditar={() => handleEditar(aluno.id)}
            />
          ))}
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
};

export default GerenciarAlunos;