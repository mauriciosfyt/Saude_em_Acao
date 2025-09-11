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
    SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

// Reutilizando e expandindo o tema
const theme = {
    colors: {
        primary: '#4CAF50',
        primaryButton: '#405CBA', // Azul dos botões
        secondaryButtonBorder: '#A0A0A0',
        background: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666',
        placeholder: '#888888',
        icon: '#555555',
        white: '#FFFFFF',
        border: '#E0E0E0',
        danger: '#D32F2F', // Vermelho para "Cancelado"
        success: '#388E3C', // Verde para "Retirado"
        warning: '#F57C00', // Laranja para "Em Análise"
        gradientStart: '#FFFFFF',
        gradientEnd: '#405CBA',
    },
    spacing: {
        small: 8,
        medium: 12,
        large: 24,
    },
    fontSize: {
        xsmall: 10,
        small: 12,
        regular: 14,
        medium: 16,
        large: 20,
    },
};

// Dados de exemplo (mock data) para a SectionList
const RESERVAS_DATA = [
    {
        title: '09/10/2015', 
        data: [
            {
                id: '1',
                status: 'Em Análise',
                nome: 'Whey Protein Concentrado 1kg',
                  imagem: require('../../../../assets/banner_vitaminas.png'),
            },
            {
                id: '2',
                status: 'Retirado',
                nome: 'Creatina Monohidratada 250g',
                imagem: require('../../../../assets/banner_creatina.png'),
            },
            {
                id: '3',
                status: 'Cancelado',
                nome: 'Vitamina D3 2000UI',
               imagem: require('../../../../assets/banner_camisas.png'),
            },
        ],
    },
    {
        title: '11/10/2015',
        data: [
            {
                id: '4',
                status: 'Em Análise',
                nome: 'Whey Protein Concentrado 1kg',
                imagem: require('../../../../assets/banner_camisas.png'),
            },
        ],
    },
];

// Função para retornar a cor baseada no status
const getStatusColor = (status) => {
    switch (status) {
        case 'Em Análise':
            return theme.colors.warning;
        case 'Retirado':
            return theme.colors.success;
        case 'Cancelado':
            return theme.colors.danger;
        default:
            return theme.colors.textSecondary;
    }
};

const Reservas = () => {
    const gradientColors = [theme.colors.gradientStart, theme.colors.gradientEnd];
    const gradientLocations = [0, 0.84];

    // Componente para renderizar um item da lista
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.imagem} style={styles.cardImage} />
            <View style={styles.cardInfo}>
                <Text style={[styles.cardStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
                <Text style={styles.cardName}>{item.nome}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Ver produto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Comprar novamente</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Componente para renderizar o cabeçalho da seção (a data)
    const renderSectionHeader = ({ section: { title } }) => {
        if (!title) return null; // Não renderiza nada se não houver título
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
                <TouchableOpacity>
                    <Text style={styles.sectionHeaderLink}>Adicionar aos favoritos</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* --- HEADER --- */}
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

            {/* --- LISTA DE SEÇÕES --- */}
            <SectionList
                sections={RESERVAS_DATA}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ListHeaderComponent={<Text style={styles.title}>Reservas</Text>}
                contentContainerStyle={styles.listContentContainer}
            />

            {/* --- BOTTOM NAVIGATION --- */}
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
                    <Icon name="heart" size={28} color={theme.colors.icon} />
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
        paddingHorizontal: theme.spacing.medium,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        // Sombra
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: theme.spacing.medium,
    },
    cardInfo: {
        flex: 1,
    },
    cardStatus: {
        fontSize: theme.fontSize.small,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardName: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.textSecondary,
    },
    cardActions: {
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.primaryButton,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 26,
        marginBottom: theme.spacing.small,
    },
    primaryButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSize.small,
        fontWeight: '500',
    },
    secondaryButton: {
        backgroundColor: theme.colors.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.colors.secondaryButtonBorder,
        paddingVertical: 5, // um pouco menos para diferenciar
        paddingHorizontal: 12,
    },
    secondaryButtonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.xsmall,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white, // Fundo branco para a data
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: theme.spacing.medium,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    sectionHeaderText: {
        fontSize: theme.fontSize.regular,
        fontWeight: '500',
        color: theme.colors.textSecondary,
    },
    sectionHeaderLink: {
        fontSize: theme.fontSize.small,
        color: theme.colors.primaryButton,
        fontWeight: '500',
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

export default Reservas;