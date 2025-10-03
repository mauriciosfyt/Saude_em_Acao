import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Image,
  useColorScheme,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemePreference } from '../../context/ThemeContext';
import { Svg, Path, Circle } from 'react-native-svg';

// 1. Importe o novo componente HeaderHome
import HeaderHome from '../../Components/header_home/HeaderHome';
// --- Constantes de Tema ---
const COLORS = {
  primary: '#3A3A3A',
  secondary: '#4A90E2',
  white: '#FFFFFF',
  lightGray: '#F4F4F6',
  gray: '#A9A9A9',
};

const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// --- Componente FeatureButton ---
const FeatureButton = ({ iconName, label, onPress, isDark }) => {
  return (
    <TouchableOpacity
      style={[
        styles.featureButtonContainer,
        isDark && {
          backgroundColor: '#3A3A3A',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 2,
        },
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={40}
        color={COLORS.secondary}
      />
      <Text
        style={[
          styles.featureButtonLabel,
          isDark && { color: '#E6E6E6' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Card de Analytics (gráficos simulados) ---
const AnalyticsCard = ({ onPress, isDark }) => {
  const bars = [40, 25, 55, 60, 52];
  const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.analyticsCard,
        isDark && { backgroundColor: '#3A3A3A' },
      ]}
    >
      <Text
        style={[
          styles.analyticsMonth,
          isDark && { color: '#E0E0E0' },
        ]}
      >
        Janeiro,2025
      </Text>
      <View style={styles.analyticsInner}>
        {/* Área (esquerda) */}
        <View style={styles.areaWrapper}>
          <Svg width={150} height={100} viewBox="0 0 150 100">
            {(() => {
              const h = 90; // baseline height
              const pts = [
                { x: 8, y: 38 },
                { x: 26, y: 48 },
                { x: 44, y: 30 },
                { x: 62, y: 34 },
                { x: 80, y: 42 },
                { x: 98, y: 30 },
                { x: 118, y: 30 },
                { x: 138, y: 28 },
              ];
              const areaPath = `M 0 ${h} ${pts
                .map((p, i) => `${i === 0 ? 'L' : 'L'} ${p.x} ${p.y}`)
                .join(' ')} L 150 ${h} Z`;
              const linePath = `M ${pts[0].x} ${pts[0].y} ${pts
                .slice(1)
                .map((p) => `L ${p.x} ${p.y}`)
                .join(' ')}`;
              return (
                <>
                  <Path d={areaPath} fill={isDark ? '#3FA2FF' : '#3FA2FF'} />
                  <Path d={linePath} fill="none" stroke={isDark ? '#79A9FF' : '#4A90E2'} strokeWidth={2} />
                  {pts.map((p, idx) => (
                    <Circle key={idx} cx={p.x} cy={p.y} r={3} fill="#FFFFFF" stroke={isDark ? '#79A9FF' : '#4A90E2'} strokeWidth={1.5} />
                  ))}
                </>
              );
            })()}
          </Svg>
          <Text style={[styles.monthLabel, isDark && { color: '#E6E6E6' }]}>Janeiro</Text>
        </View>

        {/* Divisor */}
        <View style={[styles.analyticsDivider, isDark && { backgroundColor: '#515151' }]} />

        {/* Barras (direita) */}
        <View style={styles.barWrapper}>
          <View style={styles.barsRow}>
            {bars.map((h, idx) => (
              <View
                key={idx}
                style={[
                  styles.bar,
                  { height: h },
                  isDark && { backgroundColor: '#B7C3D6' },
                ]}
              />
            ))}
          </View>
          <View style={styles.weekdaysRow}>
            {weekdays.map((d) => (
              <Text key={d} style={[styles.weekdayText, isDark && { color: '#C9C9C9' }]}>{d}</Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Componente Principal da Tela: Home ---
const Home = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { isDark: forcedDark, systemIsDark } = useThemePreference();
  const isDark = forcedDark === undefined ? colorScheme === 'dark' : forcedDark;
  const features = [
    { id: 1, icon: 'account-group-outline', label: 'Professores', screen: 'Professores' },
    { id: 2, icon: 'weight-lifter', label: 'Meus treinos', screen: 'MeuTreino' },
    { id: 3, icon: 'cart-outline', label: 'Nossa loja', screen: 'Loja' },
    { id: 4, icon: 'account-circle-outline', label: 'Meu plano', screen: 'Plano' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: '#2B2B2B' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SIZES.large }}
      >
        {/* 2. Use o novo componente HeaderHome aqui */}
        <HeaderHome 
          onProfilePress={() => navigation.navigate('Perfil')}

        />

        {/* --- Mensagem de Boas-Vindas --- */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.h1, isDark && { color: '#FFFFFF' }]}>Que bom ter você aqui!</Text>
          <Text style={[styles.body2, isDark && { color: '#BBBBBB' }]}>Seja bem vindo a academia saúde em ação!</Text>
        </View>

        {/* --- Card com Gráficos --- */}
        <AnalyticsCard isDark={isDark} onPress={() => navigation.navigate('Desempenho')} />

        {/* --- Grade de Funcionalidades --- */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureButton
              key={feature.id}
              iconName={feature.icon}
              label={feature.label}
              isDark={isDark}
              onPress={() => {
                if(feature.screen === 'Perfil'){
                  navigation.navigate('Perfil')
                } else if (feature.screen === 'Loja'){
                  navigation.navigate('Loja')
                }
                else {
                  navigation.navigate(feature.screen)
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Estilos (StyleSheet) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  // 3. Os estilos 'header' e 'logoImage' antigos foram removidos daqui
  welcomeSection: {
    marginTop: SIZES.small,
    marginBottom: SIZES.large,
  },
  h1: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  body2: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  analyticsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  analyticsMonth: {
    position: 'absolute',
    top: 8,
    right: 12,
    color: COLORS.gray,
    fontSize: 12,
  },
  analyticsInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  areaWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  areaBox: {
    width: '85%',
    height: 90,
    backgroundColor: '#5B84E2',
    borderRadius: 6,
    position: 'relative',
  },
  areaDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  monthLabel: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  analyticsDivider: {
    width: 1,
    height: 110,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SIZES.base,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '85%',
    height: 90,
  },
  bar: {
    width: 18,
    borderRadius: 4,
    backgroundColor: '#AFC0D9',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 6,
  },
  weekdayText: {
    fontSize: 10,
    color: COLORS.gray,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  featureButtonContainer: {
    backgroundColor: COLORS.white,
    width: '48%',
    padding: SIZES.medium,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureButtonLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
});

export default Home;