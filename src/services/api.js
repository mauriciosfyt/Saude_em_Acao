// src/services/api.js
// Centraliza as chamadas à API

import axios from 'axios';

// Usa variável de ambiente Vite (defina VITE_API_BASE_URL em produção se desejar)
// Se não definida, usa caminho relativo (''), permitindo que o rewrite/proxy trate as requisições.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Login padrão: autentica usuário se o usuario existe vai para o modal de token
export const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      senha,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Outras funções de API podem ser adicionadas aqui
