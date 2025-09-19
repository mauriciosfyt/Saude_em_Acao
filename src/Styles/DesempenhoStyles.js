import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  
  // Seção Superior
  topSection: {
    flex: 0.4,
    paddingHorizontal: 20,
    paddingTop: 10, // Ajustado para dar espaço para a status bar
    paddingBottom: 0,
  },

  // ===== ESTILOS DO HEADER DEVEM SER USADOS NO COMPONENTE DesempenhoHeader.js =====
  // Removidos deste arquivo para evitar duplicidade e conflitos.
  
  // Estilo 'backButton' foi removido
  
  monthYearText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    // marginTop foi removido, o espaçamento agora é controlado pelo header
  },
  
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto', // Empurra a barra de progresso para o final da seção
    marginBottom: 20,
  },
  
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#1e40af',
    borderRadius: 4,
    marginRight: 15,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    minWidth: 50,
  },
  
  // Seção Inferior (sem alterações)
  bottomSection: {
    flex: 0.6,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  
  progressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  
  progressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 10,
  },

  progressTitleIcon: {
    width: 16,
    height: 16,
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
    backgroundColor: '#2563eb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  iconImage: {
    width: 26,
    height: 26,
    tintColor: '#ffffff',
    resizeMode: 'contain',
  },
  
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default styles;