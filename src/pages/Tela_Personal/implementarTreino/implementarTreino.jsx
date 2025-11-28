import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import MenuPersonal from '../../../components/MenuPersonal/MenuPersonal';
import baixo from '../../../assets/icones/down-arrow.svg';
import cima from '../../../assets/icones/up-arrow.svg';
import { createTreino, updateTreino, getTreinoById } from '../../../services/treinoService';
import { getUsuarioById } from '../../../services/usuarioService';
import { fixImageUrl } from '../../../utils/image';


// --- Icon Components (SVG) ---
const PlusIcon = (props) => (
  <svg {...props} width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);
const EditIcon = (props) => (
  <svg {...props} width="16" height="16" className="adicionartreino-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TrashIcon = (props) => (
  <svg {...props} width="16" height="16" className="adicionartreino-trash-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const InfoIcon = (props) => (
  <svg {...props} width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const ReorderArrows = ({ onUp, onDown, disabledUp, disabledDown, extraIcon, extraOnClick, upIconSrc, downIconSrc }) => (
  <div className="adicionartreino-reorder-arrows" title="Reordenar">
    <button
      className="adicionartreino-arrow-btn"
      onClick={onUp}
      disabled={disabledUp}
      aria-label="Mover para cima"
      title="Mover para cima"
    >
      {upIconSrc ? (
        <img className="adicionartreino-arrow-img" src={upIconSrc} alt="src/assets/icones/seta cima.png" />
      ) : (
        <svg className="adicionartreino-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5l-6 6h12l-6-6z" fill="currentColor" />
        </svg>
      )}
    </button>

    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div className="adicionartreino-handle" aria-hidden>
        <span className="adicionartreino-handle-line"></span>
        <span className="adicionartreino-handle-line"></span>
      </div>
      {extraIcon ? (
        <button className="adicionartreino-extra-icon" onClick={extraOnClick} aria-label="Extra">
          {extraIcon}
        </button>
      ) : null}
    </div>

    <button
      className="adicionartreino-arrow-btn"
      onClick={onDown}
      disabled={disabledDown}
      aria-label="Mover para baixo"
      title="Mover para baixo"
    >
      {downIconSrc ? (
        <img className="adicionartreino-arrow-img" src={downIconSrc} alt="src/assets/icones/seta baixo.png" />
      ) : (
        <svg className="adicionartreino-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19l6-6H6l6 6z" fill="currentColor" />
        </svg>
      )}
    </button>
  </div>
);

// Reusable arrow icon component (direction: 'up' | 'down' | 'left' | 'right')
export const ArrowIcon = ({ direction = 'up', size = 18, color = '#ef4444' }) => {
  const paths = {
    up: 'M12 5l-6 6h12l-6-6z',
    down: 'M12 19l6-6H6l6 6z',
    left: 'M5 12l6-6v12l-6-6z',
    right: 'M19 12l-6 6V6l6 6z',
  };
  const d = paths[direction] || paths.up;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill={color} />
    </svg>
  );
};

// --- Main Component ---
export default function implementarTreino() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const treinoId = searchParams.get('id');
  const isEditMode = !!treinoId;
  
  const [activeTab, setActiveTab] = useState("Segunda");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exerciseImages, setExerciseImages] = useState({});
  const fileInputRefs = useRef({});
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    responsavel: '',
    tipoTreino: 'Musculação',
    nivel: 'Iniciante',
    sexo: 'Masculino',
    idadeMin: 15,
    idadeMax: 30
  });

  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  // Function to find image URL in various fields
  const handleTabClick = (dia) => {
    setActiveTab(dia);
  };

  // initial list with stable ids (used as template when adicionar)
  const initial = [
    { nome: "Supino Reto - Barra", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Supino halter - Banco inclinado", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Crucifixo - cross over", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Flexão de braço inclinado", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Trícips pulley", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
  ];

  // unique id generator
  const nextId = useRef(1);
    // Function to find image URL in various fields

  // exercises per day (object keyed by day name)
  // Criando um treino novo: começar sem exercícios visíveis
  // Ao editar/duplicar: o useEffect preencherá a lista a partir da API/state
  const [exerciciosPorDia, setExerciciosPorDia] = useState(() => {
    const map = {};
    dias.forEach((d) => {
      map[d] = [];
    });
    return map;
  });

  // helper to get current day's list
  const currentList = exerciciosPorDia[activeTab] || [];

  // refs to DOM nodes for FLIP animation
  const itemRefs = useRef(new Map());
  const listRef = useRef(null);
  const draggingId = useRef(null);
  const animating = useRef(false);

  // add a new exercise to the active day by duplicating the last one (or a template)
  const addExercise = () => {
    setExerciciosPorDia((prev) => {
      const dayList = prev[activeTab] || [];
      const template = dayList.length ? dayList[dayList.length - 1] : initial[0];
      const copy = { ...template, id: nextId.current++ };
      return { ...prev, [activeTab]: [...dayList, copy] };
    });
  };

  // delete an exercise by id for the active day
  const deleteExercise = (id) => {
    setExerciciosPorDia((prev) => {
      const dayList = prev[activeTab] || [];
      return { ...prev, [activeTab]: dayList.filter((x) => x.id !== id) };
    });
  };

  // Função para atualizar um campo de um exercício específico
  const updateExerciseField = (exerciseId, field, value) => {
    setExerciciosPorDia((prev) => {
      const dayList = prev[activeTab] || [];
      const updatedList = dayList.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, [field]: value };
        }
        return ex;
      });
      return { ...prev, [activeTab]: updatedList };
    });
  };

  // helper to toggle a dragging class for visual feedback
  const elAndAddDraggingClass = (id, add) => {
    const el = itemRefs.current.get(id);
    if (el) {
      if (add) el.classList.add('dragging');
      else el.classList.remove('dragging');
    }
  };

  // Função para converter nível para o formato da API
  const converterNivelParaAPI = (nivel) => {
    const mapa = {
      'Iniciante': 'INICIANTE',
      'Intermediário': 'INTERMEDIARIO',
      'Avançado': 'AVANCADO'
    };
    return mapa[nivel] || nivel.toUpperCase();
  };

  // Função para converter nível da API para o formato da UI
  const converterNivelDaAPI = (nivel) => {
    const mapa = {
      'INICIANTE': 'Iniciante',
      'INTERMEDIARIO': 'Intermediário',
      'AVANCADO': 'Avançado'
    };
    return mapa[nivel] || nivel;
  };

  // Função para converter sexo para o formato da API
  const converterSexoParaAPI = (sexo) => {
    const mapa = {
      'Masculino': 'MASCULINO',
      'Feminino': 'FEMININO'
    };
    return mapa[sexo] || sexo.toUpperCase();
  };

  // Função para converter sexo da API para o formato da UI
  const converterSexoDaAPI = (sexo) => {
    const mapa = {
      'MASCULINO': 'Masculino',
      'FEMININO': 'Feminino'
    };
    return mapa[sexo] || sexo;
  };

  // Funções para manipulação de imagem
  const handleImagemClick = (exerciseId) => {
    fileInputRefs.current[exerciseId]?.click();
  };

  const handleImagemChange = (exerciseId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem não pode ter mais de 5MB');
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setExerciseImages((prev) => ({
          ...prev,
          [exerciseId]: {
            file: file,
            preview: event.target?.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverImagem = (exerciseId, e) => {
    e.stopPropagation();
    setExerciseImages((prev) => {
      const updated = { ...prev };
      delete updated[exerciseId];
      return updated;
    });
    if (fileInputRefs.current[exerciseId]) {
      fileInputRefs.current[exerciseId].value = '';
    }
  };

  // FLIP animation: record positions, change order, then animate
  const moveItem = (fromIndex, toIndex) => {
    if (animating.current) return;
    const list = exerciciosPorDia[activeTab] || [];
    if (toIndex < 0 || toIndex >= list.length) return;

    const beforeRects = new Map();
    list.forEach((it) => {
      const el = itemRefs.current.get(it.id);
      if (el) beforeRects.set(it.id, el.getBoundingClientRect());
    });

    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setExerciciosPorDia((prev) => ({ ...prev, [activeTab]: next }));

    // wait for DOM update
    requestAnimationFrame(() => {
      const afterRects = new Map();
      next.forEach((it) => {
        const el = itemRefs.current.get(it.id);
        if (el) afterRects.set(it.id, el.getBoundingClientRect());
      });

      // apply transforms to invert, then animate to zero
      next.forEach((it) => {
        const el = itemRefs.current.get(it.id);
        if (!el) return;
        const before = beforeRects.get(it.id);
        const after = afterRects.get(it.id);
        if (!before || !after) return;

        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (dx === 0 && dy === 0) return;

        el.style.transition = 'none';
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        // force reflow
        el.getBoundingClientRect();
        el.style.transition = 'transform 250ms ease';
        el.style.transform = '';
      });

      animating.current = true;
      // clear after animation
      setTimeout(() => {
        next.forEach((it) => {
          const el = itemRefs.current.get(it.id);
          if (el) {
            el.style.transition = '';
            el.style.transform = '';
          }
        });
        animating.current = false;
      }, 300);
    });
  };

  // Carregar dados do treino se estiver em modo de edição
  useEffect(() => {
    const loadTreinoData = async () => {
      if (isEditMode && treinoId) {
        try {
          setLoading(true);
          const treinoData = await getTreinoById(treinoId);
          console.debug('treinoData recebido (GET):', treinoData);
          
          // Preencher formulário com dados do treino
          if (treinoData) {
            // Tentativa de resolver nome do responsável mesmo quando API retorna apenas ID
            let responsavelNome = typeof treinoData.responsavel === 'string'
              ? treinoData.responsavel
              : (treinoData.responsavel?.nome || treinoData.responsavelNome || '');

            // Se não temos nome, mas há um ID, buscar o usuário
            const possibleId = treinoData.responsavelId || (typeof treinoData.responsavel === 'number' ? treinoData.responsavel : (typeof treinoData.responsavel === 'string' && /^\d+$/.test(treinoData.responsavel) ? treinoData.responsavel : null));
            if (!responsavelNome && possibleId) {
              try {
                const usuario = await getUsuarioById(possibleId);
                responsavelNome = usuario?.nome || usuario?.nomeCompleto || usuario?.titulo || responsavelNome;
              } catch (e) {
                console.warn('Não foi possível buscar usuário do responsável:', e);
              }
            }

            setFormData({
                nome: treinoData.nome || '',
                responsavel: responsavelNome,
                tipoTreino: treinoData.tipoDeTreino || treinoData.tipoTreino || treinoData.tipo || 'Musculação',
                nivel: converterNivelDaAPI(treinoData.nivel) || 'Iniciante',
                sexo: converterSexoDaAPI(treinoData.sexo) || 'Masculino',
                idadeMin: treinoData.idadeMinima || treinoData.idadeMin || 15,
                idadeMax: treinoData.idadeMaxima || treinoData.idadeMax || 30
              });
            
            // Carregar exercícios por dia se existirem
              // Prioriza exerciciosPorDia (mapa por dias) — corresponde ao formato que a API espera/retorna
              const exerciciosMap = {};
              const mapDisplayDay = {};
              // cria mapa de normalização: 'SEGUNDA' -> 'Segunda'
              dias.forEach(d => {
                const key = String(d).normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();
                mapDisplayDay[key] = d;
              });

              if (treinoData.exerciciosPorDia && typeof treinoData.exerciciosPorDia === 'object') {
                Object.keys(treinoData.exerciciosPorDia).forEach(rawDayKey => {
                  const norm = String(rawDayKey).normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();
                  const displayDay = mapDisplayDay[norm];
                  if (!displayDay) return;
                  const raw = treinoData.exerciciosPorDia[rawDayKey];
                  const arr = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? Object.values(raw) : []);
                  if (!arr || arr.length === 0) {
                    exerciciosMap[displayDay] = [];
                    return;
                  }
                  exerciciosMap[displayDay] = arr.map(ex => ({
                    id: nextId.current++,
                    nome: ex.nome || ex.exercicio || '',
                    series: (ex.series !== undefined && ex.series !== null) ? ex.series : 3,
                    repeticoes: (ex.repeticoes !== undefined && ex.repeticoes !== null) ? ex.repeticoes : 10,
                    carga: ex.carga || ex.peso || '',
                    intervalo: ex.intervalo || ex.tempo || '',
                    obs: ex.observacao || ex.obs || '',
                    img: ex.img || ex.imagem || ex.imagemUrl || ex.foto || ex.fotoUrl || ex.image || ex.imageUrl || null
                  }));
                });
              }

              // Fallback compatível com formatos antigos (exercicios array / sessoes)
              if (Object.keys(exerciciosMap).length === 0 && (treinoData.exercicios || treinoData.sessoes)) {
                const normalizeForIndex = (container, idx) => {
                  if (!container) return [];
                  if (Array.isArray(container)) {
                    const val = container[idx];
                    if (Array.isArray(val)) return val;
                    if (val && typeof val === 'object') return Object.values(val).every(v => typeof v === 'object') && !Array.isArray(val) ? Object.values(val) : [val];
                    return val ? [val] : [];
                  }
                  if (typeof container === 'object') {
                    if (Object.prototype.hasOwnProperty.call(container, idx)) {
                      const v = container[idx];
                      if (Array.isArray(v)) return v;
                      if (v && typeof v === 'object') return Object.values(v).every(x => typeof x === 'object') && !Array.isArray(v) ? Object.values(v) : [v];
                      return v ? [v] : [];
                    }
                    return [];
                  }
                  return [];
                };
                dias.forEach((dia, index) => {
                  try {
                    if (treinoData.exercicios) {
                      const arr = normalizeForIndex(treinoData.exercicios, index);
                      if (arr && arr.length) {
                        exerciciosMap[dia] = arr.map((ex) => ({ id: nextId.current++, ...ex }));
                        return;
                      }
                    }
                    if (treinoData.sessoes && treinoData.sessoes[index]) {
                      const sess = treinoData.sessoes[index];
                      const sessEx = sess.exercicios || sess.exercicio || [];
                      const normalizedSessEx = Array.isArray(sessEx) ? sessEx : (typeof sessEx === 'object' ? Object.values(sessEx) : []);
                      if (normalizedSessEx && normalizedSessEx.length) {
                        exerciciosMap[dia] = normalizedSessEx.map((ex) => ({
                          nome: ex.nome || ex.exercicio || '',
                          series: ex.series || 3,
                          repeticoes: ex.repeticoes || 10,
                          carga: ex.carga || '',
                          intervalo: ex.intervalo || '',
                          obs: ex.obs || ex.observacao || '',
                          id: nextId.current++
                        }));
                      }
                    }
                  } catch (e) {
                    console.warn('Erro ao normalizar exercícios para dia', dia, e);
                  }
                });
              }

              if (Object.keys(exerciciosMap).length > 0) {
                setExerciciosPorDia(prev => ({ ...prev, ...exerciciosMap }));
                // montar previews de imagens (se houver URLs)
                const tempImageMap = {};
                Object.keys(exerciciosMap).forEach((dia) => {
                  exerciciosMap[dia].forEach((ex) => {
                    if (!ex || !ex.id) return;
                    const id = ex.id;
                    const url = ex.img || ex.imagem || ex.imagemUrl || ex.foto || ex.fotoUrl || ex.image || ex.imageUrl;
                    if (url) tempImageMap[id] = { preview: fixImageUrl(url), file: null };
                  });
                });
                if (Object.keys(tempImageMap).length > 0) {
                  setExerciseImages(prev => ({ ...prev, ...tempImageMap }));
                }
              }
             }
          } catch (error) {
            console.error('Erro ao carregar treino:', error);
            alert('Erro ao carregar dados do treino. ' + (error.message || ''));
          } finally {
            setLoading(false);
          }
      } else if (location.state?.treinoData) {
        // Se vier dados de duplicação
        const treinoData = location.state.treinoData;
        console.debug('treinoData recebido via state (duplicação):', treinoData);

        // Normalizar o responsável (pode ser string, objeto ou id)
        let responsavelNome = typeof treinoData.responsavel === 'string'
          ? treinoData.responsavel
          : (treinoData.responsavel?.nome || treinoData.responsavelNome || '');

        // Se não houver nome e houver um ID, buscar via API
        const possibleIdDup = treinoData.responsavelId || (typeof treinoData.responsavel === 'number' ? treinoData.responsavel : (typeof treinoData.responsavel === 'string' && /^\d+$/.test(treinoData.responsavel) ? treinoData.responsavel : null));
        if (!responsavelNome && possibleIdDup) {
          try {
            const usuario = await getUsuarioById(possibleIdDup);
            responsavelNome = usuario?.nome || usuario?.nomeCompleto || responsavelNome;
          } catch (e) {
            console.warn('Falha ao buscar usuário responsável para duplicação:', e);
          }
        }

        setFormData({
          nome: treinoData.nome || '',
          responsavel: responsavelNome,
          tipoTreino: treinoData.tipoDeTreino || treinoData.tipoTreino || treinoData.tipo || 'Musculação',
          nivel: converterNivelDaAPI(treinoData.nivel) || 'Iniciante',
          sexo: converterSexoDaAPI(treinoData.sexo) || 'Masculino',
          idadeMin: treinoData.idadeMinima || treinoData.idadeMin || 15,
          idadeMax: treinoData.idadeMaxima || treinoData.idadeMax || 30
        });

        // Se vier exercícios no state (cópia), normalizar e popular o estado
        if (treinoData.exercicios || treinoData.sessoes) {
          const exerciciosMap = {};

          const normalizeForIndex = (container, idx) => {
            if (!container) return [];
            if (Array.isArray(container)) {
              const val = container[idx];
              if (Array.isArray(val)) return val;
              if (val && typeof val === 'object') return Object.values(val).every((v) => typeof v === 'object') && !Array.isArray(val) ? Object.values(val) : [val];
              return val ? [val] : [];
            }
            if (typeof container === 'object') {
              if (Object.prototype.hasOwnProperty.call(container, idx)) {
                const v = container[idx];
                if (Array.isArray(v)) return v;
                if (v && typeof v === 'object') return Object.values(v).every((x) => typeof x === 'object') && !Array.isArray(v) ? Object.values(v) : [v];
                return v ? [v] : [];
              }
              return [];
            }
            return [];
          };

          dias.forEach((dia, index) => {
            try {
              if (treinoData.exercicios) {
                const arr = normalizeForIndex(treinoData.exercicios, index);
                if (arr && arr.length) {
                  exerciciosMap[dia] = arr.map((ex) => ({ id: nextId.current++, ...ex }));
                  return;
                }
              }

              if (treinoData.sessoes && treinoData.sessoes[index]) {
                const sess = treinoData.sessoes[index];
                const sessEx = sess.exercicios || sess.exercicio || [];
                const normalizedSessEx = Array.isArray(sessEx) ? sessEx : (typeof sessEx === 'object' ? Object.values(sessEx) : []);
                if (normalizedSessEx && normalizedSessEx.length) {
                  exerciciosMap[dia] = normalizedSessEx.map((ex) => ({
                    nome: ex.nome || ex.exercicio || '',
                    series: ex.series || 3,
                    repeticoes: ex.repeticoes || 10,
                    carga: ex.carga || '',
                    intervalo: ex.intervalo || '',
                    obs: ex.obs || ex.observacao || '',
                    id: nextId.current++
                  }));
                }
              }
            } catch (e) {
              console.warn('Erro ao normalizar exercícios para dia (cópia)', dia, e);
            }
          });

          if (Object.keys(exerciciosMap).length > 0) {
            setExerciciosPorDia(prev => ({ ...prev, ...exerciciosMap }));

            const tempImageMap = {};
            Object.keys(exerciciosMap).forEach((dia) => {
              exerciciosMap[dia].forEach((ex) => {
                const id = ex.id;
                // *** CORREÇÃO: "img" ***
                // Coloca ex.img como prioridade para encontrar a URL
                const url = ex.img || ex.imagem || ex.imagemUrl || ex.foto || ex.fotoUrl || ex.image || ex.imageUrl;
                if (url) tempImageMap[id] = { preview: fixImageUrl(url), file: null };
              });
            });
            if (Object.keys(tempImageMap).length > 0) setExerciseImages(prev => ({ ...prev, ...tempImageMap }));
          }
        }
      }
    };
    
    loadTreinoData();
  }, [treinoId, isEditMode]);

  // Normaliza o campo de intervalo para HH:mm:ss (reutilizável)
  const normalizarIntervalo = (valor) => {
    if (!valor) return null;
    const v = String(valor).trim();
    if (/^\d+$/.test(v)) {
      const totalSeg = parseInt(v, 10);
      const horas = Math.floor(totalSeg / 3600);
      const minutos = Math.floor((totalSeg % 3600) / 60);
      const segundos = totalSeg % 60;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
    }
    if (/^\d{1,2}:\d{2}$/.test(v)) {
      return `00:${v}`;
    }
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(v)) {
      return v;
    }
    if (/^(\d+)m(in)?$/i.test(v)) {
      const minutos = parseInt(v, 10);
      const pad = (n) => String(n).padStart(2, '0');
      return `00:${pad(minutos)}:00`;
    }
    if (/^(\d+)s(ec)?$/i.test(v)) {
      const segundos = parseInt(v, 10);
      const pad = (n) => String(n).padStart(2, '0');
      return `00:00:${pad(segundos)}`;
    }
    return null;
  };

  // Coleta dados dos exercícios como ARRAY (mantido para compatibilidade interna)
  const coletarDadosExercicios = () => {
    const lista = [];
    dias.forEach((dia) => {
      const exerciciosDia = exerciciosPorDia[dia] || [];
      exerciciosDia.forEach((ex) => {
        const imagemInfo = exerciseImages[ex.id];
        const exercicioData = {
          nome: ex.nome || '',
          series: ex.series !== undefined && ex.series !== null && ex.series !== '' ? parseInt(ex.series, 10) : 3,
          repeticoes: ex.repeticoes !== undefined && ex.repeticoes !== null && ex.repeticoes !== '' ? parseInt(ex.repeticoes, 10) : 10,
          carga: ex.carga || '',
          observacao: ex.obs || '',
          dia
        };
        if (imagemInfo && imagemInfo.file) {
          exercicioData.img = imagemInfo.file;
        }
        lista.push(exercicioData);
      });
    });
    return lista;
  };

  // Monta o objeto `exerciciosPorDia` esperado pela API (chaves por dia)
  const montarExerciciosPorDia = () => {
    const payload = {};
    dias.forEach((dia) => {
      const list = (exerciciosPorDia[dia] || []).map((ex) => {
        const imagemInfo = exerciseImages[ex.id];
        const obj = {
          nome: ex.nome || '',
          series: ex.series !== undefined && ex.series !== null && ex.series !== '' ? parseInt(ex.series, 10) : 3,
          repeticoes: ex.repeticoes !== undefined && ex.repeticoes !== null && ex.repeticoes !== '' ? parseInt(ex.repeticoes, 10) : 10,
          carga: ex.carga || '',
          observacao: ex.obs || ''
        };
        if (imagemInfo && imagemInfo.file) obj.img = imagemInfo.file;
        return obj;
      });
      // Incluir a chave do dia apenas se houver exercícios — evita enviar arrays vazios que
      // causam problemas de binding no backend.
      if (list && list.length > 0) payload[dia] = list;
    });
    return payload;
  };

  // Função para salvar treino
  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Validar campos obrigatórios
      if (!formData.nome.trim()) {
        alert('Por favor, preencha o nome do treino.');
        setSaving(false);
        return;
      }

      if (!formData.tipoTreino.trim()) {
        alert('Por favor, preencha o tipo de treino.');
        setSaving(false);
        return;
      }

      // Preparar dados para envio (usando os nomes de campos que a API espera)
      const idadeMinima = parseInt(formData.idadeMin, 10);
      const idadeMaxima = parseInt(formData.idadeMax, 10);
      
      if (isNaN(idadeMinima) || idadeMinima <= 0) {
        alert('Por favor, preencha uma idade mínima válida.');
        setSaving(false);
        return;
      }
      
      if (isNaN(idadeMaxima) || idadeMaxima <= 0) {
        alert('Por favor, preencha uma idade máxima válida.');
        setSaving(false);
        return;
      }

      // Montar payload `exerciciosPorDia` no formato esperado pela API
      const exerciciosPorDiaPayload = montarExerciciosPorDia();

      const dadosTreino = {
        nome: formData.nome.trim(),
        tipoDeTreino: formData.tipoTreino.trim(),
        nivel: converterNivelParaAPI(formData.nivel),
        sexo: converterSexoParaAPI(formData.sexo),
        idadeMinima: idadeMinima,
        idadeMaxima: idadeMaxima,
        // Envia a estrutura por dia (obrigatória para o backend)
        exerciciosPorDia: exerciciosPorDiaPayload,
        
        // Esta linha já estava correta
        responsavel: formData.responsavel.trim()
      };

      if (isEditMode) {
        await updateTreino(treinoId, dadosTreino);
        alert('Treino atualizado com sucesso!');
      } else {
        await createTreino(dadosTreino);
        alert('Treino criado com sucesso!');
      }
      
      navigate('/GerenciarTreino');
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert(error.message || 'Erro ao salvar treino. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Função para cancelar
  const handleCancelar = () => {
    if (window.confirm('Tem certeza que deseja cancelar? As alterações não salvas serão perdidas.')) {
      navigate('/GerenciarTreino');
    }
  };

  if (loading) {
    return (
      <div className="adicionartreino-page">
        <MenuPersonal />
        <main className="adicionartreino-main-content">
          <div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="adicionartreino-page">
      <MenuPersonal />
      <main className="adicionartreino-main-content">
        {/* CORREÇÃO: Wrapper adicionado para centralizar e limitar a largura */}
        <div className="adicionartreino-form-wrapper">
            <h1 className="adicionartreino-form-title">{isEditMode ? 'Editar Treino' : 'Adicionar Treinos'}</h1>

            {/* --- Formulário Principal --- */}
            <div className="adicionartreino-form-container">
              <div className="adicionartreino-form-row adicionartreino-form-row-2">
                <div className="adicionartreino-form-field">
                  <label htmlFor="nome">Nome *</label>
                  <input 
                    id="nome" 
                    type="text" 
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: 3x - Fem - Iniciante - Emagrecimento"
                  />
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="responsavel">Responsável</label>
                  <input 
                    id="responsavel" 
                    type="text" 
                    value={formData.responsavel}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
              <div className="adicionartreino-form-row adicionartreino-form-row-3">
                <div className="adicionartreino-form-field">
                  <label htmlFor="tipoTreino">Tipo de treino</label>
                  <input 
                    id="tipoTreino" 
                    type="text" 
                    value={formData.tipoTreino}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoTreino: e.target.value }))}
                    placeholder="Ex: Musculação"
                  />
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="nivel">Nível</label>
                  <select 
                    id="nivel" 
                    value={formData.nivel}
                    onChange={(e) => setFormData(prev => ({ ...prev, nivel: e.target.value }))}
                  >
                    <option>Iniciante</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                  </select>
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="sexo">Sexo</label>
                  <select 
                    id="sexo" 
                    value={formData.sexo}
                    onChange={(e) => setFormData(prev => ({ ...prev, sexo: e.target.value }))}
                  >
                    <option>Masculino</option>
                    <option>Feminino</option>
                  </select>
                </div>
              </div>
              <div className="adicionartreino-form-row adicionartreino-form-row-3">
                <div className="adicionartreino-form-field">
                  <label htmlFor="idadeMin">Idade mínima</label>
                  <input 
                    id="idadeMin" 
                    type="number" 
                    value={formData.idadeMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, idadeMin: e.target.value }))}
                    min="0"
                  />
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="idadeMax">Idade máxima</label>
                  <input 
                    id="idadeMax" 
                    type="number" 
                    value={formData.idadeMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, idadeMax: e.target.value }))}
                    min="0"
                  />
                </div>
                <div className="adicionartreino-form-field" style={{ visibility: 'hidden' }} />
              </div>
            </div>

            {/* --- Abas de Navegação --- */}
            <nav className="adicionartreino-tabs-nav">
              {dias.map((dia) => (
                <button
                  key={dia}
                  className={`adicionartreino-tab-button ${activeTab === dia ? "active" : ""}`}
                  onClick={() => handleTabClick(dia)}
                >
                  {dia}
                </button>
              ))}
            </nav>

            {/* --- Seção de Exercícios --- */}
            <div className="adicionartreino-exercicios-section">
              <button className="adicionartreino-add-exercise-btn" onClick={addExercise} type="button">
                <PlusIcon /> Exercício
              </button>

              {/* Cabeçalho visível apenas em telas maiores */}
              <div className="adicionartreino-exercise-header">
                <span></span> {/* Coluna para setas */}
                <span>Exercício *</span>
                <span>Séries *</span>
                <span>Repetições</span>
                <span>Carga(KG)</span>
                <span>Intervalo</span>
                <span>Observação</span>
                <span></span> {/* Coluna para ações */}
              </div>

              {/* Lista de Exercícios */}
              <div className="adicionartreino-exercicios-list" ref={listRef}>
                {currentList.map((item, index) => (
                  <div
                    key={item.id}
                    className={`adicionartreino-exercise-row`}
                    ref={(el) => {
                      if (el) itemRefs.current.set(item.id, el);
                      else itemRefs.current.delete(item.id);
                    }}
                    draggable
                    onDragStart={(e) => {
                      draggingId.current = item.id;
                      e.dataTransfer.effectAllowed = 'move';
                      // small data to satisfy HTML5 drag
                      e.dataTransfer.setData('text/plain', String(item.id));
                      elAndAddDraggingClass(item.id, true);
                    }}
                    onDragEnd={() => {
                      elAndAddDraggingClass(draggingId.current, false);
                      draggingId.current = null;
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      const overId = item.id;
                      const dragId = parseInt(e.dataTransfer.getData('text/plain') || draggingId.current, 10);
                      if (!isNaN(dragId) && dragId !== overId) {
                        // show potential drop location (do minimal work here)
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromId = parseInt(e.dataTransfer.getData('text/plain') || draggingId.current, 10);
                      const toId = item.id;
                      const fromIndex = currentList.findIndex((x) => x.id === fromId);
                      const toIndex = currentList.findIndex((x) => x.id === toId);
                      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                        moveItem(fromIndex, toIndex);
                      }
                    }}
                  >
                    <div className="adicionartreino-field-content adicionartreino-reorder-col">
                      <ReorderArrows
                        onUp={() => moveItem(index, index - 1)}
                        onDown={() => moveItem(index, index + 1)}
                        disabledUp={index === 0}
                        disabledDown={index === currentList.length - 1}
                        upIconSrc={cima}
                        downIconSrc={baixo}
                      />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-exercise-name-col">
                        <label className="adicionartreino-mobile-label">Exercício *</label>
                        <input 
                          type="text" 
                          value={item.nome || ''} 
                          onChange={(e) => updateExerciseField(item.id, 'nome', e.target.value)}
                        />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-series-col">
                        <label className="adicionartreino-mobile-label">Séries *</label>
                        <input 
                          type="number" 
                          value={item.series !== undefined && item.series !== null ? item.series : ''} 
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : (parseInt(e.target.value, 10) || 0);
                            updateExerciseField(item.id, 'series', val);
                          }}
                        />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-repeticoes-col">
                        <label className="adicionartreino-mobile-label">Repetições</label>
                        <input 
                          type="number" 
                          value={item.repeticoes !== undefined && item.repeticoes !== null ? item.repeticoes : ''} 
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : (parseInt(e.target.value, 10) || 0);
                            updateExerciseField(item.id, 'repeticoes', val);
                          }}
                        />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-carga-col">
                      <label className="adicionartreino-mobile-label">Carga(KG)</label>
                      <div className="adicionartreino-inline-input-wrapper">
                        <input 
                          type="text" 
                          placeholder="--" 
                          value={item.carga || ''} 
                          onChange={(e) => updateExerciseField(item.id, 'carga', e.target.value)}
                        />
                        <InfoIcon />
                      </div>
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-intervalo-col">
                      <label className="adicionartreino-mobile-label">Intervalo</label>
                      <input 
                        type="time" 
                        id="duracao" 
                        name="duracao" 
                        step="1" 
                        min="00:00" 
                        max="59:59" 
                        className="adicionartreino-tempo-intervalo"
                        value={item.intervalo || ''} 
                        onChange={(e) => updateExerciseField(item.id, 'intervalo', e.target.value)}
                        pattern="[0-5][0-9]:[0-5][0-9]"
                        title="Formato: MM:SS"
                      />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-observacao-col">
                        <label className="adicionartreino-mobile-label">Observação</label>
                        <input 
                          type="text" 
                          placeholder="--" 
                          value={item.obs || ''} 
                          onChange={(e) => updateExerciseField(item.id, 'obs', e.target.value)}
                        />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-exercise-image-col">
                      <div
                        className={`adicionartreino-exercise-image-upload ${exerciseImages[item.id] ? 'has-image' : ''}`}
                        onClick={() => handleImagemClick(item.id)}
                      >
                        <input
                          ref={(el) => {
                            if (el) fileInputRefs.current[item.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="adicionartreino-exercise-image-input"
                          onChange={(e) => handleImagemChange(item.id, e)}
                          aria-label="Upload de imagem do exercício"
                        />
                        {exerciseImages[item.id] ? (
                          <>
                            <img 
                              src={exerciseImages[item.id].preview} 
                              alt="Preview da imagem" 
                              className="adicionartreino-exercise-image-preview"
                            />
                            <button
                              className="adicionartreino-exercise-image-remove"
                              onClick={(e) => handleRemoverImagem(item.id, e)}
                              title="Remover imagem"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <div className="adicionartreino-exercise-image-content">+</div>
                        )}
                      </div>
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-actions-col">
                      <button className="adicionartreino-icon-btn" title="Excluir" onClick={() => deleteExercise(item.id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Botões do Rodapé --- */}
            <div className="adicionartreino-footer-buttons">
              <button 
                className="adicionartreino-btn adicionartreino-btn-cancel" 
                onClick={handleCancelar}
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                className="adicionartreino-btn adicionartreino-btn-save" 
                onClick={handleSalvar}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}