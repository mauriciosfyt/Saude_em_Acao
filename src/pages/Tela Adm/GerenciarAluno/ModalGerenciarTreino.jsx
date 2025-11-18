import React, { useState, useMemo, useEffect } from 'react'; // 1. Importei o useEffect
import './ModalGerenciarTreino.css';

const sampleTreinos = [
  { id: 1, title: 'Treino A', tags: ['Emagrecimento', 'Feminino', 'De 20 a 60 anos', '3 sessões'], type: 'Emagrecimento' },
  { id: 2, title: 'Treino B', tags: ['Hipertrofia', 'Feminino', 'De 20 a 60 anos', '3 sessões'], type: 'Hipertrofia' },
  { id: 3, title: 'Treino C', tags: ['Adaptado', 'Masculino', 'De 20 a 60 anos', '3 sessões'], type: 'Adaptado' },
  { id: 4, title: 'Treino D', tags: ['Emagrecimento', 'Feminino', 'De 20 a 60 anos', '3 sessões'], type: 'Emagrecimento' },
];

const ModalGerenciarTreino = ({ open, onClose, aluno, onChoose }) => {
  const [nameQuery, setNameQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // --- ⬇️ CÓDIGO ADICIONADO ⬇️ ---
  // Este hook controla o scroll do <body>
  useEffect(() => {
    // Quando o modal abrir
    if (open) {
      // Adiciona a classe que esconde o overflow do body
      document.body.style.overflow = 'hidden';
    }

    // Esta é a "função de limpeza" do useEffect.
    // Ela roda quando o modal é fechado ou desmontado.
    return () => {
      // Restaura o scroll do body
      document.body.style.overflow = 'auto'; // ou 'unset'
    };
  }, [open]); // O hook só roda novamente se a prop 'open' mudar
  // --- ⬆️ FIM DO CÓDIGO ADICIONADO ⬆️ ---


  const treinos = useMemo(() => {
    return sampleTreinos.filter(t => {
      const nameMatch = t.title.toLowerCase().includes(nameQuery.toLowerCase());
      const typeMatch = t.type.toLowerCase().includes(typeQuery.toLowerCase());
      return nameMatch && typeMatch;
    });
  }, [nameQuery, typeQuery]);

  const handleChoose = () => {
    const selectedTreino = sampleTreinos.find(t => t.id === selectedId);
    if (selectedTreino) {
      onChoose(selectedTreino);
    }
  };

  // Se não estiver aberto, não renderiza nada (e o useEffect acima vai limpar o estilo)
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title-adm">Gerenciar Treinos do Aluno: {aluno?.nome || ''}</h2>

        <div className="modal-filters">
          <div>
            <label className="modal-label-adm">Nome do treino</label>
            <input
              className="modal-input-adm"
              placeholder="Pesquisar por nome do treino"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="modal-label-adm">Tipo do treino</label>
            <input
              className="modal-input-adm"
              placeholder="Pesquisar por tipo de treino"
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Esta lista interna do modal ainda poderá rolar, o que é o correto */}
        <div className="modal-list"> 
          {treinos.map((t) => (
            <div className="modal-item" key={t.id}>
              <div className="modal-item-row">
                <input type="radio" name="treino-select" checked={selectedId === t.id} onChange={() => setSelectedId(t.id)} />
                <div className="modal-item-info">{t.title}</div>
              </div>

              <div className="modal-tags">
                {t.tags.map((tag, i) => (
                  <span className="tag-admin" key={i}>{tag}</span>
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