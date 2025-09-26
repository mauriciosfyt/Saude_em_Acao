import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const theme = {
    colors: {
        primary: '#4CAF50',
        icon: '#555555',
        gradientStart: '#FFFFFF',
        gradientEnd: '#405CBA',
    },
};

// Array com os itens da barra de navegação para facilitar a manutenção
const navItems = [
    // 1. Adicionado 'isNested: true' para telas que estão dentro do TabNavigator
    { name: 'home', screen: 'Home', isNested: true },
    { name: 'shopping-cart', screen: 'LojaReservas', isNested: false },
    { name: 'heart', screen: 'LojaFavoritos', isNested: false },
];

const BottomNavBar = ({ navigation, activeScreen }) => {
    const gradientColors = [theme.colors.gradientStart, theme.colors.gradientEnd];
    const gradientLocations = [0, 0.84];

    // 2. Função de navegação atualizada
    const handleNavigate = (item) => {
        if (item.isNested) {
            // Navega para o TabNavigator e depois para a tela específica
            navigation.navigate('MainTabs', { screen: item.screen });
        } else {
            // Navega diretamente para a tela no StackNavigator
            navigation.navigate(item.screen);
        }
    };

    return (
        <LinearGradient
            colors={gradientColors}
            locations={gradientLocations}
            start={{ y: 0, x: 0 }}
            end={{ y: 1, x: 0 }}
            style={styles.bottomNav}
        >
            {navItems.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    onPress={() => handleNavigate(item)} // 3. Chama a nova função
                >
                    <Icon
                        name={item.name}
                        size={28}
                        color={activeScreen === item.screen ? theme.colors.icon : theme.colors.icon}
                    />
                </TouchableOpacity>
            ))}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
});

export default BottomNavBar;

