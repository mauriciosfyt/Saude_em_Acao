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
    paddingTop: 20,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  
  monthYearText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginBottom: 0,
    marginLeft: 0,
    marginTop: 60,
  },
  
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
  
  // Seção Inferior
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

  // Estilos para o componente de Perfil
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  backButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },

  settingsButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },

  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#2563eb',
  },

  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },

  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },

  editProfileButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },

  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  profileInfoLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },

  profileInfoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },

  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Estilos para o Modal de Configurações
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  configList: {
    paddingHorizontal: 20,
  },

  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  configItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  configItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },

  dangerText: {
    color: '#ef4444',
  },

  configDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },

  // Estilos para o Modal de Edição de Perfil
  editContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  editFieldContainer: {
    marginBottom: 20,
  },

  editFieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  editFieldInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },

  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    minWidth: 100,
    alignItems: 'center',
  },

  selectOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  selectOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  selectOptionTextSelected: {
    color: '#ffffff',
  },

  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },

  saveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default styles;


