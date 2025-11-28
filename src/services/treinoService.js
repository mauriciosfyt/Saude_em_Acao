// URL base da nossa API
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://54.81.240.117') + '/api';
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
// Helper: normaliza dia (remove acentos e coloca em MAIÚSCULAS)
const normalizeDia = (dia) => {
  if (!dia && dia !== 0) return dia;
  return String(dia)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // remove acentos
    .toUpperCase()
    .replace(/\s+/g, '');
};

const objectToFormData = (obj, formData = new FormData(), parentKey = '') => {
  if (obj === null || obj === undefined) return formData;

  // Arquivo direto
  if (obj instanceof File) {
    if (parentKey) formData.append(parentKey, obj, obj.name);
    return formData;
  }

  // Arrays => parentKey[index] e continuar recursão
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const itemKey = parentKey ? `${parentKey}[${index}]` : `${index}`;
      objectToFormData(item, formData, itemKey);
    });
    return formData;
  }

  // Objetos (mapas/objetos aninhados)
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      let newKey;

      if (parentKey) {
        // Caso especial: o mapa de dias deve usar bracket com CHAVE do dia NORMALIZADA
        // ex: exerciciosPorDia[SEGUNDA] -> exerciciosPorDia[SEGUNDA]
        if (parentKey === 'exerciciosPorDia') {
          newKey = `${parentKey}[${normalizeDia(key)}]`;
        } else {
          // Se já temos um índice (ex: exerciciosPorDia[SEGUNDA][0]) anexamos propriedade com ponto
          if (/\[\d+\]$/.test(parentKey) || /\]\[\d+\]$/.test(parentKey) || /\]\[/.test(parentKey)) {
            newKey = `${parentKey}.${key}`;
          } else {
            newKey = `${parentKey}.${key}`;
          }
        }
      } else {
        newKey = key;
      }

      objectToFormData(value, formData, newKey);
    });
    return formData;
  }

  // Valor primitivo
  if (parentKey) {
    formData.append(parentKey, String(obj));
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

    // Constrói FormData
    const formData = treinoData instanceof FormData ? treinoData : objectToFormData(treinoData);

    // DEBUG: logar todas as entradas para inspeção (antes do envio)
    console.debug('--- FormData original ---');
    for (const pair of formData.entries()) {
      console.debug('FormData', pair[0], pair[1]);
    }

    // Filtra entradas indesejadas que podem causar binding errado no Spring
    const filtered = new FormData();
    const plainMapKeyRegex = /^exerciciosPorDia\[[^\]]+\]$/;

    // remove entradas com chave "null" (caso existam) e normalize keys de dias
    for (const pair of formData.entries()) {
      const key = pair[0];
      const value = pair[1];

      // pule qualquer entrada com chave "null"
      if (key === 'null') continue;

      // Se for chave de dia sem índice (ex: exerciciosPorDia[QUARTA]) e existir
      // detalhes indexados para esse dia, pule a chave plana.
      if (plainMapKeyRegex.test(key)) {
        // vamos verificar se há alguma entrada detalhada para esse dia; se houver, pule-a
        const dayName = key.match(/^exerciciosPorDia\[(.+)\]$/)?.[1];
        const normalizedDay = dayName ? normalizeDia(dayName) : dayName;
        const hasDetail = Array.from(formData.keys()).some(k => k.startsWith(`exerciciosPorDia[${normalizedDay}][`));
        if (hasDetail) continue;
        // se não houver detalhe e o value for Blob/JSON vazio, mantenha — caso contrário pule
        if (value instanceof File) continue; // não anexar file direto nesse key
        // se value for string vazia ou "[]" mantemos como blob para evitar binding incorreto
        if (String(value).trim() === '' || String(value).trim() === '[]') {
          filtered.append(key, new Blob([JSON.stringify([])], { type: 'application/json' }));
          continue;
        }
        // caso geral: pule
        continue;
      }

      // Normal append (tratando Files)
      if (value instanceof File) filtered.append(key, value, value.name);
      else filtered.append(key, value);
    }

    // Garante adicionar dias vazios como JSON blob (usa chaves normalizadas)
    if (treinoData && treinoData.exerciciosPorDia && typeof treinoData.exerciciosPorDia === 'object') {
      Object.keys(treinoData.exerciciosPorDia).forEach((diaKey) => {
        const diaUpper = normalizeDia(diaKey);
        const arr = treinoData.exerciciosPorDia[diaKey] || [];
        if (Array.isArray(arr) && arr.length === 0) {
          // só adiciona se ainda não existir entrada detalhada
          const plainKey = `exerciciosPorDia[${diaUpper}]`;
          const exists = Array.from(filtered.keys()).some(k => k === plainKey || k.startsWith(`exerciciosPorDia[${diaUpper}][`));
          if (!exists) filtered.append(plainKey, new Blob([JSON.stringify([])], { type: 'application/json' }));
        }
      });
    }
    
    console.debug('--- FormData final (enviado) ---');
    for (const pair of filtered.entries()) {
      console.debug('Final FormData', pair[0], pair[1]);
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: filtered,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao criar treino: ${errorText || response.status}`);
    }

    const data = await response.json();
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

    // Constrói FormData da mesma forma que createTreino (inclui tratamento para dias vazios)
    let formData = treinoData instanceof FormData ? treinoData : objectToFormData(treinoData);

    // Filtra entradas indesejadas (remove chaves planas exerciciosPorDia[SEGUNDA] quando há índices)
    const filtered = new FormData();
    const plainMapKeyRegex = /^exerciciosPorDia\[[^\]]+\]$/;

    for (const pair of formData.entries()) {
      const key = pair[0];
      const value = pair[1];
      if (plainMapKeyRegex.test(key)) {
        // pule chaves planas — vamos adicionar blobs vazios explicitamente abaixo quando necessário
        continue;
      }
      if (value instanceof File) filtered.append(key, value, value.name);
      else filtered.append(key, value);
    }

    // Anexa blobs JSON vazios para dias definidos no objeto mas sem exercícios (evita binding para String)
    if (treinoData && treinoData.exerciciosPorDia && typeof treinoData.exerciciosPorDia === 'object') {
      Object.keys(treinoData.exerciciosPorDia).forEach((diaKey) => {
        const diaUpper = String(diaKey).toUpperCase();
        const arr = treinoData.exerciciosPorDia[diaKey] || [];
        if (Array.isArray(arr) && arr.length === 0) {
          filtered.append(`exerciciosPorDia[${diaUpper}]`, new Blob([JSON.stringify([])], { type: 'application/json' }));
        }
      });
    }

    // DEBUG opcional
    for (const pair of filtered.entries()) {
      console.debug('Update FormData', pair[0], pair[1]);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: filtered,
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