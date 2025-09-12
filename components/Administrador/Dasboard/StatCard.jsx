import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="stat-card">
      {/* Novo grupo para o cabeçalho */}
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3 className="card-title">{title}</h3>
      </div>
      {/* O valor agora fica em seu próprio elemento */}
      <p className="card-value">{value}</p>
    </div>
  );
};

export default StatCard;