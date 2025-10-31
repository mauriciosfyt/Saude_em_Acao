// src/services/api.js
// Centraliza as chamadas à API e fornece helpers para autenticação

import axios from 'axios';

// Usa variável de ambiente Vite (defina VITE_API_BASE_URL em produção se desejar)
// Se não definida, usa caminho relativo (''), permitindo que o rewrite/proxy trate as requisições.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Instância axios central
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper para configurar token de autorização nas próximas requisições
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Login padrão: retorna os dados do servidor (espera token/usuario em response.data)
export const login = async (email, senha) => {
  try {
    // Mantido por compatibilidade, mas recomenda-se usar `solicitarToken` para o fluxo em 2 passos
    const response = await api.post('/api/login', { email, senha });
    return response.data;
  } catch (error) {
    // Normaliza erro: se houver resposta do servidor, lança seu corpo
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Passo 1 do login: envia email e senha; se estiverem corretas, servidor envia um código por e-mail
export const solicitarToken = async (email, senha) => {
  try {
    const response = await api.post('/api/auth/solicitar-token', { email, senha });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Valida o token de 5 dígitos (que já é o JWT)
export const loginComToken = async (email, codigo) => {
  try {
    console.log('Validando token:', { email, token: codigo });
    const response = await api.post('/api/auth/login-token', { email, token: codigo });
    console.log('Token validado com sucesso!');
    return response.data;
  } catch (error) {
    console.error('Erro na validação do token:', error);
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

export const solicitarCodigoRecuperacao = async (email) => {
  try {
    // O backend deve validar o email e enviar um código
    const response = await api.post('/api/auth/solicitar-recuperacao', { email });
    return response.data; // Espera algo como { message: 'Código enviado...' }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Fluxo oficial conforme Rotas da API: POST http://34.205.11.57/api/auth/esqueci-senha/solicitar
// Usa URL absoluta para não depender de configuração de proxy/baseURL
export const solicitarEsqueciSenha = async (email) => {
  try {
    const response = await api.post('http://34.205.11.57/api/auth/esqueci-senha/solicitar', { email });
    return response.data; // Ex.: { message: 'E-mail de recuperação enviado' }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

/**
 * Passo 2: Valida o código recebido por e-mail.
 * (Usado por ModalCodigoRecuperacao)
 */
export const validarCodigoRecuperacao = async (email, codigo) => {
  try {
    // O backend verifica se o código está correto e não expirou
    const response = await api.post('/api/auth/validar-codigo-recuperacao', { email, codigo });
    // O backend DEVE retornar um token temporário que autoriza a troca de senha
    return response.data; // Espera algo como { resetToken: 'um-token-jwt-temporario' }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

/**
 * Passo 3: Define a nova senha usando o token temporário de reset.
 * (Usado por ModalAlterarSenha)
 */
export const resetarSenha = async (resetToken, novaSenha) => {
  try {
    // O backend usa o resetToken para autorizar a mudança da senha
    const response = await api.post('/api/auth/resetar-senha', { resetToken, novaSenha });
    return response.data; // Espera algo como { message: 'Senha alterada com sucesso' }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Confirma redefinição usando o token enviado por e-mail e a nova senha
// Rota oficial: POST http://34.205.11.57/api/auth/esqueci-senha/confirmar
export const confirmarRedefinicaoSenha = async (token, novaSenha) => {
  try {
    const response = await api.post('http://34.205.11.57/api/auth/esqueci-senha/confirmar', { token, novaSenha });
    return response.data; // Ex.: { message: 'Senha redefinida com sucesso' }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

export const logout = () => {
  setAuthToken(null);
  try {
    // ALTERADO DE localStorage PARA sessionStorage
    sessionStorage.removeItem('token');
  } catch (e) {
    // ignore
  }
};
export default api;