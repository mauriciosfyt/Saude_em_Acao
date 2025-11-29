import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

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
  const [progressoTreinos, setProgressoTreinos] = useState({}); // { treinoKey: [exercicioId, ...] }
  const { user } = useAuth();

  // Carrega dados ao iniciar
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const userKey = (user && (user.email || user.claims?.sub || user.claims?.id)) || 'guest';
        const storageKey = `treinosData_${userKey}`;
        const dataString = await AsyncStorage.getItem(storageKey);
        const today = new Date().toDateString();

        if (dataString) {
          const { concluidos, incompletos, progresso, data } = JSON.parse(dataString) || {};

          // Se for um novo dia, limpa os dados para este usuário
          if (data !== today) {
            await AsyncStorage.setItem(storageKey, JSON.stringify({
              concluidos: [],
              incompletos: [],
              data: today,
            }));
            setTreinosConcluidos(new Set());
            setTreinosIncompletos(new Set());
          } else {
            // Restaura dados do mesmo dia
            setTreinosConcluidos(new Set(concluidos || []));
            setTreinosIncompletos(new Set(incompletos || []));
            setProgressoTreinos(progresso || {});
          }
        } else {
          // Nenhum dado salvo para este usuário — inicializa
          await AsyncStorage.setItem(storageKey, JSON.stringify({ concluidos: [], incompletos: [], progresso: {}, data: today }));
          setTreinosConcluidos(new Set());
          setTreinosIncompletos(new Set());
          setProgressoTreinos({});
        }
      } catch (error) {
        console.error('Erro ao carregar dados de treinos:', error);
      }
    };

    carregarDados();
  }, [user]);

  const marcarTreinoComoConcluido = (dia) => {
    console.log('DEBUG: treinosConcluidos antes:', Array.from(treinosConcluidos));
    setTreinosConcluidos(prev => {
      const novoSet = new Set([...prev, dia]);
      console.log('DEBUG: treinosConcluidos depois:', Array.from(novoSet));

      setTreinosIncompletos(incompletos => {
        const novosIncompletos = new Set(incompletos);
        novosIncompletos.delete(dia);

        const userKey = (user && (user.email || user.claims?.sub || user.claims?.id)) || 'guest';
        const storageKey = `treinosData_${userKey}`;

        AsyncStorage.setItem(storageKey, JSON.stringify({
          concluidos: Array.from(novoSet),
          incompletos: Array.from(novosIncompletos),
          progresso: progressoTreinos,
          data: new Date().toDateString(),
        })).catch(err => console.error('Erro ao salvar treinos:', err));

        return novosIncompletos;
      });

      return novoSet;
    });
  };

  const marcarTreinoComoIncompleto = (dia) => {
    console.log('DEBUG: marcando treino como incompleto:', dia);
    setTreinosIncompletos(prev => {
      const novoSet = new Set([...prev, dia]);
      console.log('DEBUG: treinosIncompletos depois:', Array.from(novoSet));
      // Salvar no AsyncStorage (por usuário)
      setTreinosConcluidos(concluidos => {
        const novosConcluidos = new Set(concluidos);
        novosConcluidos.delete(dia);

        const userKey = (user && (user.email || user.claims?.sub || user.claims?.id)) || 'guest';
        const storageKey = `treinosData_${userKey}`;

        AsyncStorage.setItem(storageKey, JSON.stringify({
          concluidos: Array.from(novosConcluidos),
          incompletos: Array.from(novoSet),
          progresso: progressoTreinos,
          data: new Date().toDateString(),
        })).catch(err => console.error('Erro ao salvar treinos:', err));

        return novosConcluidos;
      });

      return novoSet;
    });
  };

  const isTreinoConcluido = (dia) => {
    return treinosConcluidos.has(dia);
  };

  const isTreinoIncompleto = (dia) => {
    return treinosIncompletos.has(dia);
  };

  // Salva progresso parcial (ids dos exercícios) por treinoKey (treinoId ou dia)
  const salvarProgresso = (treinoKey, idsArray) => {
    const normalized = Array.isArray(idsArray) ? idsArray.map(String) : [];
    setProgressoTreinos(prev => {
      const novo = { ...(prev || {}), [treinoKey]: normalized };

      const userKey = (user && (user.email || user.claims?.sub || user.claims?.id)) || 'guest';
      const storageKey = `treinosData_${userKey}`;
      AsyncStorage.getItem(storageKey).then(dataString => {
        try {
          const parsed = dataString ? JSON.parse(dataString) : {};
          const concluidos = parsed?.concluidos || Array.from(treinosConcluidos);
          const incompletos = parsed?.incompletos || Array.from(treinosIncompletos);
          AsyncStorage.setItem(storageKey, JSON.stringify({
            concluidos: concluidos,
            incompletos: incompletos,
            progresso: novo,
            data: new Date().toDateString(),
          }));
        } catch (e) {
          AsyncStorage.setItem(storageKey, JSON.stringify({
            concluidos: Array.from(treinosConcluidos),
            incompletos: Array.from(treinosIncompletos),
            progresso: novo,
            data: new Date().toDateString(),
          }));
        }
      }).catch(err => console.error('Erro ao salvar progressoTreinos:', err));

      return novo;
    });
  };

  const obterProgresso = (treinoKey) => {
    return (progressoTreinos && progressoTreinos[treinoKey]) || [];
  };

  const value = {
    treinosConcluidos,
    treinosIncompletos,
    marcarTreinoComoConcluido,
    marcarTreinoComoIncompleto,
    isTreinoConcluido,
    isTreinoIncompleto,
    progressoTreinos,
    salvarProgresso,
    obterProgresso,
  };

  return (
    <TreinosContext.Provider value={value}>
      {children}
    </TreinosContext.Provider>
  );
};