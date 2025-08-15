import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Importe o ícone se for usar no botão
import PersonalCard from '../../../components/Administrador/GerenciarPersonal/PersonalCard';
import './GerenciarPersonal.css'; // Importa o CSS corrigido
import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";
import { Link } from 'react-router-dom';

const GerenciarPersonal = () => {
  const [professores, setProfessores] = useState([
    { id: 1, nome: 'Dr. João Silva', email: 'joao.silva@uni.com', numero: '99988-7766', senha: '' },
    { id: 2, nome: '', email: '', numero: '', senha: '' },
    { id: 3, nome: '', email: '', numero: '', senha: '' },
    { id: 4, nome: '', email: '', numero: '', senha: '' },
  ]);
  const [termoBusca, setTermoBusca] = useState('');

  const professoresFiltrados = professores.filter(p =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );
  
  const totalProfessores = professores.filter(p => p.nome).length;

  return (

    <>
     <AdminHeader />
   
    <div className="gerenciamento-container">
      <main className="gerenciamento-content">
        <h1>Gerenciamento de Professores</h1>
        
        <input
          type="text"
          className="search-bar"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Buscar"
        />

        <div className="header-actions">
          <div className="professor-count">
            Total de Professores: <strong>{totalProfessores}</strong>
          </div>
          <Link to={'/AdicionarPersonal'}>
          <button className="add-button">
            <FaPlus size={14} /> ADICIONAR
          </button>
          </Link>
        </div>

        <div className="professor-list">
          {professoresFiltrados.map((professor) => (
            <PersonalCard key={professor.id} professor={professor} />
          ))}
        </div>
      </main>
    </div>
      <Footer />
     </>
  );
};

export default GerenciarPersonal;