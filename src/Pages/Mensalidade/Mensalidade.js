import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Modal,
} from "react-native";
// Usaremos Ionicons para manter a consistência com a tela Desempenho
import { Ionicons } from "@expo/vector-icons";
import HeaderSeta from '../../Components/header_seta/header_seta';

const Mensalidades = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Funções de controle do menu e navegação
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* --- CÓDIGO DO MENU MODAL (ADICIONADO) --- */}
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

            {/* Itens do Menu */}
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
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#333"
              />
              <Text style={styles.menuItemText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemAtivo]}
              onPress={handleFecharMenu}
            >
              <Ionicons name="ribbon-outline" size={24} color="#405CBA" />
              <Text style={[styles.menuItemText, { color: "#405CBA" }]}>
                Mensalidades
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => console.log("Configurações")}
            >
              <Ionicons name="settings-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Configurações</Text>
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

      {/* --- CONTEÚDO ORIGINAL DA TELA --- */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerImageContainer}>
                      {/* Header com seta de voltar e menu */}
                      <HeaderSeta navigation={navigation} mesAno={null} />
          <Image
            source={require("../../../assets/banner_mensalidades.jpeg")} // Ajuste o caminho da imagem se necessário
            style={styles.headerImage}
          />
        </View>

        {/* --- CONTAINER BRANCO COM O CONTEÚDO (INTOCADO) --- */}
        {/* Todo o seu código original está aqui, como você pediu. */}
        <View style={styles.contentContainer}>
          <Text style={styles.mainTitle}>
            Alunos Saúde em Ação tem{" "}
            <Text style={styles.highlightTitle}>muito mais vantagens!</Text>
          </Text>
          <Text style={styles.subtitle}>
            Equipamentos de ponta e um espaço ideal para seu treino. Tudo o que
            você precisa para alcançar seus objetivos está aqui.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItemContainer}>
              <View style={styles.featureIconContainer}>
                {/* Ícone atualizado para Ionicons para consistência */}
                <Ionicons
                  name="phone-portrait-outline"
                  size={28}
                  color="#6A82FB"
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>
                  Recursos exclusivos no app
                </Text>
                <Text style={styles.featureDescription}>
                  Registre seu progresso, treinos personalizados, imagens,
                  exercícios e muito mais.
                </Text>
              </View>
            </View>

            <View style={styles.featureItemContainer}>
              <View style={styles.featureIconContainer}>
                {/* Ícone atualizado para Ionicons para consistência */}
                <Ionicons name="barbell-outline" size={28} color="#6A82FB" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>
                  Área de musculação e aeróbico
                </Text>
                <Text style={styles.featureDescription}>
                  Ampla área de musculação e equipamentos de qualidade de última
                  geração.
                </Text>
              </View>
            </View>

            <View style={styles.featureItemContainer}>
              <View style={styles.featureIconContainer}>
                {/* Ícone atualizado para Ionicons para consistência */}
                <Ionicons name="people-outline" size={28} color="#6A82FB" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>
                  Professores especialistas
                </Text>
                <Text style={styles.featureDescription}>
                  Profissionais com todo o conhecimento necessário para orientar
                  nossos alunos saúde em ação.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.mainButtonText}>Quero ser aluno!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- FOLHA DE ESTILOS COMPLETA ---
const styles = StyleSheet.create({
  // Estilos do Menu Modal
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
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  menuItemAtivo: {
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#333",
    fontWeight: "500",
  },

  // Estilos da tela Mensalidades
  safeArea: { flex: 1, backgroundColor: "#F4F7FF" },
  scrollViewContainer: { flexGrow: 1, paddingBottom: 40 },
  headerImageContainer: { position: "relative", backgroundColor: "#333D5B" },
  headerImage: { width: "100%", height: 200 },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  headerButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    borderRadius: 20,
  },

  // Estilos do container branco e seu conteúdo (originais)
  contentContainer: {
    padding: 24,
    marginTop: -30,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333D5B",
    textAlign: "center",
    marginBottom: 8,
  },
  highlightTitle: { color: "#6A82FB" },
  subtitle: {
    fontSize: 16,
    color: "#6E7A94",
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 24,
  },
  featuresList: { width: "100%" },
  featureItemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  featureIconContainer: {
    marginRight: 20,
    width: 40,
    paddingTop: 4,
    alignItems: "center",
  },
  featureTextContainer: { flex: 1 },
  featureTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333D5B",
    marginBottom: 4,
  },
  featureDescription: { fontSize: 15, color: "#6E7A94", lineHeight: 22 },
  mainButton: {
    backgroundColor: "#8A9DFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#6A82FB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 16,
  },
  mainButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});

export default Mensalidades;
