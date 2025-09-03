import { StyleSheet, Dimensions } from 'react-native';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const DIAGONAL_HEIGHT = Math.round(WINDOW_WIDTH * 0.28);

export const PlanoStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  topSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20, // aumentei de 10 para 20
    paddingBottom: 20, // adicionei padding inferior para dar mais espaço
},
planTypeLabel: {
    fontSize: 16, // aumentei de 14 para 16
    color: 'black',
    marginBottom: 8, // aumento leve para espaçamento
},
planTypeValue: {
    fontSize: 28, // aumentei de 24 para 28
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 25, // margem inferior maior
},
planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25, // aumento do espaçamento entre detalhes
},
planDetailLabel: {
    fontSize: 16, // aumentei de 14 para 16
    color: 'black',
    marginBottom: 6,
},
planDetailValue: {
    fontSize: 20, // aumentei de 18 para 20
    fontWeight: 'bold',
    color: 'black',
},
planValueLabel: {
    fontSize: 16,
    color: 'black',
    marginBottom: 6,
},
planValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
},
  bottomSection: {
    flex: 1,
    backgroundColor: '#3b5fc4',
    position: 'relative',
  },
  diagonalCut: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: WINDOW_WIDTH,
    borderTopWidth: DIAGONAL_HEIGHT,
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    zIndex: 1,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  renewalTitle: {
    fontSize: 60, // aumentei de 22 para 26
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40, // diminui o espaçamento entre o título e o botão
    lineHeight: 65, 
  },
  changePlanButton: {
    backgroundColor: '#87ceeb',
    paddingHorizontal: 24,
    paddingVertical: 14, // aumentei um pouco para combinar com o texto maior
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 5, // espaço pequeno abaixo do botão para o texto que vem depois
  },
  changePlanButtonText: {
    color: '#1e40af',
    fontSize: 16, // aumentei de 14 para 16
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: 16, // texto abaixo do botão
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
});
