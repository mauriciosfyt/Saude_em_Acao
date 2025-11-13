import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './GraficoA.css';

const GraficoA = ({ mesAtual }) => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const valores = [850, 800, 700, 750, 780, 980, 520, 850, 800, 900, 950, 850];
  
  // Preparar dados para o Recharts
  const data = useMemo(() => {
    return meses.map((mes, index) => ({
      name: mes,
      valor: valores[index],
    }));
  }, []);

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
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#4a90e2" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="valor" 
              stroke="#4a90e2" 
              strokeWidth={2}
              fill="url(#colorValor)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grafico-a-mes">Mês: {labelMes}</div>
    </div>
  );
};

export default GraficoA;
