import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import MenuAdm from './../../../components/MenuAdm/MenuAdm';
import TotalVendasChart from '../../../components/Administrador/Dasboard/TotalVendasChart';
import AlunosPlanosChart from '../../../components/Administrador/Dasboard/AlunosPlanosChart';
import GraficoA from '../../../components/Administrador/Dasboard/GraficoA';
import ProductCard from '../../../components/Administrador/Dasboard/ProductCard';
import { fetchDashboardStats } from '../../../services/dashboardService';
import { fetchReservaStats, fetchReservas } from '../../../services/reservasService';
import { useAuth } from '../../../contexts/AuthContext';
import { setAuthToken } from '../../../services/api';

// Importar as imagens
import camisaImg from '/src/assets/icones/Camisa.png';
import preTreinoImg from '/src/assets/icones/Pré-Treino.png';
import wheyImg from '/src/assets/icones/Whey protain.png';
import vitaminaImg from '/src/assets/icones/Vitamina.png';


const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const statsRef = useRef(null);
  const [reservasTotal, setReservasTotal] = useState(null);
  const [breakdownABCD, setBreakdownABCD] = useState(null);
  const { loading: authLoading, user } = useAuth();

  const handleMenuClick = (item) => {
    setActiveMenuItem(item);
    // Aqui você pode adicionar lógica para navegar entre páginas
    console.log('Menu item clicked:', item);
  };

  useEffect(() => {
    console.log('[Dashboard] useEffect disparado. authLoading:', authLoading);
    if (authLoading) {
      console.log('[Dashboard] ⏳ Aguardando carregamento de autenticação...');
      return; // aguarda autenticação
    }
    console.log('[Dashboard] ✅ Autenticação carregada, iniciando requisições...');
    // Fail-safe: configura Authorization a partir do sessionStorage em caso de reload
    try {
      const tokenStorage = sessionStorage.getItem('token');
      console.log('[Dashboard] Token no sessionStorage:', tokenStorage ? `${tokenStorage.slice(0, 20)}...` : 'ausente');
      console.log('[Dashboard] User autenticado:', user?.email || 'não autenticado');
      if (!tokenStorage) {
        console.warn('[Dashboard] ⚠️ AVISO: Nenhum token encontrado! Dashboard requer Admin logado.');
        return;
      }
      if (tokenStorage) setAuthToken(tokenStorage);
    } catch (_) {}
    let isMounted = true;
    (async () => {
      try {
        console.log('[Dashboard] 🚀 Chamando fetchDashboardStats()...');
        const dados = await fetchDashboardStats();
        if (isMounted) {
          console.log('[Dashboard] ✅ /api/dashboard/stats resposta:', dados);
          statsRef.current = dados;
          // Tenta mapear as possíveis chaves de total de reservas
          const total =
            dados?.totalReservas ??
            dados?.reservasTotal ??
            dados?.total_reservas ??
            dados?.reservas ??
            null;
          setReservasTotal(total);
        }
      } catch (e) {
        console.error('[Dashboard] ❌ Erro ao buscar /api/dashboard/stats:', e?.response?.status, e?.message);
        if (e?.response?.status === 403) {
          console.error('[Dashboard] 🔴 Erro 403: Você não tem permissão. Verifique se é ADMIN e se o token é válido.');
        }
      }
      try {
        // Busca estatísticas detalhadas de reservas (por produto/categoria)
        const statsReservas = await fetchReservaStats();
        if (isMounted && statsReservas) {
          console.log('[Dashboard] ✅ /api/reservas/stats resposta COMPLETA:', statsReservas);
          console.log('[Dashboard] Tipo da resposta:', typeof statsReservas);
          console.log('[Dashboard] É Array?', Array.isArray(statsReservas));
          console.log('[Dashboard] Chaves disponíveis:', Object.keys(statsReservas));
          
          // Mapeamento tolerante: tenta diversas estruturas comuns
          // 1) Array de objetos: [{ nome: 'Produto A', total: 10, ... }]
          let porProduto = null;
          if (Array.isArray(statsReservas)) porProduto = statsReservas;
          if (!porProduto && Array.isArray(statsReservas?.porProduto)) porProduto = statsReservas.porProduto;
          if (!porProduto && Array.isArray(statsReservas?.produtos)) porProduto = statsReservas.produtos;

          console.log('[Dashboard] porProduto encontrado?', porProduto ? 'SIM' : 'NÃO', porProduto);

          let A = 0, B = 0, C = 0, D = 0;
          if (porProduto) {
            porProduto.forEach((item) => {
              const nome = (item?.nome || item?.produto || item?.produtoNome || '').toString().toLowerCase();
              console.log('[Dashboard] Processando item:', { nome, item });
              const cat = (item?.categoria || '').toString().toLowerCase();
              const total = Number(item?.total || item?.quantidade || item?.reservas || 0) || 0;
              // A: Camisetas
              const isA = nome.includes('camiseta') || nome.includes('camisas') || nome.includes('camisa') || cat.includes('camiseta') || cat.includes('camisas') || cat.includes('camisa');
              // B: Creatina
              const isB = nome.includes('creatina') || cat.includes('creatina');
              // C: Whey Protein
              const isC = nome.includes('whey protein') || nome.includes('whey') || cat.includes('whey protein') || cat.includes('whey');
              // D: Vitaminas
              const isD = nome.includes('vitamina') || nome.includes('vitaminas') || cat.includes('vitamina') || cat.includes('vitaminas');

              if (isA) A += total;
              else if (isB) B += total;
              else if (isC) C += total;
              else if (isD) D += total;
            });
          } else {
            // 2) Objeto por categoria
            const porCategoria = statsReservas?.porCategoria || statsReservas?.categorias || statsReservas;
            const getNum = (v) => Number(v || 0) || 0;
            if (porCategoria && typeof porCategoria === 'object') {
              A = getNum(
                porCategoria.camisetas || porCategoria.camiseta || porCategoria.camisas || porCategoria.camisa || porCategoria.A || porCategoria.produtoA
              );
              B = getNum(
                porCategoria.creatina || porCategoria.B || porCategoria.produtoB
              );
              C = getNum(
                porCategoria['whey protein'] || porCategoria.whey || porCategoria.C || porCategoria.produtoC
              );
              D = getNum(
                porCategoria.vitaminas || porCategoria.vitamina || porCategoria.D || porCategoria.produtoD
              );
            }
          }

          console.log('[Dashboard] Totais mapeados -> A:', A, 'B:', B, 'C:', C, 'D:', D);

          const breakdown = [
            { label: 'Camiseta', value: A, color: '#C2E541' },
            { label: 'Creatina', value: B, color: '#FEBF01' },
            { label: 'Whey', value: C, color: '#5F77AF' },
            { label: 'Vitamina', value: D, color: '#41E5E5' },
          ];
          console.log('[Dashboard] Breakdown ABCD preparado:', breakdown);
          setBreakdownABCD(breakdown);
          if (reservasTotal == null) {
            const soma = A + B + C + D;
            if (soma > 0) setReservasTotal(soma);
          }
          // Se tudo ficou zerado, tenta fallback agregando pela lista de reservas
          const somaStats = (A + B + C + D) || 0;
          console.log('[Dashboard] Soma stats calculada:', somaStats, 'Tentará fallback?', somaStats === 0);
          if (somaStats === 0) {
            try {
              console.log('[Dashboard] Iniciando fallback - tentando /api/reservas sem filtro');
              const reservas = await fetchReservas({});
              console.log('[Dashboard] Fallback /api/reservas lista (sem filtro):', reservas);
              let A2 = 0, B2 = 0, C2 = 0, D2 = 0;
              let lista = Array.isArray(reservas?.content) ? reservas.content : (Array.isArray(reservas) ? reservas : []);
              // Filtrar apenas reservas ativas (não canceladas)
              lista = lista.filter(r => {
                const status = (r?.status || '').toString().toUpperCase();
                return !status.includes('CANCELAD');
              });
              console.log('[Dashboard] Lista de reservas encontrada (pós-filtro):', lista.length, 'itens');
              lista.forEach((r) => {
                // Filtrar reservas canceladas: não contar no total se o status for CANCELADO/CANCELADA/Cancelado
                const status = (r?.status || '').toString().toUpperCase();
                if (status.includes('CANCELAD')) {
                  console.log('[Dashboard] Pulando reserva cancelada:', r);
                  return; // Ignora reservas canceladas
                }
                const nome = (r?.produto?.nome || r?.produtoNome || r?.nome || '').toString().toLowerCase();
                const cat = (r?.produto?.categoria || r?.categoria || '').toString().toLowerCase();
                const qtd = Number(r?.quantidade || 1) || 1;
                console.log('[Dashboard] Analisando reserva:', { nome, cat, qtd, status });
                const isA = nome.includes('camiseta') || nome.includes('camisa') || cat.includes('camiseta') || cat.includes('camisa');
                const isB = nome.includes('creatina') || cat.includes('creatina');
                const isC = nome.includes('whey protein') || nome.includes('whey') || cat.includes('whey protein') || cat.includes('whey');
                const isD = nome.includes('vitamina') || nome.includes('vitaminas') || cat.includes('vitamina') || cat.includes('vitaminas');
                if (isA) A2 += qtd; else if (isB) B2 += qtd; else if (isC) C2 += qtd; else if (isD) D2 += qtd;
              });
              console.log('[Dashboard] Fallback totais -> A:', A2, 'B:', B2, 'C:', C2, 'D:', D2);
              const fallbackBreakdown = [
                { label: 'Camiseta', value: A2, color: '#C2E541' },
                { label: 'Creatina', value: B2, color: '#FEBF01' },
                { label: 'Whey', value: C2, color: '#5F77AF' },
                { label: 'Vitamina', value: D2, color: '#41E5E5' },
              ];
              setBreakdownABCD(fallbackBreakdown);
              const soma2 = A2 + B2 + C2 + D2;
              if (!reservasTotal && soma2 > 0) setReservasTotal(soma2);
            } catch (e2) {
              console.error('[Dashboard] Erro no fallback por lista de reservas:', e2);
            }
          }
        }
      } catch (e) {
        console.error('[Dashboard] ❌ Erro ao buscar /api/reservas/stats:', e?.response?.status, e?.message);
        if (e?.response?.status === 403) {
          console.error('[Dashboard] 🔴 Erro 403: Você não tem permissão de ADMIN para acessar estatísticas.');
        }
      }
    })();
    return () => { isMounted = false; };
  }, [authLoading, user?.token]);

  // Refetch a cada 30 segundos para atualizar quando reservas forem canceladas em outro lugar
  useEffect(() => {
    if (authLoading) return;
    const interval = setInterval(() => {
      console.log('[Dashboard] 🔄 Refetch periódico disparado (30s)');
      // Pode ser estendido se necessário, por enquanto apenas loga
    }, 30000);
    return () => clearInterval(interval);
  }, [authLoading]);

  return (
    <div className="dashboard-container">
      <MenuAdm activeItem={activeMenuItem} onItemClick={handleMenuClick} />
      
      <main className="dashboard-main">
        <div className="page-grid">
          <section className="left-content">
            <div className="top-charts">
              <TotalVendasChart total={reservasTotal} titulo="Total de Reservas" breakdown={breakdownABCD || []} />
              <AlunosPlanosChart />
            </div>
            <GraficoA />
          </section>

          <aside className="products-sidebar">
            <ProductCard 
              nome="Camisetas" 
              tipo="tshirt" 
              imagem={camisaImg}
              total={breakdownABCD ? breakdownABCD[0]?.value : null}
            />
            <ProductCard 
              nome="Creatina" 
              tipo="supplement" 
              imagem={preTreinoImg}
              total={breakdownABCD ? breakdownABCD[1]?.value : null}
            />
            <ProductCard 
              nome="Whey" 
              tipo="whey" 
              imagem={wheyImg}
              total={breakdownABCD ? breakdownABCD[2]?.value : null}
            />
            <ProductCard 
              nome="Vitaminas" 
              tipo="pills" 
              imagem={vitaminaImg}
              total={breakdownABCD ? breakdownABCD[3]?.value : null}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;