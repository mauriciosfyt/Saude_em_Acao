import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const HeaderProfessores = ({ title, onBackPress, navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { isDark } = useTheme();

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
    
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#1A1F2E' : '#FFFFFF' }]}>
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
              onPress={() => handleNavegar("LojaProdutos")}
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
              onPress={() => handleNavegar("Inicial")}
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
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Image
            source={require('../../../assets/icons/logo_dia.png')} // Ajuste o caminho
            style={styles.logo}
            resizeMode="contain"
          />
          
          <TouchableOpacity onPress={handleAbrirMenu} style={styles.iconButton}>
            <Ionicons name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.pageTitle, { color: '#FFFFFF' }]}>{title}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "flex-end",
  },
  menuContent: {
    height: "100%",
    width: "75%",
    paddingTop: 80,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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