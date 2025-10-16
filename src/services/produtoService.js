// URL base da nossa API
// Em desenvolvimento o Vite proxy (vite.config.js) redireciona '/api' para o servidor real.
const API_URL = '/api/produtos';

/**
 * Busca todos os produtos da loja.
 */
export const getAllProdutos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Falha ao buscar os produtos da API.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em getAllProdutos:", error);
    throw error;
  }
};

/**
 * Busca os detalhes de um único produto pelo seu ID.
 */
export const getProdutoById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Produto não encontrado.');
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar produto com ID ${id}:`, error);
        throw error;
    }
}

/**
 * Cria um novo produto.
 */
export const createProduto = async (produtoData, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let body;
    if (produtoData instanceof FormData) {
      body = produtoData; // Navegador define o Content-Type
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(produtoData);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Erro desconhecido.');
      throw new Error(`Falha ao criar produto. ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro em createProduto:', error);
    throw error;
  }
};

/**
 * Lista produtos por categoria.
 */
export const getProdutosByCategoria = async (categoria) => {
  try {
    const url = `${API_URL}/categoria/${encodeURIComponent(categoria)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao buscar produtos por categoria.');
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro em getProdutosByCategoria(${categoria}):`, error);
    throw error;
  }
};

/**
 * Atualiza um produto existente (rota: PUT /api/produtos/{id})
 * ## CORRIGIDO ##: Agora lida com FormData para envio de imagens.
 */
export const updateProduto = async (id, produtoData, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let body;
    if (produtoData instanceof FormData) {
      body = produtoData; // Deixa o navegador definir o Content-Type para multipart/form-data
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(produtoData);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => null);
      throw new Error(`Falha ao atualizar produto. ${errText || response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro em updateProduto(${id}):`, error);
    throw error;
  }
};

/**
 * Exclui um produto (rota: DELETE /api/produtos/{id})
 */
export const deleteProduto = async (id, token = null) => {
  try {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => null);
      throw new Error(`Falha ao excluir produto. ${errText || response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro em deleteProduto(${id}):`, error);
    throw error;
  }
};