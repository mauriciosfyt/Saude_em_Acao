// URL base da nossa API
// Em desenvolvimento o Vite proxy (vite.config.js) redireciona '/api' para o servidor real.
const API_URL = '/api/produtos';

/**
 * Busca todos os produtos da loja.
 * Corresponde ao endpoint: GET /
 * @returns {Promise<Array>} Uma promessa que resolve para a lista de produtos.
 */
export const getAllProdutos = async () => {
  try {
    // Faz a requisição para a API
    const response = await fetch(API_URL);

    // Se a resposta não for OK (ex: erro 404 ou 500), lança um erro
    if (!response.ok) {
      throw new Error('Falha ao buscar os produtos da API.');
    }

    // Converte a resposta para JSON e a retorna
    const data = await response.json();
    return data;
  } catch (error) {
    // Se ocorrer qualquer erro na requisição, loga no console e lança o erro
    console.error("Erro em getAllProdutos:", error);
    throw error;
  }
};

/**
 * Busca os detalhes de um único produto pelo seu ID.
 * Corresponde ao endpoint: GET /{id}
 * @param {string|number} id O ID do produto a ser buscado.
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto do produto.
 */
export const getProdutoById = async (id) => {
    // Implementação futura para a página de detalhes
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Produto não encontrado.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar produto com ID ${id}:`, error);
        throw error;
    }
}

// Futuramente, adicionaremos aqui as funções de Admin (create, update, delete)
/**
 * Cria um novo produto (rota: POST /api/produtos)
 * token é opcional, necessário se a API exigir autenticação (Admin).
 */
export const createProduto = async (produto, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(produto),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => null);
      throw new Error(`Falha ao criar produto. ${errText || response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro em createProduto:', error);
    throw error;
  }
};

/**
 * Lista produtos por categoria (rota: GET /api/produtos/categoria/{categoria})
 */
export const getProdutosByCategoria = async (categoria) => {
  try {
    const url = `${API_URL}/categoria/${encodeURIComponent(categoria)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Falha ao buscar produtos por categoria.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro em getProdutosByCategoria(${categoria}):`, error);
    throw error;
  }
};

/**
 * Atualiza um produto existente (rota: PUT /api/produtos/{id})
 * token é opcional, necessário se a API exigir autenticação (Admin).
 */
export const updateProduto = async (id, produto, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(produto),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => null);
      throw new Error(`Falha ao atualizar produto. ${errText || response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro em updateProduto(${id}):`, error);
    throw error;
  }
};

/**
 * Exclui um produto (rota: DELETE /api/produtos/{id})
 * token é opcional, necessário se a API exigir autenticação (Admin).
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

    // A API pode retornar um objeto vazio ou uma mensagem; apenas retornar true para sucesso
    return true;
  } catch (error) {
    console.error(`Erro em deleteProduto(${id}):`, error);
    throw error;
  }
};