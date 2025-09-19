import React from 'react';
import DesempenhoHeader from '../../Components/header_seta/header_seta';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Desempenho = ({ navigation }) => {
  const dadosDesempenho = {
    mesAno: 'Outubro, 2025',
    progressoGeral: 50,
    treinosRealizados: 23,
    treinosTotal: 31,
    ultimoTreino: '20/31',
  };

  // Header e menu agora estão em um componente separado

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#405CBA" />
      <View style={styles.topSection}>
        <DesempenhoHeader navigation={navigation} paddingHorizontal={2} />
        <Text paddingHorizontal={20} style={styles.monthYearText}>{dadosDesempenho.mesAno} </Text>
        <View paddingHorizontal={20} style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dadosDesempenho.progressoGeral}%` }]} />
          </View>
          <Text style={styles.progressText}>{dadosDesempenho.progressoGeral}%</Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.progressTitleContainer}>
          <Text style={styles.progressTitle}>Progresso</Text>
          <Image source={require('../../../assets/icons/imageGráficoProgresso.png')} style={styles.progressTitleIcon} />
        </View>
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <View style={styles.iconCard}>
              <Image source={require('../../../assets/icons/imageGráfico.png')} style={styles.iconImage} />
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Treinos realizados esse mês</Text>
              <Text style={styles.infoValue}>
                {dadosDesempenho.treinosRealizados}/{dadosDesempenho.treinosTotal}
              </Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.iconCard}>
              <Image source={require('../../../assets/icons/imageGráfico.png')} style={styles.iconImage} />
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Ultimo treino realizado</Text>
              <Text style={styles.infoValue}>{dadosDesempenho.ultimoTreino}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- Estilos Originais da Tela (sem alterações) ---
  container: {
    flex: 1,
    backgroundColor: '#405CBA',
  },
  topSection: {
    flex: 0.4,
    paddingTop: 10,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#405CBA',
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
    backgroundColor: '#405CBA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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

export default Desempenho;