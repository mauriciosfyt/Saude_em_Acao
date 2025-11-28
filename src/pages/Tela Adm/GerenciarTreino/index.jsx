import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GerenciarTreino.css'; // O CSS atualizado
import MenuAdm from './../../../components/MenuAdm/MenuAdm';
import { getAllTreinos, deleteTreino, getTreinoById } from '../../../services/treinoService';

const GerenciarTreino = () => {
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
    navigate('/AdicionarTreino');
  };

  const handleEditar = () => {
    if (selectedTreino) {
      navigate(`/AdicionarTreino?id=${selectedTreino.id}`);
      closeModal();
    }
  };

  const handleDuplicar = async () => {
    if (!selectedTreino) return;
    
    try {
      // Buscar os dados completos do treino
      const treinoOriginal = await getTreinoById(selectedTreino.id);
      
      if (treinoOriginal) {
        // Criar uma cópia sem o ID e com nome modificado
        const treinoDuplicado = {
          ...treinoOriginal,
          nome: `${treinoOriginal.nome || treinoOriginal.titulo} (Cópia)`,
          // Normalizar responsável: expor tanto responsavelNome quanto responsavel (obj)
          responsavelNome: treinoOriginal.responsavelNome || treinoOriginal.responsavel?.nome || treinoOriginal.responsavel || '',
          responsavelId: treinoOriginal.responsavel?.id || treinoOriginal.responsavelId || null,
        };
        delete treinoDuplicado.id;

        navigate('/AdicionarTreino', { state: { treinoData: treinoDuplicado } });
      } else {
        // Fallback: tente normalizar o campo responsavel do selectedTreino também
        const responsavelNomeFallback = selectedTreino.responsavelNome || selectedTreino.responsavel?.nome || selectedTreino.responsavel || '';
        const treinoFallback = { ...selectedTreino, nome: `${selectedTreino.nome || selectedTreino.titulo} (Cópia)`, responsavelNome: responsavelNomeFallback };
        delete treinoFallback.id; // garantir sem id
        navigate('/AdicionarTreino', { state: { treinoData: treinoFallback } });
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

  // Formatar dados do treino para exibição
  const formatarTreinoParaExibicao = (treino) => {
    const titulo = treino.nome || treino.titulo || 'Treino sem nome';
    const frequencia = treino.frequenciaSemanal || treino.frequencia || 0;
    const sessaoTag = `${frequencia}x sessões`;
    
    const tags = [];
    if (treino.tipoTreino || treino.tipo) tags.push(treino.tipoTreino || treino.tipo);
    
    // --- INÍCIO DA CORREÇÃO ---
    // O valor da API é "MASCULINO" (maiúsculas)
    if (treino.sexo) tags.push(treino.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino');
    // --- FIM DA CORREÇÃO ---
    
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
              <input 
                type="text" 
                placeholder="Nome" 
                className="gerenciartreino-filter-input"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
              <div className="gerenciartreino-input-underline"></div>
            </div>
            <div className="gerenciartreino-filter-group">
              <input 
                type="text" 
                placeholder="Tipo do treino" 
                className="gerenciartreino-filter-input"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              />
              <div className="gerenciartreino-input-underline"></div>
            </div>
            <div className="gerenciartreino-filter-group">
              <input 
                type="text" 
                placeholder="Responsável" 
                className="gerenciartreino-filter-input"
                value={filtroResponsavel}
                onChange={(e) => setFiltroResponsavel(e.target.value)}
              />
              <div className="gerenciartreino-input-underline"></div>
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
            <div className="gerenciartreino-list">
              {treinos.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Nenhum treino encontrado.
                </div>
              ) : (
                treinos.map((treino) => {
                  const treinoFormatado = formatarTreinoParaExibicao(treino);
                  return (
                    <div key={treino.id} className="gerenciartreino-card">
                      <div className="gerenciartreino-card-content">
                        <div className="gerenciartreino-card-title">{treinoFormatado.titulo}</div>
                        <div className="gerenciartreino-card-tags">
                          {[...treinoFormatado.tags, treinoFormatado.sessaoTag].map((tag, index) => (
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
                  );
                })
              )}
            </div>
          )}

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
              <button className="gerenciartreino-modal-btn edit-btn" onClick={handleEditar}>Editar</button>
              <button className="gerenciartreino-modal-btn remove-btn" onClick={handleRemover}>Remover</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GerenciarTreino;