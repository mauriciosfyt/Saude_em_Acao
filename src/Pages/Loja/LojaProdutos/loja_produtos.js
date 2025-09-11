import React from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// 1. Importar o LinearGradient do Expo
import { LinearGradient } from 'expo-linear-gradient';

// Adicionando as cores do gradiente ao tema para manter a organização
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
        // Cores do gradiente
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

const LojaProdutos = () => {
    const productTitlePlaceholder = 'Whey Protein 900g – Alta Performance';
    const descriptionPlaceholder = 'Ganhe massa muscular e recupere mais rápido com nosso Whey Protein de alta qualidade. 21g de proteína por dose, baixo teor de carboidratos e absorção rápida. Ideal para pré ou pós-treino!';

    // Constantes para o gradiente
    const gradientColors = [theme.colors.gradientStart, theme.colors.gradientEnd];
    const gradientLocations = [0, 0.84];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* --- HEADER --- */}
            <View style={styles.header}>
                
                <TouchableOpacity>
                    <Icon name="arrow-left" size={24} color={theme.colors.icon} />
                </TouchableOpacity>    
                    <TextInput
                        placeholder="Buscar Produtos"
                        style={styles.searchInput}
                        placeholderTextColor={theme.colors.placeholder}
                    />
                    <Icon name="search" size={20} color={theme.colors.placeholder} style={{ marginRight: 15 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* --- PRODUCT INFO --- */}
                <Text style={styles.productTitle}>{productTitlePlaceholder}</Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../../assets/banner_loja.png')}
                        style={styles.productImage}
                    />
                    <View style={styles.actionIcons}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Icon name="heart" size={22} color={theme.colors.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, { marginTop: theme.spacing.small }]}>
                            <Icon name="share-2" size={22} color={theme.colors.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- PRICE --- */}
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Por apenas</Text>
                    <Text style={styles.priceText}>R$100,99</Text>
                </View>

                {/* --- ACTION BUTTONS --- */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.primaryButton]}>
                        <Text style={[styles.buttonText, styles.primaryButtonText]}>Reservar agora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Adicionar ao carrinho</Text>
                    </TouchableOpacity>
                </View>

                {/* --- DESCRIPTION --- */}
                <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>Descrição</Text>
                    <Text style={styles.descriptionText}>{descriptionPlaceholder}</Text>
                </View>
            </ScrollView>

            {/* --- BOTTOM NAVIGATION --- */}
            {/* 3. Substituir a View da navegação inferior pelo LinearGradient */}
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
    // Estilo para o container do gradiente, que agora é a própria barra
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
        backgroundColor: 'transparent', // Importante para o gradiente aparecer
    },
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
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    priceSection: {
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.large, // Usado padding em vez de 'left' para melhor responsividade
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
    // Estilos do Bottom Nav aplicados diretamente no LinearGradient
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default LojaProdutos;