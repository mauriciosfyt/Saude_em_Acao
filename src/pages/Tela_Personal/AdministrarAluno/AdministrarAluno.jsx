import React, { useState, useEffect } from 'react'; 
import './AdministrarAluno.css'; 
import MenuPersonal from '../../../components/MenuPersonal/MenuPersonal'
import { Link } from 'react-router-dom';
import ModalGerenciarTreino from '../../../pages/Tela Adm/GerenciarAluno/ModalGerenciarTreino';
// --- Importação da função da API ---
import { getAllAlunos, updateAluno } from '../../../services/usuarioService';

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Sucesso.css';  // Para mensagem de sucesso
import '../../../components/Mensagem/Excluido.css'; // Para mensagem de erro

// Ícone de busca
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const AdministrarAluno = () => {
  const [alunos, setAlunos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [selectedTreinos, setSelectedTreinos] = useState({});

  // Função para Buscar Alunos da API
  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError('');
      const alunosData = await getAllAlunos(); 
      console.log('Dados de alunos recebidos da API:', alunosData);
      setAlunos(alunosData); 
    } catch (err) {
      console.error('Erro ao carregar alunos:', err);
      setError('Erro ao carregar lista de alunos. Verifique a conexão e permissões.');
    } finally {
      setLoading(false);
    }
  };

  // Executa a busca na montagem do componente
  useEffect(() => {
    fetchAlunos();
    // Carregar atribuições salvas localmente
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

  const handleOpenModal = (aluno) => {
    setSelectedAluno(aluno);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAluno(null);
  };

  // Recebe o treino escolhido no modal e salva por aluno
  const handleChooseTreino = async (treino, alunoIdParam) => {
    const alunoIdFinal = alunoIdParam || (selectedAluno?.id && String(selectedAluno.id));
    if (!alunoIdFinal) {
      toast.error('ID do aluno não encontrado. Tente novamente.', {
        className: 'custom-error-toast',
        progressClassName: 'custom-error-progress-bar'
      });
      return;
    }

    setSelectedTreinos(prev => {
      const next = { ...prev, [alunoIdFinal]: treino };
      try { localStorage.setItem('assignedTreinos', JSON.stringify(next)); } catch (e) { console.warn('Erro salvando assignedTreinos', e); }
      return next;
    });

    // Tenta persistir no backend
    try {
      await updateAluno(alunoIdFinal, { treinoId: treino.id });
      console.log('Treino associado ao aluno via API com sucesso (personal)');
      
      // --- MENSAGEM DE SUCESSO ---
      toast.success('Treino associado com sucesso!', {
        className: 'custom-success-toast', // Usa o estilo do Sucesso.css
        autoClose: 2000,
      });

    } catch (err) {
      console.warn('Falha ao salvar associação de treino no servidor (personal), persistido localmente.', err);
      
      // --- MENSAGEM DE ERRO (Estilo Excluido) ---
      toast.error('Erro ao associar treino no servidor.', {
         className: 'custom-error-toast', // Usa o estilo do Excluido.css
         autoClose: 3000,
         progressClassName: 'custom-error-progress-bar'
      });
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
      {/* ToastContainer adicionado */}
      <ToastContainer position="top-right" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <MenuPersonal /><main className="personal-content-wrapper">
        <div className="personal-header">
          <h1 className="personal-title">Alunos</h1>
          <div className="personal-search-container">
            <SearchIcon />
            <input 
                className="personal-search-input" 
                type="text" 
                placeholder="Pesquisar nome ou e-mail"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
         
        </div>
        
        {loading && (
          <div className="personal-loading">
            <div className="loading-spinner"></div>
            Carregando alunos...
          </div>
        )}
        
        {error && <div className="personal-error">{error}</div>}

        {!loading && !error && (
          <table className="personal-table">
            <thead className="personal-thead">
              <tr>
                <th>Nome:</th>
                <th>Email</th>
                <th>Função</th>
                <th>Treino</th>
              </tr>
            </thead>
            <tbody className="personal-tbody">
              {filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    {searchTerm ? 'Nenhum aluno encontrado para a pesquisa.' : 'Nenhum aluno cadastrado.'}
                  </td>
                </tr>
              ) : (
                filteredAlunos.map(aluno => {
                  const treino = aluno.treino || aluno.treinoAtual || aluno.assignedTreino || (Array.isArray(aluno.treinos) ? aluno.treinos[0] : null);
                  const possuiTreinoServidor = Boolean(aluno.possuiTreino || treino);
                  const possuiTreinoLocal = Boolean(selectedTreinos[aluno.id]);
                  const possuiTreino = possuiTreinoServidor || possuiTreinoLocal;

                  return (
                    <tr key={aluno.id}>
                      <td>{aluno.nome || 'N/A'}</td>
                      <td>{aluno.email || 'N/A'}</td>
                      <td>{aluno.perfil || 'Aluno'}</td>
                      <td>
                        {aluno.plano === 'GOLD' ? (
                          <button
                            className="personal-treino-link"
                            onClick={(e) => { e.preventDefault(); handleOpenModal(aluno); }}
                            aria-label={`Gerenciar treino de ${aluno.nome}`}
                          >
                            Gerenciar
                          </button>
                        ) : null}

                        {/* Indicador vindo do servidor (similar à tela de admin) ou do localStorage */}
                        {possuiTreino && !possuiTreinoLocal && (
                          <span
                            className="treino-dot-personal"
                            title="Aluno possui treino atribuído"
                            aria-label="Treino atribuído"
                          />
                        )}

                        {/* Indicador e título quando o treino foi escolhido localmente (persistido em localStorage) */}
                        {possuiTreinoLocal && (
                          <div className="treino-chosen-personal" title={`Treino escolhido: ${selectedTreinos[aluno.id].title}`}>
                            <span className="treino-dot-personal" aria-hidden="true" />
                            <span className="treino-title-personal">{selectedTreinos[aluno.id].title}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </main>
      
      <ModalGerenciarTreino open={modalOpen} onClose={handleCloseModal} aluno={selectedAluno} onChoose={handleChooseTreino} />
    </div>
  );
};

export default AdministrarAluno;