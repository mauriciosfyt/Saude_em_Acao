import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    // backgroundColor removido — agora controlado pelo tema no componente
  },

  // Header
  header: {
    backgroundColor: 'transparent',
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    minHeight: 48,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#405CBA',
  },

  menuButton: {
    padding: 8,
  },

  // Conteúdo Principal
  content: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
    // backgroundColor removido — controlado pelo tema
  },

  // Seções de Exercícios
  secaoContainer: {
    marginBottom: 20,
  },

  secaoHeader: {
    backgroundColor: '#405CBA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  secaoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  // Cards de Exercícios
  exercicioCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    // Cores aplicadas dinamicamente no componente (theme.cardBg)
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginRight: 15,
  },

  exercicioImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },

  exercicioInfo: {
    flex: 1,
  },

  exercicioNome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    // Cor controlada via tema no componente
  },

  exercicioDetalhes: {
    fontSize: 14,
    marginBottom: 2,
    // Cor controlada via tema no componente
  },

  infoButton: {
    padding: 5,
  },

  // Modal Sobre o Exercício
  modalExercicioContainer: {
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'flex-start',
  },

  modalExercicioTitulo: {
    fontSize: 12,
    marginBottom: 8,
  },

  modalExercicioNomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  modalExercicioPonto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#405CBA',
    marginRight: 8,
  },

  modalExercicioNome: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalExercicioDescricao: {
    fontSize: 15,
    marginBottom: 16,
  },

  modalExercicioFechar: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },

  modalExercicioFecharTexto: {
    color: '#405CBA',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Barra de Progresso
  progressContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  progressText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#405CBA',
    borderRadius: 4,
  },

  // Footer com Botões
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    // Cor aplicada dinamicamente no componente conforme tema
  },

  comecarButton: {
    flex: 1,
    backgroundColor: '#405CBA',
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },

  comecarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  finalizarButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    borderRadius: 10,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  finalizarButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },

  // Menu lateral
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  menuContent: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: 250,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },

  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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

  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default styles;
