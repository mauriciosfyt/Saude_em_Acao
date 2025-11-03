import React, { useMemo } from 'react';
import './TotalVendasChart.css';

// breakdown: array de { label, value, color }
const TotalVendasChart = ({ total = 0, titulo = 'Total de Reservas', breakdown = [] }) => {
  const donutStyle = useMemo(() => {
    if (!breakdown || breakdown.length === 0) return undefined;
    const soma = breakdown.reduce((acc, i) => acc + (Number(i.value) || 0), 0) || 0;
    if (soma <= 0) return undefined;
    let start = 0;
    const stops = breakdown.map((item) => {
      const frac = Math.max(0, Number(item.value) || 0) / soma;
      const end = start + frac * 360;
      const seg = `${item.color} ${start}deg ${end}deg`;
      start = end;
      return seg;
    });
    return { background: `conic-gradient(${stops.join(',')})` };
  }, [breakdown]);

  return (
    <div className="total-vendas-card">
      <h3>{titulo}</h3>
      <div className="chart-container">
        <div className="donut-chart" style={donutStyle}>
          <div className="donut-center">
            <span className="total-value">{Number(total).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalVendasChart;
