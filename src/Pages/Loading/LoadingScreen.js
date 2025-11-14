// src/Pages/Loading/LoadingScreen.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Usar o seu tema

export default function LoadingScreen() {
  // O useTheme() pode falhar aqui se o ThemeProvider estiver
  // dentro das rotas, então vamos proteger
  let colors;
  try {
    const theme = useTheme();
    colors = theme.colors;
  } catch (e) {
    // Fallback de cores se o contexto não estiver disponível
    colors = { background: '#fff', primary: '#000' };
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});