// Serviço para buscar estatísticas do dashboard (com filtro opcional de ano)
import api from './api';

const DASHBOARD_STATS_URL = 'http://34.205.11.57/api/dashboard/stats?ano=2025';

/**
 * Busca estatísticas consolidadas do dashboard.
 *
 * @param {number|string} [ano] - Ano para filtro opcional (ex.: 2025)
 * @returns {Promise<any>} Dados de estatísticas retornados pela API
 */
export async function fetchDashboardStats(ano) {
  try {
    const params = {};
    if (ano !== undefined && ano !== null && `${ano}`.trim() !== '') {
      params.ano = ano;
    }

    // Usamos URL absoluta para não depender de baseURL; headers (ex.: Authorization) do axios são preservados
    const response = await api.get(DASHBOARD_STATS_URL, { params });
    return response.data;
  } catch (error) {
    // Normaliza o erro
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export default {
  fetchDashboardStats,
};


