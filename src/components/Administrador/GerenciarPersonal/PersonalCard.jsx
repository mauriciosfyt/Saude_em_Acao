import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './PersonalCard.css';

const PersonalCard = ({ personal, onExcluir, onEditar }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (localStorage.getItem('showPersonalAdicionado') === 'true') {
      setToastMsg('Personal adicionado com sucesso!');
      setShowToast(true);
      localStorage.removeItem('showPersonalAdicionado');
      setTimeout(() => setShowToast(false), 2000);
    } else if (localStorage.getItem('showPersonalEditado') === 'true') {
      setToastMsg('Personal editado com sucesso!');
      setShowToast(true);
      localStorage.removeItem('showPersonalEditado');
      setTimeout(() => setShowToast(false), 2000);
    }
  }, []);

  const handleExcluir = (id) => {
    onExcluir(id);
  };

  return (
    <div>
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
            <button className="btn-excluir" onClick={() => handleExcluir(personal.id)}>EXCLUIR</button>
            <button className="btn-editar" onClick={() => onEditar(personal.id)}>EDITAR</button>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="modal-termos-notification">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default PersonalCard;