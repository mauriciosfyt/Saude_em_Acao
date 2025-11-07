import React, { useState, useEffect } from 'react'; 
import './AdministrarAluno.css'; 
import MenuPersonal from '../../../components/MenuPersonal/MenuPersonal'
import { Link } from 'react-router-dom';
import ModalGerenciarTreino from '../../../pages/Tela Adm/GerenciarAluno/ModalGerenciarTreino';
// --- Importação da função da API ---
import { getAllAlunos } from '../../../services/usuarioService';
// --- Você pode precisar do useAuth se a sua API exigir token ---
// import { useAuth } from '../../../contexts/AuthContext'; 

// Ícone de busca
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const AdministrarAluno = () => {
  // const { user } = useAuth(); // Descomente se precisar do token (geralmente necessário)
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
      const alunosData = await getAllAlunos(); // Função importada do usuarioService
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
  const handleChooseTreino = (treino) => {
    if (!selectedAluno) return;
    setSelectedTreinos(prev => ({ ...prev, [selectedAluno.id]: treino }));
    setModalOpen(false);
    setSelectedAluno(null);
  };

  // Filtrar alunos baseado na busca
  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    // Removida quebra de linha/espaço entre MenuPersonal e main para evitar erro de hidratação
    <div style={{ display: 'flex' }}>
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
        
        {loading && <div className="personal-loading">Carregando alunos...</div>}
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
                filteredAlunos.map(aluno => ( 
                  <tr key={aluno.id}>
                    <td>{aluno.nome || 'N/A'}</td>
                    <td>{aluno.email || 'N/A'}</td>
                    <td>{aluno.perfil || 'Aluno'}</td> {/* Exibe o perfil (ALUNO ou PROFESSOR) */}
                    <td>
                      {/* LÓGICA CORRIGIDA: Verifica o CAMPO PLANO */}
                      {aluno.plano === 'GOLD' ? (
                        <button
                          className="personal-treino-link"
                          onClick={(e) => { e.preventDefault(); handleOpenModal(aluno); }}
                          aria-label={`Gerenciar treino de ${aluno.nome}`}
                        >
                          Gerenciar
                        </button>
                      ) : (
                        // Renderiza um fragmento vazio (nada) se não for GOLD
                        <></> 
                      )}
                      
                      {selectedTreinos[aluno.id] && (
                        <div className="treino-chosen-personal" title={`Treino escolhido: ${selectedTreinos[aluno.id].title}`}>
                          <span className="treino-dot-personal" aria-hidden="true" />
                          <span className="treino-title-personal">{selectedTreinos[aluno.id].title}</span>
                        </div>
                      )}
                    </td>
                    {/* Removido <td> extra */}
                  </tr>
                ))
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