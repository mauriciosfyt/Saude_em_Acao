// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// REMOVIDO: import { v4 as uuidv4 } from 'uuid'; 
// (Esta linha causou o erro 'crypto.getRandomValues()')

// ADICIONADO: Importar o "porteiro" (AuthContext)
import { useAuth } from './AuthContext'; // (Ajuste o caminho se necessário)

const CartContext = createContext();

const GUEST_CART_KEY = '@SenaMobile:cart:guest';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // "Ouvir" o AuthContext
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // chave dinâmica
    const [storageKey, setStorageKey] = useState(GUEST_CART_KEY);

    // MUDANÇA: Lógica de migração e carregamento
    useEffect(() => {
        if (authLoading) return; // Espera o AuthContext decidir
        
        const setup = async () => {
            let key = GUEST_CART_KEY; // Chave padrão
            try {
                if (isAuthenticated && user?.email) {
                    // Usuário está logado
                    const userCartKey = `@SenaMobile:cart:${user.email}`;
                    key = userCartKey;

                    const [guestJSON, userJSON] = await Promise.all([
                        AsyncStorage.getItem(GUEST_CART_KEY),
                        AsyncStorage.getItem(userCartKey)
                    ]);
                    
                    const guestCartRaw = guestJSON ? JSON.parse(guestJSON) : [];
                    const userCartRaw = userJSON ? JSON.parse(userJSON) : [];

                    // Normaliza itens antigos que podem ter campos formatados (ex: "R$ 12,00")
                    const normalizeLoadedItem = (it) => {
                        if (!it) return null;
                        const normalizePrice = (p) => {
                            if (p === undefined || p === null) return 0;
                            if (typeof p === 'number' && !isNaN(p)) return p;
                            if (typeof p === 'string') {
                                let s = p.replace(/R\$|\s/g, '').replace(/\./g, '').replace(/,/g, '.');
                                const n = parseFloat(s);
                                return isNaN(n) ? 0 : n;
                            }
                            return 0;
                        };

                        const normalizeImage = (img) => {
                            if (!img) return null;
                            if (typeof img === 'object' && img.uri) return img;
                            if (typeof img === 'string') return { uri: img };
                            return null;
                        };

                        return {
                            productName: it.productName || it.nome || it.title || 'Produto',
                            categoria: it.categoria,
                            id: it.id,
                            price: normalizePrice(it.price ?? it.preco ?? it.precoFormatado),
                            image: normalizeImage(it.image ?? it.img ?? it.imagem ?? it.imagemUrl),
                            quantity: Number.isFinite(Number(it.quantity)) ? Number(it.quantity) : 1,
                            selected: typeof it.selected === 'boolean' ? it.selected : true,
                            variationValue: it.variationValue ?? null,
                            cartItemId: it.cartItemId ?? `${it.id}-${it.variationValue ?? 'null'}-${Date.now()}`,
                        };
                    };

                    const guestCart = guestCartRaw.map(normalizeLoadedItem).filter(Boolean);
                    const userCart = userCartRaw.map(normalizeLoadedItem).filter(Boolean);

                    if (guestCart.length > 0) {
                        // --- Lógica de Migração ---
                        const combinedMap = new Map();
                        [...userCart, ...guestCart].forEach(item => {
                            const uniqueKey = `${item.id}-${item.variationValue}`;
                            if (!combinedMap.has(uniqueKey)) {
                                combinedMap.set(uniqueKey, item);
                            } else {
                                const existing = combinedMap.get(uniqueKey);
                                existing.quantity += item.quantity; 
                                combinedMap.set(uniqueKey, existing);
                            }
                        });

                        const combinedCart = Array.from(combinedMap.values());

                        // Garantir normalização antes de salvar
                        const combinedNormalized = combinedCart.map(normalizeLoadedItem).filter(Boolean);
                        await AsyncStorage.setItem(userCartKey, JSON.stringify(combinedNormalized));
                        await AsyncStorage.removeItem(GUEST_CART_KEY); 
                        setCartItems(combinedNormalized);
                        // carrinho migrado para usuário
                    } else {
                        // Sem carrinho de convidado, apenas carrega o do usuário
                        setCartItems(userCart);
                        // carrinho do usuário carregado
                    }
                } else {
                    // Convidado: Apenas carrega o carrinho de convidado
                    const guestJSON = await AsyncStorage.getItem(GUEST_CART_KEY);
                    const loaded = guestJSON ? JSON.parse(guestJSON) : [];
                    setCartItems(loaded.map(normalizeLoadedItem).filter(Boolean));
                    // carrinho de convidado carregado
                }
            } catch (e) {
                // erro ao carregar/migrar carrinho
                setCartItems([]); // Começa vazio se der erro
            } finally {
                setStorageKey(key); // Define a chave que será usada para salvar
                setLoading(false);
            }
        };
        
        setup();
    }, [isAuthenticated, user, authLoading]); // Roda quando o status de autenticação muda

    // Efeito para SALVAR o carrinho no AsyncStorage sempre que ele mudar
    useEffect(() => {
            if (!loading) {
            // salvar carrinho em storageKey
            AsyncStorage.setItem(storageKey, JSON.stringify(cartItems))
                .catch(() => {});
        }
    }, [cartItems, storageKey, loading]); 

    
    // ---
    // --- ESTA É A FUNÇÃO CORRIGIDA ---
    // ---
    const adicionarAoCarrinho = (produto, variationValue) => {
        // adicionando ao carrinho

        // Verifica se o item já existe (mesmo ID de produto E mesma variação)
        const itemJaExiste = cartItems.find(
            item => item.id === produto.id && item.variationValue === variationValue
        );

        if (itemJaExiste) {
            // Se existe, apenas incrementa a quantidade
            // item já existe — incrementando quantidade
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.cartItemId === itemJaExiste.cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            // Se é novo, cria o objeto completo
            // item novo — adicionando ao carrinho
            
            // --- CORREÇÃO APLICADA AQUI ---
            // Removemos o 'uuidv4()' e usamos um ID simples
            const idUnicoCarrinho = `${produto.id}-${String(variationValue)}-${Date.now()}`;

            // Normalizar preço: aceita número, string com vírgula, string formatada 'R$ 12,00', etc.
            const normalizePrice = (p) => {
                if (p === undefined || p === null) return 0;
                if (typeof p === 'number' && !isNaN(p)) return p;
                if (typeof p === 'string') {
                    // Remover prefixo 'R$', espaços e pontos de milhar, trocar vírgula por ponto
                    let s = p.replace(/R\$|\s/g, '').replace(/\./g, '').replace(/,/g, '.');
                    const n = parseFloat(s);
                    return isNaN(n) ? 0 : n;
                }
                return 0;
            };

            // Normalizar imagem: aceitar {uri:...} ou string
            const normalizeImage = (img) => {
                if (!img) return null;
                // Se já for um objeto com uri, retorna como está
                if (typeof img === 'object' && img.uri) return img;
                // Se for string, monta { uri }
                if (typeof img === 'string') return { uri: img };
                return null;
            };

            const priceNormalized = normalizePrice(produto.preco ?? produto.price ?? produto.precoFormatado ?? produto.precoFormatadoBr);
            // Tenta várias chaves possíveis para a imagem
            const imageCandidate = produto.img ?? produto.imagem ?? produto.image ?? produto.imagemUrl ?? produto.imagemUrl;
            const imageNormalized = normalizeImage(imageCandidate);

            const novoItem = {
                productName: produto.nome || produto.productName || produto.title || 'Produto',
                categoria: produto.categoria,
                id: produto.id,
                price: priceNormalized,
                image: imageNormalized,
                quantity: 1,
                selected: true,
                variationValue: variationValue,
                cartItemId: idUnicoCarrinho,
            };

            setCartItems(prevItems => [...prevItems, novoItem]);
        }
    };

    /**
     * Atualiza a quantidade (baseado no ID único do carrinho)
     */
    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) { 
            removeItem(cartItemId); 
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    /**
     * Remove item baseado no ID único do carrinho (cartItemId)
     */
    const removeItem = (cartItemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
    };

    /**
     * Seleciona item baseado no ID único do carrinho (cartItemId)
     */
    const toggleItemSelection = (cartItemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const toggleSelectAll = (selectAll) => {
        setCartItems(prevItems =>
            prevItems.map(item => ({ ...item, selected: selectAll }))
        );
    };

    // Limpa apenas os itens SELECIONADOS (para o LojaCarrinho)
    const limparCarrinho = () => {
        setCartItems(prevItems => prevItems.filter(item => !item.selected));
    };


    const value = {
        cartItems,
        loadingCart: loading || authLoading, 
        adicionarAoCarrinho,
        updateQuantity,
        removeItem,
        toggleItemSelection,
        toggleSelectAll,
        limparCarrinho,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Hook customizado
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};