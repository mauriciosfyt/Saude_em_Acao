import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#405CBA',
    minHeight: 520,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: -40,
    height: 665,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#405CBA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: -35,
    marginBottom: 12,
    marginLeft: -10,
  },
  bannerText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },

  title: { fontSize: 35, fontWeight: 'bold', color: '#111827', marginBottom: -2, marginTop: 10 },
  description: { fontSize: 12, lineHeight: 21, color: '#6b7280', marginBottom: 16 },

  priceLabel: { fontSize: 11, color: '#6b7280', marginTop: 20, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  priceValue: { fontSize: 34, fontWeight: 'bold', color: '#111827' },
  pricePerMonth: { fontSize: 20, color: '#2b67df', marginLeft: 6, marginBottom: 2 },

  sectionTitle: { fontSize: 25, fontWeight: 'bold', color: '#9ca3af', marginTop: 50, marginBottom: 8 },
  modalidadeHint: { fontSize: 11, color: '#000000', fontWeight: 'bold', marginBottom: 25, letterSpacing: 0.5 },

  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 40, },
  benefitText: { marginLeft: 12, fontSize: 23, color: '#111827', fontWeight: '600' },

  ctaButton: { backgroundColor: '#405CBA', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 15, width: 200, alignSelf: 'center' },
  ctaText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default styles;


