// Serviço de estatísticas de reservas
import api from './api';

const RESERVAS_STATS_URL = 'http://34.205.11.57/api/reservas/stats';
const RESERVAS_LIST_URL = 'http://34.205.11.57/api/reservas';

/**
 * Retorna estatísticas de reservas (por status, produto, categoria, etc, conforme backend).
 */
export async function fetchReservaStats(params = {}) {
  try {
    const response = await api.get(RESERVAS_STATS_URL, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
}

/**
 * Busca lista de reservas, opcionalmente filtrando por status (ex.: APROVADA, PENDENTE)
 */
export async function fetchReservas(params = {}) {
  try {
    const response = await api.get(RESERVAS_LIST_URL, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
}

export default { fetchReservaStats, fetchReservas };


