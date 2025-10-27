import { StyleSheet } from 'react-native';

const stylesLogin = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    marginTop: 30,
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
  },
  botaoVoltar: {
    padding: 8,
  },
  iconeVoltar: {
    fontSize: 24,
    color: '#FFFFFF', // Ícone branco
  },
  tituloHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // Texto branco
    marginLeft: 15,
  },
  conteudo: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto branco
    textAlign: 'center',
    marginBottom: 30,
    marginTop: -35,
  },
  campoContainer: {
    marginBottom: 8,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF', // Texto branco
    marginBottom: 8,
  },
  campo: {
    backgroundColor: '#D9D9D9', // Campo cinza claro
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    color: '#000000', // Texto preto nos campos
  },
  botaoEntrar: {
    backgroundColor: '#405CBA', // Azul vibrante
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#405CBA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textoBotaoEntrar: {
    color: '#FFFFFF', // Texto branco no botão
    fontSize: 18,
    fontWeight: '600',
  },
  linhaSeparadora: {
    height: 1,
    backgroundColor: '#FFFFFF', // Linha branca fina
    marginVertical: 25,
    width: '100%',
    opacity: 0.3,
  },
  rodape: {
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  textoPoliticas: {
    fontSize: 12,
    color: '#D9D9D9', // Texto cinza claro
    textAlign: 'center',
    lineHeight: 18,
  },
  linkPoliticas: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  cardCenter: {
    width: '90%',
    maxHeight: '90%',
    minHeight: '70%',
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
  },
  logoHeader: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  botaoVoltarCard: {
    position: 'absolute',
    left: 10,
    padding: 8,
  },
  iconeVoltarCard: {
    fontSize: 24,
    color: '#FFFFFF', // Ícone branco
  },
  tituloCard: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // Texto branco
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
  },
  cardButton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#405CBA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2C', // Fundo cinza escuro
  },
  cardButtonText: {
    color: '#405CBA',
    fontSize: 16,
    fontWeight: '600',
  },
  logoCard: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  textoCard: {
    fontSize: 14,
    color: '#FFFFFF', // Texto branco
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'justify',
  },
});

export default stylesLogin;


