// URL base da nossa API para endpoints de usuário.
// Em produção, defina VITE_API_BASE_URL na Vercel (ex: https://saudeemacao.onrender.com)
// Se a variável não estiver definida, usamos o caminho relativo '/api' (funciona com o rewrite do Vercel).
// Força a base URL do backend (caso a variável de ambiente não exista)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://52.91.126.52:8080') + '/api';


// --- Funções Auxiliares ---

// Função para obter o token de autenticação (ex: do localStorage)
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('authToken') || null;
};


// --- Funções de Aluno ---


/**
 * Cria um novo usuário com o perfil de Aluno.
 * Rota: POST /aluno
 * @param {FormData} dadosFormulario - Os dados do aluno (incluindo a imagem)
 */
export const createAluno = async (dadosFormulario) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    console.log('Enviando dados do aluno (FormData)...');
    
    const response = await fetch(`${API_URL}/aluno`, { // Endpoint /aluno
      method: 'POST',
      headers: {
        // --- CORREÇÃO AQUI ---
        // NÃO definimos 'Content-Type' para FormData
        'Authorization': `Bearer ${token}`
      },
      // --- CORREÇÃO AQUI ---
      body: dadosFormulario // Envia o FormData
    });

    // Usar a mesma lógica de resposta de texto
    const responseText = await response.text();

    if (!response.ok) {
      // Se a resposta foi um erro, o texto é o JSON de erro
      try {
        const erroJson = JSON.parse(responseText);
        // Lança o erro com a mensagem da API (que você viu)
        throw new Error(JSON.stringify(erroJson)); 
      } catch (e) {
        throw new Error(responseText || 'Falha ao criar aluno.');
      }
    }
    
    // Sucesso
    if (responseText.length === 0) {
      return { success: true, message: 'Criado com sucesso.' };
    }
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { success: true, message: responseText };
    }

  } catch (error) {
    console.error('Erro em createAluno:', error);
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
    
    console.log('🔍 Iniciando getAllAlunos...');
    console.log('🔑 Token existe:', !!token);
    console.log('📍 API_URL:', API_URL);
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    // Tenta primeiro sem incluir dados aninhados
    const response = await fetch(`${API_URL}/aluno?exclude=treino`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Status text:', response.statusText);

    if (!response.ok) {
      // Se falhar com o parâmetro exclude, tenta sem ele
      console.log('⚠️ Falhou com exclude=treino, tentando sem parâmetro...');
      const retryResponse = await fetch(`${API_URL}/aluno`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status da resposta (retry):', retryResponse.status);

      if (!retryResponse.ok) {
        let errorBody = '';
        try {
          errorBody = await retryResponse.text();
          console.log('❌ Corpo da resposta de erro:', errorBody);
        } catch (e) {
          console.log('❌ Não foi possível ler o corpo do erro');
        }
        
        throw new Error(`Erro HTTP ${retryResponse.status}: ${errorBody || 'Sem detalhes'}`);
      }

      const data = await retryResponse.json();
      console.log('✅ Resposta bruta da API (retry):', data);
      return processarAlunos(data);
    }

    const data = await response.json();
    console.log('✅ Resposta bruta da API:', data);
    const processed = processarAlunos(data);
    try {
      // Salva em cache para fallback caso o backend falhe no futuro
      localStorage.setItem('alunos_cache', JSON.stringify(processed));
    } catch (e) {
      console.warn('⚠️ Não foi possível gravar cache de alunos:', e.message);
    }
    return processed;
  } catch (error) {
    console.error('❌ Erro em getAllAlunos:', error.message);

    // Tenta usar o cache local se disponível
    try {
      const cached = localStorage.getItem('alunos_cache');
      if (cached) {
        console.warn('⚠️ Usando cache local de alunos devido a erro na API.');
        const parsed = JSON.parse(cached);
        return parsed;
      }
    } catch (e) {
      console.warn('⚠️ Falha ao ler cache de alunos:', e.message);
    }

    // Se não houver cache, propaga o erro para o caller tratar (com mensagem na UI)
    throw error;
  }
}

// Função auxiliar para processar alunos
function processarAlunos(data) {
  console.log('📊 Tipo de resposta:', Array.isArray(data) ? 'Array' : typeof data);
  
  // Se a resposta for um array, filtra alunos com problemas
  if (Array.isArray(data)) {
    const alunosValidos = data.filter((aluno, index) => {
      try {
        // Valida se o aluno tem dados básicos
        if (!aluno) {
          console.warn(`⚠️ Aluno no índice ${index} é null/undefined`);
          return false;
        }
        
        // Tratamento para diferentes formatos que o backend pode retornar em 'treino'
        // 1) objeto válido -> tenta garantir que tenha id
        // 2) booleano (true/false) -> normaliza removendo o objeto e marcando flag
        // 3) outros valores inesperados -> remove para evitar erros
        if (aluno.treino !== undefined && aluno.treino !== null) {
          const t = aluno.treino;
          // se veio como booleano (ex: true/false), normaliza
          if (typeof t === 'boolean') {
            aluno.hasTreino = !!t; // indica presença, mas sem detalhes
            aluno.treino = null;
          } else if (typeof t === 'object') {
            // se for objeto, assegura que tenha id; caso contrário, limpa treino
            if (!t.id && !t.getId) {
              console.warn(`⚠️ Aluno ${aluno.email || aluno.id || 'unknown'} tem treino inválido, removendo...`);
              aluno.treino = null;
            }
          } else {
            console.warn(`⚠️ Aluno ${aluno.email || aluno.id || 'unknown'} retornou treino em formato inesperado (${typeof t}), removendo...`);
            aluno.treino = null;
          }
        }
        
        return true;
      } catch (e) {
        console.warn(`⚠️ Erro ao validar aluno no índice ${index}:`, e.message);
        return false;
      }
    });
    
    if (alunosValidos.length < data.length) {
      console.log(`📊 Filtrados ${data.length - alunosValidos.length} aluno(s) com dados inválidos`);
    }
    console.log(`📊 Total de alunos válidos: ${alunosValidos.length}`);
    
    return alunosValidos;
  }
  
  // Se não for um array, retorna como está
  return data;
}

/**
 * Atualiza os dados de um Aluno específico.
 * Rota: PUT /aluno/{id}
 * @param {string} id - O ID do aluno a ser atualizado.
 * @param {object} dadosAluno - Os novos dados do aluno.
 */
export const updateAluno = async (id, dadosAluno) => {
  try {
    // Suporta atualizar via JSON (objeto) ou FormData (multipart)
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const isFormData = typeof FormData !== 'undefined' && dadosAluno instanceof FormData;

    console.log('🔄 Atualizando aluno:', id);
    console.log('📦 Tipo de dados:', isFormData ? 'FormData' : 'JSON');
    
    if (isFormData) {
      // Log cada campo do FormData
      console.log('📋 Campos do FormData:');
      for (const [key, value] of dadosAluno.entries()) {
        if (value instanceof File) {
          console.log(`  - ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`  - ${key}: ${value}`);
        }
      }
    }

    const response = await fetch(`${API_URL}/aluno/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: isFormData ? {
        'Authorization': `Bearer ${token}`
      } : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: isFormData ? dadosAluno : JSON.stringify(dadosAluno)
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('❌ Erro na resposta:', response.status, responseText);
      try {
        const erroJson = JSON.parse(responseText);
        throw new Error(erroJson.message || 'Falha ao atualizar aluno.');
      } catch (e) {
        throw new Error(responseText || 'Falha ao atualizar aluno.');
      }
    }

    console.log('✅ Aluno atualizado com sucesso!');

    if (responseText.length === 0) {
      return { success: true, message: 'Atualizado com sucesso.' };
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { success: true, message: responseText };
    }
  } catch (error) {
    console.error(`Erro ao atualizar aluno ${id}:`, error);
    throw error;
  }
};

/**
 * Busca um Aluno pelo ID.
 * Rota: GET /aluno/{id}
 */
export const getAlunoById = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await fetch(`${API_URL}/aluno/${encodeURIComponent(id)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text();

    if (!response.ok) {
      try {
        const err = JSON.parse(text);
        throw new Error(err.message || `Erro HTTP ${response.status}`);
      } catch (e) {
        throw new Error(text || `Erro HTTP ${response.status}`);
      }
    }

    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      return { message: text };
    }
  } catch (error) {
    console.error(`Erro em getAlunoById(${id}):`, error);
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

/**
 * Associa (adiciona) um treino a um aluno usando PATCH
 * Rota: PATCH /api/aluno/{alunoId}/treino
 * @param {string} alunoId - ID do aluno
 * @param {string|number} treinoId - ID do treino a ser associado
 */
export const patchAddTreinoToAluno = async (alunoId, treinoId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado. Faça login novamente.');

    if (!alunoId) throw new Error('alunoId é obrigatório');
    if (!treinoId && treinoId !== 0) throw new Error('treinoId é obrigatório');

    console.log(`🔧 Associando treino ${treinoId} ao aluno ${alunoId} via PATCH /aluno/${alunoId}/treino`);

    const response = await fetch(`${API_URL}/aluno/${encodeURIComponent(alunoId)}/treino`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ treinoId })
    });

    const text = await response.text();

    if (!response.ok) {
      try {
        const err = JSON.parse(text);
        throw new Error(err.message || `Falha ao associar treino: ${response.status}`);
      } catch (e) {
        throw new Error(text || `Falha ao associar treino: ${response.status}`);
      }
    }

    if (!text) return { success: true };
    try {
      return JSON.parse(text);
    } catch (e) {
      return { success: true, message: text };
    }

  } catch (error) {
    console.error('Erro em patchAddTreinoToAluno:', error);
    throw error;
  }
};


// --- Funções de Professor (seguem o mesmo padrão) ---
/**
 * Cria um novo usuário com o perfil de Professor.
 * Rota: POST /professor
 * @param {FormData} dadosFormulario - Os dados do professor (incluindo a imagem)
 */
export const createProfessor = async (dadosFormulario) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    console.log('Enviando dados do professor (FormData)...');
    
    const response = await fetch(`${API_URL}/professor`, {
      method: 'POST',
      headers: {
        // NÃO definimos 'Content-Type' aqui.
        // O navegador fará isso automaticamente para FormData
        'Authorization': `Bearer ${token}`
      },
      body: dadosFormulario // Envia o FormData diretamente
    });

    // --- CORREÇÃO AQUI ---
    // Vamos primeiro ler a resposta como TEXTO, pois sabemos que pode não ser JSON
    const responseText = await response.text();

    if (!response.ok) {
      // Se a resposta foi um erro, tentamos parsar o texto como JSON
      // Se falhar, apenas usamos o texto como mensagem de erro
      try {
        const erroJson = JSON.parse(responseText);
        throw new Error(erroJson.message || 'Falha ao criar professor.');
      } catch (e) {
        throw new Error(responseText || 'Falha ao criar professor.');
      }
    }
    
    // Se a resposta FOI OK e o texto está vazio (comum para 201 Created)
    if (responseText.length === 0) {
      return { success: true, message: 'Criado com sucesso.' };
    }

    // Se o texto NÃO está vazio, tentamos parsar como JSON
    try {
      return JSON.parse(responseText);
    } catch (e) {
      // Se falhar o parse (o seu caso: "Unexpected token 'W'...")
      // não tem problema. Apenas retornamos um objeto de sucesso
      // com a string que a API nos deu.
      return { success: true, message: responseText };
    }
    // --- FIM DA CORREÇÃO ---

  } catch (error) {
    console.error('Erro em createProfessor:', error);
    throw error; // Repassa o erro para o handleSubmit
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

/**
 * Atualiza um usuário existente com o perfil de Professor.
 * Rota: PUT /professor/{id}
 * @param {string} id - O ID (CPF) do professor a ser atualizado.
 * @param {FormData} dadosFormulario - Os dados do professor (incluindo a imagem)
 */
export const updateProfessor = async (id, dadosFormulario) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    console.log(`Enviando atualização para o professor (ID/CPF: ${id})...`);
    
    const response = await fetch(`${API_URL}/professor/${id}`, { // <-- URL com ID (CPF)
      method: 'PUT', // <-- Método PUT
      headers: {
        // Novamente, sem 'Content-Type' para FormData
        'Authorization': `Bearer ${token}`
      },
      body: dadosFormulario 
    });

    const responseText = await response.text();

    if (!response.ok) {
      try {
        const erroJson = JSON.parse(responseText);
        throw new Error(erroJson.message || 'Falha ao atualizar professor.');
      } catch (e) {
        throw new Error(responseText || 'Falha ao atualizar professor.');
      }
    }
    
    // Lidar com resposta de sucesso (que pode ser texto)
    if (responseText.length === 0) {
      return { success: true, message: 'Atualizado com sucesso.' };
    }
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { success: true, message: responseText };
    }

  } catch (error) {
    console.error('Erro em updateProfessor:', error);
    throw error;
  }
};

export const deleteProfessor = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/professor/${encodeURIComponent(id)}`, {
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
    const response = await fetch(`${API_URL}/aluno/${id}`, {
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

/**
 * Busca um Professor pelo ID.
 * Rota: GET /professor/{id}
 * @param {string} id - ID do professor
 */
 export const getProfessorById = async (id) => {
   try {
     const token = getAuthToken();
     if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await fetch(`${API_URL}/professor/${encodeURIComponent(id)}`, {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     });

    const text = await response.text();

    if (!response.ok) {
      // tenta extrair mensagem da API
      try {
        const err = JSON.parse(text);
        throw new Error(err.message || `Erro HTTP ${response.status}`);
      } catch (e) {
        throw new Error(text || `Erro HTTP ${response.status}`);
      }
    }

    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      // se não for JSON, retorna texto bruto
      return { message: text };
    }
  } catch (error) {
    console.error(`Erro em getProfessorById(${id}):`, error);
    throw error;
  }
 };