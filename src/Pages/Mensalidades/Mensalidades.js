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
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
// Usaremos Ionicons para manter a consistência com a tela Desempenho
import { Ionicons } from "@expo/vector-icons";

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

const Mensalidades = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { logout } = useAuth();
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
    if (navigation) navigation.navigate(nomeDaTela);
  };

  const handleSairConta = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
              try {
                handleFecharMenu();
                await logout();
                navigation.navigate('Inicial');
              } catch (error) {
                Alert.alert('Erro', 'Erro ao sair da conta. Tente novamente.');
              }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: '#2B2B2B' }]}>
  <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />

      {/* --- CÓDIGO DO MENU MODAL (ADICIONADO) --- */}
      <Modal
             animationType="fade"
             transparent={true}
             visible={menuVisivel}
             onRequestClose={handleFecharMenu}
           >
             <TouchableOpacity
               // overlay transparente para evitar sombra pesada
               style={[styles.menuOverlay, { backgroundColor: 'transparent' }]}
               onPress={handleFecharMenu}
               activeOpacity={1}
             >
              <View style={[styles.menuContent, isDark && { backgroundColor: '#262626' }]}>
                <Text style={[styles.menuTitle, isDark && { color: '#FFFFFF' }]}>Menu</Text>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("Home")}
                 >
                   <Ionicons name="home-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Home</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("Perfil")}
                 >
                   <Ionicons name="person-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Meu Perfil</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("Chat")}
                 >
                   <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Chat</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("Mensalidades")}
                 >
                
                   <Ionicons name="cart-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Loja</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("LojaFavoritos")}
                 >
                   <Ionicons name="heart-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Favoritos</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("LojaReservas")}
                 >
                   <Ionicons name="bookmark-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Reservas</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.menuItem}
                   onPress={() => handleNavegar("Desempenho")}
                 >
                   <Ionicons name="bar-chart-outline" size={24} color={isDark ? '#E6EEF8' : '#333'} />
                  <Text style={[styles.menuItemText, { color: isDark ? '#E6EEF8' : '#333' }]}>Desempenho</Text>
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

      {/* --- CONTEÚDO ORIGINAL DA TELA --- */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerImageContainer}>
          <Image
            source={require("../../../assets/banner_mensalidades.jpeg")} // Ajuste o caminho da imagem se necessário
            style={styles.headerImage}
          />
          {/* O novo cabeçalho com os botões sobre a imagem */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleVoltar}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleAbrirMenu}
            >
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- CONTAINER BRANCO COM O CONTEÚDO (INTOCADO) --- */}
        {/* Todo o seu código original está aqui, como você pediu. */}
        <View style={[styles.contentContainer, isDark && { backgroundColor: '#3A3A3A' }]}>
          <Text style={[styles.mainTitle, isDark && { color: '#FFFFFF' }]}>
            Alunos Saúde em Ação tem{" "}
            <Text style={styles.highlightTitle}>muito mais vantagens!</Text>
          </Text>
          <Text style={[styles.subtitle, isDark && { color: '#D1D5DB' }]}>
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
                <Text style={[styles.featureTitle, isDark && { color: '#FFFFFF' }]}>
                  Recursos exclusivos no app
                </Text>
                <Text style={[styles.featureDescription, isDark && { color: '#C7C7C7' }]}>
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
                <Text style={[styles.featureTitle, isDark && { color: '#FFFFFF' }]}>
                  Área de musculação e aeróbico
                </Text>
                <Text style={[styles.featureDescription, isDark && { color: '#C7C7C7' }]}>
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
                <Text style={[styles.featureTitle, isDark && { color: '#FFFFFF' }]}>
                  Professores especialistas
                </Text>
                <Text style={[styles.featureDescription, isDark && { color: '#C7C7C7' }]}>
                  Profissionais com todo o conhecimento necessário para orientar
                  nossos alunos saúde em ação.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.primary }]} onPress={() => navigation && navigation.navigate('TelaPlanos')}>
            <Text style={[styles.mainButtonText, { color: '#FFFFFF' }]}>Planos</Text>
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
    // anteriormente usava RGBA(0,0,0,0.5) — agora transparente
    backgroundColor: 'transparent',
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
    backgroundColor: "transparent",
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
    borderWidth: 2,
    borderColor: "#405CBA",
    ...platformShadow({
      boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 8,
    }),
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
    ...platformShadow({
      boxShadow: "0px 8px 18px rgba(106,130,251,0.35)",
      shadowColor: "#6A82FB",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 4,
    }),
    marginTop: 16,
  },
  mainButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});

export default Mensalidades;