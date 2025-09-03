import React, { useState } from 'react';
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
  const [menuVisivel, setMenuVisivel] = useState(false);

  const dadosDesempenho = {
    mesAno: 'Outubro, 2025',
    progressoGeral: 50,
    treinosRealizados: 23,
    treinosTotal: 31,
    ultimoTreino: '20/31',
  };

  const handleVoltar = () => {
    if (navigation) {
      navigation.goBack();
    }
  };
  
  const handleAbrirMenu = () => {
    setMenuVisivel(true);
  };

  const handleFecharMenu = () => {
    setMenuVisivel(false);
  }

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#405CBA" />

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={handleFecharMenu} activeOpacity={1}>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleNavegar('Home')}
            >
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleNavegar('Perfil')}
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleFecharMenu}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Desempenho</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => console.log("Navegar para Configurações")}
            >
              <Ionicons name="settings-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleNavegar('Inicial')}
            >
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, {color: '#dc3545'}]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* SEU CÓDIGO PRINCIPAL (INTOCADO) */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleVoltar}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleAbrirMenu}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.monthYearText}>{dadosDesempenho.mesAno}</Text>
        <View style={styles.progressContainer}>
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

// ESTILOS ATUALIZADOS AQUI
const styles = StyleSheet.create({
  // --- Estilos do Menu Modal ---
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'flex-end', // <--- 1. ADICIONADO: Alinha o menu à direita
  },
  menuContent: {
    height: '100%',
    width: '75%',
    backgroundColor: 'white',
    paddingTop: 80,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 }, // <--- 2. ALTERADO: Sombra para a esquerda
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
  
  // --- Estilos Originais da Tela (sem alterações) ---
  container: {
    flex: 1,
    backgroundColor: '#405CBA',
  },
  topSection: {
    flex: 0.4,
    paddingHorizontal: 20,
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