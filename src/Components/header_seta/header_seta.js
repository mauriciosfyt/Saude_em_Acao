import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DesempenhoHeader = ({ navigation, mesAno }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);

  const handleVoltar = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleAbrirMenu = () => {
    setMenuVisivel(true);
  };

  const handleFecharMenu = () => {
    setMenuVisivel(false);
  };

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
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
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Mensalidades")}
            >
              <Ionicons name="card-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Mensalidades</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaProdutos")}
            >
              <Ionicons name="cart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons name="heart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons name="bookmark-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Desempenho</Text>
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={24}  color='white'/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={28}  color='white' />
        </TouchableOpacity>
      </View>
      <Text style={styles.monthYearText}>{mesAno}</Text>
    </>
  );
};

const styles = StyleSheet.create({
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 45,
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
});

export default DesempenhoHeader;
