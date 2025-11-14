import { Dimensions, Platform } from "react-native";

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

const { width, height } = Dimensions.get("window");

const createStyles = (isDark) => {
  const colors = {
    primary: '#A7C3F8',
    background: isDark ? '#2B2F36' : '#F5F5F5',
    headerBg: '#405CBA',
    headerText: '#FFFFFF',
    cardBg: isDark ? '#3A3F47' : '#FFFFFF',
    cardBorder: isDark ? '#525862' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#C9CEDA' : '#666666',
     // overlay mais suave — transparente no tema claro, leve sobreposição no escuro
     overlay: isDark ? 'rgba(0, 0, 0, 0.12)' : 'transparent',
  // Match training screens: darker neutral for menu background in dark mode
  menuBg: isDark ? '#2C2C2C' : '#FFFFFF',
  // Menu text/icons: white in dark mode, black in light mode (same as treino screens)
  menuTitle: isDark ? '#FFFFFF' : '#000000',
  menuItemText: isDark ? '#FFFFFF' : '#000000',
    menuItemActiveBg: isDark ? 'rgba(64,92,186,0.15)' : '#F0F4FF',
    success: '#4CAF50',
  };

  return {
    container: {
      flex: 1,
      backgroundColor: colors.background,
      position: "relative",
    },
    diagonalBg: {
      position: "absolute",
      top: -120, // valor negativo para subir o recorte
      left: 0,
      width: 0,
      height: 0,
      borderBottomWidth: height + 120,
      borderRightWidth: width,
      borderTopWidth: 0,
      borderBottomColor: colors.headerBg,
      borderRightColor: "transparent",
      borderTopColor: "transparent",
      zIndex: 0,
      opacity: 1,
    },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    marginBottom: 10,
    zIndex: 2,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.headerText,
    },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
    zIndex: 2,
  },
    cardPlano: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      paddingVertical: 28,
      paddingHorizontal: 26,
      width: width * 0.93,
      marginTop: 10,
      marginBottom: 22,
      borderWidth: 1.2,
      borderColor: colors.cardBorder,
      ...platformShadow({
        boxShadow: isDark ? "0px 12px 24px rgba(0,0,0,0.35)" : "0px 12px 24px rgba(64,92,186,0.18)",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.12 : 0.08,
        shadowRadius: 6,
        elevation: 3,
      }),
      zIndex: 2,
      overflow: "visible",
    },
    cardPlanoRecorte: {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: 38,
      height: 14,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 18,
      borderTopRightRadius: 18,
      zIndex: 3,
    },
    planoAtivo: {
      color: colors.success,
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 2,
      marginLeft: 2,
      letterSpacing: 0.2,
    },
    nomePlano: {
      color: colors.primary,
      fontWeight: "bold",
      fontSize: 34,
      marginBottom: 18,
      fontFamily: "monospace",
      letterSpacing: 0.5,
    },
  beneficiosList: {
    marginTop: 12,
    gap: 6,
  },
  beneficioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 2,
  },
    beneficioText: {
      marginLeft: 12,
      fontSize: 23,
      color: colors.textPrimary,
      fontWeight: "bold",
      letterSpacing: 0.1,
    },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.93,
    marginBottom: 18,
    gap: 0,
  },
    infoBox: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 16,
      width: width * 0.44,
      alignItems: "flex-start",
      ...platformShadow({
        boxShadow: isDark ? "0px 8px 20px rgba(0,0,0,0.3)" : "0px 6px 16px rgba(64,92,186,0.12)",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.12 : 0.06,
        shadowRadius: 6,
        elevation: 3,
      }),
      borderWidth: 1.2,
      borderColor: colors.cardBorder,
      marginBottom: 8,
    },
    infoLabel: {
      color: colors.textSecondary,
      fontSize: 16,
      marginBottom: 4,
      fontWeight: "600",
      marginLeft: 2,
    },
    infoValue: {
      color: colors.textPrimary,
      fontSize: 22,
          ...Platform.select({
            web: { textShadow: isDark ? '0 2px 10px rgba(64,92,186,0.20)' : '0 1px 6px rgba(49,76,182,0.10)' },
            default: {
              // Mobile não suporta textShadow nativo
            },
          }),
    },
    renovarButton: {
      marginTop: 30,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      width: width * 0.8,
      alignItems: "center",
      alignSelf: "center",
      ...platformShadow({
        boxShadow: isDark ? "0px 6px 14px rgba(0,0,0,0.35)" : "0px 6px 14px rgba(0,0,0,0.2)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 3,
        elevation: 2,
      }),
    },
  renovarButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
    menuOverlay: {
      flex: 1,
      // usa a cor overlay calculada (suave/transparente)
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },

    menuContent: {
      backgroundColor: colors.menuBg,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 30,
      width: 250,
      height: "100%",
      ...platformShadow({
        boxShadow: isDark ? "-6px 0px 18px rgba(0,0,0,0.35)" : "-6px 0px 18px rgba(0,0,0,0.15)",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: isDark ? 0.12 : 0.08,
        shadowRadius: 6,
        elevation: 3,
      }),
      borderLeftWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.cardBorder : 'transparent',
    },

    menuTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.menuTitle,
      marginBottom: 20,
      textAlign: "center",
    },

    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 5,
    },

    menuItemAtivo: {
      backgroundColor: colors.menuItemActiveBg,
    },

    menuItemText: {
      fontSize: 16,
      color: colors.menuItemText,
      marginLeft: 15,
      fontWeight: "500",
    },

    menuItemTextAtivo: {
      color: colors.primary,
      fontWeight: "600",
    },

  };
};

export default createStyles;
