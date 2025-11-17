import React, { useState, useEffect } from 'react';
import './GerenciarAlunos.css';
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { Link } from 'react-router-dom';
import ModalGerenciarTreino from './ModalGerenciarTreino';
import { getAllAlunos, deleteAluno } from '../../../services/usuarioService'; // Importar as funções da API
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
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [selectedTreinos, setSelectedTreinos] = useState({});

  

  // Buscar alunos da API
  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(' Token sendo usado:', user?.token);
      const alunosData = await getAllAlunos();
      console.log('📊 Dados recebidos da API:', alunosData);
      console.log('📊 Tipo dos dados:', typeof alunosData);
      console.log('📊 É array?', Array.isArray(alunosData));
      if (alunosData && alunosData.length > 0) {
        console.log('📊 Primeiro aluno:', alunosData[0]);
        console.log('📊 Campos do primeiro aluno:', Object.keys(alunosData[0]));
      }
      setAlunos(Array.isArray(alunosData) ? alunosData : []);
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
    console.log('🟦 handleOpenModal chamado:', {
      aluno,
      alunoId: aluno?.id,
      alunoNome: aluno?.nome,
      tipoAlunoId: typeof aluno?.id
    });
    
    // Validação mais flexível - verificar se temos pelo menos um identificador
    if (!aluno) {
      console.error('❌ Aluno é null ou undefined:', aluno);
      alert('Erro: Dados do aluno não disponíveis.');
      return;
    }
    
    // Tentar obter o ID de várias formas possíveis
    let alunoIdValue = aluno.id || aluno.idAluno || aluno.usuarioId;
    
    if (!alunoIdValue) {
      console.error('❌ Aluno sem ID válido:', aluno);
      console.log('Campos disponíveis no aluno:', Object.keys(aluno));
      alert('Erro: ID do aluno não encontrado. Por favor, recarregue a página.');
      return;
    }
    
    const alunoIdString = String(alunoIdValue);
    console.log('✅ Configurando modal:', {
      alunoId: alunoIdString,
      alunoNome: aluno.nome || 'Sem nome',
      alunoCompleto: aluno
    });
    
    setSelectedAluno(aluno);
    setSelectedAlunoId(alunoIdString); // Salvar o ID separadamente
    setModalOpen(true);
    
    console.log('✅ Modal aberto - Estados atualizados');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Não limpar selectedAluno imediatamente, deixar para o handleChooseTreino limpar após processar
  };

  const handleChooseTreino = (treino, alunoIdFromModal) => {
    // Usar o alunoId do modal se fornecido, caso contrário usar o selectedAluno
    let alunoId;
    
    if (alunoIdFromModal) {
      alunoId = String(alunoIdFromModal);
      console.log('Usando alunoId do modal:', alunoId);
    } else if (selectedAluno && selectedAluno.id) {
      alunoId = String(selectedAluno.id);
      console.log('Usando alunoId do selectedAluno:', alunoId);
    } else {
      console.error('Nenhum aluno ID disponível para atribuir treino');
      alert('Erro: Nenhum aluno selecionado.');
      return;
    }
    
    console.log('Escolhendo treino para aluno ID:', alunoId, 'Treino ID:', treino.id, 'Nome do treino:', treino.nome);
    
    // Criar objeto com dados formatados para exibição
    const treinoFormatado = {
      ...treino,
      id: treino.id,
      title: treino.nome || treino.titulo || 'Treino sem nome',
      titulo: treino.nome || treino.titulo || 'Treino sem nome',
      nome: treino.nome || treino.titulo || 'Treino sem nome'
    };
    
    console.log('Treino formatado:', treinoFormatado);
    
    // Garantir que estamos usando o ID correto do aluno e criando um novo objeto
    setSelectedTreinos(prev => {
      // Criar um novo objeto completamente novo para evitar referências compartilhadas
      const novoEstado = {};
      
      // Copiar todos os treinos anteriores, garantindo que não compartilhem referências
      Object.keys(prev).forEach(key => {
        novoEstado[key] = { ...prev[key] };
      });
      
      // Atribuir o novo treino apenas para este aluno específico
      novoEstado[alunoId] = treinoFormatado;
      
      console.log('Estado anterior:', prev);
      console.log('Novo estado de treinos:', novoEstado);
      console.log('Treino atribuído ao aluno ID:', alunoId);
      console.log('Verificação: novoEstado[alunoId] =', novoEstado[alunoId]);
      
      return novoEstado;
    });
    
    // O modal já fecha automaticamente no handleChoose do modal
    // Limpar selectedAluno após processar o treino
    setSelectedAluno(null);
    setSelectedAlunoId(null);
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

        {/* Estados de loading e erro */}
        {loading && <div className="alunos-loading">Carregando alunos...</div>}
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
                  // Garantir que o ID seja uma string para comparação consistente
                  // Tentar obter o ID de várias formas possíveis
                  const alunoIdValue = aluno.id || aluno.idAluno || aluno.usuarioId;
                  const alunoId = alunoIdValue ? String(alunoIdValue) : null;
                  const treinoDoAluno = alunoId ? selectedTreinos[alunoId] : null;
                  
                  // Debug: verificar se o treino está sendo encontrado
                  if (treinoDoAluno) {
                    console.log(`Aluno ${alunoId} (${aluno.nome}) tem treino:`, treinoDoAluno);
                  }
                  
                  return (
                    <tr key={aluno.id}>
                      <td>{aluno.nome || 'N/A'}</td>
                      <td>{aluno.email || 'N/A'}</td>
                      <td>{aluno.funcao || 'Aluno'}</td>
                      <td>
                        <button
                          className="alunos-treino-link"
                          onClick={() => handleOpenModal(aluno)}
                          aria-label={`Gerenciar treino de ${aluno.nome}`}
                        >
                          Gerenciar
                        </button>
                        {treinoDoAluno && (
                          <div className="treino-chosen" title={`Treino escolhido: ${treinoDoAluno.title || treinoDoAluno.titulo || treinoDoAluno.nome}`}>
                            <span className="treino-dot" aria-hidden="true" />
                            <span className="treino-title">
                              {treinoDoAluno.title || treinoDoAluno.titulo || treinoDoAluno.nome}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/editar-aluno/${aluno.id}`} 
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
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </main>

      <ModalGerenciarTreino 
        open={modalOpen} 
        onClose={handleCloseModal} 
        aluno={selectedAluno}
        alunoId={selectedAlunoId}
        onChoose={handleChooseTreino} 
      />
    </div>
  );
};

export default GerenciarAlunos;