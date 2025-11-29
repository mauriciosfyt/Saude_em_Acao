import { StyleSheet, Platform } from 'react-native';

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

const stylesModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // overlay removido para evitar sombra pesada quando modais abrirem
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '50%',
    minHeight: '35%',
    ...platformShadow({
      boxShadow: '0px -10px 20px rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    }),
  },
  modalContent: {
    flex: 1,
  },
  headerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  botaoFechar: {
    padding: 8,
  },
  iconeFechar: {
    fontSize: 32,
    color: '#333',
    fontWeight: '400',
  },
  conteudoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    minHeight: 0,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    ...platformShadow({
      boxShadow: '0px 5px 12px rgba(0,0,0,0.05)',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    }),
  },
  selecaoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  tituloSelecao: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  subtituloSelecao: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  botaoSelecao: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#405CBA',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 25,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    ...platformShadow({
      boxShadow: '0px 3px 6px rgba(64,92,186,0.12)',
      shadowColor: '#405CBA',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
    }),
  },
  textoBotaoSelecao: {
    color: '#405CBA',
    fontSize: 18,
    fontWeight: '600',
  },
  conteudoScroll: {
    paddingVertical: 25,
  },
  logoTopo: {
    width: 90,
    height: 90,
    // não colocar resizeMode aqui — passe como prop no <Image resizeMode="contain" />
    alignSelf: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  paragrafo: {
    fontSize: 18,
    color: '#555',
    lineHeight: 26,
    marginBottom: 15,
    textAlign: 'justify',
  },
  itemLista: {
    fontSize: 17,
    color: '#555',
    lineHeight: 25,
    marginBottom: 8,
    paddingLeft: 15,
  },
  botaoConcordarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  botaoConcordar: {
    backgroundColor: '#405CBA',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    ...platformShadow({
      boxShadow: '0px 3px 6px rgba(64,92,186,0.12)',
      shadowColor: '#405CBA',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
    }),
  },
  textoBotaoConcordar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default stylesModal;


