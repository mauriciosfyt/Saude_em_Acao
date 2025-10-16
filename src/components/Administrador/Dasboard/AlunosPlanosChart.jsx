import React from 'react';
import './AlunosPlanosChart.css';

const AlunosPlanosChart = () => {
  const planos = [
    { nome: 'Basico', valor: 30, cor: '#f39c12' },
    { nome: 'Essencial', valor: 50, cor: '#f39c12' },
    { nome: 'Gold', valor: 15, cor: '#f39c12' }
  ];

  const maxValor = Math.max(...planos.map(p => p.valor));

  return (
    <div className="alunos-planos-card">
      <h3>Alunos por planos</h3>
      <div className="chart-container">
        <div className="bar-chart">
          {planos.map((plano, index) => (
            <div key={index} className="bar-group">
              <div className="bar-value">{plano.valor}</div>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(plano.valor / maxValor) * 100}%`,
                    backgroundColor: plano.cor
                  }}
                ></div>
              </div>
              <div className="bar-label">{plano.nome}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlunosPlanosChart;
