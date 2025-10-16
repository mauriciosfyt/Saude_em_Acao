import React from 'react';
import './GerenciarAlunos.css'; // O CSS correspondente com as classes novas
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ModalGerenciarTreino from './ModalGerenciarTreino';

// Ícone de busca
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// Dados mockados
const alunosData = [
 { id: 1, nome: 'Pedro', email: 'Aluno0@gmail.com', funcao: 'Aluno' },
  { id: 2, nome: 'Bruno', email: 'Aluno1@gmail.com', funcao: 'Aluno' },
  { id: 3, nome: 'Cleiton', email: 'Aluno2@gmail.com', funcao: 'Aluno' },
  { id: 4, nome: 'Senai', email: 'Aluno3@gmail.com', funcao: 'Aluno' },
  { id: 5, nome: 'Japa', email: 'Aluno4@gmail.com', funcao: 'Aluno' },
  { id: 6, nome: 'Heleno', email: 'Aluno5@gmail.com', funcao: 'Aluno' },
  { id: 7, nome: 'Maumau', email: 'Aluno6@gmail.com', funcao: 'Aluno' },
  { id: 8, nome: 'PH', email: 'Aluno7@gmail.com', funcao: 'Aluno' },
  { id: 9, nome: 'Renato', email: 'Aluno8@gmail.com', funcao: 'Aluno' },
];

const GerenciarAlunos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [selectedTreinos, setSelectedTreinos] = useState({});

  const handleOpenModal = (aluno) => {
    setSelectedAluno(aluno);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAluno(null);
  };

  // Recebe o treino escolhido no modal e salva por aluno
  const handleChooseTreino = (treino) => {
    if (!selectedAluno) return;
    setSelectedTreinos(prev => ({ ...prev, [selectedAluno.id]: treino }));
    // fechar é tratado por onClose do modal também
    setModalOpen(false);
    setSelectedAluno(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      {/* --- ALTERAÇÃO: Classes renomeadas com prefixo 'alunos-' --- */}
      <main className="alunos-content-wrapper">
        <div className="alunos-header">
          <h1 className="alunos-title">Alunos</h1>
          <div className="alunos-search-container">
            <SearchIcon />
            <input className="alunos-search-input" type="text" placeholder="Pesquisa" />
          </div>
          <Link to="/AdicionarAluno" className="alunos-add-button-link">
            <button className="alunos-add-button">Novo Aluno</button>
          </Link>
        </div>

        <table className="alunos-table">
          <thead className="alunos-thead">
            <tr>
              <th>Nome:</th>
              <th>Email</th>
              <th>Função</th>
              <th>Treino</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody className="alunos-tbody">
            {alunosData.map(aluno => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.funcao}</td>
                <td>
                  <button
                    className="alunos-treino-link"
                    onClick={(e) => { e.preventDefault(); handleOpenModal(aluno); }}
                    aria-label={`Gerenciar treino de ${aluno.nome}`}
                  >
                    Gerenciar
                  </button>
                  {selectedTreinos[aluno.id] && (
                    <div className="treino-chosen" title={`Treino escolhido: ${selectedTreinos[aluno.id].title}`}>
                      <span className="treino-dot" aria-hidden="true" />
                      <span className="treino-title">{selectedTreinos[aluno.id].title}</span>
                    </div>
                  )}
                </td>
                <td>
                  <a href="#" className="alunos-action-link-edit">Edit</a>
                  <a href="#" className="alunos-action-link-delete">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {/* Modal renderizado aqui para ficar sobre a tela */}
  <ModalGerenciarTreino open={modalOpen} onClose={handleCloseModal} aluno={selectedAluno} onChoose={handleChooseTreino} />
    </div>
  );
};

export default GerenciarAlunos;