// URL base da nossa API
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://52.91.126.52:8080') + '/api';
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

// Lista padrão dos dias da semana (normalizada) — usada para garantir chaves mesmo quando ausentes
const WEEK_DAYS = ['SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO','DOMINGO'];

// Helper para debug: retorna um array legível com chave e descrição do valor (file/name ou string)
const debugFormDataEntries = (fd) => {
  try {
    return Array.from(fd.entries()).map(([k, v]) => {
      if (v instanceof File) return [k, `(File) ${v.name}`];
      try {
        const s = String(v);
        // corta strings longas
        return [k, s.length > 200 ? s.slice(0, 200) + '…' : s];
      } catch (e) {
        return [k, String(v)];
      }
    });
  } catch (e) {
    return [['<error>', String(e)]];
  }
};

// Constroi FormData especificamente para o formato esperado pelo backend Spring.
// Gera chaves no formato: exerciciosPorDia[SEGUNDA][0].nome, exerciciosPorDia[SEGUNDA][0].repeticoes, ...
const buildTreinoFormData = (treinoData) => {
  const fd = new FormData();
  if (!treinoData || typeof treinoData !== 'object') return fd;

  // Append campos simples (exceto exerciciosPorDia)
  Object.keys(treinoData).forEach((key) => {
    if (key === 'exerciciosPorDia') return;
    const val = treinoData[key];
    if (val === undefined || val === null) return;
    if (val instanceof File) fd.append(key, val, val.name);
    else if (typeof val === 'object') fd.append(key, JSON.stringify(val));
    else fd.append(key, String(val));
  });

  // Normaliza mapa de dias: { 'SEGUNDA': [...], 'TERCA': [...] }
  const rawMap = treinoData.exerciciosPorDia || {};
  const normMap = {};
  Object.keys(rawMap).forEach((k) => {
    normMap[normalizeDia(k)] = rawMap[k];
  });

  // Helper recursivo para anexar objetos/arrays usando notação 'base[index].prop'
  const appendRecursive = (baseKey, value) => {
    if (value === null || value === undefined) return;
    if (value instanceof File) {
      fd.append(baseKey, value, value.name);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, idx) => appendRecursive(`${baseKey}[${idx}]`, item));
      return;
    }
    if (typeof value === 'object') {
      Object.keys(value).forEach((prop) => {
        const v = value[prop];
        appendRecursive(`${baseKey}.${prop}`, v);
      });
      return;
    }
    // primitivo
    fd.append(baseKey, String(value));
  };

  // Para cada dia da semana, anexa os exercícios detalhados ou adiciona lista vazia
  WEEK_DAYS.forEach((dia) => {
    const arr = Array.isArray(normMap[dia]) ? normMap[dia] : [];
    if (arr.length === 0) {
      // se não houver exercícios para o dia, não adiciona chave — evita binding incorreto no backend
      return;
    }
    arr.forEach((ex, idx) => appendRecursive(`exerciciosPorDia[${dia}][${idx}]`, ex));
  });

  return fd;
};
export const createTreino = async (treinoData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado. Faça login novamente.');

    const formData = treinoData instanceof FormData ? treinoData : buildTreinoFormData(treinoData);

    console.debug('--- FormData (enviado) ---');
    console.debug(debugFormDataEntries(formData));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao criar treino: ${errorText || response.status}`);
    }

    return await response.json();
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
    const formData = treinoData instanceof FormData ? treinoData : buildTreinoFormData(treinoData);

    // DEBUG opcional
    console.debug('--- Update FormData (enviado) ---');
    console.debug(debugFormDataEntries(formData));

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
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
/**
 * Lista todos os treinos com filtros opcionais.
 * Rota: GET /api/treinos (Pública)
 * @param {Object} filtros - Filtros opcionais: { nome, tipo, responsavelId }
 */
export const getAllTreinos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.responsavelId) params.append('responsavelId', filtros.responsavelId);

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}: Falha ao buscar treinos`);
    return await response.json();
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
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Treino não encontrado');
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar treino`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Erro em getTreinoById(${id}):`, error);
    throw error;
  }
};