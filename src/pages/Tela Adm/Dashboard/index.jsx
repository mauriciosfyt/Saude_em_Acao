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
      const apiStart = performance.now();
      try {
        // Paralelizar as 2 chamadas de API para ganho de performance
        const [dados, statsReservas] = await Promise.all([
          fetchDashboardStats(),
          fetchReservaStats()
        ]);
        console.log(`[Dashboard] ✅ APIs responderam em ${(performance.now() - apiStart).toFixed(2)}ms`);
        
        if (isMounted) {
          // Processa stats dashboard
          statsRef.current = dados;
          const total = dados?.totalReservas ?? dados?.reservasTotal ?? dados?.total_reservas ?? dados?.reservas ?? null;
          setReservasTotal(total);

          // Processa stats de reservas
          if (statsReservas) {
            let porProduto = Array.isArray(statsReservas) ? statsReservas : (Array.isArray(statsReservas?.porProduto) ? statsReservas.porProduto : (Array.isArray(statsReservas?.produtos) ? statsReservas.produtos : null));
            let A = 0, B = 0, C = 0, D = 0;

            if (porProduto) {
              porProduto.forEach((item) => {
                const nome = (item?.nome || item?.produto || item?.produtoNome || '').toString().toLowerCase();
                const cat = (item?.categoria || '').toString().toLowerCase();
                const total = Number(item?.total || item?.quantidade || item?.reservas || 0) || 0;
                if (nome.includes('camiseta') || nome.includes('camisa') || cat.includes('camiseta') || cat.includes('camisa')) A += total;
                else if (nome.includes('creatina') || cat.includes('creatina')) B += total;
                else if (nome.includes('whey protein') || nome.includes('whey') || cat.includes('whey protein') || cat.includes('whey')) C += total;
                else if (nome.includes('vitamina') || cat.includes('vitamina')) D += total;
              });
            } else {
              const porCategoria = statsReservas?.porCategoria || statsReservas?.categorias || statsReservas;
              const getNum = (v) => Number(v || 0) || 0;
              if (porCategoria && typeof porCategoria === 'object') {
                A = getNum(porCategoria.camisetas || porCategoria.camiseta || porCategoria.camisas || porCategoria.camisa || porCategoria.A);
                B = getNum(porCategoria.creatina || porCategoria.B);
                C = getNum(porCategoria['whey protein'] || porCategoria.whey || porCategoria.C);
                D = getNum(porCategoria.vitaminas || porCategoria.vitamina || porCategoria.D);
              }
            }

            const somaStats = A + B + C + D;
            
            // Se stats retornou vazio, tenta fallback pela lista de reservas
            if (somaStats === 0) {
              try {
                const reservas = await fetchReservas({});
                let A2 = 0, B2 = 0, C2 = 0, D2 = 0;
                let lista = Array.isArray(reservas?.content) ? reservas.content : (Array.isArray(reservas) ? reservas : []);
                lista = lista.filter(r => {
                  const status = (r?.status || '').toString().toUpperCase();
                  return !status.includes('CANCELAD');
                });
                lista.forEach((r) => {
                  const nome = (r?.produto?.nome || r?.produtoNome || r?.nome || '').toString().toLowerCase();
                  const cat = (r?.produto?.categoria || r?.categoria || '').toString().toLowerCase();
                  const qtd = Number(r?.quantidade || 1) || 1;
                  if (nome.includes('camiseta') || nome.includes('camisa') || cat.includes('camiseta') || cat.includes('camisa')) A2 += qtd;
                  else if (nome.includes('creatina') || cat.includes('creatina')) B2 += qtd;
                  else if (nome.includes('whey protein') || nome.includes('whey') || cat.includes('whey protein') || cat.includes('whey')) C2 += qtd;
                  else if (nome.includes('vitamina') || cat.includes('vitamina')) D2 += qtd;
                });
                const fallbackBreakdown = [
                  { label: 'Camiseta', value: A2, color: '#C2E541' },
                  { label: 'Creatina', value: B2, color: '#FEBF01' },
                  { label: 'Whey', value: C2, color: '#5F77AF' },
                  { label: 'Vitamina', value: D2, color: '#41E5E5' },
                ];
                setBreakdownABCD(fallbackBreakdown);
                setReservasTotal(A2 + B2 + C2 + D2);
              } catch (e2) {
                console.error('[Dashboard] Erro no fallback:', e2?.message);
              }
            } else {
              const breakdown = [
                { label: 'Camiseta', value: A, color: '#C2E541' },
                { label: 'Creatina', value: B, color: '#FEBF01' },
                { label: 'Whey', value: C, color: '#5F77AF' },
                { label: 'Vitamina', value: D, color: '#41E5E5' },
              ];
              setBreakdownABCD(breakdown);
              setReservasTotal(somaStats);
            }
          }
        }
      } catch (e) {
        console.error('[Dashboard] ❌ Erro ao buscar APIs:', e?.message);
      }
    })();
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