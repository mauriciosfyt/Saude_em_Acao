// Serviço para buscar estatísticas do dashboard (com filtro opcional de ano)
import api from './api';

const DASHBOARD_STATS_URL = '/dashboard/stats';

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
    
    // Busca todos os alunos
    const response = await api.get('/aluno');
    const alunos = response.data.data || response.data || [];
    
    console.log('[dashboardService] ✅ Alunos recebidos:', alunos.length);
    console.log('[dashboardService] 📋 Amostra de aluno recebida:', alunos[0]);
    
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
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export default {
  fetchDashboardStats,
  fetchAlunosPorPlanos,
};


