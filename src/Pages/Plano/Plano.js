import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, useColorScheme, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Styles/MeuPlanoStyles";
import { useThemePreference } from "../../context/ThemeContext";

const Plano = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { isDark: forcedDark } = useThemePreference();
  const isDark = forcedDark === undefined ? colorScheme === 'dark' : forcedDark;
  const [menuVisivel, setMenuVisivel] = useState(false);

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation) navigation.navigate(nomeDaTela);
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#2B2B2B' }]}>
      <StatusBar barStyle={"light-content"} />
      {/* Fundo diagonal */}
      <View style={styles.diagonalBg} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#222'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && { color: '#FFFFFF' }]}>Meu plano</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={28} color={isDark ? '#FFFFFF' : '#222'} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do plano */}
        <View style={[styles.cardPlano, isDark && { backgroundColor: '#3A3A3A', borderColor: '#405CBA', shadowColor: '#000' }]}>
          <Text style={[styles.planoAtivo, isDark && { color: '#22C55E' }]}>Plano ativo</Text>
          <Text style={[styles.nomePlano, isDark && { color: '#7EA3FF', textShadowColor: 'rgba(126,163,255,0.10)' }]}>Essencial</Text>
          <View style={styles.beneficiosList}>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={[styles.beneficioText, isDark && { color: '#FFFFFF' }]}>Funcional</Text>
            </View>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={[styles.beneficioText, isDark && { color: '#FFFFFF' }]}>Thay Fit</Text>
            </View>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={[styles.beneficioText, isDark && { color: '#FFFFFF' }]}>Pilates</Text>
            </View>
          </View>
        </View>

        {/* Informações do plano */}
        <View style={styles.infoRow}>
          <View style={[styles.infoBox, isDark && { backgroundColor: '#3A3A3A', borderColor: '#405CBA' }]}>
            <Text style={[styles.infoLabel, isDark && { color: '#D1D5DB' }]}>Início:</Text>
            <Text style={[styles.infoValue, isDark && { color: '#FFFFFF' }]}>25/09/2025</Text>
          </View>
          <View style={[styles.infoBox, isDark && { backgroundColor: '#3A3A3A', borderColor: '#405CBA' }]}>
            <Text style={[styles.infoLabel, isDark && { color: '#D1D5DB' }]}>Vencimento:</Text>
            <Text style={[styles.infoValue, isDark && { color: '#FFFFFF' }]}>25/10/2025</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={[styles.infoBox, isDark && { backgroundColor: '#3A3A3A', borderColor: '#405CBA' }]}>
            <Text style={[styles.infoLabel, isDark && { color: '#D1D5DB' }]}>Valor do plano:</Text>
            <Text style={[styles.infoValue, isDark && { color: '#FFFFFF' }]}>R$159,90</Text>
          </View>
          <View style={[styles.infoBox, isDark && { backgroundColor: '#3A3A3A', borderColor: '#405CBA' }]}>
            <Text style={[styles.infoLabel, isDark && { color: '#D1D5DB' }]}>Duração:</Text>
            <Text style={[styles.infoValue, isDark && { color: '#FFFFFF' }]}>2 meses</Text>
          </View>
        </View>

        {/* Botão de renovar */}
            <TouchableOpacity
          style={[styles.renovarButton, isDark && { backgroundColor: '#7B97F4', shadowColor: '#000' }]}
          onPress={() => handleNavegar("TelaPlanos")}
        >
          <Text style={styles.renovarButtonText}>Renovar Plano</Text>
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
          style={styles.menuOverlay}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={[styles.menuContent, isDark && { backgroundColor: '#262626' }]}>
            <Text style={[styles.menuTitle, isDark && { color: '#FFFFFF' }]}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Mensalidades")}
            >
              <Ionicons name="card-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Mensalidades</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaProdutos")}
            >
              <Ionicons name="cart-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons name="heart-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons name="bookmark-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={[styles.menuItemText, isDark && { color: '#E5E7EB' }]}>Desempenho</Text>
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
    </View>
  );
};

export default Plano;
