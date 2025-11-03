import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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
  const [loading, setLoading] = useState(true);

  // Verifica se há token no sessionStorage ao inicializar e em alterações
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('🔍 Verificando autenticação...');
        const token = sessionStorage.getItem('token');
        const email = sessionStorage.getItem('userEmail');

        // Log do estado atual
        console.log('📦 Estado do sessionStorage:', {
          tokenExists: !!token,
          emailExists: !!email,
          token: token ? `${token.slice(0, 10)}...` : null
        });

        if (token) {
          // Verifica se o token é válido (tem formato JWT)
          const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
          
          if (!isValidJWT) {
            console.warn('⚠️ Token encontrado mas formato inválido');
            setIsAuthenticated(false);
            setUser(null);
            return;
          }

          console.log('✅ Token JWT válido encontrado');
          setIsAuthenticated(true);
          setUser({ token, email: email || 'no-email' });
          
          // Log do estado de autenticação
          console.log('🔐 Estado de autenticação atualizado:', { isAuthenticated: true, hasUser: true });
        } else {
          console.log('❌ Nenhum token JWT encontrado');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Executa verificação inicial
    checkAuth();

    // Adiciona listener para mudanças no storage
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userEmail') {
        console.log('🔄 Mudança detectada no storage:', e.key);
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listener para logout disparado pela função performLogout na mesma aba
    const handleAppLogout = () => {
      console.log('🔔 Evento app-logout recebido, atualizando estado de autenticação');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('app-logout', handleAppLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app-logout', handleAppLogout);
    };
  }, []);

  // REMOVIDO: O useEffect que usava 'pagehide', pois sessionStorage faz a limpeza.

const login = (userData) => {
  console.log("🔐 Iniciando login com dados:", userData);

  try {
    // Se o backend retornar apenas a string do token:
    const token = typeof userData === 'string'
      ? userData
      : userData?.token || userData?.accessToken || userData?.jwt || userData?.tokenJwt;

    if (!token) {
      console.error("⚠️ Nenhum token JWT encontrado em userData:", userData);
      return;
    }

    // Verifica se o token tem formato JWT válido
    const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
    if (!isValidJWT) {
      console.error("⚠️ Token fornecido não tem formato JWT válido");
      return;
    }

    console.log("✅ Token JWT válido detectado");

    // Extrai email do userData ou usa o existente
    const email = userData.email || sessionStorage.getItem('userEmail');

    // Atualiza o estado
    setIsAuthenticated(true);
    setUser({ email, token });

    // Salva no sessionStorage
    sessionStorage.setItem('token', token);
    if (email) sessionStorage.setItem('userEmail', email);

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



  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      // MUDANÇA: Limpar o sessionStorage
      sessionStorage.removeItem('token'); 
      sessionStorage.removeItem('userEmail');
      console.log('Logout realizado - dados removidos do sessionStorage');
    } catch (error) {
      console.error('Erro ao remover dados do sessionStorage:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};