import { Platform } from 'react-native';

const platformShadow = ({
  shadowColor = '#000',
  shadowOffset = { width: 0, height: 2 },
  shadowOpacity = 0.15,
  shadowRadius = 4,
  elevation,
  boxShadow,
} = {}) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: boxShadow ?? `0px 0px 0px rgba(0,0,0,0)`,
    };
  }

  // Mobile: usar apenas elevation (Android) - iOS não tem suporte nativo para shadow properties direto
  return {
    elevation: elevation ?? 5,
  };
};

const createStyles = (isDark) => {
  const colors = {
    primary: '#405CBA',
    background: isDark ? '#2C2C2C' : '#F5F5F5',
    headerBg: '#405CBA',
    headerText: '#FFFFFF',
    cardBg: isDark ? '#3A3A3A' : '#FFFFFF',
    cardBorder: isDark ? '#D9D9D9' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#D9D9D9' : '#666666',
  // reduzir overlay pesado — usar transparente para evitar sombra grande
  overlay: 'transparent',
    menuBg: isDark ? '#1A1F2E' : '#FFFFFF',
    menuTitle: isDark ? '#E6E8F3' : '#333333',
    menuItemText: isDark ? '#D3D8EB' : '#333333',
    menuItemActiveBg: isDark ? 'rgba(64,92,186,0.15)' : '#F0F4FF',
    success: '#4CAF50',
  };

  return {
    container: {
      flex: 1,
      backgroundColor: colors.headerBg,
    },

    // Header Azul
    header: {
      backgroundColor: colors.headerBg,
      paddingTop: 20,
      paddingBottom: 30,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 30,
      paddingHorizontal: 20,
      backgroundColor: "transparent",
      marginBottom: 20,
      zIndex: 2,
    },

    backButton: {
      padding: 8,
    },

    // título do header (mantido branco)
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.headerText,
    },

    menuButton: {
      padding: 8,
    },

    greetingSection: {
      paddingHorizontal: 20,
    },

    // saudação principal (deixar branco)
    greeting: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.headerText,
      marginBottom: 5,
    },

    // data também branca para contraste
    date: {
      fontSize: 16,
      color: colors.headerText,
      opacity: 0.9,
    },

    // Conteúdo Principal — curva direita maior para replicar a imagem
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: colors.background,
      // aumentar a curvatura do canto direito
      borderTopLeftRadius: 0,
      borderTopRightRadius: 50,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    // Card de Treino
    treinoCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.cardBorder,
      ...platformShadow({
        boxShadow: isDark ? '0px 8px 20px rgba(0,0,0,0.35)' : '0px 6px 16px rgba(0,0,0,0.12)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.25 : 0.08,
        shadowRadius: 4,
        elevation: isDark ? 4 : 2,
      }),
    },

    treinoImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 15,
    },

    treinoInfo: {
      flex: 1,
    },

    // título do treino (forçar branco para melhor contraste no tema escuro)
    treinoDia: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.headerText,
      flexShrink: 1,
      minWidth: 0,
    },

    // subtítulo/grupos em branco claro
    treinoGrupos: {
      fontSize: 14,
      color: isDark ? 'rgba(255,255,255,0.85)' : '#666666',
    },

    iniciarButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },

    iniciarButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      marginRight: 5,
    },

    concluidoButton: {
      backgroundColor: colors.success,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },

    concluidoButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      marginRight: 5,
    },

    // Estilos do Modal
  menuOverlay: {
    flex: 1,
    // overlay transparente para evitar dimming pesado
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
  menuContent: {
    height: '100%',
    width: '75%',
    paddingTop: 80,
    paddingHorizontal: 20,
    ...platformShadow({
      boxShadow: isDark ? '-6px 0px 18px rgba(0,0,0,0.35)' : '-6px 0px 18px rgba(0,0,0,0.12)',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
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
  };
};

export default createStyles;
