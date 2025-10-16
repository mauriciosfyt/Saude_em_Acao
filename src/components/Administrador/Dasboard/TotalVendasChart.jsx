import React from 'react';
import './TotalVendasChart.css';

const TotalVendasChart = () => {
  return (
    <div className="total-vendas-card">
      <h3>Total das vendas</h3>
      <div className="chart-container">
        <div className="donut-chart">
          <div className="donut-center">
            <span className="total-value">R$3.000,00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalVendasChart;
