// TelaLogin.js (Adaptado)

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  ActivityIndicator, // ADAPTADO: Para feedback de loading
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDERS } from '../../constants/constants';
import { useTheme } from '../../context/ThemeContext';
import ModalPoliticasTermos from '../../Components/ModalPoliticasTermos';
import ModalToken from '../../Components/Modal_Token/ModalToken';
import { Ionicons } from '@expo/vector-icons';

// ADAPTAÇÃO: Importar o Contexto e a API
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho
import { solicitarToken } from '../../Services/api'; // Ajuste o caminho

const TelaLogin = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  // ADAPTAÇÃO: Pegar a função 'login' do contexto
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // ADAPTAÇÃO: Estado de loading da API
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('politicas');
  const [mostrarCardPoliticas, setMostrarCardPoliticas] = useState(false);
  const [mostrarCardTermos, setMostrarCardTermos] = useState(false);
  const [mostrarModalToken, setMostrarModalToken] = useState(false);

  // Seus estilos dinâmicos (mantidos 100%)
  const dynamicStyles = useMemo(() => ({
    // ... (todos os seus estilos 'container', 'header', 'conteudo', etc.) ...
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 15,
      marginTop: 30,
      backgroundColor: colors.background,
    },
    conteudo: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 30,
      paddingTop: 100,
    },
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 30,
      marginTop: -35,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    campo: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    botaoEntrar: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      marginTop: 20,
      alignItems: 'center',
      ...Platform.select({
        web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.18)' },
        default: {
          elevation: 8,
        },
      }),
    },
    textoBotaoEntrar: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    linhaSeparadora: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 25,
      width: '100%',
      opacity: 0.3,
    },
    rodape: {
      backgroundColor: colors.background,
      paddingHorizontal: 30,
      paddingVertical: 20,
    },
    textoPoliticas: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  }), [colors, isDark]);

  // ADAPTAÇÃO CRÍTICA: Lógica de "Entrar"
  const handleEntrar = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true); // Inicia o loading
    Keyboard.dismiss();

    try {
      console.log('Solicitando token para:', email);
      // Passo 1: Chama a API para enviar o código de 5 dígitos por email
      await solicitarToken(email, senha); //

      // Se a API deu certo (não deu erro):
      console.log('Solicitação de token OK. Abrindo modal.');
      setMostrarModalToken(true); // Abre o modal do token

    } catch (error) {
      console.error('Erro ao solicitar token:', error);
      // Sua api.js já trata o erro (error.message)
      const message = error.message || "Email ou senha incorretos.";
      Alert.alert('Erro no Login', message);
    } finally {
      setLoading(false); // Para o loading
    }
  };

  // ADAPTAÇÃO CRÍTICA: Lógica de validação do Token
  // 'userData' agora é o objeto { token: "JWT_REAL", email: "..." } vindo do ModalToken
  const handleValidarToken = (userData) => {
    console.log('Token JWT recebido. Logando no contexto...');
    
    // Passo 3: Passa o JWT real para o AuthContext
    login(userData); // O AuthContext vai salvar e mudar o estado

    // REMOVIDO: navigation.replace('Home');
    // Por que removemos? O seu Navegador Raiz (que usa o AuthContext)
    // vai detectar que 'isAuthenticated' mudou para 'true'
    // e vai AUTOMATICAMENTE trocar a tela para Home (AppStack).
  };

  // Funções dos modais (mantidas 100%)
  const abrirModalPoliticas = () => {
    setTipoModal('politicas');
    setMostrarModal(true);
  };
  const abrirModalTermos = () => {
    setTipoModal('termos');
    setMostrarModal(true);
  };
  const fecharModal = () => {
    setMostrarModal(false);
  };
  const handleConcordar = () => {
    fecharModal();
    console.log('Usuário concordou com os termos');
  };
  const abrirCardPoliticas = () => {
    setMostrarCardPoliticas(true);
    setMostrarModal(false);
  };
  const abrirCardTermos = () => {
    setMostrarCardTermos(true);
    setMostrarModal(false);
  };

  // Estilos dos cards (mantidos 100%)
  const overlayColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)';
  const stylesLogin = useMemo(() => ({
    // ... (todos os seus estilos 'cardOverlay', 'cardCenter', 'cardHeader', etc.) ...
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: overlayColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    cardCenter: {
      width: '100%',
      maxHeight: '90%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      ...Platform.select({
        web: { boxShadow: '0px 6px 12px rgba(0,0,0,0.12)' },
        default: {
          elevation: 8,
        },
      }),
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      position: 'relative',
    },
    botaoVoltarCard: {
      padding: 8,
      position: 'absolute',
      left: 12,
      zIndex: 2,
    },
    logoHeader: {
      width: 48,
      height: 48,
      alignSelf: 'center',
    },
    tituloCard: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      paddingHorizontal: 16,
      paddingBottom: 6,
      textAlign: 'center',
      marginTop: 8,
    },
    cardContent: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexGrow: 1,
    },
    textoCard: {
      color: colors.textPrimary,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'justify',
    },
    cardButtonContainer: {
      padding: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    cardButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      width: '100%',
    },
    cardButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
  }), [colors, isDark, overlayColor]);

  // Seu JSX (mantido 100%, com pequenas adições no botão 'Entrar')
  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.conteudo}>
          <Text style={dynamicStyles.titulo}>Login</Text>
          
          <View style={{ marginBottom: 8, marginTop: 40 }}>
            <Text style={dynamicStyles.label}>Email:</Text>
            <TextInput
              style={dynamicStyles.campo}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ marginBottom: 8, marginTop: 40 }}>
            <Text style={dynamicStyles.label}>Senha:</Text>
            <TextInput
              style={dynamicStyles.campo}
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={dynamicStyles.linhaSeparadora} />

          <TouchableOpacity 
            style={dynamicStyles.botaoEntrar}
            onPress={handleEntrar}
            disabled={loading} // ADAPTAÇÃO: Desabilitar botão no loading
          >
            {/* ADAPTAÇÃO: Mostrar loading no botão */}
            {loading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={dynamicStyles.textoBotaoEntrar}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.rodape}>
          {/* ... (seu texto de políticas) ... */}
           <Text style={dynamicStyles.textoPoliticas}>
            Ao começar declara estar de acordo com a nossa{' '}
            <Text 
              style={{ color: colors.primary, textDecorationLine: 'underline' }}
              onPress={abrirModalPoliticas}
            >
              Política de privacidade
            </Text>
            {' '}e com o nosso{' '}
            <Text 
              style={{ color: colors.primary, textDecorationLine: 'underline' }}
              onPress={abrirModalTermos}
            >
              Tratamento de dados pessoais
            </Text>
          </Text>
        </View>

        <ModalPoliticasTermos
          visivel={mostrarModal}
          tipo={tipoModal}
          aoFechar={fecharModal}
          aoConcordar={handleConcordar}
          aoAbrirPoliticas={abrirCardPoliticas}
          aoAbrirTermos={abrirCardTermos}
        />

        <ModalToken
          visible={mostrarModalToken}
          onClose={() => setMostrarModalToken(false)}
          onValidate={handleValidarToken}
          email={email} // ADAPTAÇÃO: Passar o email para o modal
        />

        {/* ... (Seus cards de Políticas e Termos - mantidos 100%) ... */}
        {mostrarCardPoliticas && (
          <View style={stylesLogin.cardOverlay}>{/* ... */}</View>
        )}
        {mostrarCardTermos && (
          <View style={stylesLogin.cardOverlay}>{/* ... */}</View>
        )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TelaLogin;