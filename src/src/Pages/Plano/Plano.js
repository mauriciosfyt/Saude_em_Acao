import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "../../Styles/MeuPlanoStyles";
import { useTheme } from "../../context/ThemeContext";

const Plano = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation) navigation.navigate(nomeDaTela);
  };

  const menuBg = isDark ? "#2c2c2c" : "#FFFFFF";
  const overlayBg = isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)";
  const logoutColor = "#E24B4B";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fundo diagonal */}
      <View style={styles.diagonalBg} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#fff' : colors.headerText }]}>Meu plano</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={28} color={isDark ? '#fff' : colors.headerText} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do plano */}
        <View style={styles.cardPlano}>
          <Text style={[styles.planoAtivo, { color: colors.textSecondary }]}>Plano ativo</Text>
          <Text style={[styles.nomePlano, { color: '#405CBA' }]}>Essencial</Text>
          <View style={styles.beneficiosList}>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={[styles.beneficioText, { color: colors.textPrimary }]}>Funcional</Text>
            </View>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={[styles.beneficioText, { color: colors.textPrimary }]}>Thay Fit</Text>
            </View>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={[styles.beneficioText, { color: colors.textPrimary }]}>Pilates</Text>
            </View>
          </View>
        </View>

        {/* Informações do plano */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Data de renovação:</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>25/09/2025</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Vencimento:</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>25/10/2025</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Inicio da academia:</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>25/08/2025</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duração:</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>2 meses</Text>
          </View>
        </View>

        {/* Botão de renovar */}
        <TouchableOpacity
          style={styles.renovarButton}
          onPress={() => handleNavegar("Mensalidades")}
        >
          <Text style={styles.renovarButtonText}>Mensalidade</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Menu Lateral Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={[styles.menuOverlay, { backgroundColor: overlayBg }]}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View
            style={[
              styles.menuContent,
              {
                backgroundColor: menuBg,
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "#E9ECEF",
              },
            ]}
            onStartShouldSetResponder={() => true} // impede fechamento ao clicar no conteúdo
          >
            <Text style={[styles.menuTitle, { color: isDark ? '#fff' : colors.textPrimary }]}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
              <Ionicons name="home-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaProdutos")}
            >
              <Ionicons name="cart-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons name="heart-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color={isDark ? '#fff' : colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: isDark ? '#fff' : colors.textPrimary }]}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Inicial")}
            >
              <Ionicons name="log-out-outline" size={24} color={logoutColor} />
              <Text style={[styles.menuItemText, { color: logoutColor }]}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Plano;
