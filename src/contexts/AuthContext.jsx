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

  // Verifica se há token no sessionStorage ao inicializar (persistirá no refresh)
  useEffect(() => {
    const checkAuth = () => {
      try {
        // MUDANÇA: Usar sessionStorage
        const token = sessionStorage.getItem('token'); 
        const email = sessionStorage.getItem('userEmail'); 
        
        if (token && email) {
          console.log('Token JWT encontrado no sessionStorage:', token);
          setIsAuthenticated(true);
          setUser({ token, email });
        } else {
          console.log('Nenhum token JWT encontrado no sessionStorage');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // REMOVIDO: O useEffect que usava 'pagehide', pois sessionStorage faz a limpeza.

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // MUDANÇA: Salvar no sessionStorage
    sessionStorage.setItem('token', userData.token); 
    sessionStorage.setItem('userEmail', userData.email);
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