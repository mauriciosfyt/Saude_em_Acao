// URL base da nossa API
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://34.205.11.57') + '/api';
const API_URL = `${API_BASE_URL}/treinos`;

// Função para obter o token de autenticação
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('authToken') || null;
};

// ====================================================================
// *** INÍCIO DA CORREÇÃO ***
// Esta função foi atualizada para usar NOTAÇÃO DE PONTO (ex: exercicios[0].nome)
// que é o padrão esperado por backends Java/Spring.
// ====================================================================

/**
 * Converte um objeto JS em FormData, lidando com arquivos e objetos/arrays aninhados.
 * Usa notação de ponto para propriedades de objeto (ex: `exercicios[0].nome`) e
 * colchetes para índices de array (ex: `exercicios[0]`).
 *
 * @param {object} obj - O objeto a ser convertido.
 * @param {FormData} [formData] - O FormData existente (para recursão).
 * @param {string} [parentKey] - A chave pai (para recursão).
 */
const objectToFormData = (obj, formData = new FormData(), parentKey = '') => {
  if (obj === null || obj === undefined) {
    // Se o objeto for nulo ou indefinido, não anexe nada
    // ou anexe um valor vazio se a chave pai existir
    if (parentKey) {
      formData.append(parentKey, '');
    }
    return formData;
  }

  // Se o item for um Array
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      // Chave para o item do array: 'parentKey[index]'
      const itemKey = `${parentKey}[${index}]`;
      // Chama recursivamente para o item
      objectToFormData(item, formData, itemKey);
    });
    return formData;
  }

  // Se o item for um Objeto (mas não um File e não um Array)
  if (typeof obj === 'object' && !(obj instanceof File)) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      // *** ESTA É A MUDANÇA PRINCIPAL ***
      // Se a chave pai existir, use NOTAÇÃO DE PONTO para a nova chave
      // Se a chave pai for um array (ex: 'exercicios[0]'), o resultado é 'exercicios[0].nome'
      // Se for o primeiro nível, o resultado é apenas 'nome'
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      // Chama recursivamente para o valor
      objectToFormData(value, formData, newKey);
    });
    return formData;
  }
  
  // Se for um valor primitivo (string, number, boolean) ou um File
  if (parentKey) {
    if (obj instanceof File) {
      formData.append(parentKey, obj, obj.name);
    } else {
      formData.append(parentKey, obj);
    }
  }

  return formData;
};
// ====================================================================
// *** FIM DA CORREÇÃO ***
// ====================================================================


/**
 * Lista todos os treinos com filtros opcionais.
 * Rota: GET /api/treinos (Pública)
 * @param {Object} filtros - Filtros opcionais: { nome, tipo, responsavelId }
 */
export const getAllTreinos = async (filtros = {}) => {
  try {
    console.log('🔍 Buscando treinos...', filtros);
    
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.responsavelId) params.append('responsavelId', filtros.responsavelId);
    
    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar treinos`);
    }
    
    const data = await response.json();
    console.log('✅ Treinos encontrados:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Erro em getAllTreinos:', error);
    throw error;
  }
};

/**
 * Busca um treino específico pelo ID.
 * Rota: GET /api/treinos/{id} (Pública)
 */
export const getTreinoById = async (id) => {
  try {
    console.log(`🔍 Buscando treino por ID: ${id}`);
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Treino não encontrado');
      }
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar treino`);
    }
    
    const data = await response.json();
    console.log('✅ Treino encontrado:', data);
    return data;
    
  } catch (error) {
    console.error(`❌ Erro em getTreinoById(${id}):`, error);
    throw error;
  }
};

/**
 * Cria um novo treino.
 * Rota: POST /api/treinos (Admin/Professor)
 * Envia como 'multipart/form-data' por causa dos exercícios.
 */
export const createTreino = async (treinoData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autorizado. Faça login novamente.');
    }

    console.log('🚀 Enviando treino (FormData):', treinoData);
    
    // A função corrigida será chamada aqui
    const formData = objectToFormData(treinoData);
    
    // Debug: Verifique as chaves geradas no console
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type' não é definido, o browser cuida disso para multipart
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao criar treino: ${errorText || response.status}`);
    }

    const data = await response.json();
    console.log('✅ Treino criado com sucesso:', data);
    return data;

  } catch (error) {
    console.error('❌ Erro em createTreino:', error);
    throw error;
  }
};

/**
 * Atualiza um treino existente.
 * Rota: PUT /api/treinos/{id} (Admin/Professor)
 * Envia como 'multipart/form-data'.
 */
export const updateTreino = async (id, treinoData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autorizado. Faça login novamente.');
    }

    console.log(`🚀 Atualizando treino ${id} (FormData):`, treinoData);
    
    // A função corrigida será chamada aqui
    const formData = objectToFormData(treinoData);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao atualizar treino: ${errorText || response.status}`);
    }

    const data = await response.json();
    console.log('✅ Treino atualizado com sucesso:', data);
    return data;

  } catch (error) {
    console.error(`❌ Erro em updateTreino(${id}):`, error);
    throw error;
  }
};

/**
 * Deleta um treino pelo ID.
 * Rota: DELETE /api/treinos/{id} (Admin/Professor)
 */
export const deleteTreino = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autorizado. Faça login novamente.');
    }

    console.log(`🗑️ Deletando treino: ${id}`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao deletar treino: ${errorText || response.status}`);
    }

    // DELETE pode não retornar conteúdo (204 No Content)
    if (response.status === 204) {
      console.log('✅ Treino deletado com sucesso (204 No Content)');
      return { message: 'Treino deletado com sucesso' };
    }
    
    const data = await response.json();
    console.log('✅ Treino deletado com sucesso:', data);
    return data;

  } catch (error) {
    console.error(`❌ Erro em deleteTreino(${id}):`, error);
    throw error;
  }
};

/**
 * Associa um treino a um aluno.
 * Rota: POST /api/treinos/{id}/associar (Aluno)
 */
export const associarTreino = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autorizado. Faça login novamente.');
    }

    console.log(`🔗 Associando treino ${id} ao aluno...`);

    const response = await fetch(`${API_URL}/${id}/associar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao associar treino: ${errorText || response.status}`);
    }

    const data = await response.json();
    console.log('✅ Treino associado com sucesso:', data);
    return data;

  } catch (error) {
    console.error(`❌ Erro em associarTreino(${id}):`, error);
    throw error;
  }
};

/**
 * Busca os treinos associados ao aluno logado.
 * Rota: GET /api/treinos/meus-treinos (Aluno)
 */
export const getMeusTreinos = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autorizado. Faça login novamente.');
    }

    console.log('📚 Buscando meus treinos...');

    const response = await fetch(`${API_URL}/meus-treinos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar meus treinos`);
    }

    const data = await response.json();
    console.log('✅ Meus treinos encontrados:', data);
    return data;

  } catch (error) {
    console.error('❌ Erro em getMeusTreinos:', error);
    throw error;
  }
};

/**
 * Registra a realização de um treino.
 * Rota: POST /api/treinos/{id}/realizar (Aluno)
 */
export const realizarTreino = async (id) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    console.log(`🏁 Registrando realização do treino ${id}...`);

    const response = await fetch(`${API_URL}/${id}/realizar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao registrar treino: ${errorText || response.status}`);
    }

    const data = await response.json();
    console.log('✅ Treino registrado com sucesso:', data);
    return data;
    
  } catch (error) {
    console.error(`❌ Erro em realizarTreino(${id}):`, error);
    throw error;
  }
};

/**
 * Retorna a lista de treinos que o aluno logado realizou na semana atual.
 * Rota: GET /api/treinos/desempenho-semanal (Aluno)
 */
export const getDesempenhoSemanal = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    console.log('📊 Buscando desempenho semanal...');

    const response = await fetch(`${API_URL}/desempenho-semanal`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar desempenho`);
    }

    const data = await response.json();
    console.log('✅ Desempenho semanal encontrado:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Erro em getDesempenhoSemanal:', error);
    throw error;
  }
};