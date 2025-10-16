import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// O componente recebe 'navigation' para poder navegar
const Inicial = ({ navigation }) => {
  // Verifique se estes caminhos estão corretos para o seu projeto
  const appLogoSource = require('../../../assets/icons/Logo_Prata.png');

  // Função para navegar diretamente para o login
  const handleStartPress = () => {
    navigation.navigate('TelaLogin');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#405CBA', '#405CBA', '#5A7DE8', '#8BA0E0', '#E8ECF5']}
        locations={[0, 0.4, 0.6, 0.8, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Image
            source={appLogoSource}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.welcomeText}>Seja bem vindo!</Text>

        <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
          <Text style={styles.startButtonText}>Entrar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

// Seus estilos (sem alterações)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#2f59c1',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoImage: {
    width: 172,
    height: 172,
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 120,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    backgroundColor: '#405CBA',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Inicial;