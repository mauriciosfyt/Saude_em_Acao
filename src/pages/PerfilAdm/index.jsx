import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import "./PerfilAdm.css";
import performLogout from "../../components/LogoutButton/LogoutButton";
import { getMeuPerfil, API_URL } from "../../services/usuarioService";
import { getAllProdutos } from "../../services/produtoService";
import { fetchReservas } from "../../services/reservasService";
import { fixImageUrl } from "../../utils/image";

const PerfilAdm = () => {
  const navigate = useNavigate();
  
  // --- 1. CARREGAMENTO INSTANTÂNEO DE DADOS DO USUÁRIO ---
  // Igual ao seu Perfil.jsx: Lê do storage IMEDIATAMENTE na criação do estado
  const [adminData, setAdminData] = useState(() => {
    return {
      nome: sessionStorage.getItem('userName') || localStorage.getItem('userName') || "",
      email: sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail') || "",
      perfil: sessionStorage.getItem('userPerfil') || localStorage.getItem('userPerfil') || "ADMIN",
    };
  });

  // --- 2. CARREGAMENTO INSTANTÂNEO DOS DADOS (GRÁFICOS) ---
  // Lê do cache local instantaneamente para não mostrar zeros
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('dashboard_stats_cache');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Erro ao ler cache:", e);
    }
    return {
      produtosReservados: 0,
      produtosAtivos: 0,
      totalVendido: 0,
      pagamentoPendente: 0,
    };
  });

  const [profileImage, setProfileImage] = useState(perfilPhoto);

  // Função helper de token (igual ao seu Perfil)
  const getDecodedToken = () => {
    try {
      let token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
      if (!token) return null;

      token = token.replace(/^token/i, "").trim();
      if (token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7);
      }

      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const payload = getDecodedToken();
    if (!payload) {
      navigate("/"); 
      return;
    }

    // Validação básica de permissão
    const userRole = payload.perfil || payload.role || adminData.perfil;
    if (userRole && userRole !== "ADMIN") {
      navigate("/nao-autorizado");
      return;
    }

    const loadDashboardData = async () => {
      try {
        // --- BUSCA EM PARALELO (Velocidade Máxima) ---
        const perfilPromise = getMeuPerfil();
        const dadosPromise = Promise.all([getAllProdutos(), fetchReservas()]);

        // 1. Processa Perfil e Imagem
        const perfilCompleto = await perfilPromise;
        if (perfilCompleto) {
            const nome = perfilCompleto.nome || perfilCompleto.name || adminData.nome || "Administrador";
            const email = perfilCompleto.email || perfilCompleto.usuario?.email || adminData.email;
            const perfil = perfilCompleto.perfil || perfilCompleto.role || "ADMIN";

            setAdminData({ nome, email, perfil });
            
            // Atualiza Storage para a próxima vez ser rápida
            sessionStorage.setItem('userName', nome);
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userPerfil', perfil);

            // Tratamento de Imagem
            const possibleImage = perfilCompleto.foto || perfilCompleto.fotoUrl || perfilCompleto.imagem || perfilCompleto.imagemUrl || null;
            if (possibleImage) {
                const baseServer = API_URL.replace(/\/api$/, '');
                const isAbsolute = /^https?:\/\//i.test(possibleImage);
                const fotoUrl = isAbsolute
                ? possibleImage
                : (possibleImage.startsWith('/') ? `${baseServer}${possibleImage}` : `${baseServer}/${possibleImage}`);
                setProfileImage(fixImageUrl(fotoUrl));
            }
        }

        // 2. Processa Estatísticas (Produtos e Reservas)
        const [produtosData, reservasData] = await dadosPromise;

        let listaReservas = [];
        if (Array.isArray(reservasData)) {
            listaReservas = reservasData;
        } else if (reservasData && Array.isArray(reservasData.content)) {
            listaReservas = reservasData.content;
        }

        const listaProdutos = Array.isArray(produtosData) ? produtosData : (produtosData.content || []);

        // --- CÁLCULO OTIMIZADO (Single Loop) ---
        const parseValor = (val) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            const clean = val.toString().replace(/[R$\s.]/g, '').replace(',', '.');
            return parseFloat(clean) || 0;
        };

        let calcRetirados = 0;
        let calcReservados = 0;
        let calcSomaVendas = 0;

        const statusRetirado = ['RETIRADO', 'CONCLUIDA', 'CONCLUÍDA', 'CONCLUIDO'];
        const statusReservado = [
            'APROVADA', 'APROVADO',
            'CANCELADA', 'CANCELADO',
            'RETIRADO', 
            'CONCLUIDA', 'CONCLUÍDA', 'CONCLUIDO'
        ];

        listaReservas.forEach(r => {
            const s = r.status ? r.status.toUpperCase() : '';
            
            if (statusRetirado.includes(s)) {
                calcRetirados++;
                let totalDaReserva = parseValor(r.valorTotal || r.total);
                if (!totalDaReserva) {
                    const precoUnitario = parseValor(r.preco || r.produto?.preco || r.valor || 0);
                    const quantidade = parseValor(r.quantidade || r.qtd || r.amount || 1);
                    totalDaReserva = precoUnitario * quantidade;
                }
                calcSomaVendas += totalDaReserva;
            }

            if (statusReservado.includes(s)) {
                calcReservados++;
            }
        });

        const countAtivos = listaProdutos.length;

        const newStats = {
            produtosReservados: calcRetirados, 
            produtosAtivos: countAtivos,        
            totalVendido: calcSomaVendas,           
            pagamentoPendente: calcReservados  
        };

        // Atualiza estado e Cache
        setStats(newStats);
        localStorage.setItem('dashboard_stats_cache', JSON.stringify(newStats));

      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      }
    };

    loadDashboardData();
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
            <h2>OLÁ, {adminData.nome ? adminData.nome.toUpperCase() : "..."}</h2>
            <p className="perfil-status">Ativo: {adminData.perfil || "..."}</p>
          </div>

          <div className="perfil-dados">
            {/* Card 1 - Produtos */}
            <div className="card-produtos">
              <p className="produtos-reservados-label">Produtos Retirados:</p>
              <p className="produtos-reservados-valor">
                <strong>{stats.produtosReservados}</strong>
              </p>
              <hr className="divisor-produtos" />
              <p className="produtos-ativos-label">Produtos Ativos:</p>
              <p className="produtos-ativos-valor">
                <strong>{stats.produtosAtivos}</strong>
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
                <strong>{stats.pagamentoPendente}</strong>
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