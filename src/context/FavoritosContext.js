import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { obterFavoritos, adicionarFavorito as adicionarFavoritoAPI, removerFavorito as removerFavoritoAPI } from '../Services/api';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const FAVORITOS_STORAGE_KEY = '@app:favoritos_v1';
  const [usingCache, setUsingCache] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Carregar favoritos da API quando o usuário estiver autenticado
  useEffect(() => {
    // Aguarda o AuthContext terminar de carregar antes de tentar buscar favoritos
    if (authLoading) {
      return;
    }

    let cancelled = false; // Flag para cancelar se o componente desmontar

    const carregarFavoritos = async () => {
      // Primeiro, pega favoritos do cache local (se houver)
      const STORAGE_KEY = FAVORITOS_STORAGE_KEY;
      let savedFromStorage = [];
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) savedFromStorage = JSON.parse(raw);
      } catch (e) {
        // falha ao ler favoritos do AsyncStorage
      }
      if (!isAuthenticated) {
        // Se não estiver autenticado, limpa os favoritos
        if (!cancelled) {
          setFavoritos([]);
          setLoading(false);
        }
        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
        }
        
        const dados = await obterFavoritos();
        
        if (cancelled) return; // Se foi cancelado, não atualiza o estado
        
        // A API pode retornar um array direto ou um objeto com propriedade
        // Se a API retornou um objeto de fallback ({fallback: true, favoritos: []})
        const dadosReais = (dados && typeof dados === 'object' && dados.fallback) ? null : dados;

        const favoritosData = Array.isArray(dadosReais)
          ? dadosReais 
          : Array.isArray(dados?.favoritos) 
          ? dados.favoritos 
          : Array.isArray(dados?.data)
          ? dados.data
          : Array.isArray(dados?.produtos)
          ? dados.produtos
          : [];
        
        // Garantir que os dados estão no formato correto (com campos nome, preco, img)
        const favoritosFormatados = favoritosData
          .map(item => {
            // Se o item já tiver os campos corretos, retorna como está
            if (item && (item.nome || item.productName || item.name)) {
              return {
                ...item,
                // Garantir que temos os campos principais
                nome: item.nome || item.productName || item.name || 'Produto',
                preco: item.preco !== undefined ? item.preco : (item.price !== undefined ? item.price : 0),
                img: item.img || item.imagem || item.image || item.imagemUrl,
                // Manter o ID
                id: item.id || item.produtoId,
                // Manter outros campos que possam existir
              };
            }
            // Se for apenas um ID ou objeto incompleto, retorna como está
            return item;
          })
          .filter(item => item && (item.id || item.produtoId)); // Remove itens inválidos
        
        
        if (!cancelled) {
          // Se não vier nada da API (dadosReais === null ou array vazio) usamos cache local salvo
          if ((!favoritosData || favoritosData.length === 0) && Array.isArray(savedFromStorage) && savedFromStorage.length > 0) {
            setUsingCache(true);
            setFavoritos(savedFromStorage);
          } else {
            setFavoritos(favoritosFormatados);
            setUsingCache(false);
            // Salva no AsyncStorage para fallback futuro
            try {
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoritosFormatados));
            } catch (e) {
              // falha ao salvar favoritos no AsyncStorage
            }
          }

        }
      } catch (error) {
        if (cancelled) return;
        
        // Verifica se é erro 404 ou endpoint não encontrado
        const is404 = error?.response?.status === 404;
        const isNotFound = error?.message?.includes('No static resource') || 
                          error?.message?.includes('not found') ||
                          error?.message?.includes('404');
        
        if (is404 || isNotFound) {
          // Endpoint não existe - mantém favoritos locais
        } else {
          // Erro ao carregar favoritos (mantendo locais)
        }
        // Não limpa os favoritos locais em caso de erro (mantemos o cache local)
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    carregarFavoritos();

    // Cleanup: cancela a operação se o componente desmontar
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading]);

  const adicionarFavorito = useCallback(async (produto) => {
      try {
      // Validação: verifica se o produto é válido
      if (!produto) {
        return;
      }
      // Extrai o ID do produto - sempre usa o ID para salvar na API
      const produtoId = produto.id || produto.produtoId;
          if (!produtoId) {
        return;
      }

      // Normaliza o produtoId para comparação
      const produtoIdNormalizado = String(produtoId);
      
      // Verifica se o produto já está nos favoritos e adiciona se não estiver
      setFavoritos((prev) => {
        const jaExiste = prev.find((p) => {
          const pId = String(p.id || p.produtoId);
          return pId === produtoIdNormalizado;
        });
        if (jaExiste) {
          return prev; // Não adiciona novamente
        }

        // Garante que o produto tem os campos necessários
        const produtoFormatado = {
          ...produto,
          id: produtoId,
          nome: produto.nome || produto.productName || produto.name || 'Produto',
          preco: produto.preco !== undefined ? produto.preco : (produto.price !== undefined ? produto.price : 0),
          img: produto.img || produto.imagem || produto.image || produto.imagemUrl,
        };

        const novo = [...prev, produtoFormatado];
        // Persistir localmente (não bloquear a UI se falhar)
        AsyncStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(novo)).catch((e) => {
          // falha ao persistir favorito no AsyncStorage
        });
        return novo;
      });

      // Se estiver autenticado, sincroniza com a API usando apenas o ID
      if (isAuthenticated) {
        // Executa em background sem bloquear - sempre usa apenas o ID para a API
        adicionarFavoritoAPI(produtoId)
          .then((res) => {
            if (res && res.fallback) {
              setUsingCache(true);
            } else {
              setUsingCache(false);
            }
          })
          .catch((error) => {
          // Verifica se é erro 404 ou endpoint não encontrado
          const is404 = error?.response?.status === 404;
          const isNotFound = error?.message?.includes('No static resource') || 
                            error?.message?.includes('not found') ||
                            error?.message?.includes('404');
          
          // Não reverte - mantém o favorito local mesmo se a API falhar
        });
      }
    } catch (error) {
      // Captura qualquer erro inesperado (não propaga para não quebrar a UI)
    }
  }, [isAuthenticated]);

  const removerFavorito = useCallback(async (produtoId) => {
    try {
      // Validação: verifica se o produtoId é válido
      if (!produtoId) {
        // Attempt to remove favorite with invalid ID
        return Promise.resolve();
      }

      // Normaliza o produtoId para comparação (pode ser string ou número)
      const produtoIdNormalizado = String(produtoId);
      
      // Captura o produto antes de remover para possível reversão
      let produtoRemovido = null;
      setFavoritos((prev) => {
        produtoRemovido = prev.find((p) => {
          const pId = String(p.id || p.produtoId);
          return pId === produtoIdNormalizado;
        }) || null;
        const novo = prev.filter((p) => {
          const pId = String(p.id || p.produtoId);
          return pId !== produtoIdNormalizado;
        });
        // Persistir remoção local
        AsyncStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(novo)).catch((e) => {
          // falha ao persistir remoção de favorito no AsyncStorage
        });
        return novo;
      });

      // Se não encontrou o produto, já foi removido ou não existe
      if (!produtoRemovido) {
        return Promise.resolve();
      }

      // Se estiver autenticado, tenta sincronizar com a API em background
      // Nota: NÃO reverte a remoção local se a sincronização falhar — mantemos a remoção
      // local para uma experiência de usuário consistente. Erros de sync são logados
      // para diagnóstico, mas não afetam a lista visível.
      if (isAuthenticated) {
        removerFavoritoAPI(produtoId)
          .then((res) => {
            if (res && res.fallback) {
              setUsingCache(true);
            } else {
              setUsingCache(false);
            }
          })
          .catch((error) => {
          // Não reverte a remoção local — manter o produto fora da lista mesmo em falhas
        });
      }

      return Promise.resolve();
    } catch (error) {
      // Retorna uma Promise resolvida para não quebrar a UI
      return Promise.resolve();
    }
  }, [isAuthenticated]);

  return (
    <FavoritosContext.Provider value={{ favoritos, adicionarFavorito, removerFavorito, loading }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
