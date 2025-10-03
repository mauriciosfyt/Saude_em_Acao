// src/services/api.js
// Centraliza as chamadas à API

import axios from 'axios';

const API_BASE_URL = 'https://saudeemacao.onrender.com'; // Altere para a URL real da sua API backend

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
