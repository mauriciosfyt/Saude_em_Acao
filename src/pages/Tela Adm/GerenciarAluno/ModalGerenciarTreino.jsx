import React, { useState, useMemo, useEffect } from 'react';
import './ModalGerenciarTreino.css';
import { getAllTreinos } from '../../../services/treinoService';
import { patchAddTreinoToAluno } from '../../../services/usuarioService';

const ModalGerenciarTreino = ({ open, onClose, aluno, alunoId, onChoose }) => {
  const [nameQuery, setNameQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alunoIdSalvo, setAlunoIdSalvo] = useState(null);

  // Controla o scroll do body e salva o alunoId quando o modal abrir
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Resetar seleção quando o modal abrir para um novo aluno
      setSelectedId(null);
      // Salvar o alunoId (prioridade: prop alunoId > aluno.id > aluno.idAluno > aluno.usuarioId)
      const idParaSalvar = alunoId || 
        (aluno?.id && String(aluno.id)) ||
        (aluno?.idAluno && String(aluno.idAluno)) ||
        (aluno?.usuarioId && String(aluno.usuarioId)) ||
        null;
      console.log('🔵 Modal abrindo - Salvando alunoId:', {
        alunoIdProp: alunoId,
        alunoIdDoAluno: aluno?.id,
        alunoIdAluno: aluno?.idAluno,
        alunoUsuarioId: aluno?.usuarioId,
        idParaSalvar,
        alunoCompleto: aluno
      });
      setAlunoIdSalvo(idParaSalvar);
    } else {
      // Limpar quando o modal fechar
      console.log('🔴 Modal fechando - Limpando alunoIdSalvo');
      setAlunoIdSalvo(null);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open, alunoId, aluno]);

  // Atualizar o alunoIdSalvo sempre que o alunoId ou aluno mudar
  useEffect(() => {
    const idParaSalvar = alunoId || 
      (aluno?.id && String(aluno.id)) ||
      (aluno?.idAluno && String(aluno.idAluno)) ||
      (aluno?.usuarioId && String(aluno.usuarioId)) ||
      null;
    if (idParaSalvar) {
      console.log('🟡 Atualizando alunoIdSalvo:', {
        alunoIdProp: alunoId,
        alunoIdDoAluno: aluno?.id,
        alunoIdAluno: aluno?.idAluno,
        alunoUsuarioId: aluno?.usuarioId,
        idParaSalvar,
        alunoIdSalvoAtual: alunoIdSalvo
      });
      setAlunoIdSalvo(idParaSalvar);
    }
  }, [alunoId, aluno?.id, aluno?.idAluno, aluno?.usuarioId]);

  // Resetar seleção quando o aluno mudar
  useEffect(() => {
    if (open && aluno) {
      setSelectedId(null);
    }
  }, [aluno?.id, open]);

  // Carregar treinos da API quando o modal abrir
  useEffect(() => {
    const carregarTreinos = async () => {
      if (open) {
        try {
          setLoading(true);
          setError(null);
          
          const filtros = {};
          if (nameQuery.trim()) filtros.nome = nameQuery.trim();
          if (typeQuery.trim()) filtros.tipo = typeQuery.trim();
          
          const dados = await getAllTreinos(filtros);
          setTreinos(Array.isArray(dados) ? dados : []);
        } catch (err) {
          console.error('Erro ao carregar treinos:', err);
          setError(err.message || 'Erro ao carregar treinos');
          setTreinos([]);
        } finally {
          setLoading(false);
        }
      }
    };
    
    carregarTreinos();
  }, [open, nameQuery, typeQuery]);

  // Formatar dados do treino para exibição (mesma função da tela GerenciarTreino)
  const formatarTreinoParaExibicao = (treino) => {
    const titulo = treino.nome || treino.titulo || 'Treino sem nome';
    
    const tags = [];
    if (treino.tipoDeTreino || treino.tipoTreino || treino.tipo) {
      tags.push(treino.tipoDeTreino || treino.tipoTreino || treino.tipo);
    }
    if (treino.sexo) {
      const sexoTexto = treino.sexo === 'MASCULINO' ? 'Masculino' : 
                       treino.sexo === 'FEMININO' ? 'Feminino' : 
                       treino.sexo;
      tags.push(sexoTexto);
    }
    if (treino.idadeMinima || treino.idadeMin) {
      const idadeMin = treino.idadeMinima || treino.idadeMin;
      const idadeMax = treino.idadeMaxima || treino.idadeMax;
      if (idadeMin && idadeMax) {
        tags.push(`De ${idadeMin} a ${idadeMax} anos`);
      } else if (idadeMin) {
        tags.push(`Acima de ${idadeMin} anos`);
      } else if (idadeMax) {
        tags.push(`Até ${idadeMax} anos`);
      }
    }
    
    return {
      id: treino.id,
      titulo,
      tags,
      ...treino
    };
  };

  const treinosFiltrados = useMemo(() => {
    return treinos.map(formatarTreinoParaExibicao);
  }, [treinos]);

  const handleChoose = () => {
    console.log('🟢 handleChoose chamado:', {
      selectedId,
      alunoIdSalvo,
      alunoIdProp: alunoId,
      alunoIdDoAluno: aluno?.id,
      alunoCompleto: aluno,
      open
    });
    
    if (!selectedId) {
      alert('Por favor, selecione um treino antes de escolher.');
      return;
    }
    
    // Usar o alunoId salvo (prioridade: alunoIdSalvo > prop alunoId > aluno.id > aluno.idAluno > aluno.usuarioId)
    const alunoIdFinal = alunoIdSalvo || alunoId || 
      (aluno?.id && String(aluno.id)) ||
      (aluno?.idAluno && String(aluno.idAluno)) ||
      (aluno?.usuarioId && String(aluno.usuarioId)) ||
      null;
    
    console.log('🔍 Verificando alunoIdFinal:', {
      alunoIdFinal,
      alunoIdSalvo,
      alunoIdProp: alunoId,
      alunoIdDoAluno: aluno?.id,
      resultadoFinal: alunoIdFinal ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO'
    });
    
    // Se não tiver alunoId, não pode continuar
    if (!alunoIdFinal) {
      console.error('❌ Aluno não disponível - DETALHES COMPLETOS:', { 
        aluno, 
        alunoIdSalvo, 
        alunoIdProp: alunoId,
        alunoIdDoAluno: aluno?.id,
        open,
        selectedId,
        treinosLength: treinos.length
      });
      alert('Erro: Aluno não encontrado. Por favor, feche o modal e tente novamente.');
      return;
    }
    
    // Buscar o treino no array original (treinos) usando o selectedId
    // Tentar diferentes formas de comparação para garantir que encontre
    let selectedTreino = treinos.find(t => t.id === selectedId);
    
    if (!selectedTreino) {
      // Tentar comparação numérica
      selectedTreino = treinos.find(t => Number(t.id) === Number(selectedId));
    }
    
    if (!selectedTreino) {
      // Tentar comparação por string
      selectedTreino = treinos.find(t => String(t.id) === String(selectedId));
    }
    
    if (!selectedTreino) {
      console.error('Treino não encontrado:', { selectedId, treinos });
      alert('Erro: Treino selecionado não encontrado. Tente novamente.');
      return;
    }
    // Chamar API PATCH para associar treino ao aluno
    (async () => {
      try {
        setSaving(true);
        await patchAddTreinoToAluno(alunoIdFinal, selectedTreino.id ?? selectedId);
        // Opcional: informar o componente pai que houve escolha
        onChoose(selectedTreino, alunoIdFinal);
        // Limpar seleção após escolher
        setSelectedId(null);
        // Fechar o modal após escolher
        handleCloseModal();
        alert('Treino associado ao aluno com sucesso.');
      } catch (err) {
        console.error('Erro ao associar treino ao aluno:', err);
        alert('Erro ao associar treino ao aluno: ' + (err.message || err));
      } finally {
        setSaving(false);
      }
    })();
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setNameQuery('');
    setTypeQuery('');
    onClose();
  };

  // Se não estiver aberto, não renderiza nada
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title-adm">Gerenciar Treinos do Aluno: {aluno?.nome || ''}</h2>

        <div className="modal-filters">
          <div className="modal-filter-group">
            <input
              className="modal-input-adm"
              placeholder="Nome"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
            />
            <div className="modal-input-underline"></div>
          </div>

          <div className="modal-filter-group">
            <input
              className="modal-input-adm"
              placeholder="Tipo do treino"
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)}
            />
            <div className="modal-input-underline"></div>
          </div>
        </div>

        <div className="modal-list">
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>Carregando treinos...</div>
          )}

          {error && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
              Erro: {error}
            </div>
          )}

          {!loading && !error && treinosFiltrados.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Nenhum treino encontrado.
            </div>
          )}

          {!loading && !error && treinosFiltrados.map((treino) => {
            // Usar o ID original do treino para evitar problemas de conversão
            const treinoId = treino.id;
            const isSelected = selectedId !== null && (
              selectedId === treinoId || 
              Number(selectedId) === Number(treinoId) ||
              String(selectedId) === String(treinoId)
            );
            
            const handleCardClick = () => {
              setSelectedId(treinoId);
            };
            
            const handleRadioChange = (e) => {
              e.stopPropagation();
              setSelectedId(treinoId);
            };
            
            return (
            <div 
              className={`modal-item-card ${isSelected ? 'radio-selected' : ''}`} 
              key={treino.id}
              onClick={handleCardClick}
            >
              <div className="modal-item-row">
                <input 
                  type="radio" 
                  name="treino-select" 
                  checked={isSelected} 
                  onChange={handleRadioChange}
                  onClick={handleRadioChange}
                />
                <div className="modal-item-content">
                  <div className="modal-item-title">{treino.titulo}</div>
                  <div className="modal-item-tags">
                    {(treino.tags || []).map((tag, i) => (
                      <span className="modal-tag" key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="btn btn-back" onClick={handleCloseModal}>Voltar</button>
          <button className="btn btn-choose" onClick={handleChoose} disabled={!selectedId || saving}>
            {saving ? 'Associando...' : 'Escolher'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGerenciarTreino;