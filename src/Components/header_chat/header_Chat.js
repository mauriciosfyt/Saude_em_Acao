import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Componente renomeado para HeaderChat
const HeaderChat = ({ chatTitle, onBackPress, navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark } = useTheme();

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);


  // A navegação para telas normais
  const navegarParaTela = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation) {
      navigation.navigate(nomeDaTela);
    }
  };

  return (
    <>
      {/* Modal do Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={[styles.menuOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }]}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#1A1F2E' : 'white' }]}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("Home")}>
              <Ionicons name="home-outline" size={24} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("Perfil")}>
              <Ionicons name="person-outline" size={24} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemActive]} onPress={() => navegarParaTela("Chat")}>
              <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#405CBA' : '#405CBA'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#405CBA' : '#405CBA' }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("Loja")}>
              <Ionicons name="cart-outline" size={24} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("LojaFavoritos")}>
              <Ionicons name="heart-outline" size={24} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("LojaReservas")}>
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("Desempenho")}>
              <Ionicons name="bar-chart-outline" size={24} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarParaTela("Inicial")}>
              <Ionicons name="log-out-outline" size={24} color="#E24B4B" />
              <Text style={[styles.menuItemText, { color: "#E24B4B" }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Estrutura Visual do Header */}
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/icons/logo_dia.png')} // Ajuste o caminho
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={handleAbrirMenu} style={styles.iconButton}>
            <Ionicons name="menu" size={28} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
        {/* Usando a prop 'chatTitle' */}
        <Text style={[styles.pageTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>{chatTitle}</Text>
      </View>
    </>
  );
};

// Os estilos são idênticos aos do HeaderProfessores
const styles = StyleSheet.create({
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
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "flex-end",
  },
  menuContent: {
    height: "100%",
    width: "75%",
    backgroundColor: "white",
    paddingTop: 80,
    paddingHorizontal: 20,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#333",
    fontWeight: "500",
  },
  menuItemActive: {
    backgroundColor: 'rgba(64,92,186,0.15)',
    borderRadius: 12,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default HeaderChat;