import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Styles/MensalidadesStyles";
import { useTheme } from "../../context/ThemeContext";

const Mensalidades = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark } = useTheme();

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation) navigation.navigate(nomeDaTela);
  };

  const menuBg = isDark ? "#1F2430" : "#FFFFFF";
  const overlayBg = isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)";
  const logoutColor = "#E24B4B";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Mensalidades</Text>
        <TouchableOpacity onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ...conteúdo da tela Mensalidades... */}
        <Text style={{ color: colors.textPrimary }}>Conteúdo de Mensalidades</Text>
      </ScrollView>

      <Modal animationType="fade" transparent visible={menuVisivel} onRequestClose={handleFecharMenu}>
        <TouchableOpacity style={[styles.menuOverlay, { backgroundColor: overlayBg }]} onPress={handleFecharMenu} activeOpacity={1}>
          <View
            style={[
              styles.menuContent,
              { backgroundColor: menuBg, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#E9ECEF" },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Menu</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Home")}>
              <Ionicons name="home-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Perfil")}>
              <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Chat")}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("LojaProdutos")}>
              <Ionicons name="cart-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Loja</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("LojaFavoritos")}>
              <Ionicons name="heart-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Favoritos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("LojaReservas")}>
              <Ionicons name="bookmark-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Reservas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Desempenho")}>
              <Ionicons name="bar-chart-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Desempenho</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Inicial")}>
              <Ionicons name="log-out-outline" size={24} color={logoutColor} />
              <Text style={[styles.menuItemText, { color: logoutColor }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Mensalidades;