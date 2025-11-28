// URL base da nossa API
// Em desenvolvimento, preferimos usar o proxy do Vite (definido em `vite.config.js`).
// Se `VITE_API_BASE_URL` estiver definida, usaremos esse valor (produção).
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api';
const API_URL = `${API_BASE_URL}/produtos`;

// Função para obter o token de autenticação
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('authToken') || null;
};

/**
 * Busca todos os produtos da loja, ou filtra por nome.
 * Rota: GET /api/produtos (Pública)
 * Rota (Filtro): GET /api/produtos?nome=... (Pública)
 */
export const getAllProdutos = async (nome = null) => {
  try {
    // Começa com a URL base
    let url = API_URL;

    // Se um 'nome' (filtro) foi fornecido, anexa ele à URL
    if (nome && nome.trim() !== '') {
      url += `?nome=${encodeURIComponent(nome)}`;
      console.log(`🔍 Buscando produtos com filtro: ${nome}`);
    } else {
      console.log('🔍 Buscando todos os produtos...');
    }

    // Faz a chamada fetch com a URL (seja ela a base ou a com filtro)
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar produtos`);
    }
    
    const data = await response.json();
    console.log('✅ Produtos recebidos (raw):', data);

    // Normaliza formatos de resposta comuns: array direto, { data: [...] }, { content: [...] }, { produtos: [...] }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data.produtos)) return data.produtos;

    // Caso não seja um array conhecido, retorna um array vazio e loga para debug
    console.warn('produtoService.getAllProdutos: resposta inesperada, retornando array vazio.');
    return [];

  } catch (error) {
    console.error("❌ Erro em getAllProdutos:", error);
    throw error;
  }
};

/**
 * Busca os detalhes de um único produto pelo seu ID.
 * Rota: GET /api/produtos/{id} (Pública)
 */
export const getProdutoById = async (id) => {
  try {
    console.log(`🔍 Buscando produto ID: ${id}`);
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Produto não encontrado (ID: ${id})`);
    }
    
    const data = await response.json();
    console.log('✅ Produto encontrado:', data);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao buscar produto com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Cria um novo produto.
 * Rota: POST /api/produtos (Admin)
 */
export const createProduto = async (produtoData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    console.log('🆕 Criando novo produto...');
    
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`
    };

    if (produtoData instanceof FormData) {
      // Para FormData (com imagem), o navegador define o Content-Type automaticamente
      body = produtoData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(produtoData);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body,
    });

    console.log('📊 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      throw new Error(`Falha ao criar produto: ${errorText || response.status}`);
    }

    const data = await response.json();
    console.log('✅ Produto criado com sucesso:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Erro em createProduto:', error);
    throw error;
  }
};

/**
 * Lista produtos por categoria.
 * Rota: GET /api/produtos?categoria=... (Pública)
 */
export const getProdutosByCategoria = async (categoria) => {
  try {
    const url = `${API_URL}?categoria=${encodeURIComponent(categoria)}`;
    console.log(`🔍 Buscando produtos da categoria: ${categoria}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Falha ao buscar produtos da categoria ${categoria}`);
    }
    
    const data = await response.json();
    console.log(`✅ Produtos da categoria ${categoria}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Erro em getProdutosByCategoria(${categoria}):`, error);
    throw error;
  }
};

/**
 * Atualiza um produto existente.
 * Rota: PUT /api/produtos/{id} (Admin)
 */
export const updateProduto = async (id, produtoData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    console.log(`✏️ Atualizando produto ID: ${id}`, produtoData);

    let body;
    let headers = {
      'Authorization': `Bearer ${token}`
    };

    if (produtoData instanceof FormData) {
      body = produtoData;
      console.log('📤 Enviando como FormData');
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(produtoData);
      console.log('📤 Enviando como JSON:', body);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body,
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('❌ Erro detalhado:', errorData);
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
        console.error('❌ Erro texto:', errorText);
      }
      throw new Error(errorMessage);
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      console.log('📄 Resposta não-JSON:', textResponse);
      data = { success: true, message: 'Produto atualizado com sucesso' };
    }

    console.log('✅ Produto atualizado com sucesso:', data);
    return data;
    
  } catch (error) {
    console.error(`❌ Erro em updateProduto(${id}):`, error);
    throw new Error(`Falha ao atualizar produto: ${error.message}`);
  }
};

/**
 * Exclui um produto.
 * Rota: DELETE /api/produtos/{id} (Admin)
 */
export const deleteProduto = async (id) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    console.log(`🗑️ Excluindo produto ID: ${id}`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('📊 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      throw new Error(`Falha ao excluir produto: ${errorText || response.status}`);
    }

    console.log('✅ Produto excluído com sucesso');
    return true;
    
  } catch (error) {
    console.error(`❌ Erro em deleteProduto(${id}):`, error);
    throw error;
  }
};

/**
 * Busca produtos em destaque (mais reservados)
 * Rota: GET /api/produtos/destaques (Pública)
 */
export const getProdutosDestaques = async () => {
  try {
    console.log('🌟 Buscando produtos em destaque...');
    const response = await fetch(`${API_URL}/destaques`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar produtos em destaque');
    }
    
    const data = await response.json();
    console.log('✅ Produtos em destaque:', data);
    return data;
  } catch (error) {
    console.error("❌ Erro em getProdutosDestaques:", error);
    throw error;
  }
};