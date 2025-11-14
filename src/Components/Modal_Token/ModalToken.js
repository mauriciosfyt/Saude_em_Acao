// ModalToken.js (Adaptado)

import React, { useState, useEffect, useRef } from 'react'; // useRef estava como React.useRef
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  Platform,
  Alert, // ADAPTAÇÃO: Para mostrar erros
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

// ADAPTAÇÃO: Importar a função da API
import { loginComToken } from '../../Services/api'; // Ajuste o caminho

const { width } = Dimensions.get('window');

// ADAPTAÇÃO: Receber 'email' como prop
const ModalToken = ({ visible, onClose, onValidate, email }) => {
  const { isDark, colors } = useTheme();
  const [token, setToken] = useState(''); // Este é o código de 5 dígitos
  const [loading, setLoading] = useState(false);
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]); // Estava React.useRef

  // Animação (mantida 100%)
  const animatedValue = useRef(new Animated.Value(0)).current; // Estava React.useRef
  const nativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    if (visible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: nativeDriver,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: nativeDriver,
      }).start();
    }
  }, [visible, animatedValue, nativeDriver]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  // Lógica de input (mantida 100%)
  const handleCodeInput = (index, value) => {
    const newInputs = [...codeInputs];
    newInputs[index] = value.replace(/[^a-zA-Z0-9]/g, '').slice(-1).toUpperCase();
    setCodeInputs(newInputs);
    setToken(newInputs.join(''));

    if (value && index < 4 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ADAPTAÇÃO CRÍTICA: Lógica de validação real
  const handleValidate = async () => {
    if (token.length !== 5) return;
    if (!email) {
      Alert.alert("Erro Interno", "Email não foi fornecido ao modal.");
      return;
    }

    setLoading(true);
    try {
      console.log(`Tentando validar código ${token} para o email ${email}`);
      
      // REMOVIDO: setTimeout (simulação)
      
      // ADICIONADO: Chamada real da API
      // 'loginComToken' troca o código de 5 dígitos pelo token JWT
      const userData = await loginComToken(email, token); //
      
      // 'userData' é o objeto com o token JWT real (ex: { token: "...", email: "..." })
      if (onValidate) {
        onValidate(userData); // Envia o JWT real para a TelaLogin
      }
      handleClose(); // Fecha o modal com sucesso

    } catch (error) {
      console.error('Erro ao validar token:', error);
      const message = error.message || "Código inválido ou expirado.";
      Alert.alert('Erro na Validação', message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setToken('');
    setCodeInputs(['', '', '', '', '']);
    onClose();
  };

  // Estilos dinâmicos (mantidos 100%)
  const modalBgColor = isDark ? colors.surface : colors.cardBackground;
  const textColor = isDark ? colors.textPrimary : colors.textPrimary;
  const secondaryTextColor = isDark ? colors.textSecondary : colors.textSecondary;
  const buttonBgColor = colors.primary;

  // Seu JSX (mantido 100%)
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="rgba(0,0,0,0.6)" />
      
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacity,
            backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: modalBgColor }]}>
            <View style={styles.logoContainer}>
              <Image
                // ADAPTAÇÃO: Assumi que seus assets estão em ../../assets/...
                // Ajuste se necessário.
                source={isDark ? require('../../../assets/icons/Logo_Prata.png') : require('../../../assets/icons/logo_dia.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={[styles.closeButtonText, { color: textColor }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={[styles.content, { backgroundColor: modalBgColor }]}
            scrollEnabled={false}
          >
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={[styles.mainTitle, { color: textColor }]}>
                Seja muito bem-vindo(a) à{' '}
                <Text style={{ color: buttonBgColor, fontWeight: 'bold' }}>
                  Saúde em Ação
                </Text>{' '}
                o lugar onde sua transformação começa
              </Text>
            </View>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              Prepare-se para viver sua melhor versão.
            </Text>

            {/* Code Input Label */}
            <Text style={[styles.codeLabel, { color: buttonBgColor }]}>DIGITE O CÓDIGO</Text>

            {/* Code Inputs */}
            <View style={styles.codeInputsContainer}>
              {codeInputs.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.codeInput,
                    {
                      backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0',
                      color: textColor,
                      borderColor: value ? buttonBgColor : isDark ? '#4A4A4A' : '#E0E0E0',
                    },
                  ]}
                  maxLength={1}
                  keyboardType="default"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  value={value}
                  onChangeText={(text) => handleCodeInput(index, text)}
                  editable={!loading}
                  placeholderTextColor={secondaryTextColor}
                />
              ))}
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: secondaryTextColor, marginTop: 16 }]}>
              Digite o código que acabamos de enviar no seu email
            </Text>

            {/* Validate Button */}
            <TouchableOpacity
              style={[
                styles.validateButton,
                {
                  backgroundColor: buttonBgColor,
                  opacity: token.length === 5 ? 1 : 0.5,
                },
              ]}
              onPress={handleValidate}
              disabled={token.length !== 5 || loading}
            >
              <Text style={styles.validateButtonText}>
                {loading ? 'Validando...' : 'validar'}
              </Text>
            </TouchableOpacity>

            {/* Expiration Info */}
            <Text style={[styles.expirationText, { color: secondaryTextColor }]}>
              Este código expirará em 15 minutos. Se você não solicitou este código, apenas ignore este e-mail.
            </Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Seus estilos (mantidos 100%)
const styles = StyleSheet.create({
  // ... (todos os seus estilos 'overlay', 'modalContainer', 'header', etc.) ...
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 'auto',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 16,
  },
  headerLogo: {
    width: 80,
    height: 80,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titleContainer: {
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  codeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  validateButton: {
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  expirationText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 12,
  },
});

export default ModalToken;