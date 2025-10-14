import React, { useState } from "react";
import { FaBars, FaTimes, FaHome, FaCalendarAlt, FaChartBar, FaUserFriends, FaUserTie, FaPlusCircle, FaBox } from "react-icons/fa";
import logo from "../../assets/logo_dia.png";
import { Link } from "react-router-dom";
import "./AdminHeader.css";


export default function AdminHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <header className="admin-header">
        <div className="logo">
          <img src={logo} alt="logo" className="logo-reserva" />
        </div>

        <FaBars
          className="menu-icon"
          onClick={() => setMenuAberto(true)}
        />
      </header>

      {/* Menu lateral */}
      <nav className={`menu-lateral ${menuAberto ? "ativo" : ""}`}>
        <div className="menu-topo">
          <img src={logo} alt="logo" className="logo-reserva" />
          <FaTimes className="fechar-icon" onClick={() => setMenuAberto(false)} />
        </div>
        <ul>
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><Link to="/ReservasEfetuadas"><FaCalendarAlt /> Reservas</Link></li>
          <li><Link to="/GerenciarProduto"><FaBox /> Produtos</Link></li>
          <li><Link to="/GerenciarAlunos"><FaUserFriends /> Alunos</Link></li>
          <li><Link to="/GerenciarPersonal"><FaUserTie /> Personal</Link></li>
          <li><Link to="/Dashboard"><FaChartBar  /> Dashboard</Link></li>

        </ul>
      </nav>
    </>
  );
}
