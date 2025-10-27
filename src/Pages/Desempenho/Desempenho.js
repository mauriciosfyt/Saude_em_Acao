import React, { useState } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../Styles/DesempenhoStyles';

const Desempenho = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark } = useTheme();
  const styles = createStyles(isDark);
  const dadosDesempenho = {
    mesAno: 'Outubro, 2025',
    progressoGeral: 50,
    treinosRealizados: 23,
    treinosTotal: 31,
    ultimoTreino: '20/31',
  };

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (tela) => {
    handleFecharMenu();
    if (navigation) navigation.navigate(tela);
  };

  const logoutColor = '#E24B4B';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors.primary} />
      <View style={[styles.topSection, { backgroundColor: colors.primary }]}>
        <DesempenhoHeader navigation={navigation} paddingHorizontal={2} />
        <Text paddingHorizontal={20} style={[styles.monthYearText, { color: colors.headerText }]}>{dadosDesempenho.mesAno} </Text>
        <View paddingHorizontal={20} style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.headerText }]}>
            <View style={[styles.progressFill, { width: `${dadosDesempenho.progressoGeral}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.headerText }]}>{dadosDesempenho.progressoGeral}%</Text>
        </View>
      </View>
      <View style={[styles.bottomSection, { backgroundColor: colors.background }]}>
        <View style={styles.progressTitleContainer}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Progresso</Text>
          <Image source={require('../../../assets/icons/imageGráficoProgresso.png')} style={styles.progressTitleIcon} />
        </View>
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCard, { backgroundColor: colors.primary }]}>
              <Image source={require('../../../assets/icons/imageGráfico.png')} style={styles.iconImage} />
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Treinos realizados esse mês</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {dadosDesempenho.treinosRealizados}/{dadosDesempenho.treinosTotal}
              </Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={[styles.iconCard, { backgroundColor: colors.primary }]}>
              <Image source={require('../../../assets/icons/imageGráfico.png')} style={styles.iconImage} />
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Ultimo treino realizado</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{dadosDesempenho.ultimoTreino}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu lateral/modal — fica escuro quando isDark */}
      <Modal animationType="fade" transparent visible={menuVisivel} onRequestClose={handleFecharMenu}>
        <TouchableOpacity
          style={[styles.menuOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)' }]}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View
            style={[styles.menuContent, { backgroundColor: isDark ? '#1A1F2E' : '#FFFFFF' }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#333' }]}>Menu</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Home')}>
              <Ionicons name="home-outline" size={20} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Perfil')}>
              <Ionicons name="person-outline" size={20} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Chat')}>
              <Ionicons name="chatbubble-outline" size={20} color={isDark ? '#FFFFFF' : '#333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#FFFFFF' : '#333' }]}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemActive]} onPress={() => handleNavegar('Desempenho')}>
              <Ionicons name="bar-chart-outline" size={20} color="#405CBA" />
              <Text style={[styles.menuItemText, styles.menuItemTextActive]}>Desempenho</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Inicial')}>
              <Ionicons name="log-out-outline" size={20} color="#E24B4B" />
              <Text style={[styles.menuItemText, { color: '#E24B4B' }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Desempenho;