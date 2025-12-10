import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import './Perfil.css'; // Importa o CSS corrigido
import performLogout from "../../components/LogoutButton/LogoutButton";
import { getMeuPerfil, API_URL } from "../../services/usuarioService";
import { getMeusTreinos, getDesempenhoSemanal } from "../../services/treinoService";
import { fixImageUrl } from "../../utils/image";
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
    nivelAtividade: "",
    treinosFeitos: 0,
    ultimoTreino: "",
    desempenhoSemanal: []
  });

  const [profileImage, setProfileImage] = useState(perfilPhoto);

  // Helper robusto: procura recursivamente qualquer campo que pareça data (ISO, DD/MM/YYYY, timestamp)
  const formatDateForLast = (obj) => {
    if (!obj) return '';

    const tryFormat = (val) => {
      if (val === null || val === undefined) return null;
      // numbers: timestamp (seconds or millis)
      if (typeof val === 'number') {
        // seconds -> ms
        const maybe = val > 1e12 ? new Date(val) : new Date(val * 1000);
        if (!isNaN(maybe.getTime())) return maybe.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
      // strings
      if (typeof val === 'string') {
        const s = val.trim();
        if (!s) return null;
        // Already BR format
        const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (br) return s;
        // ISO-like
        const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (iso) {
          const d = new Date(s);
          if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        // contains T
        if (s.includes('T')) {
          const d = new Date(s);
          if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        // numeric string timestamp
        const num = Number(s);
        if (!isNaN(num) && num > 0) {
          const maybe = num > 1e12 ? new Date(num) : new Date(num * 1000);
          if (!isNaN(maybe.getTime())) return maybe.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      }
      return null;
    };

    const seen = new Set();
    const stack = [obj];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || seen.has(cur)) continue;
      seen.add(cur);
      if (typeof cur === 'object' && !Array.isArray(cur)) {
        for (const k of Object.keys(cur)) {
          try {
            const v = cur[k];
            const parsed = tryFormat(v);
            if (parsed) return parsed;
            if (typeof v === 'object' && v !== null) stack.push(v);
          } catch (e) {
            // ignore property access errors
          }
        }
      } else if (Array.isArray(cur)) {
        for (const it of cur) {
          const parsed = tryFormat(it);
          if (parsed) return parsed;
          if (typeof it === 'object' && it !== null) stack.push(it);
        }
      } else {
        const parsed = tryFormat(cur);
        if (parsed) return parsed;
      }
    }

    return '';
  };

  // Compute summary (count, last, mapped) from API retorno de desempenho
  const computeDesempenhoFromApi = (desempenho) => {
    const arr = Array.isArray(desempenho) ? desempenho : (desempenho?.data || desempenho?.content || desempenho?.items || []);
    let mapped = [];
    let count = 0;
    let last = '';
    if (Array.isArray(arr) && arr.length > 0 && arr[0].hasOwnProperty('dia')) {
      const dias = arr.map(d => ({ dia: (d.dia || d.day || '').toString().toUpperCase(), realizado: !!d.realizado }));
      count = dias.filter(d => d.realizado).length;
      const weekdayMap = { 'DOMINGO':0,'SEGUNDA':1,'TERCA':2,'TERÇA':2,'QUARTA':3,'QUINTA':4,'SEXTA':5,'SABADO':6,'SÁBADO':6 };
      const weekdayOrder = ['SABADO','SEXTA','QUINTA','QUARTA','TERCA','SEGUNDA','DOMINGO'];
      let found = null;
      for (const wd of weekdayOrder) {
        const item = dias.find(d => d.dia === wd && d.realizado);
        if (item) { found = item; break; }
      }
      if (found) {
        const now = new Date();
        const monday = new Date(now);
        const dayIndex = (now.getDay() + 6) % 7;
        monday.setDate(now.getDate() - dayIndex);
        const targetIndex = weekdayMap[found.dia];
        if (typeof targetIndex === 'number') {
          const targetDate = new Date(monday);
          const offset = targetIndex === 0 ? 6 : (targetIndex - 1);
          targetDate.setDate(monday.getDate() + offset);
          last = targetDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      }
      mapped = arr;
    } else {
      mapped = (Array.isArray(arr) ? arr : []).map((it, idx) => {
        const nome = it.nome || it.titulo || it.title || it.name || `Treino ${idx + 1}`;
        const dateFormatted = formatDateFromItem(it) || formatDateFromItem(it?.raw) || '';
        return { id: it.id || it._id || idx, nome, dateFormatted };
      });
      count = Array.isArray(mapped) ? mapped.length : 0;
      try {
        const withDates = mapped.filter(m => m.dateFormatted);
        if (withDates.length > 0) {
          const sorted = withDates.sort((a,b)=>{
            const pa = a.dateFormatted.split('/').reverse().join('-');
            const pb = b.dateFormatted.split('/').reverse().join('-');
            return new Date(pa) - new Date(pb);
          });
          const lastItem = sorted[sorted.length - 1];
          last = lastItem?.dateFormatted || lastItem?.nome || '';
        } else if (mapped.length > 0) {
          last = mapped[0].nome || '';
        }
      } catch (e) { last = '' }
    }
    return { count, last, mapped };
  };

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
      // Try to fetch full profile (image) in background
      (async () => {
        try {
          const perfilCompleto = await getMeuPerfil();
          if (!perfilCompleto) return;
          const possibleImage =
            perfilCompleto.fotoPerfil ||
            perfilCompleto.foto ||
            perfilCompleto.imagem ||
            perfilCompleto.img ||
            perfilCompleto.imageUrl ||
            perfilCompleto.avatar ||
            perfilCompleto.profilePicture ||
            perfilCompleto.photo ||
            perfilCompleto.urlFoto ||
            perfilCompleto.usuario?.foto ||
            perfilCompleto.user?.foto ||
            perfilCompleto.user?.avatar ||
            null;

          if (possibleImage) {
            const baseServer = API_URL.replace(/\/api$/, '');
            const isAbsolute = /^https?:\/\//i.test(possibleImage);
            const fotoUrl = isAbsolute
              ? possibleImage
              : (possibleImage.startsWith('/') ? `${baseServer}${possibleImage}` : `${baseServer}/${possibleImage}`);
            setProfileImage(fixImageUrl(fotoUrl));
          }
          // Também tenta buscar treinos atribuídos ao aluno
          try {
            const meus = await getMeusTreinos();
            if (meus) {
              // Normaliza para array
              const arr = Array.isArray(meus) ? meus : (meus.data || meus.content || []);
              if (arr && arr.length > 0) {
                // adiciona campo treinos no estado para renderização simples
                setUserData(prev => ({ ...prev, treinosAtribuidos: arr }));
              }
            }
            // Também tenta buscar desempenho semanal (quantidade de treinos e último treino)
            try {
              const desempenho = await getDesempenhoSemanal();
              if (desempenho) {
                const summary = computeDesempenhoFromApi(desempenho);
                setUserData(prev => ({ ...prev, treinosFeitos: summary.count, ultimoTreino: summary.last }));
              }
            } catch (e) {
              console.warn('Não foi possível carregar desempenho semanal:', e);
            }
          } catch (e) {
            console.warn('Não foi possível carregar meus treinos:', e);
          }
        } catch (e) {
          console.warn('Erro ao buscar imagem do perfil:', e);
        }
      })();
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

      // Tenta buscar a imagem completa do perfil via API (se possível)
      (async () => {
        try {
          const perfilCompleto = await getMeuPerfil();
          if (!perfilCompleto) return;
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
            const baseServer = API_URL.replace(/\/api$/, '');
            const isAbsolute = /^https?:\/\//i.test(possibleImage);
            const fotoUrl = isAbsolute
              ? possibleImage
              : (possibleImage.startsWith('/') ? `${baseServer}${possibleImage}` : `${baseServer}/${possibleImage}`);
            setProfileImage(fixImageUrl(fotoUrl));
          }
          // Também tenta buscar treinos atribuídos ao aluno
          try {
            const meus = await getMeusTreinos();
            if (meus) {
              const arr = Array.isArray(meus) ? meus : (meus.data || meus.content || []);
              if (arr && arr.length > 0) {
                setUserData(prev => ({ ...prev, treinosAtribuidos: arr }));
              }
            }
            // Busca também desempenho semanal para preencher o card "Meu Desempenho"
            try {
              const desempenho = await getDesempenhoSemanal();
              if (desempenho) {
                const summary = computeDesempenhoFromApi(desempenho);
                setUserData(prev => ({ ...prev, treinosFeitos: summary.count, ultimoTreino: summary.last }));
              }
            } catch (e) {
              console.warn('Não foi possível carregar desempenho semanal:', e);
            }
            
          } catch (e) {
            console.warn('Não foi possível carregar meus treinos:', e);
          }
        } catch (e) {
          console.warn('Erro ao buscar imagem do perfil:', e);
        }
      })();

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

  // Helper: tenta extrair uma data de vários possíveis campos e retorna string formatada DD/MM/YYYY
  const formatDateFromItem = (item) => {
    if (!item) return '';
    const candidates = [
      item.data,
      item.date,
      item.dataRealizacao,
      item.data_realizacao,
      item.realizadoEm,
      item.realizado_em,
      item.createdAt,
      item.created_at,
      item.dataUltimoTreino,
      item.ultimoTreino,
      item.ultimo_treino,
      item.timestamp,
      item.time
    ];

    for (let c of candidates) {
      if (!c) continue;
      // já pode vir formatado em DD/MM/YYYY
      const s = String(c);
      const brMatch = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      if (brMatch) return s;
      const maybeISO = s.split('T')[0];
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
      // try parsing YYYY-MM-DD
      const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        try {
          const dd = new Date(s);
          if (!isNaN(dd.getTime())) return dd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {}
      }
    }
    return '';
  };

  // Sempre tentar buscar desempenho semanal (lista + datas) ao montar o componente
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const desempenho = await getDesempenhoSemanal();
        if (!desempenho) return;

        const arr = Array.isArray(desempenho)
          ? desempenho
          : (desempenho.data || desempenho.content || desempenho.items || []);
        // Special handling: some APIs return an array of weekdays with 'dia' and 'realizado'
        let mapped = [];
        let count = 0;
        let last = '';
        if (Array.isArray(arr) && arr.length > 0 && arr[0].hasOwnProperty('dia')) {
          // count realizados
          const dias = arr.map(d => ({ dia: (d.dia || d.day || '').toString().toUpperCase(), realizado: !!d.realizado }));
          count = dias.filter(d => d.realizado).length;
          // find the most recent realizado in the week (prefer later in week)
          const order = ['DOMINGO','SEGUNDA','TERCA','TERCA','TERÇA','QUARTA','QUINTA','SEXTA','SABADO','SÁBADO','SABADO'];
          // normalize mapping to weekday index: Sunday=0, Monday=1... Saturday=6
          const weekdayMap = { 'DOMINGO':0,'SEGUNDA':1,'TERCA':2,'TERÇA':2,'QUARTA':3,'QUINTA':4,'SEXTA':5,'SABADO':6,'SÁBADO':6 };

          // find last realizado by scanning days in reverse order (Saturday -> Sunday)
          const weekdayOrder = ['SABADO','SEXTA','QUINTA','QUARTA','TERCA','SEGUNDA','DOMINGO'];
          let found = null;
          for (const wd of weekdayOrder) {
            const item = dias.find(d => d.dia === wd && d.realizado);
            if (item) { found = item; break; }
          }

          if (found) {
            // compute date for this weekday in current week
            const now = new Date();
            // get Monday of current week
            const monday = new Date(now);
            const dayIndex = (now.getDay() + 6) % 7; // 0..6 where 0=Monday
            monday.setDate(now.getDate() - dayIndex);
            const targetIndex = weekdayMap[found.dia];
            if (typeof targetIndex === 'number') {
              // convert monday-based to target date
              const targetDate = new Date(monday);
              // monday is index 0 in this scheme, but our weekdayMap uses Sunday=0, Monday=1
              // compute offset from monday: if targetIndex==0 (Sunday) offset = 6
              const offset = targetIndex === 0 ? 6 : (targetIndex - 1);
              targetDate.setDate(monday.getDate() + offset);
              last = targetDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
          }
          // keep desempenhoSemanal as original array for potential use
          mapped = arr;
        } else {
          mapped = (Array.isArray(arr) ? arr : []).map((it, idx) => {
            const nome = it.nome || it.titulo || it.title || it.name || `Treino ${idx + 1}`;
            const dateFormatted = formatDateFromItem(it) || formatDateFromItem(it?.raw) || '';
            return { id: it.id || it._id || idx, nome, dateFormatted };
          });
          count = Array.isArray(mapped) ? mapped.length : 0;
          try {
            const withDates = mapped.filter(m => m.dateFormatted);
            if (withDates.length > 0) {
              const sorted = withDates.sort((a,b)=>{
                const pa = a.dateFormatted.split('/').reverse().join('-');
                const pb = b.dateFormatted.split('/').reverse().join('-');
                return new Date(pa) - new Date(pb);
              });
              const lastItem = sorted[sorted.length - 1];
              last = lastItem?.dateFormatted || lastItem?.nome || '';
            } else if (mapped.length > 0) {
              last = mapped[0].nome || '';
            }
          } catch (e) { last = '' }
        }

        if (mounted) setUserData(prev => ({ ...prev, treinosFeitos: count, ultimoTreino: last, desempenhoSemanal: mapped }));
      } catch (e) {
        console.warn('Erro ao buscar desempenho semanal (useEffect dedicado):', e);
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <div>
      <HeaderUser />

      <main className="perfil-container">
        <section className="perfil-section">
          <div className="perfil-header">
            <img src={profileImage} alt="Foto do Perfil" className="perfil-icon" onError={() => setProfileImage(perfilPhoto)} />
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

            {/* Card para mostrar treinos atribuídos ao aluno */}
            {Array.isArray(userData.treinosAtribuidos) && userData.treinosAtribuidos.length > 0 && (
              <div className="perfil-card-info perfil-treinos-card">
                <div className="perfil-card-header">
                  <span className="perfil-icon-treino">🏋️</span>
                  <h4>Meus Treinos</h4>
                </div>
                <div className="perfil-treinos-list">
                  {userData.treinosAtribuidos.map((t, i) => (
                    <div key={t.id || i} className="perfil-treino-item">
                      <strong>{t.nome || t.titulo || t.title || 'Treino'}</strong>
                      <div className="perfil-treino-meta">{t.frequenciaSemanal ? `${t.frequenciaSemanal}x por semana` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* desempenhoSemanal data kept in state but not rendered here (kept for functionality) */}

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

      {/* debug temporário removido */}

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