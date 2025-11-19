import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import "./PerfilAdm.css";
import performLogout from "../../components/LogoutButton/LogoutButton";
import { getMeuPerfil, API_URL } from "../../services/usuarioService";
import { fixImageUrl } from "../../utils/image";

const PerfilAdm = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    nome: "",
    email: "",
    perfil: "",
  });
  // Estado para estatísticas exibidas nos cards (produtos, vendas, etc.)
  const [stats, setStats] = useState({
    produtosReservados: 0,
    produtosAtivos: 0,
    totalVendido: 0,
    pagamentoPendente: 0,
  });

  // Estado para URL da imagem do perfil (usa imagem da API ou fallback local)
  const [profileImage, setProfileImage] = useState(perfilPhoto);

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

    // Primeiro tenta carregar dados rápidos do sessionStorage
    const cachedName = sessionStorage.getItem('userName');
    const cachedEmail = sessionStorage.getItem('userEmail');
    const cachedPerfil = sessionStorage.getItem('userPerfil');

    if (cachedName || cachedEmail) {
      setAdminData({
        nome: cachedName || "",
        email: cachedEmail || "",
        perfil: cachedPerfil || "ADMIN",
      });
      if (cachedPerfil !== "ADMIN") {
        navigate("/nao-autorizado");
        return;
      }
    }

    // Busca o perfil completo do usuário logado na API e popula dados/estatísticas
    const fetchProfile = async () => {
      try {
        const perfilCompleto = await getMeuPerfil();

        if (!perfilCompleto) {
          // Mantém dados anteriores se nada for retornado
          return;
        }


        // Mapeia campos comuns retornados pela API para o estado local
        const nome = perfilCompleto.nome || perfilCompleto.name || perfilCompleto.fullName || perfilCompleto.usuario?.nome || perfilCompleto.user?.name || adminData.nome || "Administrador";
        const email = perfilCompleto.email || perfilCompleto.usuario?.email || perfilCompleto.user?.email || adminData.email || "sem-email@dominio.com";
        const perfil = perfilCompleto.perfil || perfilCompleto.role || perfilCompleto.userRole || perfilCompleto.perfilUsuario || adminData.perfil || "ADMIN";

        setAdminData({ nome, email, perfil });

        // Extrai a URL da imagem do perfil a partir de várias chaves possíveis
        const possibleImage =
          perfilCompleto.foto ||
          perfilCompleto.fotoUrl ||
          perfilCompleto.imagem ||
          perfilCompleto.imagemUrl ||
          perfilCompleto.avatar ||
          perfilCompleto.avatarUrl ||
          perfilCompleto.profilePicture ||
          perfilCompleto.photo ||
          perfilCompleto.usuario?.foto ||
          perfilCompleto.user?.foto ||
          perfilCompleto.user?.avatar ||
          null;

        if (possibleImage) {
          try {
            // Se a API retornar caminho relativo (ex: /uploads/...), prefixamos com a base do servidor
            const baseServer = API_URL.replace(/\/api$/, '');
            const isAbsolute = /^https?:\/\//i.test(possibleImage);
            const fotoUrl = isAbsolute
              ? possibleImage
              : (possibleImage.startsWith('/') ? `${baseServer}${possibleImage}` : `${baseServer}/${possibleImage}`);

            setProfileImage(fixImageUrl(fotoUrl));
          } catch (e) {
            console.warn('Erro ao normalizar URL da imagem:', e);
            setProfileImage(perfilPhoto);
          }
        } else {
          // Mantém fallback local
          setProfileImage(perfilPhoto);
        }

        // Se houver campos de estatísticas no retorno, popula-los
        // Usa nomes tolerantes (stats, resumo, dashboard, contabilidades)
        const stats = perfilCompleto.stats || perfilCompleto.resumo || perfilCompleto.dashboard || perfilCompleto.contagem || {};

        setStats({
          produtosReservados: stats.produtosReservados ?? stats.reservados ?? stats.produtos_reservados ?? 0,
          produtosAtivos: stats.produtosAtivos ?? stats.ativos ?? stats.produtos_ativos ?? 0,
          totalVendido: stats.totalVendido ?? stats.vendido ?? stats.total_vendido ?? 0,
          pagamentoPendente: stats.pagamentoPendente ?? stats.pendentes ?? stats.pagamentos_pendentes ?? 0,
        });

        if (perfil !== "ADMIN") {
          navigate("/nao-autorizado");
          return;
        }
      } catch (err) {
        console.error('Erro ao buscar perfil completo:', err);
        // Em caso de erro, mantemos os dados existentes (token/cached) e não bloqueamos a rota
      }
    };

    fetchProfile();
  }, [navigate]);

 
  return (
    <div>
      <HeaderUser />

      <main className="perfil-container">
        <section className="perfil-section">
          <div className="perfil-header">
            <img
              src={profileImage}
              alt="Foto do Perfil"
              className="perfil-foto"
              onError={() => setProfileImage(perfilPhoto)}
            />
            <h2>OLÁ, {adminData.nome.toUpperCase()}</h2>
            <p className="perfil-status">Ativo: {adminData.perfil}</p>
          </div>

          <div className="perfil-dados">
            {/* Card 1 - Produtos */}
            <div className="card-produtos">
              <p className="produtos-reservados-label">Produtos Retirados:</p>
              <p className="produtos-reservados-valor">
                <strong>{stats.produtosReservados ?? 0}</strong>
              </p>
              <hr className="divisor-produtos" />
              <p className="produtos-ativos-label">Produtos Ativos:</p>
              <p className="produtos-ativos-valor">
                <strong>{stats.produtosAtivos ?? 0}</strong>
              </p>
            </div>

            {/* Card 2 - Vendas */}
            <div className="card-vendas">
              <p className="vendas-totais-label">Total Vendido:</p>
              <p className="vendas-totais-valor">
                <strong>{
                  typeof stats.totalVendido === 'number'
                    ? stats.totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : stats.totalVendido || 'R$0,00'
                }</strong>
              </p>
              <hr className="divisor-vendas" />
              <p className="pagamento-pendente-label">Produtos Reservados:</p>
              <p className="pagamento-pendente-valor">
                <strong>{stats.pagamentoPendente ?? 0}</strong>
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
