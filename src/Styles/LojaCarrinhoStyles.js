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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para a barra de navegação
  },

  // Select All Styles
  selectAllContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#405CBA',
  },
  selectAllText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },

  // Cart Item Styles
  cartItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    ...platformShadow({
      boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCheckbox: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },

  // Item Right Section
  itemRight: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#405CBA',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    minWidth: 30,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewProductButton: {
    backgroundColor: '#405CBA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProductText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  removeText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },

  // Summary Card Styles
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    marginBottom: 40, // Espaço extra no final
    ...platformShadow({
      boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  actionButtonsContainer: {
    gap: 12,
  },
  reserveButton: {
    backgroundColor: '#405CBA',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#405CBA',
  },
  continueShoppingText: {
    color: '#405CBA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- ADICIONE ESTE ESTILO ---
  productVariation: {
    fontSize: 14,
    color: '#666', // Um cinza para diferenciar
    marginTop: 2,
    fontStyle: 'italic',
  },

});

export default styles;
