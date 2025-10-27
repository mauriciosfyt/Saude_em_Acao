import { StyleSheet, Dimensions } from 'react-native';

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
      left: 12,
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
      fontSize: 26,
      fontWeight: '700',
      color: colors.headerText,
      textAlign: 'left',
      alignSelf: 'flex-start',
      marginLeft: 8,
      marginTop: 12,
      marginBottom: 4,
    },
  
    // Barra de progresso
    progressContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 5,
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
      resizeMode: 'contain',
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
      tintColor: '#ffffff',
      resizeMode: 'contain',
    },
  
    infoCard: {
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 12,
      elevation: 3,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.cardBorder : 'transparent',
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
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'flex-end', // menu abre pela direita
    },

    menuContent: {
      backgroundColor: '#1A1F2E', // fundo azul-escuro fixo como na imagem
      paddingVertical: 30,
      paddingHorizontal: 20,
      width: 280,
      height: '100%',
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      borderRightWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },

    menuTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF', // branco como na imagem
      marginBottom: 20,
      textAlign: 'left',
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 12,
      marginBottom: 8,
    },

    menuItemActive: {
      backgroundColor: '#2A3441', // fundo azul-escuro para item ativo
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },

    menuItemText: {
      fontSize: 16,
      color: '#FFFFFF', // branco para todos os itens
      marginLeft: 15,
      fontWeight: '500',
    },

    menuItemTextActive: {
      color: '#405CBA', // azul para item ativo
      fontWeight: '600',
    },
  });
};

export default createStyles;