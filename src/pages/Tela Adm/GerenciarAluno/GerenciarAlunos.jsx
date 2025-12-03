import React, { useState, useEffect } from 'react';
import './GerenciarAlunos.css';
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { Link } from 'react-router-dom';
import ModalGerenciarTreino from './ModalGerenciarTreino';
import { getAllAlunos, deleteAluno, updateAluno } from '../../../services/usuarioService'; 
import { useAuth } from '../../../contexts/AuthContext'; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Excluido.css';

// --- IMPORTAÇÃO DO MODAL E LOGO (NOVO) ---
import ModalConfirmacao from '../../../components/ModalConfirmacao/ModalConfirmacao';
import logoEmpresa from '../../../assets/logo.png'; // Verifique se o caminho está correto para seus assets
// -----------------------------------------

// Ícone de busca (mantido igual)
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const GerenciarAlunos = () => {
  const { user } = useAuth(); 
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States do Modal de Treino (mantidos)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);

  // --- NOVOS STATES PARA O MODAL DE EXCLUSÃO ---
  const [modalExclusaoOpen, setModalExclusaoOpen] = useState(false);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);
  // ---------------------------------------------

  // Buscar alunos da API
  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(' Token sendo usado:', user?.token);
      const alunosData = await getAllAlunos();
      console.log(' Dados recebidos:', alunosData);
      setAlunos(alunosData);
    } catch (err) {
      console.error(' Erro ao carregar alunos:', err);
      setError('Erro ao carregar lista de alunos. Verifique sua conexão e permissões.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  // --- LÓGICA DE EXCLUSÃO REFATORADA ---

  // 1. Apenas abre o modal e salva quem será excluído
  const abrirModalExclusao = (aluno) => {
    setAlunoParaExcluir(aluno);
    setModalExclusaoOpen(true);
  };

  // 2. Fecha o modal sem fazer nada
  const fecharModalExclusao = () => {
    setModalExclusaoOpen(false);
    setAlunoParaExcluir(null);
  };

  // 3. Executa a exclusão real (Sua lógica original movida para cá)
  const confirmarExclusaoReal = async () => {
    if (!alunoParaExcluir) return;

    // Fecha o modal visualmente
    setModalExclusaoOpen(false);

    try {
      await deleteAluno(alunoParaExcluir.id);
      
      // Atualizar a lista após exclusão
      fetchAlunos();
      
      toast.success('Excluído com sucesso!', {
        className: 'custom-delete-toast',
        progressClassName: 'custom-delete-progress-bar',
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Erro ao excluir aluno:', err);
      alert('Erro ao excluir aluno. Tente novamente.');
    } finally {
      setAlunoParaExcluir(null); // Limpa o estado
    }
  };
  // -------------------------------------

  const handleOpenModal = (aluno) => {
    setSelectedAluno(aluno);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAluno(null);
  };

  const handleChooseTreino = async (treino, alunoIdParam) => {
    const alunoIdFinal = alunoIdParam || (selectedAluno?.id && String(selectedAluno.id));
    if (!alunoIdFinal) {
      alert('ID do aluno não encontrado. Tente novamente.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('treinoId', treino.id);
      await updateAluno(alunoIdFinal, formData);
      console.log('Treino associado ao aluno via API com sucesso');
      await fetchAlunos();
    } catch (err) {
      console.warn('Falha ao salvar associação de treino no servidor.', err);
      alert('Erro ao associar treino no servidor. Tente novamente.');
    }
    setModalOpen(false);
    setSelectedAluno(null);
  };

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="alunos-content-wrapper">
        <div className="alunos-header">
          <h1 className="alunos-title">Alunos</h1>
          
          <div className="alunos-search-container">
            <SearchIcon />
            <input 
              className="alunos-search-input" 
              type="text" 
              placeholder="Pesquisar nome do aluno"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/AdicionarAluno" className="alunos-add-button-link">
            <button className="alunos-add-button">Novo Aluno</button>
          </Link>
        </div>

        {loading && (
          <div className="personal-loading">
            <div className="loading-spinner"></div>
            Carregando alunos...
          </div>
        )}
        {error && <div className="alunos-error">{error}</div>}

        {!loading && !error && (
          <table className="alunos-table">
            <thead className="alunos-thead">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Treino</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="alunos-tbody">
              {filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    {searchTerm ? 'Nenhum aluno encontrado para a pesquisa.' : 'Nenhum aluno cadastrado.'}
                  </td>
                </tr>
              ) : (
                filteredAlunos.map(aluno => {
                  const treino = aluno.treino || aluno.treinoAtual || aluno.assignedTreino || (Array.isArray(aluno.treinos) ? aluno.treinos[0] : null);
                  return (
                    <tr key={aluno.id}>
                      <td>{aluno.nome || 'N/A'}</td>
                      <td>{aluno.email || 'N/A'}</td>
                      <td>{aluno.funcao || 'Aluno'}</td>
                      <td>
                        {aluno.plano?.toLowerCase?.() === 'gold' ? (
                          <>
                            <button
                              className="alunos-treino-link"
                              onClick={() => handleOpenModal(aluno)}
                              aria-label={`Gerenciar treino de ${aluno.nome}`}
                            >
                              Gerenciar
                            </button>
                            {treino && (
                              <div className="treino-chosen" title={`Treino escolhido: ${treino.titulo || treino.nome || 'Treino atribuído'}`}>
                                <span className="treino-dot" aria-hidden="true" />
                                <span className="treino-title">{treino.titulo || treino.nome || 'Treino atribuído'}</span>
                              </div>
                            )}
                          </>
                        ) : null}
                      </td>
                      <td>
                        <Link 
                          to={`/EditarAluno/${aluno.id}`} 
                          className="alunos-action-link-edit"
                        >
                          Editar
                        </Link>
                        
                        {/* BOTÃO EXCLUIR ALTERADO PARA ABRIR O MODAL */}
                        <button 
                          className="alunos-action-link-delete"
                          onClick={() => abrirModalExclusao(aluno)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#dc3545', 
                            cursor: 'pointer',
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
        <ToastContainer />

        {/* --- INSERÇÃO DO MODAL DE EXCLUSÃO --- */}
        <ModalConfirmacao
          isOpen={modalExclusaoOpen}
          onClose={fecharModalExclusao}
          onConfirm={confirmarExclusaoReal}
          title="Excluir Aluno"
          message={
            alunoParaExcluir 
              ? `Tem certeza que deseja excluir o aluno(a) ${alunoParaExcluir.nome}? Esta ação é irreversível.` 
              : 'Tem certeza?'
          }
          logoSrc={logoEmpresa}
          confirmLabel="Sim, Excluir"
          cancelLabel="Cancelar"
        />
        {/* ------------------------------------- */}

      </main>

      <ModalGerenciarTreino 
        open={modalOpen} 
        onClose={handleCloseModal} 
        aluno={selectedAluno} 
        onChoose={handleChooseTreino} 
      />
    </div>
  );
};

export default GerenciarAlunos;