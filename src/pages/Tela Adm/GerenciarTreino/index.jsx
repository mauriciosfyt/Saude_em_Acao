import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GerenciarTreino.css'; // O CSS atualizado
import MenuAdm from './../../../components/MenuAdm/MenuAdm';

const GerenciarTreino = () => {
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
    navigate('/AdicionarTreino');
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
    <div className="gerenciartreino-container">
      <MenuAdm activeItem={activeMenuItem} onItemClick={handleMenuClick} />
      
      <main className="gerenciartreino-main-content">
        <div className="gerenciartreino-content-wrapper">
          <header className="gerenciartreino-page-header">
            <h1>Gerenciar Treinos</h1>
          </header>

          <div className="gerenciartreino-actions-section">
            <button className="gerenciartreino-btn-novo-treino" onClick={handleAdicionarTreino}>
              <span className="gerenciartreino-plus-icon">+</span>
              Novo treino
            </button>
          </div>

          <div className="gerenciartreino-filters-section">
            <div className="gerenciartreino-filter-group">
              <input type="text" placeholder="Nome" className="gerenciartreino-filter-input" />
              <div className="gerenciartreino-input-underline"></div>
            </div>
            <div className="gerenciartreino-filter-group">
              <input type="text" placeholder="Tipo do treino" className="gerenciartreino-filter-input" />
              <div className="gerenciartreino-input-underline"></div>
            </div>
            <div className="gerenciartreino-filter-group">
              <input type="text" placeholder="Responsável" className="gerenciartreino-filter-input" />
              <div className="gerenciartreino-input-underline"></div>
            </div>
          </div>

          <div className="gerenciartreino-list">
            {treinos.map((treino) => (
              <div key={treino.id} className="gerenciartreino-card">
                <div className="gerenciartreino-card-content">
                  <div className="gerenciartreino-card-title">{treino.titulo}</div>
                  <div className="gerenciartreino-card-tags">
                    {[...treino.tags, treino.sessaoTag].map((tag, index) => (
                      <span key={index} className="gerenciartreino-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="gerenciartreino-card-actions">
                  <button 
                    className="gerenciartreino-actions-btn"
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
        <div className="gerenciartreino-modal-overlay" onClick={closeModal}>
          <div 
            className="gerenciartreino-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gerenciartreino-modal-header">
              <h3>Ações</h3>
            </div>
            <div className="gerenciartreino-modal-actions">
              <button className="gerenciartreino-modal-btn edit-btn">Editar</button>
              <button className="gerenciartreino-modal-btn duplicate-btn">Duplicar</button>
              <button className="gerenciartreino-modal-btn remove-btn">Remover</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GerenciarTreino;

