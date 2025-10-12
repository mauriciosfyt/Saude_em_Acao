// URL base da nossa API para endpoints de usuário.
// Em produção, defina VITE_API_BASE_URL na Vercel (ex: https://saudeemacao.onrender.com)
// Se a variável não estiver definida, usamos o caminho relativo '/api' (funciona com o rewrite do Vercel).
const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api';

// --- Funções Auxiliares ---

// Função para obter o token de autenticação (ex: do localStorage)
const getAuthToken = () => {
  // Substitua 'authToken' pela chave que você usa para guardar o token JWT
  return localStorage.getItem('authToken'); 
};


// --- Funções de Aluno ---

/**
 * Cria um novo usuário com o perfil de Aluno.
 * Rota: POST /aluno
 * @param {object} dadosAluno - Os dados do aluno a serem criados.
 */
export const createAluno = async (dadosAluno) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/aluno`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosAluno)
    });
    if (!response.ok) throw new Error('Falha ao criar aluno.');
    return await response.json();
  } catch (error) {
    console.error("Erro em createAluno:", error);
    throw error;
  }
};

/**
 * Lista todos os usuários com perfil de Aluno.
 * Rota: GET /aluno
 */
export const getAllAlunos = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/aluno`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar alunos.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getAllAlunos:", error);
    throw error;
  }
};

/**
 * Atualiza os dados de um Aluno específico.
 * Rota: PUT /aluno/{id}
 * @param {string} id - O ID do aluno a ser atualizado.
 * @param {object} dadosAluno - Os novos dados do aluno.
 */
export const updateAluno = async (id, dadosAluno) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/aluno/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosAluno)
    });
    if (!response.ok) throw new Error('Falha ao atualizar aluno.');
    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar aluno ${id}:`, error);
    throw error;
  }
};


// --- Funções de Professor (seguem o mesmo padrão) ---

export const createProfessor = async (dadosProfessor) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/professor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosProfessor)
    });
    if (!response.ok) throw new Error('Falha ao criar professor.');
    return await response.json();
  } catch (error) {
    console.error("Erro em createProfessor:", error);
    throw error;
  }
};

export const getAllProfessores = async () => {
  try {
    const token = getAuthToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/professor`, { headers });
    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || 'Falha ao buscar professores.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em getAllProfessores:", error);
    throw error;
  }
};

export const updateProfessor = async (id, dadosProfessor) => {
  // ... implementação similar a updateAluno ...
};


// --- Funções de Admin (seguem o mesmo padrão) ---

export const createAdmin = async (dadosAdmin) => {
    // ... implementação similar a createAluno ...
};

export const getAllAdmins = async () => {
    // ... implementação similar a getAllAlunos ...
};

export const updateAdmin = async (id, dadosAdmin) => {
    // ... implementação similar a updateAluno ...
};


// --- Funções Gerais de Usuário ---

/**
 * Busca os dados de um usuário de qualquer perfil pelo ID.
 * Rota: GET /usuario/{id}
 */
export const getUsuarioById = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/usuario/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Usuário não encontrado.');
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    throw error;
  }
};

/**
 * Exclui um usuário de qualquer perfil pelo ID.
 * Rota: DELETE /usuario/{id}
 */
export const deleteUsuario = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/usuario/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Falha ao excluir usuário.');
    // Métodos DELETE podem não retornar corpo, então checamos apenas o status
    return response.ok;
  } catch (error) {
    console.error(`Erro ao excluir usuário ${id}:`, error);
    throw error;
  }
};


// --- Funções do Usuário Logado ---

/**
 * Retorna os dados completos do perfil do usuário que está logado.
 * Rota: GET /meu-perfil
 */
export const getMeuPerfil = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Nenhum token encontrado.');
    
    const response = await fetch(`${API_URL}/meu-perfil`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar perfil.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getMeuPerfil:", error);
    throw error;
  }
};

/**
 * Permite que o usuário logado exclua a sua própria conta.
 * Rota: DELETE /me
 */
export const deleteMinhaConta = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Nenhum token encontrado.');

    const response = await fetch(`${API_URL}/me`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Falha ao excluir a conta.');
    return response.ok;
  } catch (error) {
    console.error("Erro em deleteMinhaConta:", error);
    throw error;
  }
};