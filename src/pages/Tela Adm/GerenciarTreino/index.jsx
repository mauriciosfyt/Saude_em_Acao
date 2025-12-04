import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importações do Toastify e CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Excluido.css'; // Seu arquivo de estilos para exclusão

import './GerenciarTreino.css'; // O CSS atualizado
import MenuAdm from './../../../components/MenuAdm/MenuAdm';
import { getAllTreinos, deleteTreino, getTreinoById } from '../../../services/treinoService';

// Importação do Modal e da Logo (Padrão Profissional)
import ModalConfirmacao from '../../../components/ModalConfirmacao/ModalConfirmacao';
import logoEmpresa from '../../../assets/logo.png'; // Caminho da logo conforme seu exemplo

const GerenciarTreino = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Ger/Treinos');
  const [showModal, setShowModal] = useState(false);
  
  // Estado para controlar o Modal de Confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          responsavelNome: treinoOriginal.responsavelNome || treinoOriginal.responsavel?.nome || treinoOriginal.responsavel || '',
          responsavelId: treinoOriginal.responsavel?.id || treinoOriginal.responsavelId || null,
        };
        delete treinoDuplicado.id;

        navigate('/AdicionarTreino', { state: { treinoData: treinoDuplicado } });
      } else {
        // Fallback
        const responsavelNomeFallback = selectedTreino.responsavelNome || selectedTreino.responsavel?.nome || selectedTreino.responsavel || '';
        const treinoFallback = { ...selectedTreino, nome: `${selectedTreino.nome || selectedTreino.titulo} (Cópia)`, responsavelNome: responsavelNomeFallback };
        delete treinoFallback.id; 
        navigate('/AdicionarTreino', { state: { treinoData: treinoFallback } });
      }
      closeModal();
    } catch (err) {
      console.error('Erro ao duplicar treino:', err);
      toast.error('Erro ao duplicar treino. Tente novamente.', {
        autoClose: 2000,
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
      });
    }
  };

  // 1. Função chamada ao clicar em "Remover" no menu de ações
  const handleRemover = () => {
    // Fecha o modal de ações (o menu com Editar/Remover)
    setShowModal(false);
    // Abre o modal de confirmação profissional
    setShowDeleteModal(true);
  };

  // 2. Função que executa a exclusão de fato (chamada pelo ModalConfirmacao)
  const confirmarExclusao = async () => {
    if (!selectedTreino) return;
    
    try {
      await deleteTreino(selectedTreino.id);
      
      // Toastify usando suas classes do Excluido.css
      toast.success('Excluído com sucesso!', {
        className: 'custom-delete-toast',
        progressClassName: 'custom-delete-progress-bar',
        autoClose: 2000,
      });

      carregarTreinos();
    } catch (err) {
      console.error('Erro ao remover treino:', err);
      toast.error(err.message || 'Erro ao remover treino. Tente novamente.', {
        autoClose: 2000,
        className: "custom-error-toast",
        progressClassName: "custom-error-progress-bar",
      });
    } finally {
      setShowDeleteModal(false);
      setSelectedTreino(null);
    }
  };

  const cancelarExclusao = () => {
    setShowDeleteModal(false);
    setSelectedTreino(null);
  };

  // Formatar dados do treino para exibição
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
    <div className="gerenciartreino-container">
      {/* ToastContainer para notificações */}
      <ToastContainer position="top-right" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
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
            <div className="personal-loading">
              <div className="loading-spinner"></div>
              Carregando treinos...
            </div>
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

      {/* Modal de Ações (Menu flutuante) */}
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

      {/* Modal de Confirmação Profissional com Logo */}
      <ModalConfirmacao
        isOpen={showDeleteModal}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
        title="Excluir Treino"
        message={`Tem certeza que deseja remover o treino "${selectedTreino?.nome || selectedTreino?.titulo}"?`}
        logoSrc={logoEmpresa} // Adicionada a logo aqui
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
      />

    </div>
  );
};

export default GerenciarTreino;