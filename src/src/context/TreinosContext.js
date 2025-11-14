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

  const value = {
    treinosConcluidos,
    treinosIncompletos,
    marcarTreinoComoConcluido,
    marcarTreinoComoIncompleto,
    isTreinoConcluido,
    isTreinoIncompleto,
  };

  return (
    <TreinosContext.Provider value={value}>
      {children}
    </TreinosContext.Provider>
  );
};