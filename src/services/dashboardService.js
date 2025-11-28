// Serviço para buscar estatísticas do dashboard (com filtro opcional de ano)
import api from './api';

const DASHBOARD_STATS_URL = '/api/dashboard/stats';

/**
 * Busca estatísticas consolidadas do dashboard.
 *
 * @param {number|string} [ano] - Ano para filtro opcional (ex.: 2025)
 * @returns {Promise<any>} Dados de estatísticas retornados pela API
 */
export async function fetchDashboardStats(ano = 2025) {
  try {
    const params = { ano };
    console.log('[dashboardService] 🚀 Chamando /dashboard/stats com ano:', ano);

    // URL relativa garante que os interceptadores do axios sejam aplicados corretamente
    const response = await api.get(DASHBOARD_STATS_URL, { params });
    console.log('[dashboardService] ✅ Resposta recebida:', response.data);
    return response.data;
  } catch (error) {
    // Normaliza o erro
    console.error('[dashboardService] ❌ Erro na chamada:', error?.response?.status, error?.message);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}

/**
 * Busca a quantidade de alunos agrupados por planos.
 * 
 * @returns {Promise<Array>} Array com objetos contendo {nome: string, alunos: number}
 */
export async function fetchAlunosPorPlanos() {
  try {
    console.log('[dashboardService] 🚀 Buscando alunos por planos...');
    
    // Garante que o header Authorization seja enviado (tenta sessionStorage, depois localStorage)
    const token = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('token')) || (typeof localStorage !== 'undefined' && localStorage.getItem('authToken')) || null;
    console.log('[dashboardService] Token presente?:', token ? 'SIM' : 'NÃO');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Busca todos os alunos (usar /api para garantir proxy/rewrite em dev)
    const response = await api.get('/api/aluno', { headers });
    // Normaliza possíveis formatos: { data: [...] } | { content: [...] } | [...] | { alunos: [...] }
    const alunosRaw = response.data;
    let alunos = [];

    if (Array.isArray(alunosRaw)) {
      alunos = alunosRaw;
    } else if (Array.isArray(alunosRaw?.data)) {
      alunos = alunosRaw.data;
    } else if (Array.isArray(alunosRaw?.content)) {
      alunos = alunosRaw.content;
    } else if (Array.isArray(alunosRaw?.alunos)) {
      alunos = alunosRaw.alunos;
    } else if (alunosRaw && typeof alunosRaw === 'object') {
      // Tenta encontrar a primeira propriedade que seja array
      const firstArray = Object.values(alunosRaw).find(v => Array.isArray(v));
      if (Array.isArray(firstArray)) alunos = firstArray;
    }

    // Se ainda estiver vazio e o servidor retornou um objeto único representando um aluno,
    // tenta encapsular em um array (útil em respostas que retornam um único recurso)
    if (alunos.length === 0 && alunosRaw && typeof alunosRaw === 'object' && !Array.isArray(alunosRaw)) {
      if (alunosRaw.id || alunosRaw.nome || alunosRaw.email) {
        alunos = [alunosRaw];
      }
    }

    console.log('[dashboardService] ✅ Alunos recebidos (count):', alunos.length);
    console.log('[dashboardService] 📋 Amostra de aluno recebida:', alunos[0] || alunosRaw);
    
    // Agrupar alunos por plano
    const alunosPorPlano = {};
    
    alunos.forEach((aluno, index) => {
      // Verificar múltiplas possibilidades de campo de plano
      let nomePlano = 'Sem Plano';
      
      if (aluno.plano?.nome) {
        nomePlano = aluno.plano.nome;
      } else if (aluno.plano) {
        nomePlano = typeof aluno.plano === 'string' ? aluno.plano : aluno.plano.toString();
      } else if (aluno.nomePlano) {
        nomePlano = aluno.nomePlano;
      } else if (aluno.tipoPlano) {
        nomePlano = aluno.tipoPlano;
      } else if (aluno.plan) {
        nomePlano = aluno.plan?.nome || aluno.plan;
      }
      
      // Log para os primeiros alunos para debug
      if (index < 3) {
        console.log(`[dashboardService] Aluno ${index + 1}:`, {
          nome: aluno.nome || aluno.nomeAluno,
          plano: nomePlano,
          estruturaPlano: aluno.plano
        });
      }
      
      if (!alunosPorPlano[nomePlano]) {
        alunosPorPlano[nomePlano] = 0;
      }
      alunosPorPlano[nomePlano]++;
    });
    
    // Converter para array de objetos
    const resultado = Object.entries(alunosPorPlano).map(([nome, alunos]) => ({
      nome,
      alunos
    }));
    
    console.log('[dashboardService] ✅ Resultado agrupado:', resultado);
    return resultado;
  } catch (error) {
    console.error('[dashboardService] ❌ Erro ao buscar alunos por planos:', error?.response?.status, error?.message);
    if (error.response) {
      console.error('[dashboardService] response.data:', error.response.data);
      if (error.response.data) {
        throw error.response.data;
      }
    }
    throw error;
  }
}

export default {
  fetchDashboardStats,
  fetchAlunosPorPlanos,
};


