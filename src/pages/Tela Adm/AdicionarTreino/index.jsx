import React, { useState, useRef} from 'react';
import MenuAdm from './../../../components/MenuAdm/MenuAdm';
import './AdicionarTreino.css';
import baixo from '../../../assets/icones/down-arrow.svg';
import cima  from '../../../assets/icones/up-arrow.svg';


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
export default function AdicionarTreino() {
  const [activeTab, setActiveTab] = useState("Segunda");

  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const handleTabClick = (dia) => {
    setActiveTab(dia);
  };

  // initial list with stable ids (used as template)
  const initial = [
    { nome: "Supino Reto - Barra", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Supino halter - Banco inclinado", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Crucifixo - cross over", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Flexão de braço inclinado", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
    { nome: "Trícips pulley", series: 3, repeticoes: 10, carga: "", intervalo: "", obs: "" },
  ];

  // unique id generator
  const nextId = useRef(1);

  // exercises per day (object keyed by day name)
  const [exerciciosPorDia, setExerciciosPorDia] = useState(() => {
    const map = {};
    dias.forEach((d) => {
      map[d] = initial.map((it) => ({ ...it, id: nextId.current++ }));
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

  // helper to toggle a dragging class for visual feedback
  const elAndAddDraggingClass = (id, add) => {
    const el = itemRefs.current.get(id);
    if (el) {
      if (add) el.classList.add('dragging');
      else el.classList.remove('dragging');
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

  return (
    <div className="adicionartreino-page">
      <MenuAdm />
      <main className="adicionartreino-main-content">
        {/* CORREÇÃO: Wrapper adicionado para centralizar e limitar a largura */}
        <div className="adicionartreino-form-wrapper">
            <h1 className="adicionartreino-form-title">Adicionar Treinos</h1>

            {/* --- Formulário Principal --- */}
            <div className="adicionartreino-form-container">
              <div className="adicionartreino-form-row adicionartreino-form-row-2">
                <div className="adicionartreino-form-field">
                  <label htmlFor="nome">Nome *</label>
                  <input id="nome" type="text" defaultValue="3x - Fem - Iniciante - Emagrecimento" readOnly/>
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="responsavel">Responsável</label>
                  <input id="responsavel" type="text" defaultValue="Maumau" readOnly/>
                </div>
              </div>
              <div className="adicionartreino-form-row adicionartreino-form-row-3">
                <div className="adicionartreino-form-field">
                  <label htmlFor="tipoTreino">Tipo de treino</label>
                  <input id="tipoTreino" type="text" defaultValue="Musculação" readOnly/>
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="nivel">Nível</label>
                  <select id="nivel" defaultValue="Iniciante">
                    <option>Iniciante</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                  </select>
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="sexo">Sexo</label>
                  <select id="sexo" defaultValue="Masculino">
                    <option>Masculino</option>
                    <option>Feminino</option>
                  </select>
                </div>
              </div>
              <div className="adicionartreino-form-row adicionartreino-form-row-3">
                <div className="adicionartreino-form-field">
                  <label htmlFor="frequencia">Frequência semanal *</label>
                  <input id="frequencia" type="number" defaultValue="3" readOnly/>
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="idadeMin">Idade mínima</label>
                  <input id="idadeMin" type="number" defaultValue="15" readOnly/>
                </div>
                <div className="adicionartreino-form-field">
                  <label htmlFor="idadeMax">Idade máxima</label>
                  <input id="idadeMax" type="number" defaultValue="30" readOnly/>
                </div>
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
            <input type="text" defaultValue={item.nome} />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-series-col">
                        <label className="adicionartreino-mobile-label">Séries *</label>
            <input type="number" defaultValue={item.series} />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-repeticoes-col">
                        <label className="adicionartreino-mobile-label">Repetições</label>
            <input type="number" defaultValue={item.repeticoes} />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-carga-col">
                      <label className="adicionartreino-mobile-label">Carga(KG)</label>
                      <div className="adicionartreino-inline-input-wrapper">
                        <input type="text" placeholder="--" defaultValue={item.carga} />
                        <InfoIcon />
                      </div>
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-intervalo-col">
                      <label className="adicionartreino-mobile-label">Intervalo</label>
                      <div className="adicionartreino-inline-input-wrapper">
                        <input type="text" placeholder="--" defaultValue={item.intervalo} />
                        <InfoIcon />
                      </div>
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-observacao-col">
                        <label className="adicionartreino-mobile-label">Observação</label>
            <input type="text" placeholder="--" defaultValue={item.obs} />
                    </div>

                    <div className="adicionartreino-field-content adicionartreino-actions-col">
                      <button className="adicionartreino-icon-btn" title="Editar"><EditIcon /></button>
                      <button className="adicionartreino-icon-btn" title="Excluir" onClick={() => deleteExercise(item.id)}><TrashIcon /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Botões do Rodapé --- */}
            <div className="adicionartreino-footer-buttons">
              <button className="adicionartreino-btn adicionartreino-btn-cancel">Cancelar</button>
              <button className="adicionartreino-btn adicionartreino-btn-save">Salvar</button>
            </div>
        </div>
      </main>
    </div>
  );
}

