import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMeuPerfil } from '../services/usuarioService';

// ProtectedRoute: protege rotas que exigem autenticação e (opcionalmente) um papel específico ou plano
const hasRequiredRole = (perfil, requiredRoles, requiredPlan) => {
  if (!requiredRoles && !requiredPlan) return true; // se não exige nada, permite

  if (!perfil) return false;

  // Converte requiredRoles para array se for string
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : (requiredRoles ? [requiredRoles] : []);

  // aliases para papéis que podem ter nomes diferentes na API
  const aliases = {
    PERSONAL: ['PERSONAL', 'PROFESSOR', 'TRAINER'],
    ADMIN: ['ADMIN', 'ADMINISTRADOR'],
    ALUNO: ['ALUNO', 'STUDENT']
  };

  // Verifica se o usuário tem uma das roles aceitas
  const hasRole = rolesArray.length === 0 || rolesArray.some(role => {
    const roleUpper = String(role).toUpperCase();
    const accepted = new Set([roleUpper].concat(aliases[roleUpper] || []));

    // Verifica várias chaves comuns que a API pode retornar
    const candidates = [
      perfil.role,
      perfil.roles,
      perfil.perfil,
      perfil.tipo,
      perfil.tipoUsuario,
      perfil.role?.[0],
      perfil.user?.role,
      perfil.usuario?.role,
      perfil.usuario?.perfil,
      perfil.user?.tipo
    ];

    for (const c of candidates) {
      if (!c) continue;
      const val = Array.isArray(c) ? c.map(String).join(',').toUpperCase() : String(c).toUpperCase();
      for (const acc of accepted) {
        if (val.includes(acc)) return true;
      }
    }
    return false;
  });

  if (hasRole) return true; // Se tem role requerida, permite

  // Se não tem role, verifica se tem plano requerido
  if (requiredPlan) {
    const planUpper = String(requiredPlan).toUpperCase();
    const userPlan = String(perfil.plano || perfil.plan || perfil.planoTipo || perfil.subscription || '').toUpperCase();
    if (userPlan.includes(planUpper)) return true;
  }

  return false;
};

const ProtectedRoute = ({ element, requiredRole, requiredRoles, requiredPlan }) => {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  // Normaliza requiredRole para requiredRoles (compatibilidade com prop antiga)
  const finalRequiredRoles = requiredRoles || (requiredRole ? [requiredRole] : []);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      if (!isAuthenticated) {
        if (mounted) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      // Se não precisa validar papel nem plano, já permite o acesso
      if (finalRequiredRoles.length === 0 && !requiredPlan) {
        if (mounted) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      try {
        // Tenta checar cache rápido
        const rolesStr = finalRequiredRoles.join('_').toUpperCase();
        const planStr = (requiredPlan || '').toUpperCase();
        const cacheKey = `role_plan_allowed_${rolesStr}_${planStr}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached === 'true') {
          if (mounted) {
            setAllowed(true);
            setChecking(false);
          }
          return;
        }

        // Busca o perfil do usuário e decide se tem a role/plano requeridos
        const perfil = await getMeuPerfil();
        const hasAccess = hasRequiredRole(perfil, finalRequiredRoles, requiredPlan);
        sessionStorage.setItem(cacheKey, hasAccess ? 'true' : 'false');
        if (mounted) {
          setAllowed(hasAccess);
        }
      } catch (err) {
        // Em caso de erro, não permite
        console.warn('ProtectedRoute: falha ao obter perfil', err);
        if (mounted) setAllowed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    // Se o contexto ainda está carregando, espere
    if (loading) {
      setChecking(true);
    }

    check();

    return () => { mounted = false; };
  }, [isAuthenticated, loading, finalRequiredRoles, requiredPlan]);


  if (loading || checking) {
    // Retorna null ou um loader mínimo
    return null;
  }

  // Se não autenticado, redireciona para home
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Se não autorizado (sem role/plano requerido), redireciona para 404
  if ((finalRequiredRoles.length > 0 || requiredPlan) && !allowed) return <Navigate to="/404" replace />;

  return element;
};

export default ProtectedRoute;
