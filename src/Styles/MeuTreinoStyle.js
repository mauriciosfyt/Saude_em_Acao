import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#405CBA',//alterar a cor do azul
  },
  
  // Header Azul
  header: {
    backgroundColor: '#405CBA',
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
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  
  menuButton: {
    padding: 8,
  },
  
  greetingSection: {
    paddingHorizontal: 20,
  },
  
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  
  date: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  
  // Conteúdo Principal
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 50,
  },
  
  // Card de Treino
  treinoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  
  treinoDia: { //alterar a cor dos botões
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flexShrink: 1,
    minWidth: 0,   
  },
  
  treinoGrupos: {
    fontSize: 14,
    color: '#666',
  },
  
  iniciarButton: {
    backgroundColor: '#405CBA',
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

  // Estilos do Menu Modal
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  menuContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: 250,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#F0F4FF',
  },

  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },

  menuItemTextAtivo: {
    color: '#405CBA',
    fontWeight: '600',
  },
});

export default styles;
