
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderLoja from '../../../Components/HeaderLoja';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';
import { useFavoritos } from '../../../context/FavoritosContext';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

// Reutilizando o mesmo objeto de tema para manter a consistência
const theme = {
    colors: {
        primary: '#4CAF50',
        secondary: '#D3DCE6',
        background: '#FFFFFF',
        text: '#333333',
        placeholder: '#888888',
        icon: '#555555',
        white: '#FFFFFF',
        border: '#E0E0E0',
        danger: '#D32F2F', // Vermelho para o botão "Excluir"
        link: '#2962FF', // Azul para o link "Adicionar ao carrinho"
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
        large: 20, // Ajustado para o título "Meus favoritos"
        xlarge: 24,
    },
};

// Componente para renderizar um item da lista, para manter o código limpo
const FavoriteItem = ({ item, onAddToCart, onRemove }) => {
    // Formata o preço para exibição
    const formatarPreco = (preco) => {
        if (typeof preco === 'number') {
            return `R$ ${preco.toFixed(2).replace('.', ',')}`;
        }
        if (typeof preco === 'string') {
            return preco;
        }
        return 'R$ 0,00';
    };

    // Verifica se a imagem é uma URI ou require
    const getImageSource = () => {
        // Tenta diferentes formatos de imagem que podem vir da API
        const imagem = item.imagem || item.img || item.image;
        
        if (imagem) {
            // Se for string (URL)
            if (typeof imagem === 'string') {
                // Se já começar com http, retorna URI direto
                if (imagem.startsWith('http://') || imagem.startsWith('https://')) {
                    return { uri: imagem };
                }
                // Se for caminho relativo, adiciona a base URL da API
                return { uri: `http://23.22.153.89${imagem.startsWith('/') ? imagem : '/' + imagem}` };
            }
            // Se for objeto com uri
            if (imagem.uri) {
                return imagem;
            }
            // Se for require (objeto local)
            return imagem;
        }
        // Imagem padrão se não houver
        return require('../../../../assets/banner_whey.png');
    };

    return (
        <View style={styles.itemContainer}>
            <Image 
                source={getImageSource()} 
                style={styles.itemImage}
                resizeMode="contain"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.nome || item.productName || 'Produto'}</Text>
                <Text style={styles.itemPriceLabel}>Por apenas</Text>
                <Text style={styles.itemPrice}>{formatarPreco(item.preco || item.price)}</Text>
                <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => onAddToCart(item)}>
                        <Text style={styles.actionLink}>Adicionar ao carrinho</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        const produtoId = item.id || item.produtoId;
                        if (produtoId) {
                            onRemove(produtoId);
                        }
                    }}>
                        <Text style={styles.actionDelete}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const Favoritos = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const { favoritos, removerFavorito, loading: favoritosLoading } = useFavoritos();
    const { adicionarAoCarrinho } = useCart();
    const { isAuthenticated } = useAuth();
    const gradientColors = [theme.colors.gradientStart, theme.colors.gradientEnd];
    const gradientLocations = [0, 0.84];

    // Filtrar favoritos por busca
    const favoritosFiltrados = favoritos.filter(item => {
        const nome = item.nome || item.productName || '';
        return nome.toLowerCase().includes(searchText.toLowerCase());
    });

    // Função para adicionar produto ao carrinho
    const handleAddToCart = (produto) => {
        if (!isAuthenticated) {
            Alert.alert(
                'Login necessário',
                'Você precisa estar logado para adicionar produtos ao carrinho.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Fazer Login', onPress: () => navigation.navigate('TelaLogin') }
                ]
            );
            return;
        }

        // Adiciona ao carrinho sem variação (null = padrão)
        adicionarAoCarrinho(produto, null);
        Alert.alert(
            'Sucesso!',
            `${produto.nome || produto.productName} foi adicionado ao carrinho.`,
            [
                { text: 'Continuar', style: 'cancel' },
                { text: 'Ver Carrinho', onPress: () => navigation.navigate('LojaCarrinho') }
            ]
        );
    };

    // Função para remover favorito
    const handleRemove = (produtoId) => {
        // Validação: verifica se o ID é válido
        if (!produtoId) {
            Alert.alert('Erro', 'Não foi possível identificar o produto para remover.');
            return;
        }

        Alert.alert(
            'Remover dos favoritos',
            'Deseja remover este produto dos seus favoritos?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Remover', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // A função removerFavorito agora trata os erros internamente
                            await removerFavorito(produtoId);
                            // Sucesso - o item já foi removido do estado local
                        } catch (error) {
                            // Se ainda assim houver erro, mostra mensagem
                            Alert.alert(
                                'Aviso',
                                'O favorito foi removido localmente. Pode haver um problema de conexão com o servidor.',
                                [{ text: 'OK' }]
                            );
                        }
                    }
                }
            ]
        );
    };

    // Renderizar lista vazia
    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="heart" size={64} color={theme.colors.placeholder} />
            <Text style={styles.emptyText}>Nenhum produto favoritado</Text>
            <Text style={styles.emptySubtext}>
                Não há itens listados nos favoritos
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* HeaderLoja reutilizado da tela da loja */}
            <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

            {/* --- CONTEÚDO DA TELA --- */}
            {favoritosLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.gradientEnd} />
                    <Text style={styles.loadingText}>Carregando favoritos...</Text>
                </View>
            ) : (
                <FlatList
                    data={favoritosFiltrados}
                    renderItem={({ item }) => (
                        <FavoriteItem 
                            item={item} 
                            onAddToCart={handleAddToCart}
                            onRemove={handleRemove}
                        />
                    )}
                    keyExtractor={item => String(item.id || item.produtoId || Math.random())}
                    ListHeaderComponent={
                        favoritosFiltrados.length > 0 ? (
                            <Text style={styles.title}>Meus favoritos ({favoritosFiltrados.length})</Text>
                        ) : null
                    }
                    ListEmptyComponent={renderEmptyList}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={
                        favoritosFiltrados.length === 0 
                            ? styles.listContentContainerEmpty 
                            : styles.listContentContainer
                    }
                />
            )}

            <BottomNavBar navigation={navigation} activeScreen="LojaFavoritos" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
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
    title: {
        fontSize: theme.fontSize.large,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: theme.spacing.large,
        color: theme.colors.text,
    },
    listContentContainer: {
        paddingBottom: 100, // Espaço para não sobrepor o Bottom Nav
    },
    itemContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
    },
    itemImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: theme.spacing.medium,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.text,
        marginBottom: 4,
    },
    itemPriceLabel: {
        fontSize: theme.fontSize.small,
        color: theme.colors.placeholder,
    },
    itemPrice: {
        fontSize: theme.fontSize.medium,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    itemActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionLink: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.link,
        fontWeight: '500',
        marginRight: theme.spacing.large,
    },
    actionDelete: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.danger,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginHorizontal: theme.spacing.medium,
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
        elevation: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.large * 2,
        paddingHorizontal: theme.spacing.large,
    },
    emptyText: {
        fontSize: theme.fontSize.large,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.medium,
        marginBottom: theme.spacing.small,
    },
    emptySubtext: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.placeholder,
        textAlign: 'center',
        marginBottom: theme.spacing.large,
    },
    listContentContainerEmpty: {
        flex: 1,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.large * 2,
    },
    loadingText: {
        marginTop: theme.spacing.medium,
        fontSize: theme.fontSize.regular,
        color: theme.colors.placeholder,
    },
});

export default Favoritos;
