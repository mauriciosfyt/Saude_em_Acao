import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 40,
  },

  whiteSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
  },
  mt16: {
    marginTop: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  smallLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  planType: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3b5ccc',
    letterSpacing: 0.4,
  },
  valueStrong: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  // Triângulo invertido: da borda superior esquerda descendo para a direita
  triangleSeparator: {
    width: 0,
    height: 0,
    borderRightWidth: 0,
    borderLeftWidth: 900, // aumentar para passar da largura da tela
    borderBottomWidth: 380, // manter o ângulo visual
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#3b5ccc',
    alignSelf: 'flex-end',
    marginTop: -1,
  },

  blueSection: {
    flex: 1,
    backgroundColor: '#3b5ccc',
    alignItems: 'center',
    paddingTop: 12,
  },
  renewTitle: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primaryButton: {
    marginTop: 28,
    backgroundColor: '#8fb0ff',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default styles;


