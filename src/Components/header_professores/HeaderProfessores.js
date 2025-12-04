import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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

const HeaderProfessores = ({ title, onBackPress, navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { isDark } = useTheme();
  const { logout } = useAuth();

  const handleAbrirMenu = () => {
    setMenuVisivel(true);
  };

  const handleFecharMenu = () => {
    setMenuVisivel(false);
  };

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation) {
      navigation.navigate(nomeDaTela);
    }
  };

  const handleSairConta = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Logout cancelado'),
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              handleFecharMenu();
              await logout();
              navigation.navigate('Inicial');
              console.log('✅ Logout realizado com sucesso');
            } catch (error) {
              console.error('❌ Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao sair da conta. Tente novamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
    
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#2c2c2c' : '#FFFFFF' }]}>
            <Text style={[styles.menuTitle, { color: isDark ? '#E6E8F3' : '#333333' }]}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
            <Ionicons name="home-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Loja")}
            >
              <Ionicons name="cart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons name="heart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSairConta}
            >
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: "#dc3545" }]}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
          
          <Image
            source={require('../../../assets/icons/logo_dia.png')}
            style={[styles.logo, { tintColor: isDark ? '#FFFFFF' : undefined }]}
            resizeMode="contain"
          />
          
          <TouchableOpacity onPress={handleAbrirMenu} style={styles.iconButton}>
            <Ionicons 
              name="menu" 
              size={28} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.pageTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{title}</Text>
      </View>
    </>
  );
};

// Estilos do header e do modal combinados
const styles = StyleSheet.create({
  // Estilos do Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 30,
    height: 80,
  },
  iconButton: {
    padding: 5,
    width: 40, 
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  // Estilos do Modal
  menuOverlay: {
    flex: 1,
    // removido overlay pesado para evitar sombra grande
    backgroundColor: 'transparent',
    alignItems: "flex-end",
  },
  menuContent: {
    height: "100%",
    width: "75%",
    paddingTop: 80,
    paddingHorizontal: 20,
    ...platformShadow({
      boxShadow: '-6px 0px 18px rgba(0,0,0,0.25)',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "500",
  },
});

export default HeaderProfessores;