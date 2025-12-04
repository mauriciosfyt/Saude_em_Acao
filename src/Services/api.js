// src/services/api.js (Versão Mobile)

import axios from 'axios';

// MUDANÇA: 'import.meta.env' não existe no Expo.
// Como suas rotas principais já usam o IP absoluto (http://23.22.153.89),
// podemos definir a baseURL diretamente para a raiz da API.
const API_BASE_URL = 'http://23.22.153.89'; // <-- DEFINA SEU IP DA API AQUI

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

// Validar código de redefinição (opcional)
export const validarCodigoEsqueciSenha = async (email, codigo) => {
  try {
    const payload = { email: String(email).trim().toLowerCase(), token: String(codigo) };
    // Algumas APIs usam '/confirmar' para validar; tentamos o caminho mais comum
    try {
      const response = await api.post('/api/auth/esqueci-senha/confirmar', payload);
      return response.data;
    } catch (err) {
      // fallback para um endpoint só de validação (caso exista)
      const resp = await api.post('/api/auth/esqueci-senha/validar', payload);
      return resp.data;
    }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Redefinir senha usando token recebido por e-mail
export const redefinirSenhaEsquecida = async (email, codigo, novaSenha) => {
  try {
    const payload = { email: String(email).trim().toLowerCase(), token: String(codigo), novaSenha };
    // endpoint documentado comumente é '/confirmar'
    const response = await api.post('/api/auth/esqueci-senha/confirmar', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// O 'logout' do api.js não é mais necessário,
// pois o AuthContext agora cuida de limpar o token do Axios.
// export const logout = () => { ... } // PODE REMOVER

// Atualizar dados do perfil do usuário logado
export const atualizarPerfil = async (perfilDTO) => {
  try {
    const response = await api.put('/api/meu-perfil', perfilDTO);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Mudar senha do usuário logado
export const mudarSenha = async (senhaAtual, novaSenha) => {
  try {
    const payload = { senhaAtual, novaSenha };
    const response = await api.post('/api/meu-perfil/mudar-senha', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Atualizar avatar (upload). `formData` deve ser um FormData contendo o arquivo sob a chave 'avatar' ou conforme a API.
export const atualizarAvatar = async (formData) => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = await api.post('/api/meu-perfil/avatar', formData, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

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
  // Tentamos múltiplos caminhos para compatibilidade com diferentes backends
  const candidatos = [
    '/api/treinos/desempenho-semanal',
    '/treinos/desempenho-semanal',
    '/api/desempenho-semanal',
    '/desempenho-semanal',
  ];

  let lastErr = null;
  for (const path of candidatos) {
      try {
      const resp = await api.get(path);
      return resp.data;
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;
      // Se for erro de autenticação, propagar imediatamente
      if (status === 401 || status === 403) {
        if (err.response && err.response.data) throw err.response.data;
        throw err;
      }
      // tentar próximo candidato
      continue;
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  if (lastErr) {
    if (lastErr.response && lastErr.response.data) throw lastErr.response.data;
    throw lastErr;
  }
  return null;
};

// Buscar histórico anual de exercícios (opcionalmente por ano)
export const obterHistoricoAnualExercicios = async (ano) => {
  try {
    const config = {};
    if (ano !== undefined && ano !== null) config.params = { ano };
    const response = await api.get('/api/treinos/historico-anual-exercicios', config);
    
    return response.data;
  } catch (error) {
    // Erro ao obter histórico anual — propagar para o chamador
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Obter desempenho (métricas) para o mês atual usando o endpoint anual
export const obterDesempenhoMesAtual = async (ano) => {
  try {
    const hoje = new Date();
    const mesIndex = hoje.getMonth(); // 0-11
    const mesAtual = mesIndex + 1; // 1-12
    const anoBusca = ano || hoje.getFullYear();

    // Obter histórico anual e normalizar
    const resp = await obterHistoricoAnualExercicios(anoBusca);

    if (!resp) {
      return { dias: [], treinosRealizados: 0, treinosTotal: 0, dataUltimoTreino: null, itensBrutos: null };
    }

    // A API retorna { resumoMensal: [...], historicoDetalhado: [...] }
    const resumoMensal = resp?.resumoMensal || [];
    const historicoDetalhado = resp?.historicoDetalhado || [];

    

    // Encontrar o mês atual no resumoMensal
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mesNome = meses[mesIndex];
    const resumoMes = resumoMensal.find(r => r.mes === mesNome);

    if (resumoMes) {
    }

    // Contar treinos realizados no mês atual a partir do historicoDetalhado
    // Agrupar por data para contar quantos dias tiveram treino
    const diasComTreino = new Set();
    const treinosRealizadosList = historicoDetalhado.filter(h => {
      try {
        // dataRealizacao vem como "04/12/2025 02:14"
        const partes = h.dataRealizacao?.split(' ') || [];
        const dataParte = partes[0]; // "04/12/2025"
        
        if (!dataParte) return false;
        
        const [dia, mes, ano] = dataParte.split('/');
        const mesNum = parseInt(mes);
        const anoNum = parseInt(ano);
        
        // Filtrar apenas o mês e ano atual
        if (mesNum === mesAtual && anoNum === hoje.getFullYear()) {
          diasComTreino.add(dataParte); // usar data como chave única
          return true;
        }
        return false;
        } catch (e) {
        return false;
      }
    });

    const treinosRealizados = diasComTreino.size; // número de dias com treino
    
    

    // Total planejado: usar totalExercicios do mês ou fallback para historicoDetalhado.length
    let treinosTotal = resumoMes?.totalExercicios || treinosRealizadosList.length || 0;
    
    

    // Data do último treino realizado - ordenar por data decrescente
    let dataUltimoTreino = null;
    if (treinosRealizadosList.length > 0) {
      // helper: parsear 'DD/MM/YYYY HH:mm' ou 'DD/MM/YYYY' em Date
      const parseBRDateTime = (br) => {
        if (!br) return null;
        try {
          const parts = br.split(' ');
          const datePart = parts[0]; // '04/12/2025'
          const timePart = parts[1] || '00:00'; // '02:14'
          const [day, month, year] = datePart.split('/').map(s => parseInt(s, 10));
          const [hour, minute] = timePart.split(':').map(s => parseInt(s, 10));
          if (!day || !month || !year) return null;
          return new Date(year, month - 1, day, hour || 0, minute || 0);
        } catch (e) {
          return null;
        }
      };

      // Ordenar corretamente usando parseBRDateTime
      const sorted = treinosRealizadosList.sort((a, b) => {
        const da = parseBRDateTime(a.dataRealizacao) || new Date(0);
        const db = parseBRDateTime(b.dataRealizacao) || new Date(0);
        return db - da;
      });
      const ultimoExercicio = sorted[0];

      // Extrair apenas a data (sem hora) no formato DD/MM/YYYY
      const dataComHora = ultimoExercicio.dataRealizacao; // "04/12/2025 02:14"
      const dataParte = dataComHora ? dataComHora.split(' ')[0] : null; // "04/12/2025"
      dataUltimoTreino = dataParte;

      
    }

    // Criar array de dias normalizados para o calendário
    const dias = Array.from(diasComTreino).map(dataBR => {
      // dataBR vem como "04/12/2025"
      const [dia, mes, ano] = dataBR.split('/');
      const dateISO = `${ano}-${mes}-${dia}`; // "2025-12-04"
      return {
        date: dateISO,
        realizado: true,
        dataBR: dataBR,
        raw: { dataRealizacao: dataBR }
      };
    });

    
    const result = {
      dias: dias,
      treinosRealizados: treinosRealizados,
      treinosTotal: treinosTotal,
      dataUltimoTreino: dataUltimoTreino,
      itensBrutos: resp,
    };
    return result;
  } catch (error) {
    
    return { dias: [], treinosRealizados: 0, treinosTotal: 0, dataUltimoTreino: null, itensBrutos: null };
  }
};

// Registrar treino realizado
export const registrarTreinoRealizado = async (treinoId, payload = {}) => {
  try {
    // Garantir que treinoId seja string ou número válido
    const id = String(treinoId).trim();
    if (!id || id === 'null' || id === 'undefined') {
      throw new Error('treinoId é obrigatório');
    }
    
    // payload pode conter { exercicios: [ids], parcial: true }
    // Garantir que exercicios seja um array
    const payloadFormatado = {
      exercicios: Array.isArray(payload.exercicios) ? payload.exercicios : (payload.exercicios ? [payload.exercicios] : []),
      parcial: payload.parcial !== undefined ? payload.parcial : false,
    };
    
    // Tentar diferentes formatos de URL (caso a API tenha variações)
    const urlsParaTentar = [
      `/api/treinos/${id}/realizar`,  // Formato documentado
      `/api/treino/${id}/realizar`,   // Singular
      `/api/treinos/realizar`,        // Sem ID no path (ID no body)
    ];
    
    let lastError = null;
    
    for (const url of urlsParaTentar) {
      try {
        
        // Se a URL não tem ID, adicionar ao payload
        const finalPayload = url.includes('/realizar') && !url.includes(`/${id}/`) 
          ? { ...payloadFormatado, treinoId: id }
          : payloadFormatado;
        
        const response = await api.post(url, finalPayload);
        
        
        
        return response.data;
      } catch (err) {
        lastError = err;
        // Se não for erro 404/500, não tentar outras URLs
        const status = err.response?.status;
        if (status && status !== 404 && status !== 500) {
          throw err;
        }
        
        continue;
      }
    }
    
    // Se todas as tentativas falharam, lançar o último erro
    throw lastError || new Error('Falha ao registrar treino: nenhum endpoint funcionou');
    
  } catch (error) {
    
    
    // Se o erro vier do servidor, retornar a mensagem do servidor
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      // Se for uma string, retornar como está
      if (typeof errorData === 'string') {
        throw new Error(errorData);
      }
      // Se for um objeto, tentar extrair a mensagem
      if (typeof errorData === 'object') {
        throw new Error(errorData.message || errorData.error || JSON.stringify(errorData));
      }
      throw errorData;
    }
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

/**
 * Busca produtos, com filtros opcionais por nome ou categoria.
 * (Combina getAllProdutos e getProdutosByCategoria)
 */
export const obterProdutos = async (filtros = {}) => {
  try {
    // A instância 'api' do axios permite passar 'params'
    // que ele mesmo formata na URL (ex: /api/produtos?nome=...&categoria=...)
    const config = {
      params: {
        nome: filtros.nome,
        categoria: filtros.categoria
      }
    };
    // O axios ignora automaticamente parâmetros 'undefined' ou 'null'
    const response = await api.get('/api/produtos', config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

/**
 * Busca os detalhes de um único produto pelo seu ID.
 */
export const obterProdutoPorId = async (id) => {
  try {
    // O caminho relativo é resolvido pela baseURL da instância 'api'
    const response = await api.get(`/api/produtos/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};


// Buscar todos os professores
export const obterProfessores = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    
    // CORRIGIDO: Removido '?' duplicado e usado template literal ``
    const query = params.toString() ? `?${params.toString()}` : '';
    // CORRIGIDO: Usado template literal `` em vez de regex /
    const response = await api.get(`/api/professor${query}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Buscar professor específico por ID
export const obterProfessorById = async (id) => {
  try {
    // CORRIGIDO: Usado template literal `` em vez de regex /
    const response = await api.get(`/api/professor/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

export const criarReserva = async (reservaDTO) => {
  try {
    const response = await api.post('/api/reservas', reservaDTO);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// ===============================================
// FUNÇÕES DE CHAT (usadas por src/Pages/Chat/Chat.js)
// ===============================================

// Busca histórico do chat pelo chatId
export const obterHistoricoChat = async (chatId) => {
  try {
    if (!chatId) throw new Error('chatId é obrigatório para obter o histórico');
    // rota principal documentada: /api/chat/historico/{chatId}
    const response = await api.get(`/api/chat/historico/${chatId}`);
    return response.data;
  } catch (error) {
    // fallback: tentar outros caminhos comuns (compatibilidade com diferentes backends)
    try {
      const alt = await api.get(`/api/chat/${chatId}/mensagens`);
      return alt.data;
    } catch (e2) {
      if (error.response && error.response.data) throw error.response.data;
      throw error;
    }
  }
};

// Envia mensagem para um chat
export const enviarMensagemChat = async (chatId, texto, remetente) => {
  try {
    if (!chatId) throw new Error('chatId é obrigatório para enviar mensagens');
    if (!texto) throw new Error('texto é obrigatório para enviar mensagens');

    // Payload esperado pela sua API (conforme imagem de rotas):
    // { "chatId": "salala", "usuario": "arthur", "conteudo": "Olá" }
    const payload = {
      chatId: String(chatId),
      usuario: remetente || 'usuario',
      conteudo: texto,
    };

    // Primeiro tente o endpoint oficial /api/chat/enviar (mais provável)
    const preferencial = '/api/chat/enviar';
    try {
      const resp = await api.post(preferencial, payload);
      return resp.data;
    } catch (err) {
      // tentativa preferencial falhou — continuar para tentativas alternativas
    }

    // Endpoints alternativos (compatibilidade com outras implementações)
    const attempts = [
      `/api/chat/${chatId}/mensagem`,
      `/api/chat/${chatId}/mensagens`,
      `/api/chat/${chatId}/message`,
    ];

    for (const path of attempts) {
      try {
        const response = await api.post(path, payload);
        return response.data;
      } catch (err) {
        continue;
      }
    }

    throw new Error('Falha ao enviar mensagem: nenhum endpoint retornou sucesso');
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Envia imagem para o chat (suporta uri local/file, data-uri (base64) e urls remotas)
export const enviarImagemChat = async (chatId, uriOrData, remetente) => {
  try {
    if (!chatId) throw new Error('chatId é obrigatório para enviar imagens');
    if (!uriOrData) throw new Error('uri/data da imagem é obrigatório');

    // Remetente padrão
    const usuario = remetente || 'usuario';

    // Se receber uma data-uri (base64) — alguns backends aceitam receber via JSON
    if (String(uriOrData).startsWith('data:image')) {
      // inclue 'tipo' para deixar explícito que é imagem
      const payload = { chatId: String(chatId), usuario, conteudo: String(uriOrData), tipo: 'image' };
      // tentar endpoints que aceitam JSON com data-uri
      const jsonCandidates = ['/api/chat/enviar', '/api/chat/enviar-imagem', `/api/chat/${chatId}/mensagem`];
      for (const path of jsonCandidates) {
        try {
          const resp = await api.post(path, payload);
          return resp.data;
        } catch (err) {
          continue;
        }
      }
      // se nada funcionou, lance o erro original
      throw new Error('Nenhum endpoint aceitou o data-uri como JSON');
    }

    // Se for uma URI remota (http/https) — tratamos como URL e tentamos enviar como mensagem normal
    const isRemote = String(uriOrData).startsWith('http');
    if (isRemote) {
      // muitas APIs aceitam que a 'conteudo' seja uma URL de imagem
      try {
        const resp = await enviarMensagemChat(chatId, String(uriOrData), usuario);
        return resp;
      } catch (err) {
        // fallback enviarMensagemChat falhou — continuar
      }
    }

    // Caso seja URI local (file://, content:// ou asset://) — montar FormData
    const uri = String(uriOrData);
    const filename = uri.split('/').pop().split('?')[0] || `photo_${Date.now()}.jpg`;
    const ext = (filename.split('.').pop() || '').toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'gif') mimeType = 'image/gif';
    else if (ext === 'webp') mimeType = 'image/webp';

    // Paths candidatos para upload multipart
    const candidates = [
      '/api/chat/enviar-imagem',
      '/api/chat/enviar',
      `/api/chat/${chatId}/imagem`,
      `/api/chat/${chatId}/upload`,
      `/api/chat/${chatId}/mensagem`,
    ];

    // Tentamos chaves diferentes para o arquivo (algumas APIs esperam 'imagem', outras 'file')
    const fileKeys = ['imagem', 'file', 'arquivo', 'image'];

    // Não forçamos Content-Type — axios/setters cuidam do boundary em FormData.
    for (const path of candidates) {
      for (const key of fileKeys) {
        try {
          const formData = new FormData();
          // campos úteis para a API identificar o chat / remetente
          formData.append('chatId', String(chatId));
          formData.append('usuario', usuario);
          formData.append('tipo', 'image');
          formData.append(key, { uri, name: filename, type: mimeType });

          const resp = await api.post(path, formData);
          if (resp?.data) return resp.data;
        } catch (err) {
          continue;
        }
      }
    }

    // Ultimate fallback: enviar uri como texto via enviarMensagemChat
    try {
      const fallback = await enviarMensagemChat(chatId, String(uriOrData), usuario);
      return fallback;
    } catch (err) {
      // fallback também falhou
    }

    throw new Error('Falha ao enviar imagem: nenhum endpoint aceitou a imagem');
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Apaga uma mensagem do chat no servidor
export const apagarMensagemChat = async (chatId, mensagemId) => {
  try {
    if (!mensagemId) throw new Error('mensagemId é obrigatório para apagar mensagem');

    // A API documentada usa: DELETE /api/chat/deletar/{id}
    const preferencial = `/api/chat/deletar/${mensagemId}`;
    try {
      const resp = await api.delete(preferencial);
      return resp.data;
    } catch (err) {
      // tentativa preferencial falhou — continuar
    }

    // Endpoints prováveis alternativos
    const attempts = [
      `/api/chat/${chatId}/mensagem/${mensagemId}`,
      `/api/chat/mensagem/${mensagemId}`,
      `/api/chat/${chatId}/mensagens/${mensagemId}`,
    ];

    for (const path of attempts) {
      try {
        const response = await api.delete(path);
        return response.data;
      } catch (err) {
        continue;
      }
    }

    // fallback via POST apagar
    try {
      const resp = await api.post(`/api/chat/${chatId}/mensagem/apagar`, { id: mensagemId });
      return resp.data;
    } catch (err) {
      // fallback POST falhou — continuar
    }

    throw new Error('Falha ao apagar mensagem: endpoint não disponível');
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Apaga todo o histórico do chat
export const apagarHistoricoChat = async (chatId) => {
  try {
    if (!chatId) throw new Error('chatId é obrigatório para apagar histórico');

    // endpoint documentado tentado primeiro
    try {
      const response = await api.delete(`/api/chat/historico/${chatId}`);
      return response.data;
    } catch (err) {
      // fallback
    }

    // outras variações comuns
    const attempts = [
      `/api/chat/${chatId}/historico`,
      `/api/chat/${chatId}/mensagens`,
    ];

    for (const path of attempts) {
      try {
        const response = await api.delete(path);
        return response.data;
      } catch (err) {
        continue;
      }
    }

    // Se nenhum endpoint DELETE específico existir, tentamos apagar as mensagens
    // individualmente usando DELETE /api/chat/deletar/{id} (conforme documentado).
    try {
      const historico = await obterHistoricoChat(chatId);
      // obterHistoricoChat pode retornar array direto ou objeto com propriedade
      const items = Array.isArray(historico)
        ? historico
        : Array.isArray(historico?.mensagens)
        ? historico.mensagens
        : Array.isArray(historico?.items)
        ? historico.items
        : Array.isArray(historico?.content)
        ? historico.content
        : [];

      if (!items.length) {
        // nada para apagar
        return { success: true, deleted: 0 };
      }

      // deletar mensagens em paralelo com limite de concorrência simples
      const promises = items.map((msg) => {
        // extrair id da mensagem: suporte a vários formatos (id, _id, messageId)
        const id = msg?.id || msg?._id || msg?.messageId || msg?.mensagemId;
        if (!id) return Promise.resolve({ id: null, status: 'skipped' });
        const path = `/api/chat/deletar/${String(id)}`;
        return api.delete(path).then(r => ({ id: String(id), status: 'ok', data: r.data })).catch(e => ({ id: String(id), status: 'error', error: (e?.response?.data || e?.message || String(e)) }));
      });

      const results = await Promise.all(promises);
      const ok = results.filter(r => r.status === 'ok').length;
      const failed = results.filter(r => r.status === 'error');

      if (failed.length > 0) {
        return { success: false, deleted: ok, failed };
      }

      // todas removidas
      return { success: true, deleted: ok };
    } catch (err) {
      throw new Error('Falha ao apagar histórico do chat: endpoint não disponível');
    }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// ===============================================
// ADICIONE ESTA FUNÇÃO QUE ESTAVA FALTANDO
// ===============================================
export const obterMinhasReservas = async () => {
  try {
    // O endpoint é /api/reservas/minhas, baseado no seu 'reservasService.js' da web
    const response = await api.get('/api/reservas/minhas'); 
    return response.data;
  } catch (error) {
    // Erro ao buscar 'minhas reservas' — propagar
    // Lança o erro para a tela (loja_reservas.js) poder tratar
    if (error.response && error.response.data) throw error.response.data;
    throw error; // Lança o erro de rede (ex: Network Error)
  }
};

// Buscar os treinos atribuídos ao usuário (dias da semana com treino)
export const obterMeusTreinos = async () => {
  try {
    const response = await api.get('/api/meus-treinos');
    return response.data;
  } catch (error) {
    // Erro ao buscar meus treinos — propagar
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// ===============================================
// FUNÇÕES DE FAVORITOS
// ===============================================

/**
 * Busca todos os favoritos do usuário logado
 */
export const obterFavoritos = async () => {
  // Strategy:
  // 1) Try canonical endpoint /api/favoritos
  // 2) If it fails (500/404), try known alternative paths used by other services
  // 3) Retry a couple times on transient 5xx failures with backoff
  // 4) If still failing, return [] (caller should use local cache) or rethrow for auth errors
  const candidates = ['/api/favoritos', '/api/meus-favoritos', '/api/favoritos/minhas', '/api/me/favoritos'];

  const tryRequest = async (path) => {
    const response = await api.get(path);
    return response.data;
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  for (const path of candidates) {
    let attempt = 0;
    const maxAttempts = 3; // try up to 3 times on 5xx
    while (attempt < maxAttempts) {
      try {
        const data = await tryRequest(path);
        return data;
      } catch (error) {
        const status = error?.response?.status;
        // If auth error or other client error, don't silently continue to other endpoints
        if (status === 401 || status === 403) {
          // Propagate auth errors: caller might want to react (logout, show message)
          if (error.response && error.response.data) throw error.response.data;
          throw error;
        }

        if (status === 404) {
          // No endpoint here - break attempts and try next candidate
          break;
        }

        // For 5xx, retry with a small backoff
        if (status >= 500 || !status) {
          attempt += 1;
          if (attempt < maxAttempts) {
            const backoff = 250 * attempt; // 250ms, 500ms, ...
            await sleep(backoff);
            continue;
          }
          // failed after retries — try next candidate
          break;
        }

        // Any other case, rethrow
        if (error.response && error.response.data) throw error.response.data;
        throw error;
      }
    }
  }

  // Todas as tentativas falharam — retornar objeto de fallback para sinalizar o erro
  return { fallback: true, favoritos: [] };
};

/**
 * Adiciona um produto aos favoritos do usuário logado
 * @param {number} produtoId - ID do produto a ser favoritado
 */
export const adicionarFavorito = async (produtoId) => {
  try {
    const response = await api.post('/api/favoritos', { produtoId });
    return response.data;
  } catch (error) {
    // Tratamento mais resistente: para erros de autenticação, propaga para o consumidor
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      if (error.response && error.response.data) throw error.response.data;
      throw error;
    }

    // Para 5xx/404 ou falhas de rede retornamos objeto de fallback para o cliente manter dados locais
    if (status === 404 || status >= 500 || !status) {
      return { success: false, fallback: true, error: error?.response?.data || error?.message || error };
    }

    // Outros casos (400 etc) mantemos o comportamento de lançar o erro para a UI tratar
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

/**
 * Remove um produto dos favoritos do usuário logado
 * @param {number} produtoId - ID do produto a ser removido dos favoritos
 */
export const removerFavorito = async (produtoId) => {
  try {
    const response = await api.delete(`/api/favoritos/${produtoId}`);
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      if (error.response && error.response.data) throw error.response.data;
      throw error;
    }

    // Para 5xx/404 ou falhas de rede não propagamos (mantemos remoção local)
    if (status === 404 || status >= 500 || !status) {
      return { success: false, fallback: true, error: error?.response?.data || error?.message || error };
    }

    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};


export default api;