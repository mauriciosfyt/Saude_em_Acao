import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import PersonalCard from '../../../components/Administrador/GerenciarPersonal/PersonalCard';
import './GerenciarPersonal.css';
import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";
import { useNavigate } from 'react-router-dom';

const GerenciarPersonal = () => {
  const navigate = useNavigate();
  
  // Dados mock para personal
  const mockPersonal = [
    { id: 1, nome: 'Dr. João Silva', email: 'joao.silva@uni.com', cpf: '123.456.789-00', numero: '(11) 99988-7766', senha: '' },
    { id: 2, nome: 'Dra. Maria Santos', email: 'maria.santos@uni.com', cpf: '987.654.321-00', numero: '(21) 98877-6655', senha: '' },
    { id: 3, nome: 'Prof. Carlos Oliveira', email: 'carlos.oliveira@uni.com', cpf: '456.789.123-00', numero: '(31) 97766-5544', senha: '' },
    { id: 4, nome: 'Dra. Ana Costa', email: 'ana.costa@uni.com', cpf: '789.123.456-00', numero: '(41) 96655-4433', senha: '' },
  ];

  // Carregar personal do localStorage ou usar dados mock
  const [personal, setPersonal] = useState(() => {
    const savedPersonal = localStorage.getItem('personal');
    return savedPersonal ? JSON.parse(savedPersonal) : mockPersonal;
  });
  
  const [termoBusca, setTermoBusca] = useState('');

  // Salvar personal no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('personal', JSON.stringify(personal));
  }, [personal]);

  const personalFiltrados = personal.filter(p =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    p.email.toLowerCase().includes(termoBusca.toLowerCase())
  );
  
  const totalPersonal = personal.filter(p => p.nome).length;

  // Funções para os botões do card
  const handleExcluir = (personalId) => {
    if (window.confirm('Tem certeza que deseja excluir este personal?')) {
      const personalAtualizados = personal.filter(p => p.id !== personalId);
      setPersonal(personalAtualizados);
      localStorage.setItem('personal', JSON.stringify(personalAtualizados));
      alert('Personal excluído com sucesso!');
    }
  };

  const handleEditar = (personalId) => {
    // Encontrar o personal pelo ID
    const personalEncontrado = personal.find(p => p.id === personalId);
    if (personalEncontrado) {
      // Salvar dados do personal no localStorage e navegar
      localStorage.setItem('personalParaEditar', JSON.stringify(personalEncontrado));
      navigate('/EditarPersonal');
    } else {
      alert('Personal não encontrado.');
    }
  };

  const handleAdicionar = () => {
    navigate('/AdicionarPersonal');
  };

  return (

    <>
     <AdminHeader />
   
    <div className="gerenciamento-container">
      <main className="gerenciamento-content">
        <h1>Gerenciamento de Personal</h1>
        
        <div className="search-bar-wrapper-personal">
          <FaSearch className="search-icon-personal" />
          <input
            type="text"
            className="input-busca-personal"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar"
          />
        </div>

        <div className="header-actions">
          <div className="professor-count">
            TOTAL DE PERSONAL: <strong>{totalPersonal}</strong>
          </div>
          <button className="add-button" onClick={handleAdicionar}>
            <FaPlus size={14} /> ADICIONAR
          </button>
        </div>

        <div className="professor-list">
          {personalFiltrados.map((personal) => (
            <PersonalCard 
              key={personal.id} 
              personal={personal} 
              onExcluir={() => handleExcluir(personal.id)}
              onEditar={() => handleEditar(personal.id)}
            />
          ))}
        </div>
      </main>
    </div>
      <Footer />
     </>
  );
};

export default GerenciarPersonal;