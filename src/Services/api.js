// src/services/api.js (Versão Mobile)

import axios from 'axios';

// MUDANÇA: 'import.meta.env' não existe no Expo.
// Como suas rotas principais já usam o IP absoluto (http://34.205.11.57),
// podemos definir a baseURL diretamente para a raiz da API.
export const API_BASE_URL = 'http://34.205.11.57'; // <-- DEFINA SEU IP DA API AQUI

// Instância axios central
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper para configurar token (PERFEITO, NENHUMA MUDANÇA NECESSÁRIA)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ... (Restante das suas funções) ...

// MUDANÇA: Ajuste as funções que usavam caminhos relativos
export const login = async (email, senha) => {
  try {
    // Agora usa a baseURL + caminho
    const response = await api.post('/api/login', { email, senha }); 
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// MUDANÇA: Ajuste esta também
export const solicitarToken = async (email, senha) => {
  try {
    const response = await api.post('/api/auth/solicitar-token', { email, senha });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// MUDANÇA: Ajuste esta
export const loginComToken = async (email, codigo) => {
  try {
    const response = await api.post('/api/auth/login-token', { email, token: codigo });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// MUDANÇA: Remova o IP fixo daqui, pois já está na baseURL
export const solicitarEsqueciSenha = async (email) => {
  try {
    const response = await api.post('/api/auth/esqueci-senha/solicitar', { 
      email: email.trim().toLowerCase() 
    });
    // ... (resto da lógica de erro)
    return response.data;
  } catch (error) {
    // ... (sua lógica de erro está boa)
    if (error.response?.status === 404) { /* ... */ }
    throw error;
  }
};

// ... Faça o mesmo para 'validarCodigoEsqueciSenha' e 'redefinirSenhaEsquecida' ...
// Remova o 'http://34.205.11.57' e deixe apenas o caminho relativo (ex: '/api/auth/...')

// O 'logout' do api.js não é mais necessário,
// pois o AuthContext agora cuida de limpar o token do Axios.
// export const logout = () => { ... } // PODE REMOVER

// Buscar dados do perfil do usuário logado
export const obterMeuPerfil = async () => {
  try {
    const response = await api.get('/api/meu-perfil');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Buscar todos os treinos disponíveis
export const obterTreinos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.responsavelId) params.append('responsavelId', filtros.responsavelId);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/api/treinos${query}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Buscar treino específico por ID
export const obterTreinoById = async (id) => {
  try {
    const response = await api.get(`/api/treinos/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Buscar desempenho semanal do usuário
export const obterDesempenhoSemanal = async () => {
  try {
    const response = await api.get('/api/treinos/desempenho-semanal');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Registrar treino realizado
export const registrarTreinoRealizado = async (treinoId) => {
  try {
    const response = await api.post(`/api/treinos/${treinoId}/realizar`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Exclusão de Conta (Admin)
export const deleteAdminAccount = async (adminId) => {
  try {
    const response = await api.delete(`/api/admin/${adminId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

export default api;