import React, { useEffect, useState } from 'react';
// --- ALTERAÇÃO --- Trocamos 'Link' por 'NavLink'
import { NavLink } from 'react-router-dom';
import './MenuAdm.css';
import { getMeuPerfil } from '../../services/usuarioService';

// Ícone do usuário
const UserIcon = () => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
  </svg>
);

const MenuAdm = () => {
  // Inicializa com o valor do sessionStorage se existir, senão com "Carregando..."
  const [adminName, setAdminName] = useState(() => {
    return sessionStorage.getItem('adminName') || 'Carregando...';
  });

  // Função para buscar o token salvo e decodificá-lo
  const getDecodedToken = () => {
    try {
      let token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        "";

      if (!token) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
          if (value && value.includes("eyJ")) {
            token = value;
            break;
          }
        }
      }

      if (!token) return null;

      token = token.replace(/^token/i, "").trim();
      if (token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7);
      }

      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      return payload;
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      return null;
    }
  };

  useEffect(() => {
    // Primeiro, verifica se o nome já está armazenado no sessionStorage
    const cachedName = sessionStorage.getItem('adminName');
    if (cachedName) {
      setAdminName(cachedName);
      return; // Se tiver em cache, não faz a requisição
    }

    const payload = getDecodedToken();
    if (!payload) {
      return;
    }

    // Tenta buscar os dados completos do usuário via API primeiro
    const fetchProfile = async () => {
      try {
        const perfil = await getMeuPerfil();
        console.log('Meu perfil de admin (API):', perfil);

        const nomeApi = perfil.nome || perfil.name || perfil.usuario?.nome || perfil.user?.nome || perfil.fullName || perfil.nome_completo || perfil.nomeCompleto;

        if (nomeApi) {
          setAdminName(nomeApi);
          sessionStorage.setItem('adminName', nomeApi); // Armazena em cache
          return;
        }
      } catch (err) {
        // Se a chamada à API falhar, faz fallback usando o token (já decodificado)
        console.warn('Falha ao buscar perfil via API, usando token como fallback:', err);
        console.log("Decoded token payload (Admin fallback):", payload);

        const nome = 
          payload.nome ||
          payload.name ||
          payload.user?.nome ||
          payload.user?.name ||
          payload.usuario?.nome ||
          payload.fullName ||
          payload.nome_completo ||
          payload.nomeCompleto ||
          "Administrador";
        setAdminName(nome);
        sessionStorage.setItem('adminName', nome); // Armazena em cache
      }
    };

    fetchProfile();
  }, []);

  const menuItems = [
    { nome: 'Home', path: '/' },
    { nome: 'Dashboard', path: '/Dashboard' },
    { nome: 'Personal', path: '/GerenciarPersonal' },
    { nome: 'Alunos', path: '/GerenciarAlunos' },
    { nome: 'Gerenciar Treinos', path: '/GerenciarTreino' },
    { nome: 'Gerenciar Produtos', path: '/GerenciarProduto' },
    { nome: 'Reservas', path: '/ReservasPendentes' },
    { nome: 'Historico', path: '/GerenciarReservas' } // Corrigi o path para ser único
  ];

  return (
    <aside className="menu-wrapper">
      <div className="profile-section">
        <div className="avatar-circle">
          <UserIcon />
        </div>
        <h2 className="user-name">Olá {adminName}</h2>
      </div>

      <nav className="navigation">
        {menuItems.map((item) => (
          // --- ALTERAÇÃO --- Usando NavLink em vez de Link
          // Ele recebe uma função no className que nos informa se o link está ativo.
          <NavLink
            key={item.nome}
            to={item.path}
            className={({ isActive }) => 
              "menu-item" + (isActive ? " active" : "")
            }
          >
            {item.nome}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default MenuAdm;
