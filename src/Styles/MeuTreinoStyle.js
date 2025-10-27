import { StyleSheet } from 'react-native';

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
    overlay: 'rgba(0, 0, 0, 0.5)',
    menuBg: isDark ? '#1A1F2E' : '#FFFFFF',
    menuTitle: isDark ? '#E6E8F3' : '#333333',
    menuItemText: isDark ? '#D3D8EB' : '#333333',
    menuItemActiveBg: isDark ? 'rgba(64,92,186,0.15)' : '#F0F4FF',
    success: '#4CAF50',
  };

  return StyleSheet.create({
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
      borderBottomRightRadius: 50,
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 4,
      elevation: isDark ? 4 : 2,
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

    // Estilos do Menu Modal
    menuOverlay: {
      flex: 1,
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
      height: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderLeftWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.cardBorder : 'transparent',
    },

    menuTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.menuTitle,
      marginBottom: 20,
      textAlign: 'center',
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
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
      fontWeight: '500',
    },

    menuItemTextAtivo: {
      color: colors.primary,
      fontWeight: '600',
    },
  });
};

export default createStyles;
