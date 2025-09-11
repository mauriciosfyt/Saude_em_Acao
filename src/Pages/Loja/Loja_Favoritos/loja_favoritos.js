import React from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

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

// Dados de exemplo (mock data). Em um app real, isso viria de um estado ou API.
const FAVORITOS_DATA = [
    {
        id: '1',
        nome: 'Creatina monohidratada Growth/ 250g',
        preco: 'R$100,99',
        imagem: require('../../../../assets/banner_whey.png'), // Adapte o caminho para sua imagem
    },
    {
        id: '2',
        nome: 'Creatina monohidratada Growth/ 250g',
        preco: 'R$100,99',
        imagem: require('../../../../assets/banner_vitaminas.png'),
    },
    {
        id: '3',
        nome: 'Creatina monohidratada Growth/ 250g',
        preco: 'R$100,99',
        imagem: require('../../../../assets/banner_creatina.png'),
    },
    {
        id: '4',
        nome: 'Creatina monohidratada Growth/ 250g',
        preco: 'R$100,99',
        imagem: require('../../../../assets/banner_camisas.png'),
    },
];

// Componente para renderizar um item da lista, para manter o código limpo
const FavoriteItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <Image source={item.imagem} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemPriceLabel}>Por apenas</Text>
            <Text style={styles.itemPrice}>{item.preco}</Text>
            <View style={styles.itemActions}>
                <TouchableOpacity>
                    <Text style={styles.actionLink}>Adicionar ao carrinho</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.actionDelete}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const Favoritos = () => {
    const gradientColors = [theme.colors.gradientStart, theme.colors.gradientEnd];
    const gradientLocations = [0, 0.84];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* --- HEADER (Reutilizado da tela anterior) --- */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Icon name="arrow-left" size={24} color={theme.colors.icon} />
                </TouchableOpacity>
                <LinearGradient
                    colors={gradientColors}
                    locations={gradientLocations}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.searchBarGradient}
                >
                    <TextInput
                        placeholder="Buscar Produtos"
                        style={styles.searchInput}
                        placeholderTextColor={theme.colors.placeholder}
                    />
                    <Icon name="search" size={20} color={theme.colors.placeholder} style={{ marginRight: 15 }} />
                </LinearGradient>
            </View>

            {/* --- CONTEÚDO DA TELA --- */}
            <FlatList
                data={FAVORITOS_DATA}
                renderItem={({ item }) => <FavoriteItem item={item} />}
                keyExtractor={item => item.id}
                ListHeaderComponent={<Text style={styles.title}>Meus favoritos</Text>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContentContainer}
            />

            {/* --- BOTTOM NAVIGATION (Reutilizado da tela anterior) --- */}
            <LinearGradient
                colors={gradientColors}
                locations={gradientLocations}
                start={{ y: 0, x: 0 }}
                end={{ y: 1, x: 0 }}
                style={styles.bottomNav}
            >
                <TouchableOpacity>
                    <Icon name="home" size={28} color={theme.colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon name="shopping-cart" size={28} color={theme.colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon name="heart" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
            </LinearGradient>
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
});

export default Favoritos;