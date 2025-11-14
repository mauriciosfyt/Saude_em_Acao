import React, { useEffect, useState } from "react";
import HeaderUser from "../../components/header";
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import './PerfilPersonal.css';
import performLogout from "../../components/LogoutButton/LogoutButton";
import { useAuth } from '../../contexts/AuthContext';

const PerfilPersonal = () => {
  const navigate = useNavigate();
  const [personalData, setPersonalData] = useState({
    nome: "",
    email: "",
    numero: "",
    perfil: "",
  });

  const { perfil } = useAuth();

  // Função para buscar o token salvo e decodificá-lo
  const getDecodedToken = () => {
    try {
      // Procura o token no localStorage ou sessionStorage
      let token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        "";

      if (!token) {
        // procura tokens salvos incorretamente (tipo tokeneyJ...)
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

      // Corrige tokens com prefixos tipo 'tokeneyJ...' ou 'Bearer eyJ...'
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
    // Se o perfil estiver disponível no AuthContext, usa ele (evita problemas no reload)
    const payload = getDecodedToken();
    if (!payload && !perfil) {
      navigate('/');
      return;
    }

    if (perfil) {
      const nome = perfil.nome || perfil.name || perfil.usuario?.nome || perfil.user?.nome || perfil.fullName || perfil.nome_completo || perfil.nomeCompleto || 'Personal';
      const email = perfil.email || perfil.usuario?.email || perfil.user?.email || perfil.login || sessionStorage.getItem('personalEmail') || 'sem-email@dominio.com';
      const perfilTipo = perfil.perfil || perfil.role || perfil.userRole || 'PERSONAL';
      const numero = perfil.numero || perfil.telefone || perfil.phone || perfil.celular || sessionStorage.getItem('personalNumero') || '(00) 00000-0000';

      setPersonalData({ nome, email, numero, perfil: perfilTipo });

      // Garantir compatibilidade com outras partes que leem chaves específicas
      try {
        sessionStorage.setItem('personalName', nome);
        sessionStorage.setItem('personalEmail', email);
        sessionStorage.setItem('personalNumero', numero);
        sessionStorage.setItem('personalPerfil', perfilTipo);
      } catch (e) {
        // ignore
      }

      return;
    }

    // Fallback: usar sessionStorage ou token quando perfil não estiver no contexto
    const cachedName = sessionStorage.getItem('personalName');
    const cachedEmail = sessionStorage.getItem('personalEmail');
    const cachedNumero = sessionStorage.getItem('personalNumero');
    const cachedPerfil = sessionStorage.getItem('personalPerfil');

    if (cachedName || cachedEmail) {
      setPersonalData({
        nome: cachedName || '',
        email: cachedEmail || '',
        perfil: cachedPerfil || 'PERSONAL',
        numero: cachedNumero || '',
      });
    } else if (payload) {
      const nome = payload.nome || payload.name || payload.user?.nome || payload.user?.name || payload.usuario?.nome || payload.fullName || payload.nome_completo || payload.nomeCompleto || 'Personal';
      const email = payload.email || payload.usuario?.email || payload.user?.email || payload.sub || 'sem-email@dominio.com';
      const perfilTipo = payload.perfil || payload.role || payload.userRole || 'PERSONAL';
      const numero = payload.numero || payload.telefone || payload.phone || payload.celular || '(00) 00000-0000';

      setPersonalData({ nome, email, numero, perfil: perfilTipo });
    }
  }, [navigate, perfil]);


  return (
    <div>
      <HeaderUser />

    <main className="perfil-container-personal">
  <section className="perfil-section-personal">
    <div className="perfil-header-personal">
      <img src={perfilPhoto} alt="Foto do Perfil" className="perfil-foto-personal" />
      <h2>OLÁ, {personalData.nome.toUpperCase()}</h2>
      <p className="perfil-status-personal">Ativo: {personalData.perfil}</p>
    </div>

  </section>
</main>

 <div className="perfil-wave">
  <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
    <path
      fill="#D9D9D9"
      d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,218.7C840,235,960,245,1080,229.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    />
  </svg>
</div>


      <div className="container-dados">
        <div className="dados-box">
          <p><strong>Nome:</strong> {personalData.nome}</p>
          <p><strong>Email:</strong> {personalData.email}</p>
          <p><strong>Número:</strong> {personalData.numero}</p>
          <p><strong>Senha:</strong> ********</p>
        </div>

        <div className="actions-row-personal">
          <button className="logout-btn-personal" onClick={() => performLogout(navigate)}>Desconectar</button>
          <button className="manage-btn-personal" onClick={() => navigate('/AdministrarAluno')}>Gerenciar</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilPersonal;
