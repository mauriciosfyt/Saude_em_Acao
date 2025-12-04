import React, { useState, useEffect } from 'react';
import './GerenciarPersonal.css';
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { Link } from 'react-router-dom';
import { getAllProfessores, deleteProfessor } from '../../../services/usuarioService';
import { useAuth } from '../../../contexts/AuthContext';

// --- REACT TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Excluido.css'; // Importação do CSS personalizado para Exclusão
// --- FIM REACT TOASTIFY ---

// --- IMPORTAÇÃO DO MODAL E LOGO (NOVO) ---
import ModalConfirmacao from '../../../components/ModalConfirmacao/ModalConfirmacao';
import logoEmpresa from '../../../assets/logo.png'; // Caminho padronizado conforme seus outros arquivos
// -----------------------------------------

// Ícone de busca
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const GerenciarPersonal = () => {
  const { user } = useAuth();
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- NOVOS STATES PARA O MODAL DE EXCLUSÃO ---
  const [modalExclusaoOpen, setModalExclusaoOpen] = useState(false);
  const [personalParaExcluir, setPersonalParaExcluir] = useState(null);
  // ---------------------------------------------

  // Buscar professores da API
  const fetchProfessores = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔐 Iniciando busca de professores...');
      
      const professoresData = await getAllProfessores();
      console.log('📦 Dados brutos da API:', professoresData);
      
      // Verificar se é um array
      if (!Array.isArray(professoresData)) {
        console.warn('⚠️ A API não retornou um array:', professoresData);
        setProfessores([]);
        return;
      }
      
      // Ajuste: escolher um identificador disponível (id, _id, cpf, email, etc.)
      const professoresFormatados = professoresData.map(professor => {
        const resolvedId = professor.id ?? professor._id ?? professor.cpf ?? professor.cpfProfessor ?? professor.email ?? null;
        return {
          id: resolvedId,
          nome: professor.nome || professor.nomeCompleto || professor.nomeUsuario || 'N/A',
          email: professor.email || 'N/A',
          funcao: professor.funcao || 'Personal',
          status: 'Ativo'
        };
      });
      
      console.log('👥 Professores formatados:', professoresFormatados);
      setProfessores(professoresFormatados);
      
    } catch (err) {
      console.error('❌ Erro detalhado ao carregar professores:', err);
      setError(`Erro ao carregar lista de personais: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  // --- LÓGICA REFATORADA PARA O MODAL ---

  // 1. Apenas abre o modal e guarda quem será excluído
  const abrirModalExclusao = (personal) => {
    setPersonalParaExcluir(personal);
    setModalExclusaoOpen(true);
  };

  // 2. Fecha o modal e limpa a seleção
  const fecharModalExclusao = () => {
    setModalExclusaoOpen(false);
    setPersonalParaExcluir(null);
  };

  // 3. Executa a lógica de exclusão (chamada pelo botão Confirmar do modal)
  const confirmarExclusaoReal = async () => {
    if (!personalParaExcluir) return;

    // Fecha o modal visualmente antes de processar
    setModalExclusaoOpen(false);

    try {
      await deleteProfessor(personalParaExcluir.id);
      fetchProfessores(); // Atualiza a lista após excluir
      
      // Toast de Sucesso (mantendo sua configuração original)
      toast.success('Excluído com sucesso!', {
        className: 'custom-delete-toast',
        progressClassName: 'custom-delete-progress-bar',
        autoClose: 2000,
      });
      
    } catch (err) {
      console.error('Erro ao excluir personal:', err);
      // Toast de erro
      toast.error(`2rro ao excluir personal: ${err.message}`, {
        autoClose: 5000,
        className: 'custom-error-toast',
        progressClassName: 'custom-error-progress-bar',
      });
    } finally {
      setPersonalParaExcluir(null);
    }
  };
  // -------------------------------------

  // Filtrar personais baseado na busca
  const filteredPersonais = professores.filter(personal =>
    personal.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    personal.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="personal-content-wrapper">
        <div className="personal-header">
          <h1 className="personal-title">Personal</h1>
          
          <div className="personal-search-container">
            <SearchIcon />
            <input 
              className="personal-search-input" 
              type="text" 
              placeholder="Pesquisar nome do personal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/AdicionarPersonal" className="personal-add-button-link">
            <button className="personal-add-button">Novo Personal</button>
          </Link>
        </div>

        {/* Estados de loading e erro */}
        {loading && (
          <div className="personal-loading">
            <div className="loading-spinner"></div>
            Carregando personais...
          </div>
        )}
        
        {error && (
          <div className="personal-error">
            <strong>Erro:</strong> {error}
            <button 
              onClick={fetchProfessores}
              className="retry-button"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <table className="personal-table">
              <thead className="personal-thead">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className="personal-tbody">
                {filteredPersonais.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      {searchTerm ? 'Nenhum personal encontrado para a pesquisa.' : 'Nenhum personal cadastrado.'}
                    </td>
                  </tr>
                ) : (
                  filteredPersonais.map(personal => (
                    <tr key={personal.id || personal.email || Math.random()}>
                      <td>{personal.nome}</td>
                      <td>{personal.email}</td>
                      <td>{personal.funcao}</td>
                      <td>
                        <span className="personal-status-text">{personal.status}</span>
                      </td>
                      <td>
                        <Link 
                          to={personal.id ? `/EditarPersonal/${personal.id}` : `/EditarPersonal/sem-id`}
                          className="personal-action-link-edit"
                        >
                          Editar
                        </Link>
                        
                        {/* BOTÃO EXCLUIR ALTERADO PARA ABRIR O MODAL */}
                        <button 
                          className="personal-action-link-delete"
                          onClick={() => abrirModalExclusao(personal)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              color: '#666',
              textAlign: 'center'
            }}>
       
            </div>
          </>
        )}
        {/* Componente ToastContainer para exibir as notificações */}
        <ToastContainer />

        {/* --- MODAL DE EXCLUSÃO (NOVO) --- */}
        <ModalConfirmacao
          isOpen={modalExclusaoOpen}
          onClose={fecharModalExclusao}
          onConfirm={confirmarExclusaoReal}
          title="Excluir Personal"
          message={
            personalParaExcluir 
              ? `Tem certeza que deseja excluir o personal ${personalParaExcluir.nome}?` 
              : 'Tem certeza?'
          }
          logoSrc={logoEmpresa}
          confirmLabel="Sim, Excluir"
          cancelLabel="Cancelar"
        />
        {/* -------------------------------- */}

      </main>
    </div>
  );
};

export default GerenciarPersonal;