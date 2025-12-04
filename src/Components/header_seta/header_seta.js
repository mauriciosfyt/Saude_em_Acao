import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const DesempenhoHeader = ({ navigation, mesAno, isDark, extraMarginTop }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark: themeIsDark } = useTheme();
  const { logout } = useAuth();

  const handleVoltar = () => {
    try {
      // tenta obter a rota atual de forma confiável
      const currentRoute = (navigation && navigation.getCurrentRoute && navigation.getCurrentRoute().name)
        || (navigation?.getState && navigation.getState().routes?.[navigation.getState().index]?.name)
        || null;

      // Se estiver em uma tela de Treino, resetar a pilha para [Home, MeuTreino]
      if (currentRoute && /^Treino/i.test(currentRoute)) {
        if (navigation.reset) {
          navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'MeuTreino' }] });
        } else if (navigation.replace) {
          navigation.replace('MeuTreino');
        } else {
          navigation.navigate && navigation.navigate('MeuTreino');
        }
        return;
      }

      // Se estiver em MeuTreino, resetar para [Home]
      if (currentRoute === 'MeuTreino') {
        if (navigation.reset) {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } else if (navigation.replace) {
          navigation.replace('Home');
        } else {
          navigation.navigate && navigation.navigate('Home');
        }
        return;
      }
    } catch (err) {
      // fallback para comportamento padrão
    }

    if (navigation) navigation.goBack();
  };

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  const handleSairConta = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Logout cancelado'),
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              handleFecharMenu();
              await logout();
              navigation.navigate('Inicial');
              console.log('✅ Logout realizado com sucesso');
            } catch (error) {
              console.error('❌ Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao sair da conta. Tente novamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Use cores do ThemeContext para o menu acompanhar o tema
  const theme = {
    iconColor: colors.textPrimary,
    menuText: colors.textPrimary,
    menuBg: colors.surface,
    menuIconColor: colors.textSecondary,
  };
  // Tornar o overlay transparente para evitar sombra pesada quando o menu abre
  const overlayColor = 'transparent';

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
          <View style={[styles.menuContent, { backgroundColor: theme.menuBg }]}> 
            <Text style={[styles.menuTitle, { color: theme.menuText }]}>Menu</Text>
            {[
              { name: "home-outline", text: "Home", screen: "Home" },
              { name: "person-outline", text: "Meu Perfil", screen: "Perfil" },
              { name: "chatbubble-outline", text: "Chat", screen: "Chat" },
              { name: "cart-outline", text: "Loja", screen: "Loja" },
              { name: "heart-outline", text: "Favoritos", screen: "LojaFavoritos" },
              { name: "bookmark-outline", text: "Reservas", screen: "LojaReservas" },
              { name: "bar-chart-outline", text: "Desempenho", screen: "Desempenho" },
            ].map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={styles.menuItem}
                onPress={() => handleNavegar(item.screen)}
              >
                <Ionicons name={item.name} size={24} color={theme.menuIconColor} />
                <Text style={[styles.menuItemText, { color: theme.menuText }]}> 
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSairConta}
            >
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: "#dc3545" }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={[styles.header, { marginTop: typeof extraMarginTop === 'number' ? extraMarginTop : styles.header.marginTop }]}>
        {/* Só renderiza a seta se não estiver na Home */}
        {navigation?.getState?.()?.routeNames?.[navigation?.getState?.()?.index] !== 'Home' && (
          <TouchableOpacity style={styles.headerButton} onPress={handleVoltar}>
            <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.headerButton} onPress={handleAbrirMenu}>
          <Ionicons name="menu" size={28} color={theme.iconColor} />
        </TouchableOpacity>
      </View>

      {mesAno && (
        <Text style={[styles.monthYearText, { color: theme.iconColor }]}>{mesAno}</Text>
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
    ...Platform.select({
      web: { boxShadow: '-2px 0px 10px rgba(0,0,0,0.25)' },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
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
    marginTop: 15, // Sobe os ícones
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
