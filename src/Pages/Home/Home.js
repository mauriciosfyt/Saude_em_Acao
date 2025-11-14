import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';


// --- Constantes de Tema ---
const COLORS = {
  primary: '#2C2C2C', // Fundo cinza escuro
  secondary: '#405CBA', // Azul vibrante
  white: '#FFFFFF',
  lightGray: '#2C2C2C', // Fundo cinza escuro
  gray: '#D9D9D9', // Cinza claro para textos secundários
  cardBackground: '#3A3A3A', // Fundo dos cards (cinza médio)
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
const FeatureButton = ({ iconName, label, onPress, colors }) => {
  return (
    <TouchableOpacity style={[styles.featureButtonContainer, { backgroundColor: colors.cardBackground }]} onPress={onPress}>
      <MaterialCommunityIcons name={iconName} size={40} color={colors.primary} />
      <Text style={[styles.featureButtonLabel, { color: colors.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// --- Card de Analytics (gráficos simulados) ---
const AnalyticsCard = ({ onPress, colors }) => {
  const bars = [40, 25, 55, 60, 52];
  const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.analyticsMonth, { color: colors.textPrimary }]}>Janeiro,2025</Text>
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
                  <Path d={areaPath} fill={colors.primary} />
                  <Path d={linePath} fill="none" stroke={colors.primary} strokeWidth={2} />
                  {pts.map((p, idx) => (
                    <Circle key={idx} cx={p.x} cy={p.y} r={3} fill="#FFFFFF" stroke={colors.primary} strokeWidth={1.5} />
                  ))}
                </>
              );
            })()}
          </Svg>
          <Text style={[styles.monthLabel, { color: colors.textPrimary }]}>Janeiro</Text>
        </View>

        {/* Divisor */}
        <View style={[styles.analyticsDivider, { backgroundColor: colors.divider }]} />

        {/* Barras (direita) */}
        <View style={styles.barWrapper}>
          <View style={styles.barsRow}>
            {bars.map((h, idx) => (
              <View key={idx} style={[styles.bar, { height: h, backgroundColor: colors.primary }]} />
            ))}
          </View>
          <View style={styles.weekdaysRow}>
            {weekdays.map((d) => (
              <Text key={d} style={[styles.weekdayText, { color: colors.textPrimary }]}>{d}</Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Componente Principal da Tela: Home ---
const Home = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const features = [
    { id: 1, icon: 'account-group-outline', label: 'Professores', screen: 'Professores' },
    { id: 2, icon: 'weight-lifter', label: 'Meus treinos', screen: 'MeuTreino' },
    { id: 3, icon: 'cart-outline', label: 'Nossa loja', screen: 'Loja' },
    { id: 4, icon: 'account-circle-outline', label: 'Meu plano', screen: 'Plano' },
  ];

  // Criar estilos dinâmicos baseados no tema
  const dynamicStyles = useMemo(() => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: SIZES.medium,
    },
    headerInline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SIZES.small,
      marginBottom: SIZES.small,
      paddingHorizontal: 0,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: SIZES.large,
      fontWeight: '700',
      color: colors.textPrimary,
      // text shadow: use CSS shorthand on web, native props on mobile
      ...Platform.select({
        web: { textShadow: '0px 0px 10px rgba(64,92,186,0.3)' },
        default: {
          // Mobile: textShadow* não suportados nativamente
        },
      }),
    },
    welcomeSection: {
      marginTop: SIZES.small,
      marginBottom: SIZES.large,
    },
    h1: {
      fontSize: SIZES.xlarge,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    body2: {
      fontSize: SIZES.font,
      color: colors.textSecondary,
      marginTop: SIZES.base / 2,
    },
    analyticsCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      paddingVertical: SIZES.medium,
      paddingHorizontal: SIZES.medium,
      marginBottom: SIZES.large,
      ...(Platform.OS === 'web'
        ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' }
        : {
            elevation: 3,
          }),
    },
    analyticsMonth: {
      position: 'absolute',
      top: 8,
      right: 12,
      color: colors.textPrimary,
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
      color: colors.textPrimary,
      fontWeight: '600',
    },
    analyticsDivider: {
      width: 1,
      height: 110,
      backgroundColor: colors.divider,
      marginHorizontal: SIZES.base,
      opacity: 0.3,
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
      backgroundColor: '#405CBA', // Azul vibrante
    },
    weekdaysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '85%',
      marginTop: 6,
    },
    featureButtonContainer: {
      backgroundColor: colors.cardBackground,
      width: '48%',
      padding: SIZES.medium,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SIZES.medium,
      aspectRatio: 1,
      ...(Platform.OS === 'web'
        ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' }
        : {
            elevation: 5,
          }),
    },
    featureButtonLabel: {
      fontSize: SIZES.medium,
      fontWeight: '500',
      color: colors.textPrimary,
      marginTop: SIZES.base,
    },
  }), [colors, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <StatusBar barStyle={colors.statusBar} />
      <ScrollView
        style={dynamicStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SIZES.large }}
      >
        {/* Logo Dia para tema claro, Prata para tema escuro */}
        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
          <Image
            source={isDark
              ? require('../../../assets/icons/Logo_Prata.png')
              : require('../../../assets/icons/logo_dia.png')}
            style={{ width: 64, height: 64 }}
            resizeMode="contain"
          />
        </View>
        {/* Ícone de perfil alinhado à esquerda e centralizado verticalmente com a logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: -45 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={{ alignSelf: 'flex-start', marginLeft: 290 }}>
            <Ionicons name="person-circle-outline" size={35} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Mensagem de Boas-Vindas --- */}
        <View style={dynamicStyles.welcomeSection}>
          <Text style={dynamicStyles.h1}>Que bom ter você aqui!</Text>
          <Text style={dynamicStyles.body2}>Seja bem vindo a academia saúde em ação!</Text>
        </View>

        {/* --- Card com Gráficos --- */}
        <AnalyticsCard onPress={() => navigation.navigate('Desempenho')} colors={colors} />

        {/* --- Grade de Funcionalidades --- */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: SIZES.small }}>
          {features.map((feature) => (
            <FeatureButton
              key={feature.id}
              iconName={feature.icon}
              label={feature.label}
              colors={colors}
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
    backgroundColor: COLORS.primary, // Fundo cinza escuro
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  headerInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.small,
    marginBottom: SIZES.small,
    paddingHorizontal: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
    ...Platform.select({
      web: { textShadow: '0px 0px 10px rgba(64,92,186,0.3)' },
      default: {
        // Mobile: textShadow* não suportados nativamente
      },
    }),
  },
  welcomeSection: {
    marginTop: SIZES.small,
    marginBottom: SIZES.large,
  },
  h1: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.white, // Texto branco
  },
  body2: {
    fontSize: SIZES.font,
    color: COLORS.gray, // Cinza claro
    marginTop: SIZES.base / 2,
  },
  analyticsCard: {
    backgroundColor: COLORS.cardBackground, // Fundo cinza médio
    borderRadius: 16,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.large,
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' },
      default: {
        elevation: 3,
      },
    }),
  },
  analyticsMonth: {
    position: 'absolute',
    top: 8,
    right: 12,
    color: COLORS.white, // Texto branco
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
    color: COLORS.white, // Texto branco
    fontWeight: '600',
  },
  analyticsDivider: {
    width: 1,
    height: 110,
    backgroundColor: COLORS.gray, // Linha cinza claro
    marginHorizontal: SIZES.base,
    opacity: 0.3,
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
    backgroundColor: '#405CBA', // Azul vibrante
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 6,
  },
  weekdayText: {
    fontSize: 10,
    color: COLORS.white, // Texto branco
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  featureButtonContainer: {
    backgroundColor: COLORS.cardBackground, // Fundo cinza médio
    width: '48%',
    padding: SIZES.medium,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    aspectRatio: 1,
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  featureButtonLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.white, // Texto branco
    marginTop: SIZES.base,
  },
});

export default Home;