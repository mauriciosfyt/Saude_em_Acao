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

  const marcarTreinoComoConcluido = (dia) => {
  
    console.log('DEBUG: treinosConcluidos antes:', Array.from(treinosConcluidos));
    setTreinosConcluidos(prev => {
      const novoSet = new Set([...prev, dia]);
      console.log('DEBUG: treinosConcluidos depois:', Array.from(novoSet));
      return novoSet;
    });
  };

  const isTreinoConcluido = (dia) => {
    return treinosConcluidos.has(dia);
  };

  const value = {
    treinosConcluidos,
    marcarTreinoComoConcluido,
    isTreinoConcluido,
  };

  return (
    <TreinosContext.Provider value={value}>
      {children}
    </TreinosContext.Provider>
  );
};
