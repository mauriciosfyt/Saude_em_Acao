import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeuPerfil } from '../services/usuarioService';

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
  const [perfil, setPerfil] = useState(null);

  // Verifica se há token no sessionStorage ao inicializar e em alterações
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Verificando autenticação...');
        const token = sessionStorage.getItem('token');
        const email = sessionStorage.getItem('userEmail');
        const cachedPerfil = sessionStorage.getItem('userPerfilData');

        // Log do estado atual
        console.log('📦 Estado do sessionStorage:', {
          tokenExists: !!token,
          emailExists: !!email,
          hasCachedPerfil: !!cachedPerfil,
          token: token ? `${token.slice(0, 10)}...` : null
        });

        if (token) {
          // Verifica se o token é válido (tem formato JWT)
          const isValidJWT = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token);
          
          if (!isValidJWT) {
            console.warn('⚠️ Token encontrado mas formato inválido');
            setIsAuthenticated(false);
            setUser(null);
            setPerfil(null);
            setLoading(false);
            return;
          }

          console.log('✅ Token JWT válido encontrado');
          setIsAuthenticated(true);
          setUser({ token, email: email || 'no-email' });
          
          // Se houver perfil em cache, usa; caso contrário, busca da API
          if (cachedPerfil) {
            console.log('📋 Usando perfil em cache');
            setPerfil(JSON.parse(cachedPerfil));
          } else {
            console.log('📡 Buscando perfil da API...');
            try {
              const perfilData = await getMeuPerfil();
              console.log('✅ Perfil obtido com sucesso:', perfilData);
              setPerfil(perfilData);
              sessionStorage.setItem('userPerfilData', JSON.stringify(perfilData));
            } catch (err) {
              console.warn('⚠️ Falha ao buscar perfil durante checkAuth:', err);
              // Não falha a autenticação se não conseguir buscar perfil
              setPerfil(null);
            }
          }
          
          // Log do estado de autenticação
          console.log('🔐 Estado de autenticação atualizado:', { isAuthenticated: true, hasUser: true });
        } else {
          console.log('❌ Nenhum token JWT encontrado');
          setIsAuthenticated(false);
          setUser(null);
          setPerfil(null);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
        setPerfil(null);
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
      setPerfil(null);
      setLoading(false);
    };

    window.addEventListener('app-logout', handleAppLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app-logout', handleAppLogout);
    };
  }, []);

  const login = async (userData) => {
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

      // Extrai email do userData (se fornecido) ou usa o que já está no sessionStorage
      const email = (userData && userData.email) || sessionStorage.getItem('userEmail');

      // Atualiza o estado
      setIsAuthenticated(true);
      setUser({ email, token });

      // Salva no sessionStorage
      sessionStorage.setItem('token', token);
      if (email) sessionStorage.setItem('userEmail', email);

      // Tenta derivar o tipo de usuário a partir dos dados já salvos no sessionStorage
      let perfilFromStorage = (
        sessionStorage.getItem('userPerfil') ||
        sessionStorage.getItem('personalPerfil') ||
        sessionStorage.getItem('adminPerfil') ||
        sessionStorage.getItem('alunoPerfil') ||
        ''
      ).toString().toUpperCase();

      // Se não houver perfil salvo, tentamos buscar o perfil imediatamente para ter a role pronta
      let perfilTipo = '';
      let perfilData = null;
      if (!perfilFromStorage) {
        try {
          const perfil = await getMeuPerfil();
          console.log('AuthContext: perfil buscado no login:', perfil);
          
          // Cacheia o perfil completo no estado e sessionStorage
          setPerfil(perfil);
          sessionStorage.setItem('userPerfilData', JSON.stringify(perfil));
          perfilData = perfil;

          perfilTipo = perfil.perfil || perfil.role || perfil.userRole || perfil.perfilTipo || '';
          const nome = perfil.nome || perfil.name || perfil.usuario?.nome || perfil.user?.nome || perfil.fullName || perfil.nome_completo || perfil.nomeCompleto || 'Usuário';
          const emailPerfil = perfil.email || perfil.usuario?.email || perfil.user?.email || perfil.login || email;
          const numero = perfil.numero || perfil.telefone || perfil.phone || perfil.celular || perfil.phoneNumber || '';

          // Salva no sessionStorage (genérico)
          sessionStorage.setItem('userName', nome);
          sessionStorage.setItem('userEmail', emailPerfil);
          sessionStorage.setItem('userNumero', numero);
          if (perfilTipo) sessionStorage.setItem('userPerfil', perfilTipo);

          // Salva também com nome específico de cada tipo de usuário
          const upperPerfil = (perfilTipo || '').toString().toUpperCase();
          if (upperPerfil.includes('ADMIN')) {
            sessionStorage.setItem('adminName', nome);
            sessionStorage.setItem('adminEmail', emailPerfil);
            sessionStorage.setItem('adminPerfil', perfilTipo);
          } else if (upperPerfil.includes('PERSONAL') || upperPerfil.includes('PERSON')) {
            sessionStorage.setItem('personalName', nome);
            sessionStorage.setItem('personalEmail', emailPerfil);
            sessionStorage.setItem('personalNumero', numero);
            sessionStorage.setItem('personalPerfil', perfilTipo);
          } else {
            // Usuário comum (aluno)
            sessionStorage.setItem('alunoName', nome);
            sessionStorage.setItem('alunoEmail', emailPerfil);
            sessionStorage.setItem('alunoNumero', numero);
            sessionStorage.setItem('alunoPerfil', perfilTipo);
          }

          perfilFromStorage = (
            sessionStorage.getItem('userPerfil') ||
            sessionStorage.getItem('personalPerfil') ||
            sessionStorage.getItem('adminPerfil') ||
            sessionStorage.getItem('alunoPerfil') ||
            ''
          ).toString().toUpperCase();
        } catch (err) {
          console.warn('AuthContext: falha ao buscar perfil no login:', err);
        }
      }

      // Prioriza userData.userType quando disponível (objeto retornado pelo backend)
      let userType = (userData && userData.userType) || '';
      userType = (userType || '').toString().toLowerCase();

      if (!userType && perfilFromStorage) {
        if (perfilFromStorage.includes('PERSONAL')) userType = 'personal';
        else if (perfilFromStorage.includes('PROF')) userType = 'professor';
        else if (perfilFromStorage.includes('ADMIN')) userType = 'admin';
        else userType = 'aluno';
      }

      // Se ainda estiver vazio, usa 'aluno' como fallback conservador
      if (!userType) userType = 'aluno';

      sessionStorage.setItem('userType', userType);

      // Limpa chaves específicas de outras roles para evitar estados mistos
      const clearIfNot = (role, keys) => {
        if (userType !== role) {
          keys.forEach(k => sessionStorage.removeItem(k));
        }
      };

      // Remove dados de aluno se o usuário for personal/admin/professor
      clearIfNot('aluno', ['alunoName', 'alunoEmail', 'alunoNumero', 'alunoPerfil']);
      // Remove dados de personal se o usuário for aluno/admin/professor
      clearIfNot('personal', ['personalName', 'personalEmail', 'personalNumero', 'personalPerfil']);
      // Remove dados de admin if the user is not admin
      clearIfNot('admin', ['adminName', 'adminEmail', 'adminPerfil']);

      console.log("✅ Login concluído com sucesso:", {
        isAuthenticated: true,
        hasToken: true,
        hasEmail: !!email,
        userType,
        perfilFromStorage
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
    setPerfil(null);
    try {
      // MUDANÇA: Limpar o sessionStorage (token, email e chaves específicas por role)
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('userPerfilData');
      // chaves específicas que podem existir
      ['alunoName','alunoEmail','alunoNumero','alunoPerfil',
       'personalName','personalEmail','personalNumero','personalPerfil',
       'adminName','adminEmail','adminPerfil',
       'userName','userEmail','userNumero','userPerfil']
        .forEach(k => sessionStorage.removeItem(k));
      console.log('Logout realizado - dados removidos do sessionStorage (incluindo chaves por role)');
    } catch (error) {
      console.error('Erro ao remover dados do sessionStorage:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    perfil,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};