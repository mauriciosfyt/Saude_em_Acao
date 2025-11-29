import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Platform,
    ActivityIndicator, 
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderLoja from '../../../Components/HeaderLoja';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';

// Importar a função da API
import { obterProdutoPorId } from '../../../Services/api'; 

// --- 1. IMPORTAR O CONTEXTO DO CARRINHO ---
import { useCart } from '../../../context/CartContext';

// --- IMPORTAR O CONTEXTO DE FAVORITOS ---
import { useFavoritos } from '../../../context/FavoritosContext';

// --- 2. Lógica de Variações (Corrigida) ---
// Agora só mapeia o TIPO, não os itens (que virão da API)
const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', tipoEstoque: 'tamanho' },
  { valor: 'WHEY_PROTEIN', tipoEstoque: 'sabor' },
  { valor: 'CREATINA', tipoEstoque: 'sabor' },
  { valor: 'VITAMINAS', tipoEstoque: 'padrao' }, 
];
// -----------------------------------------------------------------

// Sua função platformShadow (Intocada)
const platformShadow = ({
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.15,
    shadowRadius = 4,
    elevation,
    boxShadow,
} = {}) => {
    // ... (código intocado) ...
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

// Seu objeto theme (Intocado)
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

const LojaProdutos = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState("");
    
    // States (Intocados)
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State da variação (Intocado)
    const [variacaoSelecionada, setVariacaoSelecionada] = useState(null);

    const { adicionarAoCarrinho } = useCart();
    const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();

    // useEffect (Intocado)
    useEffect(() => {
        const { produtoId } = route.params;
        if (!produtoId) {
            setError("Nenhum ID de produto fornecido.");
            setLoading(false); return;
        }
        const carregarProduto = async () => {
            try {
                setLoading(true);
                setError(null);
                setVariacaoSelecionada(null); 
                const data = await obterProdutoPorId(produtoId);
                const produtoFormatado = {
                    ...data,
                    id: data.id || produtoId, // Garante que tem ID
                    nome: data.nome || data.name || 'Produto',
                    preco: data.preco !== undefined ? data.preco : (data.price !== undefined ? data.price : 0),
                    img: data.img || data.imagem || data.imagemUrl || data.image,
                    imagem: { uri: data.img || data.imagem || data.imagemUrl || data.image }, 
                    precoFormatado: `R$ ${data.preco ? data.preco.toFixed(2).replace('.', ',') : '0,00'}`,
                    descricao: data.descricao || data.description || '',
                    categoria: data.categoria || data.category,
                };
                setProduto(produtoFormatado); 
            } catch (err) {
                console.error("Erro ao buscar produto por ID:", err);
                setError(err.message || "Não foi possível carregar o produto.");
            } finally {
                setLoading(false);
            }
        };
        carregarProduto();
    }, [route.params.produtoId]); 

    // --- 5. LÓGICA DE VARIAÇÕES (CORRIGIDA - Lógica da Web) ---
    const variacoesDisponiveis = useMemo(() => {
        if (!produto || !produto.categoria) return null;
        
        const infoCategoria = CATEGORIAS_PRODUTO.find(c => c.valor === produto.categoria);
        if (!infoCategoria || infoCategoria.tipoEstoque === 'padrao') {
            return null; // Produto não tem variações (ex: Vitaminas)
        }

        let estoqueMap = null;
        // Pega o mapa de estoque correto (tamanho ou sabor)
        if (infoCategoria.tipoEstoque === 'tamanho' && produto.estoquePorTamanho) {
            estoqueMap = produto.estoquePorTamanho;
        } else if (infoCategoria.tipoEstoque === 'sabor' && produto.estoquePorSabor) {
            estoqueMap = produto.estoquePorSabor;
        }

        if (!estoqueMap) {
            return null; // Categoria deveria ter variações, mas o produto não tem dados de estoque
        }

        // LÓGICA CHAVE (do seu LojaProduto.js da web):
        // Filtra o estoque para incluir apenas itens com qty > 0
        const itensDisponiveis = Object.entries(estoqueMap)
            .filter(([, qty]) => qty > 0) // <-- O FILTRO DE ESTOQUE
            .map(([nomeDaVariacao]) => nomeDaVariacao); // <-- Pega só o nome ('P', 'Morango')

        // Se, após filtrar, não sobrar nenhum item, o produto está esgotado
        if (itensDisponiveis.length === 0) {
            return { 
                label: infoCategoria.tipoEstoque.charAt(0).toUpperCase() + infoCategoria.tipoEstoque.slice(1), 
                itens: [], 
                esgotado: true // <-- Sinaliza que está esgotado
            };
        }

        return {
            label: infoCategoria.tipoEstoque.charAt(0).toUpperCase() + infoCategoria.tipoEstoque.slice(1),
            itens: itensDisponiveis,
            esgotado: false
        };
    }, [produto]);
    // --- FIM DA CORREÇÃO ---


    // Funções de clique (Intocadas)
    const handleAdicionarAoCarrinho = () => {
        if (!produto) return;
        const produtoParaCarrinho = { ...produto, imagemUrl: produto.img };
        adicionarAoCarrinho(produtoParaCarrinho, variacaoSelecionada);
        Alert.alert("Sucesso!", `${produto.nome} (${variacaoSelecionada || 'Padrão'}) foi adicionado ao carrinho.`);
    };

    const handleReservarAgora = () => {
        if (!produto) return;
        const produtoParaCarrinho = { ...produto, imagemUrl: produto.img };
        adicionarAoCarrinho(produtoParaCarrinho, variacaoSelecionada);
        navigation.navigate('LojaCarrinho');
    };

    // --- LÓGICA DE BOTÃO DESABILITADO (Corrigida) ---
    // Verifica se o produto exige uma variação
    const variacaoNecessaria = variacoesDisponiveis && variacoesDisponiveis.itens.length > 0;
    // O botão deve ser desabilitado se:
    // 1. O produto está totalmente esgotado (variacoesDisponiveis.esgotado)
    // 2. Ou uma variação é necessária, mas nenhuma foi selecionada
    const botaoDesabilitado = (variacoesDisponiveis?.esgotado) || (variacaoNecessaria && !variacaoSelecionada);
    // ---------------------------------------------------

    // Constantes de gradiente (Intocadas)
    const gradientColors = [theme.colors.gradientStart, theme.colors.gradientEnd];
    const gradientLocations = [0, 0.84];

    // Telas de Loading, Erro, etc (Intocadas)
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

    // Renderização principal
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* --- PRODUCT INFO (Intocado) --- */}
                <Text style={styles.productTitle}>{produto.nome}</Text>
                <View style={styles.imageContainer}>
                    <Image source={produto.imagem} style={styles.productImage} resizeMode="contain" />
                    <View style={styles.actionIcons}>
                        <TouchableOpacity 
                            style={styles.iconButton}
                            onPress={() => {
                                try {
                                    if (!produto || !produto.id) return;
                                    const produtoId = produto.id || produto.produtoId;
                                    if (!produtoId) return;
                                    
                                    const isFavorito = favoritos.some((p) => (p.id || p.produtoId) === produtoId);
                                    if (isFavorito) {
                                        removerFavorito(produtoId).catch(err => {
                                            if (__DEV__) console.warn("Erro ao remover favorito:", err);
                                        });
                                    } else {
                                        adicionarFavorito(produto).catch(err => {
                                            if (__DEV__) console.warn("Erro ao adicionar favorito:", err);
                                        });
                                    }
                                } catch (error) {
                                    if (__DEV__) {
                                        console.error("Erro ao manipular favorito:", error);
                                    }
                                }
                            }}
                        >
                            <Icon 
                                name="heart" 
                                size={22} 
                                color={favoritos.some((p) => (p.id || p.produtoId) === (produto?.id || produto?.produtoId)) ? "#e74c3c" : theme.colors.icon} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, { marginTop: theme.spacing.small }]}>
                            <Icon name="share-2" size={22} color={theme.colors.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- PRICE (Intocado) --- */}
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Por apenas</Text>
                    <Text style={styles.priceText}>{produto.precoFormatado}</Text>
                </View>

                {/* --- SELETOR DE VARIAÇÃO (Corrigido) --- */}
                {variacoesDisponiveis && (
                    <View style={styles.variationSection}>
                        <Text style={styles.variationTitle}>Selecione o {variacoesDisponiveis.label}:</Text>
                        
                        {/* Se estiver esgotado, mostra a mensagem */}
                        {variacoesDisponiveis.esgotado && (
                            <Text style={styles.variationSoldOutText}>Produto esgotado</Text>
                        )}
                        
                        {/* Mostra os botões (agora filtrados pelo estoque) */}
                        <View style={styles.variationOptionsContainer}>
                            {variacoesDisponiveis.itens.map(item => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.variationButton,
                                        variacaoSelecionada === item && styles.variationButtonSelected
                                    ]}
                                    onPress={() => setVariacaoSelecionada(item)}
                                >
                                    <Text style={[
                                        styles.variationButtonText,
                                        variacaoSelecionada === item && styles.variationButtonTextSelected
                                    ]}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
                {/* --- FIM DO SELETOR --- */}


                {/* --- ACTION BUTTONS (Modificado para desabilitar) --- */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.primaryButton, botaoDesabilitado && styles.buttonDisabled]}
                        onPress={handleReservarAgora}
                        disabled={botaoDesabilitado} // <-- Habilitado
                    >
                        <Text style={[styles.buttonText, styles.primaryButtonText]}>Reservar agora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, styles.secondaryButton, botaoDesabilitado && styles.buttonDisabled]}
                        onPress={handleAdicionarAoCarrinho}
                        disabled={botaoDesabilitado} // <-- Habilitado
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText, botaoDesabilitado && styles.buttonTextDisabled]}>Adicionar ao carrinho</Text>
                    </TouchableOpacity>
                </View>

                {/* --- DESCRIPTION (Intocado) --- */}
                <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>Descrição</Text>
                    <Text style={styles.descriptionText}>{produto.descricao}</Text>
                </View>
            </ScrollView>

             <BottomNavBar navigation={navigation} activeScreen="LojaProdutos" />
        </SafeAreaView>
    );
};

// Seus estilos (Intocados, com *adição* dos novos estilos no final)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // ... (Todos os seus estilos originais: header, searchBarGradient, searchInput, etc...)
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.small,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    searchBarGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        marginLeft: theme.spacing.medium,
        height: 40,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: theme.spacing.medium,
        fontSize: theme.fontSize.regular,
        color: theme.colors.text,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    productTitle: {
        fontSize: theme.fontSize.medium,
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

    // --- ESTILOS NOVOS (Adicionados) ---
    variationSection: {
        paddingHorizontal: theme.spacing.large,
        marginBottom: theme.spacing.medium,
    },
    variationTitle: {
        fontSize: theme.fontSize.regular,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    variationOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    variationButton: {
        borderColor: theme.colors.border,
        borderWidth: 1.5,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: theme.spacing.small,
        marginBottom: theme.spacing.small,
    },
    variationButtonSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    variationButtonText: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.text,
    },
    variationButtonTextSelected: {
        color: theme.colors.white,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: theme.colors.lightGray, // Cor cinza para desabilitado
        borderColor: '#AAA',
    },
    buttonTextDisabled: {
        color: '#AAA',
    },
    variationSoldOutText: { // Estilo para a mensagem de "Esgotado"
        fontSize: theme.fontSize.regular,
        color: theme.colors.placeholder,
        fontStyle: 'italic',
        marginBottom: theme.spacing.small,
    }
});

export default LojaProdutos;