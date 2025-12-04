import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native'; // 1. Importei o ScrollView
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Dados = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <View style={styles.container}>
        {/* 2. Todo o conteúdo que pode ultrapassar a tela vai aqui dentro */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent} // Estilo para o conteúdo interno
        >
          <View style={styles.header}>
            <TouchableOpacity>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationIcon}>
              <Icon name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          <Text style={styles.greeting}>Olá Heleno!</Text>
          <Text style={styles.dateSubtitle}>Outubro, 2025</Text>

          <View style={styles.performanceCard}>
            <Text style={styles.cardDate}>Outubro, 2025</Text>
            <Text style={styles.performanceTitle}>Meu Desempenho</Text>
            <FeatherIcon name="trending-up" size={30} color="#FFF" style={styles.chartIcon} />
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={styles.progressBarFill} />
              </View>
              <Text style={styles.progressText}>50%</Text>
            </View>
            <TouchableOpacity style={styles.seeMoreButton}>
              <Text style={styles.seeMoreButtonText}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.infoCard}>
              <FeatherIcon name="lock" size={40} color="#FFF" />
              <View style={styles.cardTextRow}>
                <Text style={styles.infoCardText}>Dados</Text>
                <Icon name="arrow-forward" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoCard}>
              <Icon name="person-outline" size={30} color="#FFF" />
              <Icon name="list-outline" size={30} color="#FFF" style={{ marginLeft: 0, marginTop: -5 }}/>
              <View style={styles.cardTextRow}>
                <Text style={styles.infoCardText}>Meu plano</Text>
                <Icon name="arrow-forward" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        {/* 3. O botão "Voltar" fica FORA do ScrollView */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // Apenas padding horizontal aqui
  },
  // Novo estilo para o conteúdo do ScrollView
  scrollContent: {
    paddingTop: 20, // Padding que estava no container
    paddingBottom: 20, // Espaço extra no final da rolagem
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
  },
  notificationIcon: {
    position: 'relative',
    marginTop: 10,
  },

  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  dateSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  performanceCard: {
    backgroundColor: '#405CBA',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardDate: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 10,
  },
  performanceTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    width: '60%',
  },
  chartIcon: {
    position: 'absolute',
    right: 30,
    top: 60,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 10,
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  seeMoreButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  seeMoreButtonText: {
    color: '#4A5C9E',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: '#405CBA',
    borderRadius: 20,
    width: '48%',
    height: 150,
    padding: 15,
    justifyContent: 'space-between',
  },
  cardTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCardText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#A7C3F8',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10, // 4. Margem fixa para espaçamento
    marginBottom: 20, // Garante espaço na parte de baixo da tela
  },
  backButtonText: {
    color: '#405CBA',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Dados;