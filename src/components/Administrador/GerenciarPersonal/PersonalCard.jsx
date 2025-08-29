import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './PersonalCard.css';

const PersonalCard = ({ personal, onExcluir, onEditar }) => {
  return (
    <div className="card-container">
      <div className="card-icon-circle">
        <FaPlus size={24} color="#007BFF" />
      </div>
      <div className="card-form">
        <div className="card-form-row">
          <label className="card-label">Nome:</label>
          <input className="card-input" type="text" value={personal.nome} disabled />
        </div>
        <div className="card-form-row">
          <label className="card-label">Email:</label>
          <input className="card-input" type="email" value={personal.email} disabled />
        </div>
        <div className="card-form-row">
          <label className="card-label">CPF:</label>
          <input className="card-input" type="text" value={personal.cpf} disabled />
        </div>
        <div className="card-form-row">
          <label className="card-label">Senha:</label>
          <input className="card-input" type="password" value="••••••••" disabled />
        </div>
        <div className="card-form-row">
          <label className="card-label">Número:</label>
          <input className="card-input" type="text" value={personal.numero} disabled />
        </div>
        <div className="card-actions">
          <button className="btn-excluir" onClick={onExcluir}>EXCLUIR</button>
          <button className="btn-editar" onClick={onEditar}>EDITAR</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalCard;