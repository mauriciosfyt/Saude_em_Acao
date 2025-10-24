import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdministrarTreino.css'; // O CSS atualizado
import MenuPersonal from '../../../components/MenuPersonal/MenuPersonal';

const AdministrarTreino = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Ger/Treinos');
  const [showModal, setShowModal] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState(null);

  const handleMenuClick = (item) => {
    setActiveMenuItem(item);
  };

  const handleTreinoActions = (treino) => {
    setSelectedTreino(treino);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTreino(null);
  };

  const handleAdicionarTreino = () => {
    navigate('/ImplementarTreino');
  };

  const treinos = [
    {
      id: 1,
      titulo: "3x - Fem - Iniciante - Emagrecimento",
      sessaoTag: "3 sessões",
      tags: ["Emagrecimento", "Feminino", "De 20 a 60 anos"]
    },
    {
      id: 2,
      titulo: "3x - Fem - Iniciante - Hipertrofia",
      sessaoTag: "3 sessões",
      tags: ["Hipertrofia", "Feminino", "De 20 a 60 anos"]
    },
    {
      id: 3,
      titulo: "3x - Masc - Iniciante - Adaptado",
      sessaoTag: "3 sessões",
      tags: ["Adaptado", "masculino", "De 20 a 60 anos"]
    },
    {
      id: 4,
      titulo: "3x - Masc - Adaptado",
      sessaoTag: "3 sessões",
      tags: ["adaptado", "masculino", "De 20 a 60 anos"]
    }
  ];

  return (
    <div className="gerenciartreino-container-personal">
      <MenuPersonal activeItem={activeMenuItem} onItemClick={handleMenuClick} />
      
      <main className="gerenciartreino-main-content-personal">
        <div className="gerenciartreino-content-wrapper-personal">
          <header className="gerenciartreino-page-header-personal">
            <h1>Gerenciar Treinos</h1>
          </header>

          <div className="gerenciartreino-actions-section-personal">
            <button className="gerenciartreino-btn-novo-treino-personal" onClick={handleAdicionarTreino}>
              <span className="gerenciartreino-plus-icon-personal">+</span>
              Novo treino
            </button>
          </div>

          <div className="gerenciartreino-filters-section-personal">
            <div className="gerenciartreino-filter-group-personal">
              <input type="text" placeholder="Nome" className="gerenciartreino-filter-input-personal" />
              <div className="gerenciartreino-input-underline-personal"></div>
            </div>
            <div className="gerenciartreino-filter-group-personal">
              <input type="text" placeholder="Tipo do treino" className="gerenciartreino-filter-input-personal" />
              <div className="gerenciartreino-input-underline-personal"></div>
            </div>
            <div className="gerenciartreino-filter-group-personal">
              <input type="text" placeholder="Responsável" className="gerenciartreino-filter-input-personal" />
              <div className="gerenciartreino-input-underline-personal"></div>
            </div>
          </div>

          <div className="gerenciartreino-list-personal">
            {treinos.map((treino) => (
              <div key={treino.id} className="gerenciartreino-card-personal">
                <div className="gerenciartreino-card-content-personal">
                  <div className="gerenciartreino-card-title-personal">{treino.titulo}</div>
                  <div className="gerenciartreino-card-tags-personal">
                    {[...treino.tags, treino.sessaoTag].map((tag, index) => (
                      <span key={index} className="gerenciartreino-tag-personal">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="gerenciartreino-card-actions-personal">
                  <button 
                    className="gerenciartreino-actions-btn-personal"
                    onClick={() => handleTreinoActions(treino)}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {showModal && (
        <div className="gerenciartreino-modal-overlay-personal" onClick={closeModal}>
          <div 
            className="gerenciartreino-modal-content-personal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gerenciartreino-modal-header-personal">
              <h3>Ações</h3>
            </div>
            <div className="gerenciartreino-modal-actions-personal">
              <button className="gerenciartreino-modal-btn-personal edit-btn-personal">Editar</button>
              <button className="gerenciartreino-modal-btn-personal duplicate-btn-personal">Duplicar</button>
              <button className="gerenciartreino-modal-btn-personal remove-btn-personal">Remover</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdministrarTreino;

