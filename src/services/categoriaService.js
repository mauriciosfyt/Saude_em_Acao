// A URL base para os endpoints de produtos, de onde a rota de categoria deriva.
const API_URL = '/api/produtos';

/**
 * Busca todos os produtos pertencentes a uma categoria específica.
 * [cite_start]Corresponde ao endpoint: GET /api/produtos/categoria/{categoria} [cite: 19]
 * @param {string} categoria O nome da categoria a ser buscada.
 * @returns {Promise<Array>} Uma promessa que resolve para a lista de produtos daquela categoria.
 */
export const getProdutosByCategoria = async (categoria) => {
  // Validação para garantir que a categoria não seja nula ou vazia.
  if (!categoria) {
    throw new Error('O nome da categoria é obrigatório.');
  }

  try {
    // Codifica a categoria para garantir que caracteres especiais sejam tratados corretamente na URL.
    const url = `${API_URL}/categoria/${encodeURIComponent(categoria)}`;
    
    // Faz a requisição para a API.
    const response = await fetch(url);

    // Se a resposta não for OK (ex: 404 Categoria não encontrada), lança um erro.
    if (!response.ok) {
      throw new Error('Falha ao buscar os produtos da categoria especificada.');
    }

    // Converte a resposta para JSON e a retorna.
    const data = await response.json();
    return data;
  } catch (error) {
    // Se ocorrer qualquer erro, loga no console e lança o erro para o chamador.
    console.error(`Erro em getProdutosByCategoria para a categoria "${categoria}":`, error);
    throw error;
  }
};