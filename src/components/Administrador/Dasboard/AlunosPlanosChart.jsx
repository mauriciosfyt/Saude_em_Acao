import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAlunosPorPlanos } from '../../../services/dashboardService';
import './AlunosPlanosChart.css';

const AlunosPlanosChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const alunosPorPlano = await fetchAlunosPorPlanos();
        
        // Transformar dados para o formato esperado pelo gráfico
        const dadosFormatados = alunosPorPlano.map(item => ({
          name: item.nome,
          alunos: item.alunos,
        }));
        
        setData(dadosFormatados);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar alunos por planos:', err);
        setError('Erro ao carregar dados dos alunos por planos');
        
        // Fallback para dados padrão em caso de erro
        setData([
          { name: 'Basico', alunos: 30 },
          { name: 'Essencial', alunos: 50 },
          { name: 'Gold', alunos: 15 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Calcular ticks inteiros para o eixo Y com base no maior valor de 'alunos'
  const maxAlunos = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(d => Number(d.alunos) || 0));
  }, [data]);

  const maxCeil = Math.max(1, Math.ceil(maxAlunos));
  const yTicks = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= maxCeil; i++) arr.push(i);
    return arr;
  }, [maxCeil]);

  return (
    <div className="alunos-planos-card">
      <h3>Alunos por planos</h3>
      
      {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados...</p>}
      
      {error && <p style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>{error}</p>}
      
      {data.length > 0 && (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                allowDecimals={false}
                type="number"
                scale="linear"
                ticks={yTicks}
                domain={[0, maxCeil]}
              />
              <Tooltip 
                formatter={(value) => [value, 'Alunos']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="alunos" 
                fill="#f39c12" 
                radius={[8, 8, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AlunosPlanosChart;
