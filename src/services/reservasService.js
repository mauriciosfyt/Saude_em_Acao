// 1. ADICIONAMOS A LÓGICA MANUAL DE PEGAR O TOKEN
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('authToken') || null;
};

// 2. Centralizei a URL base
const API_BASE_URL = 'http://34.205.11.57/api';

const RESERVAS_STATS_URL = `${API_BASE_URL}/reservas/stats`;
const RESERVAS_LIST_URL = `${API_BASE_URL}/reservas`;
const MINHAS_RESERVAS_URL = `${API_BASE_URL}/reservas/minhas`;

/**
 * Retorna estatísticas de reservas (por status, produto, categoria, etc, conforme backend).
 * (MODIFICADO PARA USAR FETCH)
 */
export async function fetchReservaStats(params = {}) {
  try {
    const token = getAuthToken(); // Requer token (provavelmente)
    const url = new URL(RESERVAS_STATS_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) {
    console.error("❌ Erro em fetchReservaStats:", error);
    throw error;
  }
}

/**
 * Busca lista de reservas (Admin)
 * (MODIFICADO PARA USAR FETCH)
 */
export async function fetchReservas(params = {}) {
  try {
    const token = getAuthToken(); // Requer token
    const url = new URL(RESERVAS_LIST_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) {
    console.error("❌ Erro em fetchReservas:", error);
    throw error;
  }
}

/**
 * Cria uma nova reserva para o aluno logado.
 * Rota: POST /api/reservas (Aluno)
 */
export async function createReserva(reservaData) {
  try {
    const token = getAuthToken(); // PEGA O TOKEN
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login.');
    }
    
    console.log('📦 Criando nova reserva...', reservaData);
    
    const response = await fetch(RESERVAS_LIST_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // ENVIA O TOKEN
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservaData)
    });

    if (!response.ok) {
      // O erro 403 (ou outro) virá aqui
      const errorText = await response.text();
      console.error('❌ Erro da API ao criar reserva:', response.status, errorText);
      // Retorna o JSON de erro da API
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(JSON.stringify(errorJson)); 
      } catch (e) {
        throw new Error(errorText || `Erro ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Reserva criada:', data);
    return data;
    
  } catch (error) {
    console.error("❌ Erro em createReserva:", error);
    throw error; // Propaga o erro para o Carrinho.js tratar
  }
}

/**
 * Retorna a lista de todas as reservas feitas pelo aluno logado.
 * Rota: GET /api/minhas (Aluno)
 */
export async function fetchMinhasReservas() {
  try {
    const token = getAuthToken(); // PEGA O TOKEN
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login.');
    }

    console.log('🧑‍🎓 Buscando minhas reservas...');
    
    const response = await fetch(MINHAS_RESERVAS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // ENVIA O TOKEN
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API ao buscar minhas reservas:', errorText);
      throw new Error(errorText || `Erro ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Minhas reservas recebidas:', data);
    return data;
  } catch (error) {
    console.error("❌ Erro em fetchMinhasReservas:", error);
    throw error;
  }
}

// (Cole isso no final do seu reservasService.js)

// --- FUNÇÕES DE ATUALIZAÇÃO DE STATUS (CORRIGIDAS) ---

// Helper centralizado para requisições PATCH autenticadas
// (Não precisa de body, pois a ação está na URL)
async function makeAuthPatchRequest(url) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado.');
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Erro da API:', errorText);
    throw new Error(errorText || `Erro ${response.status}`);
  }

  // A API pode retornar um corpo (o objeto atualizado) ou apenas um status 200 OK
  const responseBody = await response.text();
  try {
    return JSON.parse(responseBody); // Tenta retornar como JSON
  } catch (e) {
    return responseBody; // Retorna como texto se não for JSON (ex: "OK")
  }
}


export async function aprovarRetirada(id) {
  console.log(`🔃 Aprovando retirada ${id}...`);
  const url = `${RESERVAS_LIST_URL}/${id}/concluir`;
  return makeAuthPatchRequest(url);
}
/**
 * APROVA uma reserva (Admin).
 * Rota: PATCH /api/reservas/{id}/aprovar
 */
export async function aprovarReserva(id) {
  console.log(`🔃 Aprovando reserva ${id}...`);
  const url = `${RESERVAS_LIST_URL}/${id}/aprovar`;
  return makeAuthPatchRequest(url);
}

/**
 * REJEITA uma reserva (Admin).
 * Rota: PATCH /api/reservas/{id}/rejeitar
 */
export async function rejeitarReserva(id) {
  console.log(`🔃 Rejeitando reserva ${id}...`);
  const url = `${RESERVAS_LIST_URL}/${id}/rejeitar`;
  return makeAuthPatchRequest(url);
}

/**
 * CANCELA uma reserva (Admin ou Aluno).
 * Rota: PATCH /api/reservas/{id}/cancelar
 */
export async function cancelarReserva(id) {
  console.log(`🔃 Cancelando reserva ${id}...`);
  const url = `${RESERVAS_LIST_URL}/${id}/cancelar`;
  return makeAuthPatchRequest(url);
}


export default {
  fetchReservaStats,
  fetchReservas,
  createReserva,
  fetchMinhasReservas
};