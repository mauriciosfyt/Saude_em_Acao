import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#656565',
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
  },
  bannerText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', },

  titleRow: { fontSize: 35, fontWeight: 'bold', color: '#FFFFFF', marginBottom: -2, marginTop: 10 },
  titleGold: { color: '#FFFFFF' },
  description: { fontSize: 11, lineHeight: 21, color: '#FFFFFF', marginBottom: 16 },

  priceLabel: { fontSize: 11, color: '#FFFFFF', marginTop: 20, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  priceValue: { fontSize: 34, fontWeight: 'bold', color: '#FFFFFF' },
  pricePerMonth: { fontSize: 20, color: '#FFFFFF', marginLeft: 6, marginBottom: 2 },

  sectionTitle: { fontSize: 25, fontWeight: 'bold', color: '#ffffff', marginTop: 50, marginBottom: 8 },
  modalidadeHint: { fontSize: 11, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 25, letterSpacing: 0.5 },

  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  benefitText: { marginLeft: 12, fontSize: 23, color: '#FFFFFF', fontWeight: '600' },

  ctaButton: { backgroundColor: '#405CBA', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 50, width: 200, alignSelf: 'center' },
  ctaText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});

export default styles;


