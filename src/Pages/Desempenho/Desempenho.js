import React, { useMemo, useState, useEffect } from 'react';
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
import { obterDesempenhoSemanal } from '../../Services/api';

const Desempenho = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const [dadosDesempenho, setDadosDesempenho] = useState({
    mesAno: '',
    progressoGeral: 0,
    treinosRealizados: 0,
    treinosTotal: 0,
    ultimoTreino: '',
  });

  useEffect(() => {
    let mounted = true;
    const carregarDesempenho = async () => {
      try {
        const dados = await obterDesempenhoSemanal();
        if (!mounted) return;

        // A API pode retornar um array ou um objeto; mapeie com segurança
        if (Array.isArray(dados)) {
          // assumimos que a API retorna lista de registros; agregue valores
          const treinosRealizados = dados.length;
          const treinosTotal = dados.reduce((acc, cur) => acc + (cur.total || 1), 0);
          setDadosDesempenho({
            mesAno: new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
            progressoGeral: treinosTotal ? Math.round((treinosRealizados / treinosTotal) * 100) : 0,
            treinosRealizados,
            treinosTotal,
            ultimoTreino: dados[0]?.data || '',
          });
        } else if (typeof dados === 'object' && dados !== null) {
          // se API já retorna objeto com campos esperados
          setDadosDesempenho({
            mesAno: dados.mesAno || new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
            progressoGeral: dados.progressoGeral || 0,
            treinosRealizados: dados.treinosRealizados || 0,
            treinosTotal: dados.treinosTotal || 0,
            ultimoTreino: dados.ultimoTreino || dados.ultimo || '',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar desempenho semanal:', error);
      }
    };

    carregarDesempenho();

    return () => { mounted = false; };
  }, []);

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
           <Image 
             source={require('../../../assets/icons/imageGráficoProgresso.png')} 
             style={styles.progressTitleIcon}
             resizeMode="contain"
           />
        </View>
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCard, { backgroundColor: colors.primary }]}>
               <Image 
                 source={require('../../../assets/icons/imageGráfico.png')} 
                 style={styles.iconImage}
                 resizeMode="contain"
                 tintColor="#ffffff"
               />
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
               <Image 
                 source={require('../../../assets/icons/imageGráfico.png')} 
                 style={styles.iconImage}
                 resizeMode="contain"
                 tintColor="#ffffff"
               />
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Ultimo treino realizado</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{dadosDesempenho.ultimoTreino}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu lateral/modal — adaptado para ficar igual ao HeaderProfessores */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#ffffff' : '#2c2c2c' }]}>
            <Text style={[styles.menuTitle, { color: isDark ? '#333333' : '#E6E8F3' }]}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
              <Ionicons name="home-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaProdutos")}
            >
              <Ionicons name="cart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons name="heart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Inicial")}
            >
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: "#dc3545" }]}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Desempenho;