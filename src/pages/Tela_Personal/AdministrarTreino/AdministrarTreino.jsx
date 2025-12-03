import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdministrarTreino.css'; 
import MenuPersonal from '../../../components/MenuPersonal/MenuPersonal';
import { getAllTreinos, deleteTreino, getTreinoById } from '../../../services/treinoService';

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Excluido.css'; 

// --- IMPORTAÇÃO DO MODAL DE CONFIRMAÇÃO E LOGO ---
import ModalConfirmacao from '../../../components/ModalConfirmacao/ModalConfirmacao';
import logoEmpresa from '../../../assets/logo.png'; // Importação do logo

const AdministrarTreino = () => {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('Ger/Treinos');
  
  // Modais
  const [showModal, setShowModal] = useState(false); // Modal de Ações (Editar/Remover)
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de Confirmação de Exclusão
  
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
  };

  const handleAdicionarTreino = () => {
    navigate('/ImplementarTreino');
  };

  const handleEditar = () => {
    if (selectedTreino) {
      navigate(`/ImplementarTreino?id=${selectedTreino.id}`);
      setShowModal(false);
      setSelectedTreino(null);
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
      setShowModal(false);
      setSelectedTreino(null);
    } catch (err) {
      console.error('Erro ao duplicar treino:', err);
      toast.error('Erro ao duplicar treino. Tente novamente.', {
        className: 'custom-error-toast',
      });
    }
  };

  // Função chamada ao clicar em "Remover" no menu de ações
  const handleSolicitarRemocao = () => {
    setShowModal(false);
    setShowConfirmModal(true);
  };

  // Função chamada ao clicar em "Sim, confirmar" no modal
  const handleConfirmarExclusao = async () => {
    if (!selectedTreino) return;

    try {
      await deleteTreino(selectedTreino.id);
      
      toast.success('Treino removido com sucesso!', {
        className: 'custom-delete-toast',
        progressClassName: 'custom-delete-progress-bar',
        autoClose: 2000,
      });

      carregarTreinos();
    } catch (err) {
      console.error('Erro ao remover treino:', err);
      toast.error(err.message || 'Erro ao remover treino. Tente novamente.', {
         className: 'custom-error-toast',
         autoClose: 3000
      });
    } finally {
      setShowConfirmModal(false);
      setSelectedTreino(null);
    }
  };

  // Função para cancelar a exclusão
  const handleCancelarExclusao = () => {
    setShowConfirmModal(false);
    setSelectedTreino(null);
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
      <ToastContainer position="top-right" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
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

          {/* --- ALTERAÇÃO: Loading com Spinner Azul --- */}
          {loading && (
            <div className="personal-loading">
              <div className="loading-spinner"></div>
              Carregando treinos...
            </div>
          )}
          {/* ------------------------------------------- */}

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

      {/* --- Modal de Ações (Editar/Remover) --- */}
      {showModal && (
        <div className="gerenciartreino-modal-overlay-personal" onClick={() => { setShowModal(false); setSelectedTreino(null); }}>
          <div 
            className="gerenciartreino-modal-content-personal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gerenciartreino-modal-header-personal">
              <h3>Ações</h3>
            </div>
            <div className="gerenciartreino-modal-actions-personal">
              <button className="gerenciartreino-modal-btn-personal edit-btn-personal" onClick={handleEditar}>Editar</button>
              <button className="gerenciartreino-modal-btn-personal remove-btn-personal" onClick={handleSolicitarRemocao}>Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal de Confirmação de Exclusão com Logo --- */}
      <ModalConfirmacao
        isOpen={showConfirmModal}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        title="Excluir Treino"
        message={`Tem certeza que deseja excluir o treino "${selectedTreino?.nome || selectedTreino?.titulo || 'Selecionado'}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        logoSrc={logoEmpresa} // Logo adicionada aqui
      />

    </div>
  );
};

export default AdministrarTreino;