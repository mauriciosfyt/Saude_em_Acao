import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminHeader from '../../../components/header_admin';
import Footer from '../../../components/footer';
import fotoAluno from '../../../assets/professor1.jpeg'; // ajuste se for .jpg ou outro caminho
import './GerenciarTreino.css';

const GerenciarTreino = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alunoId = searchParams.get('alunoId');

  const [aluno, setAluno] = useState({
    nome: 'Arthur Heleno',
   telefone: '123456-78910',
    email: 'helenocosta@gmail.com',
    foto: fotoAluno
  });

  useEffect(() => {
    if (alunoId) {
      const alunosMock = {
        '1': { nome: "Ana Beatriz Costa",telefone: "123.456.789-00", email: "ana.costa@email.com" },
        '2': { nome: "Bruno Dias Lima",telefone: "987.654.321-00", email: "bruno.lima@email.com" },
        '3': { nome: "Carla Martins",telefone: "456.789.123-00", email: "carla.martins@email.com" },
        '4': { nome: "Daniel Fogaça",telefone: "789.123.456-00", email: "daniel.fogaca@email.com" }
      };
      const dadosAluno = alunosMock[alunoId] || aluno;
      setAluno(prev => ({ ...prev, ...dadosAluno }));
    }
  }, [alunoId]);

  const diasSemana = [
    { dia: 'Segunda-Feira', treinos: ['Peito', 'Tríceps'] },
    { dia: 'Terça-Feira', treinos: ['Costas', 'Bíceps'] },
    { dia: 'Quarta-Feira', treinos: ['Quadríceps', 'Ombro'] },
    { dia: 'Quinta-Feira', treinos: ['Cardio', 'Abdomen'] },
    { dia: 'Sexta-Feira', treinos: ['Posterior de coxa', 'Panturrilha'] },
  ];

  const handlePersonalizarTreino = (dia) => {
    navigate(`/PersonalizarTreino?alunoId=${alunoId || ''}&dia=${encodeURIComponent(dia)}`);
  };

  const handleFinalizar = () => {
    // lógica de salvar/finalizar aqui
    navigate('/GerenciarAlunos');
  };

  return (
    <>
      <AdminHeader />
      <div className="gerenciar-treino-page">
        {/* container branco central com bordas arredondadas */}
        <div className="main-card">
          <h1 className="page-title">Gerenciamento de treino</h1>

          {/* bloco de perfil */}
          <div className="profile-row">
            <div className="profile-info">
              <div className="small-label">Nome:</div>
              <div className="aluno-nome">{aluno.nome}</div>

              <div className="small-label">Telefone:</div>
              <div className="aluno-telefone">{aluno.telefone}</div>

            </div>

            <div className="profile-photo">
              <img
                src={aluno.foto}
                alt={`Foto de ${aluno.nome}`}
                onError={(e) => {
                  e.target.onerror = null;
                  // fallback inline svg pequeno
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEzMCIgdmlld0JveD0iMCAwIDEzMCAxMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEzMCIgaGVpZ2h0PSIxMzAiIGZpbGw9IiNFMEUwRTAiIHJ4PSIxNiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNDRGIiByPSIyMCIgZmlsbD0iI0FBN0E3QSIvPjxwYXRoIGQ9Ik0zMiA5MUMzMiA4MCA1MyA3MSA2NSAzN0M3NyA3MSA5OCA4MCA5OCA5MSIgc3Ryb2tlPSIjQkJCQiIvPjwvc3ZnPg==';
                }}
              />
            </div>
          </div>

          {/* grid de cards (3 colunas) */}
          <div className="cards-grid">
            {diasSemana.map((item, idx) => (
              <div key={idx} className="schedule-card">
                <h3 className="card-title">{item.dia}</h3>
                <ul className="ex-list">
                  {item.treinos.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
                <div className="card-footer">
                  <button className="btn-personalizar" onClick={() => handlePersonalizarTreino(item.dia)}>
                    Personalizar treino
                  </button>
                </div>
              </div>
            ))}

            {/* Finalizar como último item (coluna 3, segunda linha) */}
            <div className="finalize-card">
              <button className="btn-finalizar" onClick={handleFinalizar}>
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GerenciarTreino;
