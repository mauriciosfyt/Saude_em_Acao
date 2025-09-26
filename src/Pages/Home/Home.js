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
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

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
const FeatureButton = ({ iconName, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.featureButtonContainer} onPress={onPress}>
      <MaterialCommunityIcons name={iconName} size={40} color={COLORS.secondary} />
      <Text style={styles.featureButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// --- Componente Principal da Tela: Home ---
const Home = ({ navigation }) => {
  const features = [
    { id: 1, icon: 'account-group-outline', label: 'Professores', screen: 'Professores' },
    { id: 2, icon: 'weight-lifter', label: 'Meus treinos', screen: 'MeuTreino' },
    { id: 3, icon: 'cart-outline', label: 'Nossa loja', screen: 'Loja' },
    { id: 4, icon: 'account-circle-outline', label: 'Meu plano', screen: 'Plano' },
  ];

  const promoImage = { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?fit=crop&w=800&q=80' };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SIZES.large }}
      >
        {/* 2. Use o novo componente HeaderHome aqui */}
        <HeaderHome 
          onProfilePress={() => navigation.navigate('MainTabs', { screen: 'Perfil' })}
        />

        {/* --- Mensagem de Boas-Vindas --- */}
        <View style={styles.welcomeSection}>
          <Text style={styles.h1}>Que bom ter você aqui!</Text>
          <Text style={styles.body2}>Seja bem vindo a academia saúde em ação!</Text>
        </View>

        {/* --- Card de Assinatura --- */}
        <TouchableOpacity onPress={() => navigation.navigate('TelaPlanos')}>
          <ImageBackground
            source={promoImage}
            style={styles.promoCard}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.promoOverlay}>
              <Text style={styles.promoText}>
                Assine com a Equipe Saúde em Ação e treine quando quiser.
              </Text>
              <Feather name="arrow-right-circle" size={30} color={COLORS.white} />
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* --- Grade de Funcionalidades --- */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureButton
              key={feature.id}
              iconName={feature.icon}
              label={feature.label}
              onPress={() => {
                if(feature.screen === 'Perfil'){
                  navigation.navigate('MainTabs', { screen: 'Perfil' })
                } else if (feature.screen === 'Loja'){
                  navigation.navigate('MainTabs', { screen: 'Loja' })
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
  promoCard: {
    height: 150,
    justifyContent: 'flex-end',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SIZES.large,
  },
  promoOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
    flex: 1,
    marginRight: SIZES.base,
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