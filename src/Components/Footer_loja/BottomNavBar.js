import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const theme = {
    colors: {
        primary: '#405CBA', // azul do exemplo
        icon: '#222',
        background: '#fff',
        iconActive: '#fff',
    },
};

// Array com os itens da barra de navegação para facilitar a manutenção
const navItems = [
    { name: 'home', screen: 'Loja', isNested: false }, // alterado para false
    { name: 'shopping-cart', screen: 'LojaCarrinho', isNested: false },
    { name: 'heart', screen: 'LojaFavoritos', isNested: false },
];

const BottomNavBar = ({ navigation, activeScreen }) => {
    const handleNavigate = (item) => {
        if (item.isNested) {
            navigation.navigate('MainTabs', { screen: item.screen });
        } else {
            navigation.navigate(item.screen);
        }
    };

    return (
        <View style={styles.bottomNav}>
            {navItems.map((item) => {
                const isActive = activeScreen === item.screen;
                return (
                    <TouchableOpacity
                        key={item.name}
                        onPress={() => handleNavigate(item)}
                        style={[styles.iconButton, isActive && styles.iconButtonActive]}
                    >
                        <Icon
                            name={item.name}
                            size={25}
                            color={isActive ? theme.colors.iconActive : theme.colors.icon}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 16,
        left: 8,
        right: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 38,
        backgroundColor: theme.colors.background,
        borderRadius: 19,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 8,
    },
    iconButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 19,
        height: 38,
        marginHorizontal: 1,
    },
    iconButtonActive: {
        backgroundColor: theme.colors.primary,
        borderRadius: 19,
        height: 38,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomNavBar;

