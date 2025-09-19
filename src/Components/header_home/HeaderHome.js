import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constantes de cores para o componente
const COLORS = {
  primary: '#3A3A3A',
  lightGray: '#F4F4F6',
};

const HeaderHome = ({ onProfilePress }) => {
  return (
    <View style={styles.header}>
      {/* 1. Adicionamos um 'espaçador' invisível aqui para empurrar a logo para o centro */}
      <View style={styles.iconButton} />

      {/* 2. A logo agora fica naturalmente no centro */}
      <Image
        source={require('../../../assets/icons/logo_dia.png')} // Ajuste o caminho do seu logo
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* 3. O ícone de perfil, que age como o terceiro elemento */}
      <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
        <Ionicons name="person-circle-outline" size={32} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.lightGray,
        paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 30,
    height: 80,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  // 4. Estilo aplicado tanto ao botão de perfil quanto ao espaçador invisível
  iconButton: {
    width: 40, // Largura fixa para garantir o alinhamento
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HeaderHome;