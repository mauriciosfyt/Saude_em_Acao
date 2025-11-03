import React, { useMemo } from 'react';
import './GraficoA.css';

const GraficoA = ({ mesAtual }) => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const valores = [850, 800, 700, 750, 780, 980, 520, 850, 800, 900, 950, 850];
  
  const maxValor = 1000;
  const chartWidth = 500;
  const chartHeight = 250;
  const labelMes = useMemo(() => {
    if (typeof mesAtual === 'number' && mesAtual >= 0 && mesAtual <= 11) return meses[mesAtual];
    const now = new Date();
    return meses[now.getMonth()];
  }, [mesAtual]);

  return (
    <div className="grafico-a-card">
      <div className="card-header">
        <h3>Gráfico A</h3>
        <span className="year">2025</span>
      </div>
      <div className="chart-container">
        <div className="y-axis">
          <div className="y-label">R$1.000,00</div>
          <div className="y-label">R$800,00</div>
          <div className="y-label">R$500,00</div>
          <div className="y-label">R$100,00</div>
          <div className="y-label">R$0</div>
        </div>
        <div className="chart-area">
          <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Linhas de grade horizontais */}
            <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="0" y1="160" x2={chartWidth} y2="160" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e0e0e0" strokeWidth="1" />
            
            {/* Área preenchida */}
            <polygon
              points={`0,${chartHeight} ${valores.map((valor, index) => 
                `${(index * chartWidth) / (valores.length - 1)},${chartHeight - (valor / maxValor) * chartHeight}`
              ).join(' ')} ${chartWidth},${chartHeight}`}
              fill="#4a90e2"
              opacity="0.3"
            />
            
            {/* Linha do gráfico */}
            <polyline
              points={valores.map((valor, index) => 
                `${(index * chartWidth) / (valores.length - 1)},${chartHeight - (valor / maxValor) * chartHeight}`
              ).join(' ')}
              fill="none"
              stroke="#4a90e2"
              strokeWidth="3"
            />
            
            {/* Pontos de dados */}
            {valores.map((valor, index) => (
              <circle
                key={index}
                cx={(index * chartWidth) / (valores.length - 1)}
                cy={chartHeight - (valor / maxValor) * chartHeight}
                r="4"
                fill="white"
                stroke="#4a90e2"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        <div className="x-axis">
          {meses.map((mes, index) => (
            <div key={index} className="x-label">{mes}</div>
          ))}
        </div>
        <div className="grafico-a-mes">Mês: {labelMes}</div>
      </div>
    </div>
  );
};

export default GraficoA;
