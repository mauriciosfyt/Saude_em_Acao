import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Styles/MeuPlanoStyles";

const Plano = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation) navigation.navigate(nomeDaTela);
  };

  return (
    <View style={styles.container}>
      {/* Fundo diagonal */}
      <View style={styles.diagonalBg} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Meu plano</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do plano */}
        <View style={styles.cardPlano}>
          <Text style={styles.planoAtivo}>Plano ativo</Text>
          <Text style={styles.nomePlano}>Essencial</Text>
          <View style={styles.beneficiosList}>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.beneficioText}>Funcional</Text>
            </View>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.beneficioText}>Thay Fit</Text>
            </View>
            <View style={styles.beneficioItem}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.beneficioText}>Pilates</Text>
            </View>
          </View>
        </View>

        {/* Informações do plano */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Início:</Text>
            <Text style={styles.infoValue}>25/09/2025</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Vencimento:</Text>
            <Text style={styles.infoValue}>25/10/2025</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Valor do plano:</Text>
            <Text style={styles.infoValue}>R$159,90</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Duração:</Text>
            <Text style={styles.infoValue}>2 meses</Text>
          </View>
        </View>

        {/* Botão de renovar */}
        <TouchableOpacity style={styles.renovarButton}>
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
    </View>
  );
};

export default Plano;
