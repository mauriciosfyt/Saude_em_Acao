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
  const [errorMessage, setErrorMessage] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '').slice(-1).toUpperCase();
    // Atualiza apenas quando há um caractere válido
    if (cleanedValue) {
      newInputs[index] = cleanedValue;
      setCodeInputs(newInputs);
      // limpar aviso de erro quando o usuário começa a digitar novamente
      if (errorMessage) {
        setErrorMessage('');
      }
      shakeAnim.setValue(0);
      setToken(newInputs.join(''));

      // Vai para o próximo campo automaticamente
      if (index < 4 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      // Quando o valor fica vazio, não forçamos alterações aqui — o onKeyPress (Backspace)
      // lida com o foco e limpeza do campo anterior em dispositivos que suportam.
      const newEmpty = [...codeInputs];
      newEmpty[index] = '';
      setCodeInputs(newEmpty);
      setToken(newEmpty.join(''));
    }
  };

  // Detecta Backspace para mover o foco e limpar o campo anterior
  const handleKeyPress = (index, e) => {
    const key = e.nativeEvent && e.nativeEvent.key;
    if (key === 'Backspace') {
      const newInputs = [...codeInputs];
      // Se campo atual já está vazio, apaga o anterior e foca nele
      if (newInputs[index] === '' && index > 0) {
        newInputs[index - 1] = '';
        setCodeInputs(newInputs);
        setToken(newInputs.join(''));
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }
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
      // Marcar erro (será usado para borda vermelha e shake)
      setErrorMessage(message);
      // animação de shake
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      // Limpa os campos para permitir nova tentativa imediata
      setCodeInputs(['', '', '', '', '']);
      setToken('');
      if (inputRefs.current[0]) inputRefs.current[0].focus();
      // Esconder a mensagem automaticamente após 3 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
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
              {codeInputs.map((value, index) => {
                const borderColor = errorMessage ? '#e74c3c' : (value ? buttonBgColor : (isDark ? '#4A4A4A' : '#E0E0E0'));
                const borderWidth = errorMessage ? 2 : 0;
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.codeInputWrapper,
                      {
                        borderColor,
                        borderWidth,
                        transform: [{ translateX: shakeAnim }],
                      },
                    ]}
                  >
                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.codeInput,
                        {
                          backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0',
                          color: textColor,
                        },
                      ]}
                      maxLength={1}
                      keyboardType="default"
                      autoCapitalize="characters"
                      autoCorrect={false}
                      value={value}
                      onChangeText={(text) => handleCodeInput(index, text)}
                      onKeyPress={(e) => handleKeyPress(index, e)}
                      editable={!loading}
                      placeholderTextColor={secondaryTextColor}
                    />
                  </Animated.View>
                );
              })}
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: secondaryTextColor, marginTop: 16 }]}>
              Digite o código que acabamos de enviar no seu email
            </Text>

            {/* Aviso de texto removido conforme solicitado; mantemos apenas borda vermelha + shake */}

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

            {/* Botão 'Limpar' removido conforme solicitado */}

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
  errorMessage: {
    color: '#e74c3c',
    backgroundColor: 'rgba(231,76,60,0.06)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
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
    gap: 6,
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
  codeInputWrapper: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
  // estilos do botão Limpar removidos
  expirationText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 12,
  },
});

export default ModalToken;