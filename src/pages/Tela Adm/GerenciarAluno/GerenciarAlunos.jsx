import React, { useState, useEffect } from 'react';
import './GerenciarAlunos.css';
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { Link } from 'react-router-dom';
import ModalGerenciarTreino from './ModalGerenciarTreino';
import { getAllAlunos, deleteAluno, updateAluno } from '../../../services/usuarioService'; // Importar as funções da API
import { useAuth } from '../../../contexts/AuthContext'; // Importar o contexto de auth

// Ícone de busca (mantido igual)
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);



const GerenciarAlunos = () => {
  const { user } = useAuth(); // Usar o contexto de autenticação
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [selectedTreinos, setSelectedTreinos] = useState({});

  

  // Buscar alunos da API
  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(' Token sendo usado:', user?.token);
      const alunosData = await getAllAlunos();
      console.log(' Dados recebidos:', alunosData);
      setAlunos(alunosData);

      // Extrair possíveis treinos já associados no objeto aluno (se existirem)
      try {
        const saved = {};
        alunosData.forEach(a => {
          // Possíveis campos que podem conter um treino associado
          const candidato = a.treino || a.treinoId || a.treinoAtual || a.assignedTreino || a.treinos || null;
          if (candidato) {
            // Se for array, pega primeiro; se for objeto, usa objeto; se for id, tenta construir um objeto leve
            if (Array.isArray(candidato) && candidato.length > 0) saved[a.id] = candidato[0];
            else if (typeof candidato === 'object') saved[a.id] = candidato;
            else saved[a.id] = { id: candidato, titulo: 'Treino atribuído' };
          }
        });
        // Merge com localStorage (localStorage tem prioridade)
        const raw = localStorage.getItem('assignedTreinos');
        const local = raw ? JSON.parse(raw) : {};
        const merged = { ...saved, ...local };
        if (Object.keys(merged).length > 0) setSelectedTreinos(merged);
      } catch (e) {
        console.warn('Erro ao extrair treinos dos alunos:', e);
      }
    } catch (err) {
      console.error(' Erro ao carregar alunos:', err);
      setError('Erro ao carregar lista de alunos. Verifique sua conexão e permissões.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
    // Carregar atribuições salvas localmente (fallback)
    try {
      const raw = localStorage.getItem('assignedTreinos');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setSelectedTreinos(parsed);
        }
      }
    } catch (e) {
      console.warn('Falha ao ler assignedTreinos do localStorage', e);
    }
  }, []);

  // Função para deletar aluno
  const handleDeleteAluno = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o aluno ${nome}?`)) {
      try {
        await deleteAluno(id);
        // Atualizar a lista após exclusão
        fetchAlunos();
        alert('Aluno excluído com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir aluno:', err);
        alert('Erro ao excluir aluno. Tente novamente.');
      }
    }
  };

  const handleOpenModal = (aluno) => {
    setSelectedAluno(aluno);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAluno(null);
  };

  const handleChooseTreino = async (treino, alunoIdParam) => {
    // Recebe (treino, alunoId) vindo do modal
    const alunoIdFinal = alunoIdParam || (selectedAluno?.id && String(selectedAluno.id));
    if (!alunoIdFinal) {
      alert('ID do aluno não encontrado. Tente novamente.');
      return;
    }

    // Atualiza UI local primeiro
    setSelectedTreinos(prev => {
      const next = { ...prev, [alunoIdFinal]: treino };
      try { localStorage.setItem('assignedTreinos', JSON.stringify(next)); } catch (e) { console.warn('Erro salvando assignedTreinos', e); }
      return next;
    });

    // Tenta persistir no backend usando updateAluno (campo sugerido: treinoId)
    try {
      // Usamos JSON simples — updateAluno aceita FormData ou JSON
      await updateAluno(alunoIdFinal, { treinoId: treino.id });
      console.log('Treino associado ao aluno via API com sucesso');
    } catch (err) {
      console.warn('Falha ao salvar associação de treino no servidor, persistido localmente.', err);
    }

    setModalOpen(false);
    setSelectedAluno(null);
  };

  // Filtrar alunos baseado na busca
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
          
          {/* Barra de pesquisa */}
          <div className="alunos-search-container">
            <SearchIcon />
            <input 
              className="alunos-search-input" 
              type="text" 
              placeholder="Pesquisar nome  do aluno"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/AdicionarAluno" className="alunos-add-button-link">
            <button className="alunos-add-button">Novo Aluno</button>
          </Link>
        </div>

        {/* Estados de loading e erro - MODIFICADO */}
        {loading && (
          <div className="personal-loading"> {/* Classe usada para corresponder ao estilo do GerenciarPersonal */}
            <div className="loading-spinner"></div> {/* Classe usada para o spinner */}
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
                filteredAlunos.map(aluno => (
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
                          {selectedTreinos[aluno.id] && (
                            <div className="treino-chosen" title={`Treino escolhido: ${selectedTreinos[aluno.id].title}`}>
                              <span className="treino-dot" aria-hidden="true" />
                              <span className="treino-title">{selectedTreinos[aluno.id].title}</span>
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
                      <button 
                        className="alunos-action-link-delete"
                        onClick={() => handleDeleteAluno(aluno.id, aluno.nome)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#dc3545', 
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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