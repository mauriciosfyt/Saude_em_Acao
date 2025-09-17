import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  triangleSmall: {
    position: 'absolute',
    top: -10,
    right: 10,
    width: 30,
    height: 0,
    borderRightWidth: 60,
    borderTopWidth: 80,
  borderTopRightRadius: 0,
  borderTopLeftRadius: 10,
    borderRightColor: 'transparent',
    borderTopColor: '#405CBA',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 100,
    transform: [{ rotate: '90deg' }],

  },
  diagonalWhite: {
    position: 'absolute',
    bottom: -120, // Valor aumentado para descer mais o triângulo
    left: 0,
    width: 0,
    height: 0,
    borderBottomWidth: height,
    borderRightWidth: width,
    borderTopWidth: 0,
    borderBottomColor: '#ffffff',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    zIndex: 2,
    opacity: 0.98,
  },
  // --- Estrutura Principal e Fundo ---
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  // --- Cabeçalho ---
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 20,
  //   paddingTop: 20,
  //   paddingBottom: 20,
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   zIndex: 3,
  // },
  // backButton: {
  //   marginRight: 15,
  // },
  // headerTitle: {
  //   color: '#ffffff',
  //   fontSize: 15,
  //   fontWeight: 'bold',
  //   marginLeft:  118 ,
  //   marginTop: 40
  //  },

  // --- ScrollView ---
  scrollView: {
    flex: 1,
    marginTop: '15%',
    zIndex: 2,
  },

  // --- Conteúdo (contentContainerStyle) ---
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },

  // --- Estilo Base do Card ---
  planCard: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 20, // Adiciona margem superior para descer o card
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },

  diagonalBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 0,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#405CBA',
    zIndex: 1,
  },
  // --- Banner ("Mais Vantajoso") ---
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#405CBA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: -19, // Valor aumentado para descer o banner
    marginLeft: -18,
    marginBottom: 8,
    minHeight: 32,
  },
  bannerIcon: {
    width: 20,
    height: 23,
    marginRight: 6,
    resizeMode: 'contain',
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },

  // --- Textos e Botão dentro do Card ---
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 10,
    lineHeight: 21,
    color: '#6b7280',
    marginBottom: 20,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b67df',
    marginBottom: 20,
  },
  saibaMaisButton: {
    backgroundColor: '#405CBA',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saibaMaisText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
