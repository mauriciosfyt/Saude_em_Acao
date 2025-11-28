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
  // Inicializa o estado lendo direto do sessionStorage (se existir), sem esperar o useEffect
  const [adminData, setAdminData] = useState(() => {
    return {
      nome: sessionStorage.getItem('userName') || "",
      email: sessionStorage.getItem('userEmail') || "",
      perfil: sessionStorage.getItem('userPerfil') || "",
    };
  });

  // --- 2. CARREGAMENTO INSTANTÂNEO DOS CARDS (STATS) ---
  // Essa função roda antes da tela aparecer. Se tiver cache, mostra na hora.
  const getInitialStats = () => {
    try {
      const cached = sessionStorage.getItem('dashboard_stats_cache');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Erro ao ler cache:", e);
    }
    // Estado inicial (Loading) se for o primeiro acesso absoluto
    return {
      produtosReservados: 0,
      produtosAtivos: 0,
      totalVendido: 0,
      pagamentoPendente: 0,
    };
  };

  const [stats, setStats] = useState(getInitialStats);
  const [profileImage, setProfileImage] = useState(perfilPhoto);

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

    // Se o perfil não veio do cache inicial, redireciona se não for admin
    if (adminData.perfil && adminData.perfil !== "ADMIN") {
      navigate("/nao-autorizado");
      return;
    }

    const loadDashboardData = async () => {
      try {
        // --- A. ATUALIZAÇÃO DO PERFIL EM BACKGROUND ---
        const perfilCompleto = await getMeuPerfil();
        if (perfilCompleto) {
            const nome = perfilCompleto.nome || perfilCompleto.name || adminData.nome || "Administrador";
            const email = perfilCompleto.email || perfilCompleto.usuario?.email || adminData.email;
            const perfil = perfilCompleto.perfil || perfilCompleto.role || "ADMIN";

            // Atualiza estado e Cache da Sessão
            setAdminData({ nome, email, perfil });
            sessionStorage.setItem('userName', nome);
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userPerfil', perfil);

            // Imagem
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

        // --- B. ATUALIZAÇÃO DOS CARDS (STATS) EM BACKGROUND ---
        const [produtosData, reservasData] = await Promise.all([
            getAllProdutos(),
            fetchReservas()
        ]);

        let listaReservas = [];
        if (Array.isArray(reservasData)) {
            listaReservas = reservasData;
        } else if (reservasData && Array.isArray(reservasData.content)) {
            listaReservas = reservasData.content;
        }

        const listaProdutos = Array.isArray(produtosData) ? produtosData : (produtosData.content || []);

        // --- CÁLCULOS ---
        const parseValor = (val) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            const clean = val.toString().replace(/[R$\s.]/g, '').replace(',', '.');
            return parseFloat(clean) || 0;
        };

        // 1. Produtos Retirados (Status Finalizados)
        const countRetirados = listaReservas.filter(r => {
            const s = r.status ? r.status.toUpperCase() : '';
            return ['RETIRADO', 'CONCLUIDA', 'CONCLUÍDA', 'CONCLUIDO'].includes(s);
        }).length;

        // 2. Produtos Reservados (Histórico: Aprovado, Cancelado, Retirado)
        const countReservados = listaReservas.filter(r => {
            const s = r.status ? r.status.toUpperCase() : '';
            return [
                'APROVADA', 'APROVADO',
                'CANCELADA', 'CANCELADO',
                'RETIRADO', 
                'CONCLUIDA', 'CONCLUÍDA', 'CONCLUIDO'
            ].includes(s);
        }).length;

        // 3. TOTAL VENDIDO (Preço * Quantidade dos Concluídos)
        const somaVendas = listaReservas
            .filter(r => {
                const s = r.status ? r.status.toUpperCase() : '';
                return ['RETIRADO', 'CONCLUIDA', 'CONCLUÍDA', 'CONCLUIDO'].includes(s);
            })
            .reduce((acc, curr) => {
                let totalDaReserva = parseValor(curr.valorTotal || curr.total);

                if (!totalDaReserva) {
                    const precoUnitario = parseValor(curr.preco || curr.produto?.preco || curr.valor || 0);
                    const quantidade = parseValor(curr.quantidade || curr.qtd || curr.amount || 1);
                    totalDaReserva = precoUnitario * quantidade;
                }
                
                return acc + totalDaReserva;
            }, 0);

        // 4. Produtos Ativos
        const countAtivos = listaProdutos.length;

        const newStats = {
            produtosReservados: countRetirados, 
            produtosAtivos: countAtivos,        
            totalVendido: somaVendas,           
            pagamentoPendente: countReservados  
        };

        // Atualiza a tela e SALVA NA SESSÃO para o próximo F5 ser instantâneo
        setStats(newStats);
        sessionStorage.setItem('dashboard_stats_cache', JSON.stringify(newStats));

      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      }
    };

    loadDashboardData();
  }, [navigate, adminData.nome]); // Atualiza se mudar usuário

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
            {/* Dados lidos instantaneamente do adminData */}
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