// AuthContext.jsx (Versão para React Native/Expo)

import React, { createContext, useContext, useState, useEffect } from 'react';
// MUDANÇA: Importar o SecureStore
import * as SecureStore from 'expo-secure-store';

// MUDANÇA: Importar o 'setAuthToken' do seu arquivo api.js
// (Assumindo que ele está em ../services/api.js)
import { setAuthToken } from '../Services/api'; 

const AuthContext = createContext();

// Helper seguro para ler o payload de um JWT sem depender de bibliotecas externas
function parseJwtSafe(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    if (pad) payload += '='.repeat(4 - pad);

    // Tenta usar Buffer (Metro normalmente fornece) ou atob como fallback
    let decoded = null;
    if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(payload, 'base64').toString('utf8');
    } else if (typeof atob === 'function') {
      decoded = atob(payload);
    } else if (typeof globalThis?.atob === 'function') {
      decoded = globalThis.atob(payload);
    } else {
      return null;
    }

    return JSON.parse(decoded);
  } catch (err) {
    if (__DEV__) console.warn('parseJwtSafe failed', err?.message || err);
    return null;
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 'loading' é crucial no mobile

  // MUDANÇA: A verificação inicial agora é assíncrona
  useEffect(() => {
    // Função async para verificar o token salvo no SecureStore
    const bootstrapAuth = async () => {
      try {
        console.log('🔍 Verificando autenticação (Mobile)...');
        // MUDANÇA: Lendo do SecureStore
        const token = await SecureStore.getItemAsync('token');
        const email = await SecureStore.getItemAsync('userEmail');

        console.log('📦 Estado do SecureStore:', {
          tokenExists: !!token,
          emailExists: !!email,
        });

        if (token) {
          // Sua validação de JWT (ótima prática!)
          const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
          
          if (!isValidJWT) {
            console.warn('⚠️ Token encontrado mas formato inválido');
            setIsAuthenticated(false);
            setUser(null);
            return;
          }

          console.log('✅ Token JWT válido encontrado');
          
          // ADIÇÃO CRÍTICA: Configurar o token no Axios assim que o app carregar
          setAuthToken(token);

          // Extrair claims do JWT (se possível) para obter role/roles
          const claims = parseJwtSafe(token);
          const role = claims?.role || claims?.perfil || claims?.tipo || claims?.roles || null;

          // Atualiza o estado da aplicação com dados completos do usuário
          setIsAuthenticated(true);
          setUser({ token, email: email || 'no-email', claims, role });
        } else {
          console.log('❌ Nenhum token JWT encontrado');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Erro ao restaurar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        // Importante: Indicar que a verificação terminou
        setLoading(false);
      }
    };

    bootstrapAuth();

    // MUDANÇA: Todos os 'window.addEventListener' são removidos.
    // Eles não existem e não são necessários no React Native.

  }, []); // Executa apenas uma vez na inicialização


  // MUDANÇA: A função 'login' agora precisa ser 'async'
  const login = async (userData) => {
    console.log("🔐 Iniciando login com dados:", userData);

    try {
      // Lógica para extrair o token (igual à sua, está ótima)
      const token = typeof userData === 'string'
        ? userData
        : userData?.token || userData?.accessToken || userData?.jwt || userData?.tokenJwt;

      if (!token) {
        console.error("⚠️ Nenhum token JWT encontrado em userData:", userData);
        return;
      }

      const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
      if (!isValidJWT) {
        console.error("⚠️ Token fornecido não tem formato JWT válido");
        return;
      }

      console.log("✅ Token JWT válido detectado");

      const email = userData.email || null; // Pegar o email se vier

      // MUDANÇA: Salva no SecureStore (assíncrono)
      await SecureStore.setItemAsync('token', token);
      if (email) {
        await SecureStore.setItemAsync('userEmail', email);
      }
      
      // ADIÇÃO CRÍTICA: Configura o token no Axios imediatamente após o login
      setAuthToken(token);

      // Tentar extrair claims do JWT para pegar a role
      const claims = parseJwtSafe(token);
      const role = claims?.role || claims?.perfil || claims?.tipo || claims?.roles || null;

      // Atualiza o estado com o objeto completo (útil para regras de UI)
      const fullUser = typeof userData === 'object' ? { ...userData, token, email, claims, role } : { token, email, claims, role };
      setIsAuthenticated(true);
      setUser(fullUser);

      console.log("✅ Login concluído com sucesso:", { 
        isAuthenticated: true, 
        hasToken: true,
        hasEmail: !!email
      });

    } catch (error) {
      console.error("❌ Erro durante o login:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };


  // MUDANÇA: A função 'logout' agora precisa ser 'async'
  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      // MUDANÇA: Limpar o SecureStore
      await SecureStore.deleteItemAsync('token'); 
      await SecureStore.deleteItemAsync('userEmail');
      
      // ADIÇÃO CRÍTICA: Limpa o token da instância do Axios
      setAuthToken(null);

      console.log('Logout realizado - dados removidos do SecureStore');
    } catch (error) {
      console.error('Erro ao remover dados do SecureStore:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading, // Exponha o 'loading'
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};