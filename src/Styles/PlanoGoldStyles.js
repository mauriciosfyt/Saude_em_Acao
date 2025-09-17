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
    height: 750,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#405CBA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: -35,
    marginBottom: 12,
  },

      titleRowContainer: {
      flexDirection: 'row',    
      alignItems: 'center',      
      marginBottom: 8,           
    },
    titleRow: {
      fontSize: 24,
      fontWeight: 'bold',
    },

  bannerText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', },

  titleRow: { fontSize: 35, fontWeight: 'bold', color: '#FFFFFF', marginBottom: -2, marginTop: 10 },

  description: { fontSize: 11, lineHeight: 21, color: '#FFFFFF', marginBottom: 16 },

  priceLabel: { fontSize: 11, color: '#FDAD00', marginTop: 15, top:10, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  priceValue: { fontSize: 34, fontWeight: 'bold', color: '#FFFFFF' },
  pricePerMonth: { fontSize: 25, color: '#FDAD00', marginLeft: 6, marginBottom: 2 },

  sectionTitle: { fontSize: 23, fontWeight: 'bold', color: '#ffffff', marginTop: 30, marginBottom: 8 },
  modalidadeHint: { fontSize: 12, color: '#FDAD00', fontWeight: 'bold', marginBottom: 25, letterSpacing: 0.5 },

  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 34 },
  benefitText: { marginLeft: 12, fontSize: 20, color: '#FFFFFF', fontWeight: '600' },

  ctaButton: { backgroundColor: '#405CBA', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: -5, width: 200, alignSelf: 'center', top: 25 },
  ctaText: { color: '#ffffff', fontSize: 17, fontWeight: 'bold' },
});

export default styles;


