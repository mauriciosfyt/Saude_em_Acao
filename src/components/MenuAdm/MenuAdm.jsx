import React from 'react';
// --- ALTERAÇÃO --- Trocamos 'Link' por 'NavLink'
import { NavLink } from 'react-router-dom';
import './MenuAdm.css';

// Ícone do usuário
const UserIcon = () => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
  </svg>
);

const MenuAdm = () => {
  // --- REMOVIDO --- O useState não é mais necessário, o NavLink gerencia o estado ativo.
  // const [activeItem, setActiveItem] = useState('Personal');

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
        <h2 className="user-name">Olá maumau</h2>
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
