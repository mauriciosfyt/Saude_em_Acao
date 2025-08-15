import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './PersonalCard.css';

const PersonalCard = ({ professor }) => {
  // Se o professor não tiver nome, é um card "novo" e os inputs ficam habilitados
  const isNewCard = !professor.nome;

  return (
    <div className="card-container">
      <div className="card-icon-circle">
        <FaPlus size={24} color="#007BFF" />
      </div>
      <form className="card-form">
        <div className="card-form-row">
          <label className="card-label">Nome:</label>
          <input className="card-input" type="text" defaultValue={professor.nome} disabled={!isNewCard} />
        </div>
        <div className="card-form-row">
          <label className="card-label">Email:</label>
          <input className="card-input" type="email" defaultValue={professor.email} disabled={!isNewCard} />
        </div>
        <div className="card-form-row">
          <label className="card-label">Número:</label>
          <input className="card-input" type="text" defaultValue={professor.numero} disabled={!isNewCard} />
        </div>
        <div className="card-form-row">
          <label className="card-label">Senha:</label>
          <input className="card-input" type="password" defaultValue={professor.senha} disabled={!isNewCard} />
        </div>
      </form>
    </div>
  );
};

export default PersonalCard;