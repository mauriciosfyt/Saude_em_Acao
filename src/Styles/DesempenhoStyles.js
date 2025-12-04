import { Dimensions, Platform } from 'react-native';

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

const { width } = Dimensions.get('window');

const createStyles = (isDark) => {
  const colors = {
    primary: '#405CBA',
    background: isDark ? '#2B2F36' : '#F5F5F5',
    headerBg: '#405CBA',
    headerText: '#FFFFFF',
    cardBg: isDark ? '#3A3F47' : '#FFFFFF',
    cardBorder: isDark ? '#525862' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#C9CEDA' : '#666666',
  // overlay suave: transparente no tema claro, leve escurecimento no escuro
  overlay: isDark ? 'rgba(0, 0, 0, 0.12)' : 'transparent',
  // Make menu colors match the treino screens
  menuBg: isDark ? '#2C2C2C' : '#FFFFFF',
  menuTitle: isDark ? '#ffffffff' : '#000000',
  menuItemText: isDark ? '#FFFFFF' : '#000000',
    menuItemActiveBg: isDark ? 'rgba(64,92,186,0.15)' : '#F0F4FF',
    success: '#4CAF50',
  };

  return {
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
  
    // Seção Superior
    topSection: {
      flex: 0.38,
      paddingTop: 18,
      paddingHorizontal: 0,
      justifyContent: 'flex-start',
    },

    // Header com título mais à esquerda
    headerContainer: {
      height: 56,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 12,
      marginBottom: 4,
    },
    backButton: {
      position: 'absolute',
      left: 10,
      top: 14,
      zIndex: 2,
      padding: 6,
    },
    menuButton: {
      position: 'absolute',
      right: 12,
      top: 14,
      zIndex: 2,
      padding: 6,
    },

    monthYearText: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.headerText,
      textAlign: 'left',
      alignSelf: 'flex-start',
      marginLeft: 8,
      marginTop: 20,
      marginBottom: 4,
    },
  
    // Barra de progresso
    progressContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 80,
      paddingHorizontal: 12,
      paddingLeft: 8,
    },
  
    progressBar: {
      flex: 1,
      maxWidth: Math.min(340, width - 160),
      height: 8,
      backgroundColor: 'rgba(255,255,255,0.32)',
      borderRadius: 4,
      marginRight: 10,
    },
  
    progressFill: {
      height: '100%',
      backgroundColor: colors.headerText,
      borderRadius: 4,
    },
  
    progressText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.headerText,
      minWidth: 40,
      textAlign: 'right',
    },
  
    // Seção Inferior
    bottomSection: {
      flex: 0.62,
      backgroundColor: colors.background,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 0,
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 20,
    },
  
    progressTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
  
    progressTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginRight: 10,
      alignSelf: 'center',
    },

    progressTitleIcon: {
      width: 18,
      height: 18,
    },
    
  
    cardsContainer: {
      flex: 1,
    },
  
    cardRow: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems: 'center',
    },
  
    iconCard: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      elevation: 4,
    },

    iconImage: {
      width: 26,
      height: 26,
    },
  
    infoCard: {
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 12,
      // Remover sombra pesada (Android elevation) que cria um contorno escuro
      elevation: 0,
      // Usar borda sutil em tema claro para manter separação visual
      borderWidth: isDark ? 1 : 1,
      borderColor: isDark ? colors.cardBorder : 'rgba(0,0,0,0.06)',
    },
  
    infoLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    
    infoValue: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },

    /* Modal / menu styles */
    menuOverlay: {
      flex: 1,
      // overlay transparente para evitar dimming pesado em alguns dispositivos
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