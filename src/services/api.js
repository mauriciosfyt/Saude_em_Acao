// src/services/api.js
// Centraliza as chamadas à API e fornece helpers para autenticação

import axios from 'axios';

// Usa variável de ambiente Vite VITE_API_URL em produção
// Se não definida, usa caminho relativo (''), permitindo que o proxy trate as requisições
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

// Fluxo oficial conforme Rotas da API: POST http://54.81.240.117/api/auth/esqueci-senha/solicitar
// Usa URL absoluta para não depender de configuração de proxy/baseURL
export const solicitarEsqueciSenha = async (email) => {
  try {
    const response = await api.post('http://54.81.240.117/api/auth/esqueci-senha/solicitar', { 
      email: email.trim().toLowerCase() 
    });
    
    if (!response.data) {
      throw new Error('Resposta inválida do servidor');
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw { response: { status: 404, data: { message: 'Email não encontrado.' } } };
    }
    if (error.response?.data) {
      throw error;
    }
    throw new Error('Erro ao conectar com o servidor');
  }
};

// Etapa 2: valida o código de 5 dígitos enviado ao e-mail
export const validarCodigoEsqueciSenha = async (codigo) => {
  try {
    const response = await api.post('http://54.81.240.117/api/auth/esqueci-senha/validar-codigo', { codigo });
    return response.data; // Ex.: { codigo: '123456' }
  } catch (error) {
    if (error.response && error.response.data) throw error.response.data;
    throw error;
  }
};

// Etapa 3: redefine a senha usando o código validado na etapa 2
// Rota: POST http://54.81.240.117/api/auth/esqueci-senha/redefinir/{codigo}
// Envia apenas a nova senha no corpo da requisição
export const redefinirSenhaEsquecida = async (codigo, novaSenha) => {
  try {
    const url = `http://54.81.240.117/api/auth/esqueci-senha/redefinir/${encodeURIComponent(codigo)}`;
    const response = await api.post(url, { novaSenha });
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

