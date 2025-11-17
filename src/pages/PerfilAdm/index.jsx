import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import "./PerfilAdm.css";
import performLogout from "../../components/LogoutButton/LogoutButton";

const PerfilAdm = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    nome: "",
    email: "",
    perfil: "",
  });

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
    const payload = getDecodedToken();
    if (!payload) {
      navigate("/"); // se não houver token, redireciona para login ou home
      return;
    }

    // Carrega os dados salvos no sessionStorage durante o login
    const cachedName = sessionStorage.getItem('userName');
    const cachedEmail = sessionStorage.getItem('userEmail');
    const cachedPerfil = sessionStorage.getItem('userPerfil');

    if (cachedName || cachedEmail) {
      setAdminData({
        nome: cachedName || "",
        email: cachedEmail || "",
        perfil: cachedPerfil || "ADMIN",
      });
    } else {
      // Se não houver cache, tenta extrair do token
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
      const email = payload.email || payload.usuario?.email || payload.user?.email || payload.sub || "sem-email@dominio.com";
      const perfil = payload.perfil || payload.role || payload.userRole || "ADMIN";

      setAdminData({
        nome,
        email,
        perfil,
      });
    }
  }, [navigate]);


  return (
    <div>
      <HeaderUser />

      <main className="perfil-container">
        <section className="perfil-section">
          <div className="perfil-header">
            <img
              src={perfilPhoto}
              alt="Foto do Perfil"
              className="perfil-foto"
            />
            <h2>OLÁ, {adminData.nome.toUpperCase()}</h2>
            <p className="perfil-status">Ativo: {adminData.perfil}</p>
          </div>

          <div className="perfil-dados">
            {/* Card 1 - Produtos */}
            <div className="card-produtos">
              <p className="produtos-reservados-label">Produtos Reservados:</p>
              <p className="produtos-reservados-valor">
                <strong>100</strong>
              </p>
              <hr className="divisor-produtos" />
              <p className="produtos-ativos-label">Produtos Ativos:</p>
              <p className="produtos-ativos-valor">
                <strong>150</strong>
              </p>
            </div>

            {/* Card 2 - Vendas */}
            <div className="card-vendas">
              <p className="vendas-totais-label">Total Vendido:</p>
              <p className="vendas-totais-valor">
                <strong>R$99.999,99</strong>
              </p>
              <hr className="divisor-vendas" />
              <p className="pagamento-pendente-label">Aguardando Pagamento:</p>
              <p className="pagamento-pendente-valor">
                <strong>100</strong>
              </p>
            </div>
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
          <p>
            <strong>Nome:</strong> {adminData.nome}
          </p>
          <p>
            <strong>Email:</strong> {adminData.email}
          </p>
          <p>
            <strong>Perfil:</strong> {adminData.perfil}
          </p>
          <p>
            <strong>Senha:</strong> ********
          </p>
        </div>

        <div className="actions-row">
          <button className="logout-btn" onClick={() => performLogout(navigate)}>
            Desconectar
          </button>
          <button
            className="manage-btn"
            onClick={() => navigate("/Dashboard")}
          >
            Gerenciar
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilAdm;
