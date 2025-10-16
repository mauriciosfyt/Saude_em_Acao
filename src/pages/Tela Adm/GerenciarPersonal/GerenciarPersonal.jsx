import React from 'react';
import './GerenciarPersonal.css'; // O CSS correspondente com as classes novas
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { Link } from 'react-router-dom';

// Ícone de busca
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// Dados mockados
const personalData = [
{ id: 1, nome: 'Admin', email: 'Admin', funcao: 'Admin', status: 'Ativo' },
  { id: 2, nome: 'Bruno', email: 'Personal1@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 3, nome: 'Cleiton', email: 'Personal2@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 4, nome: 'Senai', email: 'Personal3@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 5, nome: 'Japa', email: 'Personal4@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 6, nome: 'Heleno', email: 'Personal5@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 7, nome: 'Maumau', email: 'Personal6@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 8, nome: 'PH', email: 'Personal7@gmail.com', funcao: 'Personal', status: 'Ativo' },
  { id: 9, nome: 'Renato', email: 'Personal8@gmail.com', funcao: 'Personal', status: 'Ativo' },
];

const GerenciarPersonal = () => {
  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      {/* --- ALTERAÇÃO: Classes renomeadas com prefixo 'personal-' --- */}
      <main className="personal-content-wrapper">
        <div className="personal-header">
          <h1 className="personal-title">Personal</h1>
          <div className="personal-search-container">
            <SearchIcon />
            <input className="personal-search-input" type="text" placeholder="Pesquisa" />
          </div>
          <Link to="/AdicionarPersonal" className="personal-add-button-link">
            <button className="personal-add-button">Novo Personal</button>
          </Link>
        </div>

        <table className="personal-table">
          <thead className="personal-thead">
            <tr>
              <th>Nome:</th>
              <th>Email</th>
              <th>Função</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody className="personal-tbody">
            {personalData.map(person => (
              <tr key={person.id}>
                <td>{person.nome}</td>
                <td>{person.email}</td>
                <td>{person.funcao}</td>
                <td>
                  <span className="personal-status-text">{person.status}</span>
                </td>
                <td>
                  <a href="#" className="personal-action-link-edit">Edit</a>
                  <a href="#" className="personal-action-link-delete">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default GerenciarPersonal;