// Importar o axios já configurado
import api from './api';

// URLs relativas (baseURL é configurado em api.js)
const RESERVAS_STATS_URL = '/reservas/stats';
const RESERVAS_LIST_URL = '/reservas';
const MINHAS_RESERVAS_URL = '/minhas';

/**
 * Retorna estatísticas de reservas (por status, produto, categoria, etc, conforme backend).
 */
export async function fetchReservaStats(params = {}) {
  try {
    const response = await api.get(RESERVAS_STATS_URL, { params });
    console.log('✅ fetchReservaStats sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro em fetchReservaStats:", error?.response?.data || error?.message);
    throw error;
  }
}

/**
 * Busca lista de reservas (Admin)
 */
export async function fetchReservas(params = {}) {
  try {
    const response = await api.get(RESERVAS_LIST_URL, { params });
    console.log('✅ fetchReservas sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro em fetchReservas:", error?.response?.data || error?.message);
    throw error;
  }
}

/**
 * Cria uma nova reserva para o aluno logado.
 * Rota: POST /api/reservas (Aluno)
 */
export async function createReserva(reservaData) {
  try {
    console.log('📦 Criando nova reserva...', reservaData);
    const response = await api.post(RESERVAS_LIST_URL, reservaData);
    console.log('✅ Reserva criada:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro em createReserva:", error?.response?.data || error?.message);
    throw error;
  }
}

/**
 * Retorna a lista de todas as reservas feitas pelo aluno logado.
 * Rota: GET /api/minhas (Aluno)
 */
export async function fetchMinhasReservas() {
  try {
    console.log('🧑‍🎓 Buscando minhas reservas...');
    const response = await api.get(MINHAS_RESERVAS_URL);
    console.log('✅ Minhas reservas recebidas:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro em fetchMinhasReservas:", error?.response?.data || error?.message);
    throw error;
  }
}

// --- FUNÇÕES DE ATUALIZAÇÃO DE STATUS (CORRIGIDAS) ---

/**
 * APROVA uma reserva (Admin).
 * Rota: PATCH /api/reservas/{id}/aprovar
 */
export async function aprovarReserva(id) {
  try {
    console.log(`🔃 Aprovando reserva ${id}...`);
    const url = `${RESERVAS_LIST_URL}/${id}/aprovar`;
    const response = await api.patch(url);
    console.log('✅ Reserva aprovada:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao aprovar reserva:", error?.response?.data || error?.message);
    throw error;
  }
}

/**
 * REJEITA uma reserva (Admin).
 * Rota: PATCH /api/reservas/{id}/rejeitar
 */
export async function rejeitarReserva(id) {
  try {
    console.log(`🔃 Rejeitando reserva ${id}...`);
    const url = `${RESERVAS_LIST_URL}/${id}/rejeitar`;
    const response = await api.patch(url);
    console.log('✅ Reserva rejeitada:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao rejeitar reserva:", error?.response?.data || error?.message);
    throw error;
  }
}

/**
 * CANCELA uma reserva (Admin ou Aluno).
 * Rota: PATCH /api/reservas/{id}/cancelar
 */
export async function cancelarReserva(id) {
  try {
    console.log(`🔃 Cancelando reserva ${id}...`);
    const url = `${RESERVAS_LIST_URL}/${id}/cancelar`;
    const response = await api.patch(url);
    console.log('✅ Reserva cancelada:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao cancelar reserva:", error?.response?.data || error?.message);
    throw error;
  }
}


export default {
  fetchReservaStats,
  fetchReservas,
  createReserva,
  fetchMinhasReservas
};