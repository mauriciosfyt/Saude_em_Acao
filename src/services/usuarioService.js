// URL base da nossa API para endpoints de usuário.
// Em produção, defina VITE_API_BASE_URL na Vercel (ex: https://saudeemacao.onrender.com)
// Se a variável não estiver definida, usamos o caminho relativo '/api' (funciona com o rewrite do Vercel).
// Força a base URL do backend (caso a variável de ambiente não exista)
const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://34.205.11.57') + '/api';


// --- Funções Auxiliares ---

// Função para obter o token de autenticação (ex: do localStorage)
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('authToken') || null;
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

// CORREÇÃO em usuarioService.js
export async function getAllAlunos() { // Remover o parâmetro token
  try {
    const token = getAuthToken(); // Usar a função interna
    const response = await fetch(`${API_URL}/aluno`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro em getAllAlunos:', error);
    throw new Error('Falha ao buscar alunos.');
  }
}

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

/**
 * Exclui um Aluno específico.
 * Rota: DELETE /aluno/{id}
 * @param {string} id - O ID do aluno a ser excluído.
 */
export const deleteAluno = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/aluno/${id}`, { // Usando /aluno/{id} conforme a documentação
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Falha ao excluir aluno.');
    return response.ok; // Retorna true em caso de sucesso
  } catch (error) {
    console.error(`Erro ao excluir aluno ${id}:`, error);
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
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    console.log('🔐 Buscando professores com token:', token.substring(0, 20) + '...');
    
    const response = await fetch(`${API_URL}/professor`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Status da resposta professores:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Professores recebidos com sucesso:', data);
    return data;
    
  } catch (error) {
    console.error("❌ Erro em getAllProfessores:", error);
    throw new Error(error.message || 'Falha ao buscar professores.');
  }
};

export const updateProfessor = async (id, dadosProfessor) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/professor/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosProfessor)
    });
    if (!response.ok) throw new Error('Falha ao atualizar professor.');
    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar professor ${id}:`, error);
    throw error;
  }
};

export const deleteProfessor = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/professor/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Falha ao excluir professor.');
    }
    
    return response.ok;
  } catch (error) {
    console.error(`❌ Erro ao excluir professor ${id}:`, error);
    throw error;
  }
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