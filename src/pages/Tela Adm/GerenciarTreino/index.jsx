import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GerenciarTreino.css';
import AdminHeader from '../../../components/header_admin';
import Footer from '../../../components/footer';

const GerenciarTreino = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alunoId = searchParams.get('alunoId');
  
  const [aluno, setAluno] = useState({
    nome: "Arthur Heleno",
    cpf: "123456-78910",
    email: "helenocosta@gmail.com",
    foto: "/src/assets/icones/icone Perfil 100x100.png" // Usando uma imagem existente como placeholder
  });

  useEffect(() => {
    if (alunoId) {
      // Aqui você pode fazer uma chamada para a API para buscar os dados do aluno
      // Por enquanto, vamos simular com dados mockados
      console.log('Carregando dados do aluno ID:', alunoId);
      
      // Simulação de dados diferentes baseados no ID
      const alunosMock = {
        '1': { nome: "Ana Beatriz Costa", cpf: "123.456.789-00", email: "ana.costa@email.com" },
        '2': { nome: "Bruno Dias Lima", cpf: "987.654.321-00", email: "bruno.lima@email.com" },
        '3': { nome: "Carla Martins", cpf: "456.789.123-00", email: "carla.martins@email.com" },
        '4': { nome: "Daniel Fogaça", cpf: "789.123.456-00", email: "daniel.fogaca@email.com" }
      };
      
      const dadosAluno = alunosMock[alunoId] || aluno;
      setAluno(prev => ({ ...prev, ...dadosAluno }));
    }
  }, [alunoId]);

  const [diasSemana] = useState([
    "SEGUNDA-FEIRA",
    "TERÇA-FEIRA", 
    "QUARTA-FEIRA",
    "QUINTA-FEIRA",
    "SEXTA-FEIRA"
  ]);

  const handlePersonalizarTreino = (dia) => {
    navigate(`/PersonalizarTreino?alunoId=${alunoId || ''}&dia=${encodeURIComponent(dia)}`);
  };

  const handleFinalizar = () => {
    console.log("Finalizando gerenciamento de treino");
    // Aqui você pode implementar a lógica para salvar e finalizar
    // Depois de finalizar, voltar para a lista de alunos
    navigate('/GerenciarAlunos');
  };

  const handleVoltar = () => {
    navigate('/GerenciarAlunos');
  };

  return (
    <>
      <AdminHeader />
      <div className="gerenciar-treino-container">
      <div className="content-grid">
        <div className="aluno-info-panel">
        <div className="profile-picture">
          <img 
            src={aluno.foto} 
            alt={`Foto de ${aluno.nome}`}
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTIiIGZpbGw9IiNGNEY1RjciLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMTUiIGZpbGw9IiM0MjUyNkUiLz4KPHBhdGggZD0iTTI1IDc1QzI1IDY1IDM1IDU1IDUwIDU1QzY1IDU1IDc1IDY1IDc1IDc1VjgwSDI1Vjc1WiIgZmlsbD0iIzQyNTI2RSIvPgo8L3N2Zz4K";
            }}
          />
        </div>
        <div className="aluno-details">
          <div className="detail-item">
            <span className="label">Nome:</span>
            <span className="value">{aluno.nome}</span>
          </div>
          <div className="detail-item">
            <span className="label">CPF:</span>
            <span className="value">{aluno.cpf}</span>
          </div>
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{aluno.email}</span>
          </div>
        </div>
        </div>

        <div className="schedule-panel">
        <h2 className="schedule-title">Cronograma Semanal</h2>
        <div className="schedule-cards">
          {diasSemana.map((dia, index) => (
            <div key={index} className="schedule-card">
              <span className="day-name">{dia}</span>
              <button 
                className="btn-personalizar"
                onClick={() => handlePersonalizarTreino(dia)}
              >
                Personalizar treino
              </button>
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="finalizar-container">
        <button className="btn-finalizar" onClick={handleFinalizar}>
          Finalizar
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default GerenciarTreino;
