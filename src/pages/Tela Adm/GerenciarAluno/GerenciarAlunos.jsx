import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import './GerenciarAlunos.css';
import AlunoCard from '../../../components/Administrador/AlunoCard/AlunoCard'; // Ajuste o caminho conforme sua estrutura

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

// Dados de exemplo
const mockAlunos = [
  { id: 1, nome: 'Ana Beatriz Costa', email: 'ana.costa@email.com', cpf: '123.456.789-00', senha: '', numero: '(11) 98765-4321' },
  { id: 2, nome: 'Bruno Dias Lima', email: 'bruno.lima@email.com', cpf: '987.654.321-00', senha: '', numero: '(21) 91234-5678' },
  { id: 3, nome: 'Carla Martins', email: 'carla.martins@email.com', cpf: '456.789.123-00', senha: '', numero: '(31) 95555-4444' },
  { id: 4, nome: 'Daniel Fogaça', email: 'daniel.fogaca@email.com', cpf: '789.123.456-00', senha: '', numero: '(41) 93333-2222' },
];

const GerenciarAlunos = () => {
  const navigate = useNavigate();
  
  // Carregar alunos do localStorage ou usar dados mock
  const [alunos, setAlunos] = useState(() => {
    const savedAlunos = localStorage.getItem('alunos');
    return savedAlunos ? JSON.parse(savedAlunos) : mockAlunos;
  });
  
  const [termoBusca, setTermoBusca] = useState('');

  // Salvar alunos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('alunos', JSON.stringify(alunos));
  }, [alunos]);

  // Lógica de filtro (pode ser por nome ou email)
  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    aluno.email.toLowerCase().includes(termoBusca.toLowerCase())
  );
  
  // Funções de exemplo para os botões do card
  const handleExcluir = (alunoId) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      const alunosAtualizados = alunos.filter(aluno => aluno.id !== alunoId);
      setAlunos(alunosAtualizados);
      localStorage.setItem('alunos', JSON.stringify(alunosAtualizados));
      alert(`Aluno excluído com sucesso!`);
    }
  };

  const handleEditar = (alunoId) => {
    // Encontrar o aluno pelo ID
    const aluno = alunos.find(a => a.id === alunoId);
    if (aluno) {
      // Salvar dados do aluno no localStorage e navegar
      localStorage.setItem('alunoParaEditar', JSON.stringify(aluno));
      navigate('/EditarAluno');
    } else {
      alert('Aluno não encontrado.');
    }
  };

  const handleAdicionar = () => {
    navigate('/AdicionarAluno');
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

        <div className="header-actions">
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