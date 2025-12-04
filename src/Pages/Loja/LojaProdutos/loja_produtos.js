import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    SafeAreaView, ScrollView, StatusBar, Platform, 
    ActivityIndicator, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderLoja from '../../../Components/HeaderLoja';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';

// APIs
import { obterProdutoPorId } from '../../../Services/api'; 
import api from '../../../Services/api';
import { useCart } from '../../../context/CartContext'; 
import { useFavoritos } from '../../../context/FavoritosContext';

// --- ADICIONADO: Lógica de Variações (do seu index.jsx - fonte 79) ---
const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', tipoEstoque: 'tamanho', itens: ['P', 'M', 'G', 'GG'] },
  { valor: 'WHEY_PROTEIN', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  { valor: 'CREATINA', tipoEstoque: 'sabor', itens: ['Morango', 'Chocolate', 'Baunilha'] },
  // Adicione outras categorias que tenham variações
  // Categorias sem variação (como 'VITAMINAS') são tratadas automaticamente
];
// -----------------------------------------------------------

// ... (Sua função platformShadow e theme - INTOCADAS) ...
const platformShadow = ({
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.15,
    shadowRadius = 4,
    elevation,
    boxShadow,
} = {}) => {
    const offset = shadowOffset ?? { width: 0, height: 2 };
    const radius = shadowRadius ?? 4;
    const opacity = shadowOpacity ?? 0.15;
    if (Platform.OS === 'web') {
        const blur = Math.max(radius * 2, 1);
        return {
            boxShadow: boxShadow ?? `${offset.width}px ${offset.height}px ${blur}px rgba(0,0,0,${opacity})`,
        };
    }
    const nativeShadow = {
        shadowColor,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
    };
    if (typeof elevation === 'number') {
        nativeShadow.elevation = elevation;
    }
    return nativeShadow;
};

const theme = {
    colors: {
        primary: '#4CAF50',
        secondary: '#D3DCE6',
        background: '#FFFFFF',
        text: '#333333',
        placeholder: '#888888',
        lightGray: '#F0F0F0',
        icon: '#555555',
        white: '#FFFFFF',
        border: '#E0E0E0',
        gradientStart: '#FFFFFF',
        gradientEnd: '#405CBA',
    },
    spacing: {
        small: 8,
        medium: 16,
        large: 24,
    },
    fontSize: {
        small: 12,
        regular: 14,
        medium: 16,
        large: 24,
        xlarge: 32,
    },
};
// -----------------------------------------------------------


const LojaProdutos = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState("");
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ADICIONADO: State para a variação
    const [variacaoInfo, setVariacaoInfo] = useState(null); // Info (ex: {tipo: 'tamanho', itens: ['P']})
    const [variacaoSelecionada, setVariacaoSelecionada] = useState(null); // Valor (ex: 'P')

    const { adicionarAoCarrinho } = useCart();
    const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();

    // useEffect para buscar dados (Modificado para incluir variações)
    useEffect(() => {
        const { produtoId } = route.params;
        if (!produtoId) {
            setError("Nenhum ID de produto fornecido.");
            setLoading(false);
            return;
        }

        const carregarProduto = async () => {
            try {
                setLoading(true);
                setError(null);
                setVariacaoInfo(null);
                setVariacaoSelecionada(null);

                const data = await obterProdutoPorId(produtoId);
                
                // Normaliza o campo de imagem (várias APIs usam nomes diferentes)
                const rawImg = data.imagemUrl || data.img || data.imagem || data.image || data.url || data.foto || data.path || null;
                let imagemUrlFinal = rawImg;
                try {
                    const base = api?.defaults?.baseURL || '';
                    if (imagemUrlFinal && !String(imagemUrlFinal).startsWith('http')) {
                        const sep = String(imagemUrlFinal).startsWith('/') ? '' : '/';
                        imagemUrlFinal = `${base}${sep}${imagemUrlFinal}`;
                    }
                } catch (e) {
                    console.warn('Erro ao normalizar URL da imagem:', e);
                }

                const produtoFormatado = {
                    ...data,
                    // Guardamos os dados brutos para o carrinho
                    nome: data.nome,
                    preco: data.preco,
                    imagemUrl: imagemUrlFinal,
                    categoria: data.categoria, // <-- IMPORTANTE PARA VARIAÇÃO
                    // Formatamos para exibição
                    imagem: { uri: imagemUrlFinal },
                    precoFormatado: `R$ ${data.preco ? data.preco.toFixed(2).replace('.', ',') : '0,00'}`
                };
                
                setProduto(produtoFormatado);

                // 2. Definir as variações (lógica do index.jsx)
                const info = CATEGORIAS_PRODUTO.find(c => c.valor === data.categoria);
                if (info) { // Se a categoria (ex: CAMISETA) estiver na nossa lista
                    setVariacaoInfo(info);
                }

            } catch (err) { 
                console.error("Erro ao buscar produto por ID:", err);
                setError(err.message || "Não foi possível carregar o produto.");
            } 
            finally { setLoading(false); }
        };
        carregarProduto();
    }, [route.params.produtoId]); 

    // --- LÓGICA DOS BOTÕES (ARRUMADA) ---

    // Verifica se o botão deve estar desabilitado
    // (Se existe variação E nenhuma foi selecionada)
    const isBotaoDesabilitado = variacaoInfo && !variacaoSelecionada;

    // Função interna para adicionar (usada pelos dois botões)
    const handleAdicionar = (navegarParaCarrinho) => {
        if (isBotaoDesabilitado || !produto) {
            Alert.alert("Selecione uma opção", `Por favor, escolha um ${variacaoInfo.tipoEstoque}.`);
            return;
        }
        
        // 1. Adiciona ao "cofre" com a variação
        // (Se não houver variaçãoInfo, 'variacaoSelecionada' será null, e o contexto tratará como 'padrao')
        adicionarAoCarrinho(produto, variacaoSelecionada);
        
        // 2. Decide se navega ou mostra alerta
        if (navegarParaCarrinho) {
            navigation.navigate('LojaCarrinho');
        } else {
            const nomeVariacao = variacaoSelecionada ? `(${variacaoSelecionada})` : '';
            Alert.alert(
                "Produto Adicionado!",
                `${produto.nome} ${nomeVariacao} foi adicionado ao seu carrinho.`,
                [
                    { text: "Ver Carrinho", onPress: () => navigation.navigate('LojaCarrinho') },
                    { text: "Continuar", style: "cancel" }
                ]
            );
        }
    };

    // --- Telas de Loading / Erro (INTOCADAS) ---
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />
                <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ marginTop: 10, color: theme.colors.placeholder }}>Carregando...</Text>
                </View>
                <BottomNavBar navigation={navigation} activeScreen="LojaProdutos" />
            </SafeAreaView>
        );
    }
    if (error) {
         return (
            <SafeAreaView style={styles.safeArea}>
                <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />
                <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Icon name="alert-circle" size={50} color="#cc0000" />
                    <Text style={{ marginTop: 10, color: '#cc0000', textAlign: 'center' }}>
                        Erro ao carregar produto: {error}
                    </Text>
                </View>
                <BottomNavBar navigation={navigation} activeScreen="LojaProdutos" />
            </SafeAreaView>
        );
    }
    if (!produto) {
       return (
             <SafeAreaView style={styles.safeArea}>
                <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />
                <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: theme.colors.placeholder }}>Produto não encontrado.</Text>
                </View>
                <BottomNavBar navigation={navigation} activeScreen="LojaProdutos" />
            </SafeAreaView>
        );
    }

    // --- Renderização Principal ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* --- PRODUCT INFO (INTOCADO) --- */}
                <Text style={styles.productTitle}>{produto.nome}</Text>
                <View style={styles.imageContainer}>
                    <Image
                        source={produto.imagem}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                    <View style={styles.actionIcons}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => {
                                try {
                                    const isFav = favoritos && favoritos.find((f) => String(f.id || f.produtoId) === String(produto.id));
                                    if (isFav) {
                                        removerFavorito(produto.id);
                                    } else {
                                        adicionarFavorito(produto);
                                    }
                                } catch (e) {
                                    console.error('Erro ao alternar favorito:', e);
                                }
                            }}
                        >
                            {
                                (favoritos && favoritos.find((f) => String(f.id || f.produtoId) === String(produto.id)))
                                ? <Icon name="heart" size={22} color="#E24B4B" />
                                : <Icon name="heart" size={22} color={theme.colors.icon} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, { marginTop: theme.spacing.small }]}>
                            <Icon name="share-2" size={22} color={theme.colors.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Por apenas</Text>
                    <Text style={styles.priceText}>{produto.precoFormatado}</Text>
                </View>

                {/* --- ADICIONADO: Seletor de Variação --- */}
                {variacaoInfo && (
                    <View style={styles.variationSection}>
                        <Text style={styles.variationTitle}>
                            Selecione o {variacaoInfo.tipoEstoque}: 
                            <Text style={{fontWeight: 'bold'}}> {variacaoSelecionada}</Text>
                        </Text>
                        <View style={styles.variationOptions}>
                            {variacaoInfo.itens.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.variationButton,
                                        variacaoSelecionada === item && styles.variationButtonSelected
                                    ]}
                                    onPress={() => setVariacaoSelecionada(item)}
                                >
                                    <Text style={[
                                        styles.variationText,
                                        variacaoSelecionada === item && styles.variationTextSelected
                                    ]}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
                {/* ------------------------------------------- */}


                {/* --- ACTION BUTTONS (ARRUMADOS) --- */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.button, 
                            styles.primaryButton,
                            isBotaoDesabilitado && styles.buttonDisabled // <-- ADICIONADO
                        ]}
                        onPress={() => handleAdicionar(true)} // true = navegar
                        disabled={isBotaoDesabilitado}
                    >
                        <Text style={[styles.buttonText, styles.primaryButtonText]}>Reservar agora</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[
                            styles.button, 
                            styles.secondaryButton,
                            isBotaoDesabilitado && styles.buttonDisabled // <-- ADICIONADO
                        ]}
                        onPress={() => handleAdicionar(false)} // false = mostrar alerta
                        disabled={isBotaoDesabilitado}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Adicionar ao carrinho</Text>
                    </TouchableOpacity>
                </View>

                {/* --- DESCRIPTION (INTOCADO) --- */}
                <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>Descrição</Text>
                    <Text style={styles.descriptionText}>{produto.descricao}</Text>
                </View>
            </ScrollView>

             <BottomNavBar navigation={navigation} activeScreen="LojaProdutos" />
        </SafeAreaView>
    );
};

// Seus estilos (ADICIONADO estilos de variação e botão disabled)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // ... (seu header, searchInput, etc.)
    scrollContent: {
        paddingBottom: 100,
    },
    productTitle: {
        fontSize: theme.fontSize.regular,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginHorizontal: theme.spacing.large,
        marginTop: theme.spacing.large,
        lineHeight: 20,
    },
    imageContainer: {
        marginVertical: theme.spacing.medium,
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: 350,
        height: 150,
        resizeMode: 'contain',
    },
    actionIcons: {
        position: 'absolute',
        top: 10,
        right: theme.spacing.large,
    },
    iconButton: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.small,
        borderRadius: 20,
        ...platformShadow({
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
        }),
    },
    priceSection: {
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.large, 
        marginVertical: theme.spacing.medium,
    },
    priceLabel: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.placeholder,
    },
    priceText: {
        fontSize: theme.fontSize.xlarge,
        fontWeight: 'bold',
        color: theme.colors.text,
    },

    // --- ADICIONADO: Estilos para as Variações ---
    variationSection: {
        paddingHorizontal: theme.spacing.large,
        marginTop: theme.spacing.small,
        marginBottom: theme.spacing.medium,
    },
    variationTitle: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
    },
    variationOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    variationButton: {
        minWidth: 50,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: theme.colors.lightGray,
        marginRight: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    variationButtonSelected: {
        backgroundColor: theme.colors.primary, // Cor 'primary' do seu 'theme'
        borderColor: theme.colors.primary,
    },
    variationText: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.text,
        fontWeight: '500',
    },
    variationTextSelected: {
        color: theme.colors.white,
    },
    // ------------------------------------------
    
    buttonContainer: {
        paddingHorizontal: theme.spacing.large,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.medium,
    },
    // ADICIONADO: Estilo para botão desabilitado
    buttonDisabled: {
        backgroundColor: '#CCC', // Cor cinza para desabilitado
        borderColor: '#AAA',
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    buttonText: {
        fontSize: theme.fontSize.medium,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: theme.colors.white,
    },
    secondaryButtonText: {
        color: theme.colors.text,
    },
    descriptionSection: {
        paddingHorizontal: theme.spacing.large,
        marginTop: theme.spacing.medium,
    },
    descriptionTitle: {
        fontSize: theme.fontSize.medium,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    descriptionText: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.placeholder,
        lineHeight: 22,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        ...platformShadow({
            boxShadow: '0px -6px 18px rgba(0,0,0,0.2)',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 10,
        }),
    },
});

export default LojaProdutos;