import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdministrarTreino.css'; // O CSS atualizado
import MenuPersonal from '../../../components/MenuPersonal/MenuPersonal';
import { getAllTreinos, deleteTreino, getTreinoById } from '../../../services/treinoService';

const AdministrarTreino = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Ger/Treinos');
  const [showModal, setShowModal] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroResponsavel, setFiltroResponsavel] = useState('');

  // Carregar treinos
  const carregarTreinos = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros = {};
      if (filtroNome.trim()) filtros.nome = filtroNome.trim();
      if (filtroTipo.trim()) filtros.tipo = filtroTipo.trim();
      if (filtroResponsavel.trim()) filtros.responsavel = filtroResponsavel.trim();

      const dados = await getAllTreinos(filtros);
      setTreinos(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error('Erro ao carregar treinos:', err);
      setError(err.message || 'Erro ao carregar treinos');
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTreinos();
  }, []);

  // Aplicar filtros com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarTreinos();
    }, 500);
    return () => clearTimeout(timer);
  }, [filtroNome, filtroTipo, filtroResponsavel]);

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

  const handleEditar = () => {
    if (selectedTreino) {
      navigate(`/ImplementarTreino?id=${selectedTreino.id}`);
      closeModal();
    }
  };

  const handleDuplicar = async () => {
    if (!selectedTreino) return;

    try {
      const treinoOriginal = await getTreinoById(selectedTreino.id);

      if (treinoOriginal) {
        const treinoDuplicado = {
          ...treinoOriginal,
          nome: `${treinoOriginal.nome || treinoOriginal.titulo} (Cópia)`,
          responsavelNome: treinoOriginal.responsavelNome || treinoOriginal.responsavel?.nome || treinoOriginal.responsavel || '',
          responsavelId: treinoOriginal.responsavel?.id || treinoOriginal.responsavelId || null,
        };
        delete treinoDuplicado.id;

        navigate('/ImplementarTreino', { state: { treinoData: treinoDuplicado } });
      } else {
        const responsavelNomeFallback = selectedTreino.responsavelNome || selectedTreino.responsavel?.nome || selectedTreino.responsavel || '';
        const treinoFallback = { ...selectedTreino, nome: `${selectedTreino.nome || selectedTreino.titulo} (Cópia)`, responsavelNome: responsavelNomeFallback };
        delete treinoFallback.id;
        navigate('/ImplementarTreino', { state: { treinoData: treinoFallback } });
      }
      closeModal();
    } catch (err) {
      console.error('Erro ao duplicar treino:', err);
      alert('Erro ao duplicar treino. Tente novamente.');
    }
  };

  const handleRemover = async () => {
    if (!selectedTreino || !window.confirm(`Tem certeza que deseja remover o treino "${selectedTreino.nome || selectedTreino.titulo}"?`)) {
      return;
    }

    try {
      await deleteTreino(selectedTreino.id);
      alert('Treino removido com sucesso!');
      closeModal();
      carregarTreinos();
    } catch (err) {
      console.error('Erro ao remover treino:', err);
      alert(err.message || 'Erro ao remover treino. Tente novamente.');
    }
  };

  const formatarTreinoParaExibicao = (treino) => {
    const titulo = treino.nome || treino.titulo || 'Treino sem nome';
    const frequencia = treino.frequenciaSemanal || treino.frequencia || 0;
    const sessaoTag = `${frequencia}x sessões`;

    const tags = [];
    if (treino.tipoTreino || treino.tipo) tags.push(treino.tipoTreino || treino.tipo);

    if (treino.sexo) tags.push(treino.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino');

    if (treino.idadeMin && treino.idadeMax) {
      tags.push(`De ${treino.idadeMin} a ${treino.idadeMax} anos`);
    } else if (treino.idadeMin) {
      tags.push(`Acima de ${treino.idadeMin} anos`);
    } else if (treino.idadeMax) {
      tags.push(`Até ${treino.idadeMax} anos`);
    }

    return {
      id: treino.id,
      titulo,
      sessaoTag,
      tags,
      ...treino
    };
  };

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
              <input 
                type="text" 
                placeholder="Nome" 
                className="gerenciartreino-filter-input-personal"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
              <div className="gerenciartreino-input-underline-personal"></div>
            </div>
            <div className="gerenciartreino-filter-group-personal">
              <input 
                type="text" 
                placeholder="Tipo do treino" 
                className="gerenciartreino-filter-input-personal"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              />
              <div className="gerenciartreino-input-underline-personal"></div>
            </div>
            <div className="gerenciartreino-filter-group-personal">
              <input 
                type="text" 
                placeholder="Responsável" 
                className="gerenciartreino-filter-input-personal"
                value={filtroResponsavel}
                onChange={(e) => setFiltroResponsavel(e.target.value)}
              />
              <div className="gerenciartreino-input-underline-personal"></div>
            </div>
          </div>

          {loading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>Carregando treinos...</div>
          )}

          {error && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
              Erro: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="gerenciartreino-list-personal">
              {treinos.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Nenhum treino encontrado.
                </div>
              ) : (
                treinos.map((treino) => {
                  const treinoFormatado = formatarTreinoParaExibicao(treino);
                  return (
                    <div key={treino.id} className="gerenciartreino-card-personal">
                      <div className="gerenciartreino-card-content-personal">
                        <div className="gerenciartreino-card-title-personal">{treinoFormatado.titulo}</div>
                        <div className="gerenciartreino-card-tags-personal">
                          {[...treinoFormatado.tags, treinoFormatado.sessaoTag].map((tag, index) => (
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
                  );
                })
              )}
            </div>
          )}

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
              <button className="gerenciartreino-modal-btn-personal edit-btn-personal" onClick={handleEditar}>Editar</button>
              <button className="gerenciartreino-modal-btn-personal remove-btn-personal" onClick={handleRemover}>Remover</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdministrarTreino;

