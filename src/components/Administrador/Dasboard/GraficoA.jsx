import React, { useMemo, useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './GraficoA.css';
import { fetchReservas } from '../../../services/reservasService';

const GraficoA = ({ mesAtual }) => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const [valores, setValores] = useState(new Array(12).fill(0));
  const [resumoMeses, setResumoMeses] = useState({ atual: 0, anterior: 0 });
  
  // Preparar dados para o Recharts
  const data = useMemo(() => {
    return meses.map((mes, index) => ({
      name: mes,
      valor: valores[index] || 0,
    }));
  }, [valores]);

  // Fetch reservas e agrega por mês (produtos "retirados")
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const startTime = performance.now();
        const ano = new Date().getFullYear();
        const params = { ano, size: 500 }; // Reduzido de 1000 para melhorar performance
        console.log('[GraficoA] 🚀 Buscando reservas...');
        const resp = await fetchReservas(params);
        console.log(`[GraficoA] ✅ API respondeu em ${(performance.now() - startTime).toFixed(2)}ms`);
        // Normaliza diferentes formatos retornados pela API
        let lista = Array.isArray(resp?.content) ? resp.content : (Array.isArray(resp) ? resp : []);

        // Se for objeto com outras chaves, tenta encontrar o array
        if (!Array.isArray(lista) || lista.length === 0) {
          const candidate = Object.values(resp || {}).find(v => Array.isArray(v));
          if (Array.isArray(candidate)) lista = candidate;
        }

        console.log('[GraficoA] ✅ Reservas recebidas (amostra):', (lista && lista.length) ? lista.slice(0,3) : lista);

        const processStart = performance.now();
        const mesesCount = new Array(12).fill(0);
        let cancelledCount = 0;
        let includedCount = 0;
        let ignoredCount = 0;

        // Helpers compilados fora do loop para melhor performance
        const normalize = (s) => typeof s === 'string' ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() : '';
        const parsePrice = (v) => {
          if (v == null) return 0;
          if (typeof v === 'number') return v;
          let s = String(v).trim().replace(/[^0-9,.\-]/g, '');
          const commaCount = (s.match(/,/g) || []).length;
          const dotCount = (s.match(/\./g) || []).length;
          if (commaCount > 0 && dotCount > 0) s = s.replace(/\./g, '').replace(/,/g, '.');
          else if (commaCount > 0) s = s.replace(/,/g, '.');
          const n = parseFloat(s);
          return Number.isFinite(n) ? n : 0;
        };

        lista.forEach(r => {
          const status = normalize((r?.status || '').toString());
          if (status.includes('CANCEL')) { cancelledCount++; ignoredCount++; return; }
          if (!(status === 'CONCLUIDA' || status === 'RETIRADO' || status.includes('CONCLUID') || status.includes('RETIRAD'))) { ignoredCount++; return; }

          const rawDate = r?.dataRetirada || r?.dataConclusao || r?.dataRetirado || r?.data || r?.dataReserva || r?.dataCriacao || r?.updatedAt || r?.updated_at || r?.createdAt || r?.created_at;
          const d = rawDate ? new Date(rawDate) : new Date(r?.produto?.dataRetirada || r?.produto?.data);
          if (!d || isNaN(d.getTime())) return;

          const qtd = Number(r?.quantidade || r?.qtd || r?.quantidadeReserva || 1) || 1;
          const price = r?.precoUnitario || r?.preco || r?.valor || r?.price || r?.produto?.precoUnitario || r?.produto?.preco || r?.produto?.valor || r?.produto?.price || r?.produto?.valorUnitario || r?.valorUnitario || 0;
          const priceNum = parsePrice(price);

          mesesCount[d.getMonth()] += priceNum * qtd;
          includedCount++;
        });

        const processTime = performance.now() - processStart;
        console.log(`[GraficoA] ✅ Processamento: ${processTime.toFixed(2)}ms | incluídas: ${includedCount}, canceladas: ${cancelledCount}, ignoradas: ${ignoredCount}`);

        if (isMounted) {
          const currentMonth = new Date().getMonth();
          const somaMesAtual = mesesCount[currentMonth] || 0;
          console.log(`[GraficoA] Soma mês atual: ${somaMesAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
          setValores(mesesCount);
          setResumoMeses({
            atual: somaMesAtual,
            anterior: mesesCount[(currentMonth + 11) % 12] || 0
          });
        }
      } catch (err) {
        console.error('[GraficoA] ❌ Erro ao buscar/agregar reservas:', err);
        // mantém o fallback hardcoded
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const labelMes = useMemo(() => {
    if (typeof mesAtual === 'number' && mesAtual >= 0 && mesAtual <= 11) return meses[mesAtual];
    const now = new Date();
    return meses[now.getMonth()];
  }, [mesAtual]);

  return (
    <div className="grafico-a-card">
      <div className="card-header">
        <h3>Vendas Anuais</h3>
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
            <YAxis tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value} />
            <Tooltip 
              formatter={(value) => {
                const num = Number(value) || 0;
                return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              }}
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
