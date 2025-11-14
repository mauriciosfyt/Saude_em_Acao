import { StyleSheet, Dimensions, Platform } from 'react-native';

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
const cardWidth = (width - 48) / 2;

const createStyles = (isDark) => StyleSheet.create({
  logo: {
    width: 45,
    height: 45,
    marginTop: 15,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  whatsappButton: {
    backgroundColor: '#5FC248',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...platformShadow({
      boxShadow: '0px 6px 14px rgba(0,0,0,0.25)',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 7,
    }),
  },
  whatsappIcon: {
    width: 28, 
    height: 28,
    marginRight: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#333333' : '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  // --- FORMA AZUL ATUALIZADA ---
  blueShape: {
    backgroundColor: '#4A69BD',
    width: width * 2,
    height: '90%',
    position: 'absolute',
    bottom: -400, // <-- EMPURRAMOS A FORMA MAIS PARA BAIXO
    left: '-30%',
    transform: [{ rotate: '-30deg' }], // <-- AUMENTAMOS A INCLINAÇÃO
  },
  // --- FIM DA ATUALIZAÇÃO ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 60,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  scrollViewContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: isDark ? '#444444' : '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    ...platformShadow({
      boxShadow: isDark ? '0px 10px 20px rgba(0,0,0,0.35)' : '0px 10px 20px rgba(0,0,0,0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 8,
    }),
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#F0F0F0',
  },
  professorName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default createStyles;