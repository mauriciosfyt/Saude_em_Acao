import { Platform } from 'react-native';

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
const createStyles = (isDark) => ({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#4A69BD' : '#405CBA',
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
    backgroundColor: isDark ? '#333333' : 'white',
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
    backgroundColor: '#405CBA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    ...platformShadow({
      boxShadow: '0px 2px 6px rgba(0,0,0,0.15)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },

  iconImage: {
    width: 26,
    height: 26,
  },
  
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    ...platformShadow({
      boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
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
    paddingTop: 10,
    paddingBottom: 40,
      marginTop: 30,
       top: 0,
    left: 0,
    right: 0,
  },

  backButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 22,
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
    backgroundColor: isDark ? '#333333' : 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#555555' : '#e5e7eb',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: isDark ? '#333333' : '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: isDark ? '#FFFFFF' : '#3B82F6',
  },

  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A69BD',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#333333' : 'white',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1f2937',
    marginBottom: 5,
  },

  userEmail: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6b7280',
    marginBottom: 20,
  },

  editProfileButton: {
    backgroundColor: '#4A69BD',
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
    borderBottomColor: isDark ? '#555555' : '#e5e7eb',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1f2937',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#555555' : '#f3f4f6',
  },

  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  profileInfoLabel: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#374151',
    marginLeft: 12,
    flex: 1,
  },

  profileInfoValue: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#1f2937',
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
    backgroundColor: isDark ? '#444444' : '#f8fafc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A69BD',
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 12,
    color: isDark ? '#FFFFFF' : '#6b7280',
    textAlign: 'center',
  },

  // Estilos para o Modal de Configurações
  modalOverlay: {
    flex: 1,
    // overlay transparente para evitar sombra pesada ao abrir as configurações
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: isDark ? '#333333' : 'white',
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
    borderBottomColor: isDark ? '#555555' : '#e5e7eb',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1f2937',
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
    borderBottomColor: isDark ? '#555555' : '#f3f4f6',
  },

  configItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  configItemText: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#374151',
    marginLeft: 12,
  },

  dangerText: {
    color: '#ef4444',
  },

  configDivider: {
    height: 1,
    backgroundColor: isDark ? '#555555' : '#e5e7eb',
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
    color: isDark ? '#FFFFFF' : '#374151',
    marginBottom: 8,
  },

  editFieldInput: {
    borderWidth: 1,
    borderColor: isDark ? '#555555' : '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#1f2937',
    backgroundColor: isDark ? '#444444' : '#ffffff',
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
    borderColor: isDark ? '#555555' : '#d1d5db',
    backgroundColor: isDark ? '#444444' : '#ffffff',
    minWidth: 100,
    alignItems: 'center',
  },

  selectOptionSelected: {
    backgroundColor: '#4A69BD',
    borderColor: '#4A69BD',
  },

  selectOptionText: {
    fontSize: 14,
    color: isDark ? '#FFFFFF' : '#374151',
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
    borderColor: isDark ? '#555555' : '#d1d5db',
    backgroundColor: isDark ? '#444444' : '#ffffff',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#374151',
  },

  saveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4A69BD',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default createStyles;
