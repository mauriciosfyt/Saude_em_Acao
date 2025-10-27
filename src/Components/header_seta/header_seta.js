import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const DesempenhoHeader = ({ navigation, mesAno, isDark }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors } = useTheme();

  const handleVoltar = () => {
    if (navigation) navigation.goBack();
  };

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  const iconColor = isDark ? "#FFFFFF" : "#000000";
  const menuTextColor = isDark ? "#FFFFFF" : "#333333";
  const menuBg = isDark ? "#2C2C2C" : "#FFFFFF";
  const overlayColor = isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={[styles.menuOverlay, { backgroundColor: overlayColor }]}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={[styles.menuContent, { backgroundColor: menuBg }]}>
            <Text style={[styles.menuTitle, { color: menuTextColor }]}>Menu</Text>

            {[
              { name: "home-outline", text: "Home", screen: "Home" },
              { name: "person-outline", text: "Meu Perfil", screen: "Perfil" },
              { name: "chatbubble-outline", text: "Chat", screen: "Chat" },
              { name: "cart-outline", text: "Loja", screen: "LojaProdutos" },
              { name: "heart-outline", text: "Favoritos", screen: "LojaFavoritos" },
              { name: "bookmark-outline", text: "Reservas", screen: "LojaReservas" },
              { name: "bar-chart-outline", text: "Desempenho", screen: "Desempenho" },
            ].map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={styles.menuItem}
                onPress={() => handleNavegar(item.screen)}
              >
                <Ionicons name={item.name} size={24} color={menuTextColor} />
                <Text style={[styles.menuItemText, { color: menuTextColor }]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Inicial")}
            >
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: "#dc3545" }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

      {mesAno && (
        <Text style={[styles.monthYearText, { color: iconColor }]}>{mesAno}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
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
    textAlign: "left",
  },
});

export default DesempenhoHeader;
