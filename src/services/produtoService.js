// services/produtoService.js

// URL base da nossa API
const API_BASE_URL = (import.meta.env.VITE_KNOW_API_URL || 'http://23.22.153.89:8080') + '/api';
const API_URL = `${API_BASE_URL}/produtos`;

// Função para obter o token de autenticação
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('authToken') || null;
};

/**
 * Busca todos os produtos da loja, ou filtra por nome.
 * Rota: GET /api/produtos
 */
export const getAllProdutos = async (nome = null) => {
  try {
    let url = API_URL;
    if (nome && nome.trim() !== '') {
      url += `?nome=${encodeURIComponent(nome)}`;
      console.log(`🔍 Buscando produtos com filtro: ${nome}`);
    } else {
      console.log('🔍 Buscando todos os produtos...');
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao buscar produtos`);
    }
    
    const data = await response.json();
    console.log('✅ Produtos recebidos:', data);
    return data;
  } catch (error) {
    console.error("❌ Erro em getAllProdutos:", error);
    throw error;
  }
};

/**
 * Busca os detalhes de um único produto pelo seu ID.
 * Rota: GET /api/produtos/{id}
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
    if (!token) throw new Error('Token de autenticação não encontrado.');

    console.log('🆕 Criando novo produto...');
    
    let body;
    let headers = { 'Authorization': `Bearer ${token}` };

    if (produtoData instanceof FormData) {
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

    // CORREÇÃO AQUI: Ler como texto uma única vez para evitar erro de stream
    const responseText = await response.text();

    if (!response.ok) {
      console.error('❌ Erro na resposta:', responseText);
      throw new Error(responseText || `Erro ${response.status}`);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('✅ Produto criado com sucesso:', data);
      return data;
    } catch (e) {
      return { success: true, message: responseText };
    }
    
  } catch (error) {
    console.error('❌ Erro em createProduto:', error);
    throw error;
  }
};

/**
 * Lista produtos por categoria.
 * Rota: GET /api/produtos?categoria=...
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
    if (!token) throw new Error('Token de autenticação não encontrado.');

    console.log(`✏️ Atualizando produto ID: ${id}`, produtoData);

    let body;
    let headers = { 'Authorization': `Bearer ${token}` };

    if (produtoData instanceof FormData) {
      body = produtoData;
      console.log('📤 Enviando como FormData');
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(produtoData);
      console.log('📤 Enviando como JSON');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body,
    });

    // === CORREÇÃO DO ERRO "BODY STREAM ALREADY READ" ===
    // Lemos o corpo da resposta UMA VEZ como texto
    const responseText = await response.text();

    // Se a resposta não for OK (200-299), lançamos erro com o texto obtido
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        // Tentamos converter o erro para JSON para pegar a mensagem detalhada
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.message || errorMessage;
        console.error('❌ Erro detalhado (API):', errorJson);
      } catch (e) {
        // Se não for JSON, usamos o texto puro
        errorMessage = responseText || errorMessage;
        console.error('❌ Erro texto (API):', responseText);
      }
      throw new Error(errorMessage);
    }

    // Se for sucesso, tentamos converter para JSON
    try {
      const data = JSON.parse(responseText);
      console.log('✅ Produto atualizado com sucesso:', data);
      return data;
    } catch (e) {
      // Se a API retornou sucesso mas sem JSON (ex: string vazia), retornamos um objeto dummy
      console.log('✅ Sucesso (sem corpo JSON).');
      return { success: true };
    }
    
  } catch (error) {
    console.error(`❌ Erro em updateProduto(${id}):`, error);
    throw error; // Repassa o erro original (agora legível) para o componente
  }
};

/**
 * Exclui um produto.
 * Rota: DELETE /api/produtos/{id} (Admin)
 */
export const deleteProduto = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    console.log(`🗑️ Excluindo produto ID: ${id}`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('❌ Erro na resposta:', responseText);
      throw new Error(`Falha ao excluir produto: ${responseText || response.status}`);
    }

    console.log('✅ Produto excluído com sucesso');
    return true;
    
  } catch (error) {
    console.error(`❌ Erro em deleteProduto(${id}):`, error);
    throw error;
  }
};

/**
 * Busca produtos em destaque
 * Rota: GET /api/produtos/destaques
 */
export const getProdutosDestaques = async () => {
  try {
    console.log('🌟 Buscando produtos em destaque...');
    const response = await fetch(`${API_URL}/destaques`);
    if (!response.ok) throw new Error('Falha ao buscar destaques');
    return await response.json();
  } catch (error) {
    console.error("❌ Erro em getProdutosDestaques:", error);
    throw error;
  }
};