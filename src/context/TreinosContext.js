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

  const marcarTreinoComoConcluido = (dia) => {
    console.log('DEBUG: treinosConcluidos antes:', Array.from(treinosConcluidos));
    setTreinosConcluidos(prev => {
      const novoSet = new Set([...prev, dia]);
      console.log('DEBUG: treinosConcluidos depois:', Array.from(novoSet));
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
    console.log('DEBUG: marcando treino como incompleto:', dia);
    setTreinosIncompletos(prev => {
      const novoSet = new Set([...prev, dia]);
      console.log('DEBUG: treinosIncompletos depois:', Array.from(novoSet));
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
      console.log('DEBUG: progresso salvo para', treinoKey, progresso);
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  };

  // Obtém o progresso salvo para uma chave de treino
  const obterProgresso = (treinoKey) => {
    return progressoTreinosMap ? progressoTreinosMap[treinoKey] : undefined;
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
  };

  return (
    <TreinosContext.Provider value={value}>
      {children}
    </TreinosContext.Provider>
  );
};