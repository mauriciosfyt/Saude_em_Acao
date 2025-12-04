import React, { createContext, useContext, useState } from 'react';

const TreinosContext = createContext();

export const useTreinos = () => {
  const context = useContext(TreinosContext);
  if (!context) {
    throw new Error('useTreinos deve ser usado dentro de TreinosProvider');
  }
  return context;
};

export const TreinosProvider = ({ children }) => {
  const [treinosConcluidos, setTreinosConcluidos] = useState(new Set());
  const [treinosIncompletos, setTreinosIncompletos] = useState(new Set());
  // Guarda progresso dos treinos por chave (pode ser treinoKey, data etc.)
  const [progressoTreinosMap, setProgressoTreinosMap] = useState({});
  // Guarda últimas realizações locais para mostrar no Desempenho
  const [ultimasRealizacoes, setUltimasRealizacoes] = useState([]);
  // Guarda datas únicas (YYYY-MM-DD) dos dias que tiveram treino realizado
  const [diasComTreinoRealizado, setDiasComTreinoRealizado] = useState(new Set());

  const marcarTreinoComoConcluido = (dia) => {
    setTreinosConcluidos(prev => {
      const novoSet = new Set([...prev, dia]);
      return novoSet;
    });
    // Remove do set de incompletos se estiver lá
    setTreinosIncompletos(prev => {
      const novoSet = new Set(prev);
      novoSet.delete(dia);
      return novoSet;
    });
  };

  const marcarTreinoComoIncompleto = (dia) => {
    setTreinosIncompletos(prev => {
      const novoSet = new Set([...prev, dia]);
      return novoSet;
    });
    // Remove do set de concluídos se estiver lá
    setTreinosConcluidos(prev => {
      const novoSet = new Set(prev);
      novoSet.delete(dia);
      return novoSet;
    });
  };

  const isTreinoConcluido = (dia) => {
    return treinosConcluidos.has(dia);
  };

  const isTreinoIncompleto = (dia) => {
    return treinosIncompletos.has(dia);
  };

  // Salva o progresso para um treino específico (p. ex. lista de exercícios completados)
  const salvarProgresso = (treinoKey, progresso) => {
    try {
      setProgressoTreinosMap(prev => ({ ...prev, [treinoKey]: progresso }));
    } catch (err) {
      // ignore save errors to avoid breaking UI flow
    }
  };

  // Obtém o progresso salvo para uma chave de treino
  const obterProgresso = (treinoKey) => {
    return progressoTreinosMap ? progressoTreinosMap[treinoKey] : undefined;
  };

  // Registra localmente a realização de um treino (ids e nomes dos exercícios)
  const registrarRealizacaoLocal = (treinoKey, exercicios = [], nomes = [], data = null) => {
    try {
      const dataRealizacao = data ? new Date(data) : new Date();
      const registro = {
        treinoKey: String(treinoKey || ''),
        exercicios: Array.isArray(exercicios) ? exercicios : [],
        nomes: Array.isArray(nomes) ? nomes : [],
        data: dataRealizacao,
      };
      setUltimasRealizacoes(prev => {
        // Mesclar registros existentes do mesmo treinoKey e mesma data (YYYY-MM-DD)
        const dia = dataRealizacao.toISOString().split('T')[0];
        const novoArray = [...prev];
        let merged = false;

        for (let i = 0; i < novoArray.length; i++) {
          const r = novoArray[i];
          if (!r) continue;
          const rDia = new Date(r.data).toISOString().split('T')[0];
          if (String(r.treinoKey) === String(registro.treinoKey) && rDia === dia) {
            // Mesclar IDs de exercícios (únicos)
            const ids = Array.from(new Set([...(Array.isArray(r.exercicios) ? r.exercicios : []), ...(Array.isArray(registro.exercicios) ? registro.exercicios : [])]));
            // Mesclar nomes de exercícios (mantendo ordem, únicos)
            const nomesExistentes = Array.isArray(r.nomes) ? r.nomes : [];
            const novosNomes = Array.isArray(registro.nomes) ? registro.nomes : [];
            const nomesUnicos = Array.from(new Set([...nomesExistentes, ...novosNomes]));

            novoArray[i] = {
              treinoKey: String(registro.treinoKey),
              exercicios: ids,
              nomes: nomesUnicos,
              // manter a data mais recente para exibição
              data: registro.data > new Date(r.data) ? registro.data : new Date(r.data),
            };
            merged = true;
            break;
          }
        }

        if (!merged) {
          novoArray.unshift(registro);
        }

        // limitar a 20 registros para evitar crescimento infinito
        return novoArray.slice(0, 20);
      });
      
      // Registrar a data como dia com treino realizado (formato YYYY-MM-DD)
      const diaFormatado = dataRealizacao.toISOString().split('T')[0];
      setDiasComTreinoRealizado(prev => {
        const novo = new Set(prev);
        novo.add(diaFormatado);
        return novo;
      });
      
      // Também salvar como progresso (para compatibilidade)
      if (registro.treinoKey) {
        setProgressoTreinosMap(prev => ({ ...prev, [registro.treinoKey]: registro.exercicios }));
      }
      // realização registrada localmente
    } catch (err) {
      // ignorando erro local de registro para não interromper o fluxo
    }
  };

  const obterUltimasRealizacoes = () => {
    return ultimasRealizacoes;
  };

  const obterDiasComTreinoRealizado = () => {
    return Array.from(diasComTreinoRealizado);
  };

  const obterTotalDiasComTreinoRealizado = () => {
    return diasComTreinoRealizado.size;
  };

  const value = {
    treinosConcluidos,
    treinosIncompletos,
    progressoTreinos: progressoTreinosMap,
    marcarTreinoComoConcluido,
    marcarTreinoComoIncompleto,
    isTreinoConcluido,
    isTreinoIncompleto,
    salvarProgresso,
    obterProgresso,
    registrarRealizacaoLocal,
    obterUltimasRealizacoes,
    obterDiasComTreinoRealizado,
    obterTotalDiasComTreinoRealizado,
  };

  return (
    <TreinosContext.Provider value={value}>
      {children}
    </TreinosContext.Provider>
  );
};