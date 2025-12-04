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

  // Normaliza nomes de dia para uma forma canônica usada internamente
  const normalizarDia = (dia) => {
    if (!dia) return '';
    const up = String(dia).toUpperCase();
    if (up.includes('SEGUNDA')) return 'Segunda';
    if (up.includes('TERCA') || up.includes('TERÇA')) return 'Terça';
    if (up.includes('QUARTA')) return 'Quarta';
    if (up.includes('QUINTA')) return 'Quinta';
    if (up.includes('SEXTA')) return 'Sexta';
    if (up.includes('SABADO') || up.includes('SÁBADO')) return 'Sábado';
    if (up.includes('DOMINGO')) return 'Domingo';
    return String(dia);
  };

  // Cria uma chave única para o treino baseada na data de hoje
  const criarChaveTreino = (dia) => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const data = String(hoje.getDate()).padStart(2, '0');
    const dataPadrao = `${ano}-${mes}-${data}`;
    const canon = normalizarDia(dia);
    return `${dataPadrao}_${canon}`;
  };

  const marcarTreinoComoConcluido = (dia) => {
    const chave = criarChaveTreino(dia);
    console.log('DEBUG: marcarTreinoComoConcluido recebido:', dia, '->', chave);
    console.log('DEBUG: treinosConcluidos antes:', Array.from(treinosConcluidos));
    setTreinosConcluidos(prev => {
      const novoSet = new Set(prev);
      if (chave) novoSet.add(chave);
      console.log('DEBUG: treinosConcluidos depois:', Array.from(novoSet));
      return novoSet;
    });
    // Remove do set de incompletos se estiver lá
    setTreinosIncompletos(prev => {
      const novoSet = new Set(prev);
      if (chave) novoSet.delete(chave);
      return novoSet;
    });
  };

  // Reseta os sets de treinos concluídos/incompletos (útil ao recarregar do servidor)
  const resetarTreinos = () => {
    if (__DEV__) console.log('DEBUG: resetando treinos concluidos e incompletos');
    setTreinosConcluidos(new Set());
    setTreinosIncompletos(new Set());
  };

  const marcarTreinoComoIncompleto = (dia) => {
    const chave = criarChaveTreino(dia);
    console.log('DEBUG: marcando treino como incompleto recebido:', dia, '->', chave);
    setTreinosIncompletos(prev => {
      const novoSet = new Set(prev);
      if (chave) novoSet.add(chave);
      console.log('DEBUG: treinosIncompletos depois:', Array.from(novoSet));
      return novoSet;
    });
    // Remove do set de concluídos se estiver lá
    setTreinosConcluidos(prev => {
      const novoSet = new Set(prev);
      if (chave) novoSet.delete(chave);
      return novoSet;
    });
  };

  const isTreinoConcluido = (dia) => {
    const chave = criarChaveTreino(dia);
    return treinosConcluidos.has(chave);
  };

  const isTreinoIncompleto = (dia) => {
    const chave = criarChaveTreino(dia);
    return treinosIncompletos.has(chave);
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
    resetarTreinos,
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