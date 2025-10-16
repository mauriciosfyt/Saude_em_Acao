import React, { useState, useMemo } from 'react';
import './ModalGerenciarTreino.css';

const sampleTreinos = [
  { id: 1, title: '3x - Fem - Iniciante - Emagrecimento', tags: ['Emagrecimento', 'Feminino', 'De 20 a 60 anos', '3 sessões'], type: 'Emagrecimento' },
  { id: 2, title: '3x - Fem - Iniciante - Hipertrofia', tags: ['Hipertrofia', 'Feminino', 'De 20 a 60 anos', '3 sessões'], type: 'Hipertrofia' },
  { id: 3, title: '3x - Masc - Adaptado - Hipertrofia', tags: ['Adaptado', 'Masculino', 'De 20 a 60 anos', '3 sessões'], type: 'Adaptado' },
  { id: 4, title: '3x - Fem - Iniciante - Emagrecimento (2)', tags: ['Emagrecimento', 'Feminino', 'De 20 a 60 anos', '3 sessões'], type: 'Emagrecimento' },
];

const ModalGerenciarTreino = ({ open, onClose, aluno, onChoose }) => {
  const [nameQuery, setNameQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const treinos = useMemo(() => {
    return sampleTreinos.filter(t => {
      const matchesName = nameQuery.trim() === '' || t.title.toLowerCase().includes(nameQuery.toLowerCase());
      const matchesType = typeQuery.trim() === '' || t.type.toLowerCase().includes(typeQuery.toLowerCase());
      return matchesName && matchesType;
    });
  }, [nameQuery, typeQuery]);

  if (!open) return null;

  function handleChoose() {
    const chosen = sampleTreinos.find(t => t.id === selectedId) || null;
    if (onChoose) onChoose(chosen);
    // default: just close
    onClose();
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3 className="modal-title">Treinos</h3>

        <div className="modal-form">
          <div>
            <label className="modal-label">Nome</label>
            <input
              className="modal-input"
              placeholder="Pesquisar por nome do treino"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="modal-label">Tipo do treino</label>
            <input
              className="modal-input"
              placeholder="Pesquisar por tipo de treino"
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-list">
          {treinos.map((t) => (
            <div className="modal-item" key={t.id}>
              <div className="modal-item-row">
                <input type="radio" name="treino-select" checked={selectedId === t.id} onChange={() => setSelectedId(t.id)} />
                <div className="modal-item-info">{t.title}</div>
              </div>

              <div className="modal-tags">
                {t.tags.map((tag, i) => (
                  <span className="tag" key={i}>{tag}</span>
                ))}
              </div>

              <hr className="modal-sep" />
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-back" onClick={onClose}>Voltar</button>
          <button className="btn btn-choose" onClick={handleChoose}>Escolher</button>
        </div>
      </div>
    </div>
  );
};

export default ModalGerenciarTreino;
