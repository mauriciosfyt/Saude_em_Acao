// src/services/api.js (Versão Mobile)

import axios from 'axios';

// MUDANÇA: 'import.meta.env' não existe no Expo.
// Como suas rotas principais já usam o IP absoluto (http://54.81.240.117),
// podemos definir a baseURL diretamente para a raiz da API.
const API_BASE_URL = 'http://54.81.240.117'; // <-- DEFINA SEU IP DA API AQUI

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
  try {
    const response = await api.get('/api/treinos/desempenho-semanal');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Registrar treino realizado
export const registrarTreinoRealizado = async (treinoId, payload = {}) => {
  try {
    // payload pode conter { exercicios: [ids], parcial: true }
    const response = await api.post(`/api/treinos/${treinoId}/realizar`, payload);
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
      if (__DEV__) console.warn('[enviarMensagemChat] tentativa preferencial falhou', preferencial, err?.response?.status || err?.message);
      // continuar para tentativas alternativas
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
        if (__DEV__) console.debug(`[enviarMensagemChat] tentativa falhou em ${path}`, err?.response?.status || err?.message);
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
          if (__DEV__) console.debug('[enviarImagemChat] json attempt failed', path, err?.response?.status || err?.message);
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
        if (__DEV__) console.debug('[enviarImagemChat] fallback enviarMensagemChat para URL falhou', err?.message || err);
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
          if (__DEV__) console.debug('[enviarImagemChat] multipart attempt failed', path, key, err?.response?.status || err?.message);
          continue;
        }
      }
    }

    // Ultimate fallback: enviar uri como texto via enviarMensagemChat
    try {
      const fallback = await enviarMensagemChat(chatId, String(uriOrData), usuario);
      return fallback;
    } catch (err) {
      if (__DEV__) console.warn('[enviarImagemChat] fallback enviarMensagemChat falhou', err?.message || err);
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
      if (__DEV__) console.warn('[apagarMensagemChat] tentativa preferencial falhou', preferencial, err?.response?.status || err?.message);
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
        if (__DEV__) console.debug('[apagarMensagemChat] falha em', path, err?.response?.status || err?.message);
        continue;
      }
    }

    // fallback via POST apagar
    try {
      const resp = await api.post(`/api/chat/${chatId}/mensagem/apagar`, { id: mensagemId });
      return resp.data;
    } catch (err) {
      if (__DEV__) console.warn('[apagarMensagemChat] fallback POST falhou', err?.message || err);
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
        if (__DEV__) console.log('[apagarHistoricoChat] nenhum item no histórico para deletar');
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
        if (__DEV__) console.warn('[apagarHistoricoChat] algumas mensagens não puderam ser deletadas:', failed);
        return { success: false, deleted: ok, failed };
      }

      // todas removidas
      return { success: true, deleted: ok };
    } catch (err) {
      if (__DEV__) console.error('[apagarHistoricoChat] fallback por item falhou', err?.message || err);
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
    console.log("Chamando API: /api/reservas/minhas");
    const response = await api.get('/api/reservas/minhas'); 
    console.log("API /api/reservas/minhas respondeu:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar 'minhas reservas':", error);
    // Lança o erro para a tela (loja_reservas.js) poder tratar
    if (error.response && error.response.data) throw error.response.data;
    throw error; // Lança o erro de rede (ex: Network Error)
  }
};

// Buscar os treinos atribuídos ao usuário (dias da semana com treino)
export const obterMeusTreinos = async () => {
  try {
    console.log("Chamando API: /api/meus-treinos");
    const response = await api.get('/api/meus-treinos');
    console.log("API /api/meus-treinos respondeu:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar meus treinos:", error);
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
        if (__DEV__) console.log(`Tentando favorites -> ${path} (attempt ${attempt + 1})`);
        const data = await tryRequest(path);
        if (__DEV__) console.log(`API ${path} respondeu:`, data);
        return data;
      } catch (error) {
        const status = error?.response?.status;
        // If auth error or other client error, don't silently continue to other endpoints
        if (status === 401 || status === 403) {
          if (__DEV__) console.warn(`Auth issue when GET ${path} -> ${status}`);
          // Propagate auth errors: caller might want to react (logout, show message)
          if (error.response && error.response.data) throw error.response.data;
          throw error;
        }

        if (status === 404) {
          // No endpoint here - break attempts and try next candidate
          if (__DEV__) console.log(`${path} retornou 404 — tentando próximo endpoint`);
          break;
        }

        // For 5xx, retry with a small backoff
        if (status >= 500 || !status) {
          attempt += 1;
          if (attempt < maxAttempts) {
            const backoff = 250 * attempt; // 250ms, 500ms, ...
            if (__DEV__) console.warn(`${path} erro ${status || 'network'}. Retentando em ${backoff}ms`);
            await sleep(backoff);
            continue;
          }
          // failed after retries — log and try next candidate
          if (__DEV__) console.warn(`${path} falhou após ${maxAttempts} tentativas:`, error?.response?.data || error?.message || error);
          break;
        }

        // Any other case, rethrow
        if (error.response && error.response.data) throw error.response.data;
        throw error;
      }
    }
  }

  // Todas as tentativas falharam — retornar objeto de fallback para sinalizar o erro
  if (__DEV__) console.warn('Todas as rotas de favoritos falharam — retornando fallback vazia para que o cliente use cache local');
  return { fallback: true, favoritos: [] };
};

/**
 * Adiciona um produto aos favoritos do usuário logado
 * @param {number} produtoId - ID do produto a ser favoritado
 */
export const adicionarFavorito = async (produtoId) => {
  try {
    if (__DEV__) {
      console.log("Chamando API: POST /api/favoritos", { produtoId });
    }
    const response = await api.post('/api/favoritos', { produtoId });
    if (__DEV__) {
      console.log("API POST /api/favoritos respondeu:", response.data);
    }
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
      if (__DEV__) console.warn('Falha ao adicionar favorito na API — retornando fallback (erro não propagado):', status, error?.message || error);
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
    if (__DEV__) {
      console.log("Chamando API: DELETE /api/favoritos/" + produtoId);
    }
    const response = await api.delete(`/api/favoritos/${produtoId}`);
    if (__DEV__) {
      console.log("API DELETE /api/favoritos respondeu:", response.data);
    }
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      if (error.response && error.response.data) throw error.response.data;
      throw error;
    }

    // Para 5xx/404 ou falhas de rede não propagamos (mantemos remoção local)
    if (status === 404 || status >= 500 || !status) {
      if (__DEV__) console.warn('Falha ao remover favorito na API — retornando fallback (erro não propagado):', status, error?.message || error);
      return { success: false, fallback: true, error: error?.response?.data || error?.message || error };
    }

    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};


export default api;