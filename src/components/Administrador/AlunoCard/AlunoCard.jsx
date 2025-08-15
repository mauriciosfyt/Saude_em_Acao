import React from 'react';
import './AlunoCard.css';

const AlunoCard = ({ aluno, onExcluir, onEditar }) => {
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
        <label>Senha:</label>
        <input type="password" value="••••••••" disabled />
      </div>
      <div className="form-group">
        <label>Número:</label>
        <input type="text" value={aluno.numero} disabled />
      </div>
      <div className="card-actions">
        <button className="btn-excluir" onClick={onExcluir}>EXCLUIR</button>
        <button className="btn-editar" onClick={onEditar}>EDITAR</button>
      </div>
    </div>
  );
};

export default AlunoCard;