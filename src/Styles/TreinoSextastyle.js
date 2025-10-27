import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // fundo escuro como no site
  },

  // Header sem cor de fundo, apenas seta e menu
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
    color: '#405CBA', // Azul para manter padrão visual
  },

  menuButton: {
    padding: 8,
  },

  // Conteúdo Principal
  content: {
    flex: 1,
    backgroundColor: '#3A3A3A', // mesmo tom dos cards de exercício
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: '#3A3A3A', // sobretom cinza escuro
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  checkbox: {
    width: 24,
  height: 24,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent', // sem fundo
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

  exercicioNomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
    minHeight: 24,
  },
  exercicioNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // branco para contraste
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  exercicioDetalhes: {
    fontSize: 14,
    color: '#D9D9D9', // cinza claro para contraste
    marginBottom: 2,
  },

  infoButton: {
    padding: 5,
  },

  // Modal Sobre o Exercício
  modalExercicioContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'flex-start',
  },
  modalExercicioTitulo: {
    color: '#888',
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
    color: '#222',
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
    color: '#FFFFFF', // branco para contraste
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
    backgroundColor: '#1A1A1A', // <--- Altere para a mesma cor do `styles.container`
    borderTopWidth: 0,
    borderTopColor: 'transparent',
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

  // Estilos do Menu Modal
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  menuContent: {
    backgroundColor: '#1A1F2E', // fundo escuro
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
    color: '#FFFFFF', // branco para contraste
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
    color: '#FFFFFF', // branco para contraste
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default styles;