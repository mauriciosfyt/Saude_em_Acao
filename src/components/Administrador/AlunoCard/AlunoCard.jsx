import React, { useEffect, useState } from 'react';
import './AlunoCard.css';

const AlunoCard = ({ aluno, onExcluir, onEditar, onGerenciarTreino }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('showAlunoAdicionado') === 'true') {
      setShowToast(true);
      localStorage.removeItem('showAlunoAdicionado');
      setTimeout(() => setShowToast(false), 2000); // Esconde após 2 segundos
    }
  }, []);

  return (
    <div className="aluno-card">
      <div className="form-group">
        <label>Nome:</label>
        <input type="text" value={aluno.nome} disabled />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={aluno.email} disabled />
      </div>
      <div className="form-group">
        <label>CPF:</label>
        <input type="text" value={aluno.cpf} disabled />
      </div>
      <div className="form-group">
        <label>Senha:</label>
        <input type="password" value="••••••••" disabled />
      </div>
      <div className="form-group">
        <label>Número:</label>
        <input type="text" value={aluno.numero} disabled />
      </div>
      <div className="form-group">
        <label>Plano:</label>
        <input type="text" value={aluno.plano} disabled />
      </div>
      <button className="btn-gerenciar-treino" onClick={onGerenciarTreino}>
        Gerenciar treino
      </button>
      <div className="card-actions">
        <button className="btn-excluir" onClick={onExcluir}>EXCLUIR</button>
        <button className="btn-editar" onClick={onEditar}>EDITAR</button>
      </div>
      {showToast && (
        <div className="modal-termos-notification">
          Aluno adicionado com sucesso!
        </div>
      )}
    </div>
  );
};

export default AlunoCard;