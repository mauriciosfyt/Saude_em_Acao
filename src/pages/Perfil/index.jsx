import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import './Perfil.css'; // Importa o CSS corrigido
import performLogout from "../../components/LogoutButton/LogoutButton";
import { FaTimesCircle } from 'react-icons/fa';

// SVG para o ícone de check circle
const CheckCircleIcon = () => (
  <svg className="perfil-check-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// SVG para o ícone de times circle (X)
const TimesCircleIcon = () => (
  <svg className="perfil-times-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M15 9L9 15M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    telefone: "",
    perfil: "ALUNO",
    plano: "",
    dataUltimoTreino: "",
    nivelAtividade: ""
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

    // Validação de perfil ADMIN ou ALUNO
    const cachedPerfil = sessionStorage.getItem('userPerfil');
    let perfilFromToken = payload.perfil || payload.role || payload.userRole || "ALUNO";
    const perfil = cachedPerfil || perfilFromToken;
    if (perfil !== "ALUNO") {
      navigate("/nao-autorizado");
      return;
    }
    sessionStorage.setItem('userPerfil', perfil);

    // Carrega os dados salvos no sessionStorage durante o login
    const cachedName = sessionStorage.getItem('userName');
    const cachedEmail = sessionStorage.getItem('userEmail');
    const cachedTelefone = sessionStorage.getItem('userNumero');
    const cachedPlano = sessionStorage.getItem('userPlano');

    if (cachedName || cachedEmail) {
      setUserData((prev) => ({
        ...prev,
        nome: cachedName || prev.nome,
        email: cachedEmail || prev.email,
        telefone: cachedTelefone || prev.telefone,
        plano: cachedPlano || prev.plano,
      }));
    } else {
      // Se não houver cache, tenta extrair do token
      const nome =
        payload.nome ||
        payload.name ||
        payload.user?.nome ||
        payload.user?.name ||
        payload.usuario?.nome ||
        payload.sub?.split("@")[0] ||
        "Aluno";

      const email =
        payload.email ||
        payload.user?.email ||
        payload.usuario?.email ||
        payload.sub ||
        "sem-email@dominio.com";

      const telefone =
        payload.numero ||
        payload.phone ||
        payload.telefone || "(00) 00000-0000";

      const plano = payload.plano || "Sem Plano";

      setUserData((prev) => ({
        ...prev,
        nome,
        email,
        telefone,
        plano,
      }));

      // Salva os dados no sessionStorage
      sessionStorage.setItem('userName', nome);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userNumero', telefone);
      sessionStorage.setItem('userPlano', plano);

      // Remove chaves antigas para evitar duplicidade
      sessionStorage.removeItem('alunoName');
      sessionStorage.removeItem('alunoEmail');
      sessionStorage.removeItem('alunoNumero');
      sessionStorage.removeItem('alunoPerfil');
    }
  }, [navigate]);

  // Logout agora é tratado pelo componente reutilizável LogoutButton

  // chave do plano em minúsculas (usada para condições de exibição)
  const planKey = (userData.plano || userData.perfil || '').toString().toLowerCase();

  return (
    <div>
      <HeaderUser />

      <main className="perfil-container">
        <section className="perfil-section">
          <div className="perfil-header">
            <img src={perfilPhoto} alt="Foto do Perfil" className="perfil-icon" />
            <h2>OLÁ, {(userData.nome || "").toUpperCase()}</h2>
            <p className="perfil-desc">
              Estudando resolver cenários e aprendendo com os erros
            </p>
          </div>

          <div className="perfil-cards">
            {/* Card "Meu Desempenho" - exibido apenas para plano Gold */}
            {planKey === 'gold' && (
              <div className="perfil-card-info perfil-desempenho-card">
                <div className="perfil-card-header">
                  <span className="perfil-icon-desempenho">📊</span>
                  <h4>Meu Desempenho</h4>
                </div>
                <div className="perfil-desempenho-info">
                  <p className="perfil-treinos-feitos"><strong>{userData.treinosFeitos}</strong></p>
                  <p className="perfil-info-label">Treinos Feitos na Semana</p>
                  <hr className="perfil-linha-divisoria" />
                  <p className="perfil-ultimo-treino"><strong>{userData.ultimoTreino}</strong></p>
                  <p className="perfil-info-label">Último Treino</p>
                </div>
              </div>
            )}

            {/* Card "Plano Black" com os novos ícones SVG */}
            {/* Plano: exibe os recursos conforme o plano do usuário (mocked) */}
            <div className="perfil-card-info">
              {
                (() => {
                  const planCatalog = {
                    gold: {
                      title: 'Plano Gold',
                      features: [
                        'Todas as modalidades:',
                        'Personal',
                        'Funcional',
                        'Thay fit',
                        'Pilates'
                      ]
                    },
                    essencial: {
                      title: 'Plano Essencial',
                      features: [
                        'Todas as modalidades:',
                        'Pilates',
                        'Funcional',
                      ]
                    },
                    basico: {
                      title: 'Plano Básico',
                      features: [
                        'Escolha uma das funcionalidade:',
                        'Thay fit',
                        'Pilates',
                        'Funcional'
                      ]
                    },
                    // nota: não existe 'black' por padrão; se não reconhecido usamos 'basico'
                  };

                  const selected = planCatalog[planKey] || planCatalog['basico'];

                  return (
                    <>
                      <h3>{selected.title}</h3>
                      <ul className="perfil-plano-lista">
                        {selected.features.map((f, idx) => (
                          <li key={idx}>
                            {f !== 'Todas as modalidades:' && f !== 'Escolha uma das funcionalidade:' && <CheckCircleIcon />} {f}
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()
              }
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

        <div className="perfil-container-dados">
        <div className="perfil-dados-box">
          <p><strong>Nome:</strong> {userData.nome}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Número:</strong> {userData.telefone}</p>
          <p><strong>Senha:</strong> ********</p>
        </div>

        <button className="perfil-logout-btn" onClick={() => performLogout(navigate)}>Desconectar</button>
      </div>

      <Footer />
    </div>
  );
};

export default Perfil;