import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAlunosPorPlanos } from '../../../services/dashboardService';
import './AlunosPlanosChart.css';

const AlunosPlanosChart = () => {
  // Chave para salvar no cache
  const CACHE_KEY = 'alunos_planos_data';

  // 1. Inicializa o DATA buscando do cache primeiro (Carregamento Instantâneo)
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Erro ao ler cache de alunos:', error);
      return [];
    }
  });

  // 2. Define LOADING como false se já tivermos dados em cache (para não piscar "Carregando...")
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem(CACHE_KEY);
  });
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Se não tiver dados (primeira vez), mostra loading. Se tiver cache, roda em background.
        if (data.length === 0) setLoading(true);
        
        const alunosPorPlano = await fetchAlunosPorPlanos();
        
        // Transformar dados para o formato esperado pelo gráfico
        const dadosFormatados = alunosPorPlano.map(item => ({
          name: item.nome,
          alunos: item.alunos,
        }));
        
        setData(dadosFormatados);
        setError(null);
        
        // Salva a versão atualizada no cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(dadosFormatados));

      } catch (err) {
        console.error('Erro ao carregar alunos por planos:', err);
        setError('Erro ao carregar dados dos alunos por planos');
        
        // Fallback para dados padrão em caso de erro
        const fallbackData = [
          { name: 'Basico', alunos: 30 },
          { name: 'Essencial', alunos: 50 },
          { name: 'Gold', alunos: 15 }
        ];
        setData(fallbackData);
        // Opcional: Salvar fallback no cache ou não, dependendo da preferência. 
        // Aqui optamos por não sujar o cache com dados fake se a API falhar.
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vazio para executar apenas na montagem

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