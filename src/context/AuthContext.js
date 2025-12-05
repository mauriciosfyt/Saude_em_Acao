// AuthContext.jsx (Versão para React Native/Expo)

import React, { createContext, useContext, useState, useEffect } from 'react';
// MUDANÇA: Importar o SecureStore
import * as SecureStore from 'expo-secure-store';

// MUDANÇA: Importar o 'setAuthToken' do seu arquivo api.js
// (Assumindo que ele está em ../services/api.js)
import { setAuthToken, obterMeuPerfil } from '../Services/api'; 

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
    // parseJwtSafe failed - error message logged in development
    return null;
  }
}

// Determina flags úteis a partir das claims do token
function determineRoleFlags(claims) {
  if (!claims || typeof claims !== 'object') {
    return { isAdmin: false, isGold: false, isProfessor: false };
  }

  const rawRole = (claims.role || claims.perfil || claims.tipo || null);
  const rolesArray = Array.isArray(claims.roles) ? claims.roles : (typeof claims.roles === 'string' ? [claims.roles] : []);

  const planoCandidate = (claims.plano || claims.plan || claims.subscription?.plan || claims.plano_usuario || null);

  // Normalize to UPPERCASE because backend returns roles/plans em MAIÚSCULAS
  const normalize = (v) => (typeof v === 'string' ? v.toUpperCase() : '');

  const isAdmin = [rawRole, ...(rolesArray || [])].some(r => {
    const n = normalize(r);
    return n === 'ADMIN' || n === 'ADM' || n === 'ADMINISTRATOR';
  });

  const isProfessor = [rawRole, ...(rolesArray || [])].some(r => {
    const n = normalize(r);
    return n === 'PROFESSOR' || n === 'PROF' || n === 'PERSONAL' || n === 'PERSONAL TRAINER';
  });

  const isGold = normalize(planoCandidate) === 'GOLD' || [rawRole, ...rolesArray].some(r => normalize(r) === 'GOLD') || normalize(claims?.subscription) === 'GOLD';

  // Também aceitar flags booleanas se existirem
  if (claims.isAdmin === true || claims.adm === true) return { isAdmin: true, isGold, isProfessor };
  if (claims.isGold === true) return { isAdmin, isGold: true, isProfessor };
  if (claims.isProfessor === true) return { isAdmin, isGold, isProfessor: true };

  return { isAdmin, isGold, isProfessor };
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
        // Checking authentication (Mobile)
        // Reading from SecureStore
        const token = await SecureStore.getItemAsync('token');
        const email = await SecureStore.getItemAsync('userEmail');

        // SecureStore state checked - token and email existence logged

        if (token) {
          // Sua validação de JWT (ótima prática!)
          const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
          
          if (!isValidJWT) {
            // Token found but format invalid
            setIsAuthenticated(false);
            setUser(null);
            return;
          }

          // Valid JWT token found
          
          // ADIÇÃO CRÍTICA: Configurar o token no Axios assim que o app carregar
          setAuthToken(token);

          // Extrair claims do JWT (se possível) para obter role/roles
          const claims = parseJwtSafe(token);
          // DEBUG: mostrar claims para depuração (remova em produção)
          try { console.log('[Auth] bootstrapAuth claims:', claims); } catch (e) {}
          const role = claims?.role || claims?.perfil || claims?.tipo || claims?.roles || null;

          // Determinar flags (isAdmin / isGold / isProfessor) automaticamente
          const { isAdmin, isGold, isProfessor } = determineRoleFlags(claims);
          // DEBUG: mostrar flags calculadas no bootstrap
          try { console.log('[Auth] bootstrapAuth determined flags:', { isAdmin, isGold, isProfessor }); } catch (e) {}

          // Se as flags não vieram no token, tentar buscar no endpoint /api/meu-perfil
          let finalIsAdmin = isAdmin;
          let finalIsGold = isGold;
          let finalIsProfessor = isProfessor;
          if (!isAdmin && !isGold && !isProfessor) {
            try {
              const perfil = await obterMeuPerfil();
              try { console.log('[Auth] perfil from API:', perfil); } catch (e) {}
              // verificar campos comuns no perfil
              const perfilPlano = perfil?.plano || perfil?.plan || perfil?.subscription?.plan || perfil?.plano_usuario || perfil?.planoNome || perfil?.planName || null;
              const perfilRole = perfil?.role || perfil?.perfil || perfil?.tipo || null;
              const perfilNorm = (v) => (typeof v === 'string' ? v.toUpperCase() : '');
              if (perfilPlano && perfilNorm(perfilPlano) === 'GOLD') finalIsGold = true;
              if (perfilRole) {
                const normRole = perfilNorm(perfilRole);
                if (normRole === 'ADMIN' || normRole === 'ADM') finalIsAdmin = true;
                if (normRole === 'PROFESSOR' || normRole === 'PROF' || normRole === 'PERSONAL' || normRole === 'PERSONAL TRAINER') finalIsProfessor = true;
              }
            } catch (e) {
              // falha ao obter perfil — ignorar e manter flags como estavam
            }
          }

          // Atualiza o estado da aplicação com dados completos do usuário
          setIsAuthenticated(true);
          setUser({ token, email: email || 'no-email', claims, role, isAdmin: finalIsAdmin, isGold: finalIsGold, isProfessor: finalIsProfessor });
        } else {
          // No JWT token found
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Error restoring authentication
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
    // Starting login with user data

    try {
      // Lógica para extrair o token (igual à sua, está ótima)
      const token = typeof userData === 'string'
        ? userData
        : userData?.token || userData?.accessToken || userData?.jwt || userData?.tokenJwt;

      if (!token) {
        // No JWT token found in userData
        return;
      }

      const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
      if (!isValidJWT) {
        // Provided token does not have valid JWT format
        return;
      }

      // Valid JWT token detected

      const email = userData.email || null; // Pegar o email se vier

      // MUDANÇA: Salva no SecureStore (assíncrono)
      await SecureStore.setItemAsync('token', token);
      if (email) {
        await SecureStore.setItemAsync('userEmail', email);
      }
      
      // ADIÇÃO CRÍTICA: Configura o token no Axios imediatamente após o login
      setAuthToken(token);

      // Tentar extrair claims do JWT para pegar a role
      // Tentar extrair claims do JWT para pegar a role
      const claims = parseJwtSafe(token);
      // DEBUG: mostrar claims no login para depuração (remova em produção)
      try { console.log('[Auth] login claims:', claims); } catch (e) {}
      const role = claims?.role || claims?.perfil || claims?.tipo || claims?.roles || null;

      // Determinar flags (isAdmin / isGold / isProfessor) automaticamente
      const { isAdmin, isGold, isProfessor } = determineRoleFlags(claims);
      // DEBUG: mostrar flags calculadas
      try { console.log('[Auth] determined flags:', { isAdmin, isGold, isProfessor }); } catch (e) {}
      // Se as flags não vieram no token, tentar buscar no endpoint /api/meu-perfil
      let finalIsAdmin = isAdmin;
      let finalIsGold = isGold;
      let finalIsProfessor = isProfessor;
      if (!isAdmin && !isGold && !isProfessor) {
        try {
          const perfil = await obterMeuPerfil();
          try { console.log('[Auth] perfil from API (login):', perfil); } catch (e) {}
          const perfilPlano = perfil?.plano || perfil?.plan || perfil?.subscription?.plan || perfil?.plano_usuario || perfil?.planoNome || perfil?.planName || null;
          const perfilRole = perfil?.role || perfil?.perfil || perfil?.tipo || null;
          const perfilNorm = (v) => (typeof v === 'string' ? v.toUpperCase() : '');
          if (perfilPlano && perfilNorm(perfilPlano) === 'GOLD') finalIsGold = true;
          if (perfilRole) {
            const normRole = perfilNorm(perfilRole);
            if (normRole === 'ADMIN' || normRole === 'ADM') finalIsAdmin = true;
            if (normRole === 'PROFESSOR' || normRole === 'PROF' || normRole === 'PERSONAL' || normRole === 'PERSONAL TRAINER') finalIsProfessor = true;
          }
        } catch (e) {
          // falha ao obter perfil — ignorar
        }
      }

      // Atualiza o estado com o objeto completo (útil para regras de UI)
      const fullUser = typeof userData === 'object'
        ? { ...userData, token, email, claims, role, isAdmin: finalIsAdmin, isGold: finalIsGold, isProfessor: finalIsProfessor }
        : { token, email, claims, role, isAdmin: finalIsAdmin, isGold: finalIsGold, isProfessor: finalIsProfessor };
      const userWithFlags = { ...fullUser, isAdmin: finalIsAdmin, isGold: finalIsGold, isProfessor: finalIsProfessor };
      setIsAuthenticated(true);
      setUser(userWithFlags);

      // Login completed successfully - authentication, token and email logged

    } catch (error) {
      // Error during login
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
      
      // Critical: Clear token from Axios instance
      setAuthToken(null);

      // Logout completed - data removed from SecureStore
    } catch (error) {
      // Error removing data from SecureStore
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading, // Exponha o 'loading'
    login,
    logout
  };
  // Expor helpers úteis para verificação rápida de permissões
  value.isAdmin = () => !!(user && user.isAdmin);
  value.isGold = () => !!(user && user.isGold);
  value.isProfessor = () => !!(user && user.isProfessor);
  value.isGoldOrAdmin = () => !!(user && (user.isGold || user.isAdmin));
  value.isGoldOrAdminOrProfessor = () => !!(user && (user.isGold || user.isAdmin || user.isProfessor));
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};