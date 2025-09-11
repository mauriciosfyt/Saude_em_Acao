import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// O componente recebe 'navigation' para poder navegar
const Inicial = ({ navigation }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Verifique se estes caminhos estão corretos para o seu projeto
  const googleIconSource = require('../../../assets/icons/icone_google.png');
  const appLogoSource = require('../../../assets/icons/Logo_Prata.png');

  const handleStartPress = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  // --- CORREÇÃO APLICADA AQUI ---
  // Esta função agora navega para a tela de Login, como desejado.
  const navigateToLogin = () => {
    setShowLoginModal(false);
    // Usamos 'navigate' para ir para a tela de Login.
    // O nome 'TelaLogin' deve ser o mesmo que você definiu no seu arquivo de rotas.
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
          <Text style={styles.startButtonText}>Começar</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            {/* O botão "Já sou aluno" agora chama a função correta */}
            <TouchableOpacity style={styles.studentButton} onPress={navigateToLogin}>
              <Text style={styles.studentButtonText}>Já sou aluno(a)</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* O botão do Google agora também leva para a tela de Login */}
            <TouchableOpacity style={styles.googleButton} onPress={navigateToLogin}>
              <Image
                source={googleIconSource}
                style={styles.googleImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  studentButton: {
    backgroundColor: '#405CBA',
    height: 52,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  separatorLine: {
    flex: 1,
    height: 6,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#D9D9D9',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 12,
    flexDirection: 'row',
  },
  googleImage: {
    width: 24,
    height: 24,
  },
});

export default Inicial;