// TelaLogin.js (Adaptado)

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  Image,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ModalPoliticasTermos from '../../Components/ModalPoliticasTermos';
import ModalToken from '../../Components/Modal_Token/ModalToken';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { solicitarToken } from '../../Services/api';

const TelaLogin = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('politicas');
  const [mostrarCardPoliticas, setMostrarCardPoliticas] = useState(false);
  const [mostrarCardTermos, setMostrarCardTermos] = useState(false);
  const [mostrarModalToken, setMostrarModalToken] = useState(false);

  const dynamicStyles = useMemo(() => ({
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
    },
    conteudo: {
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
      paddingHorizontal: 30,
      paddingVertical: 20,
    },
    textoPoliticas: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  }), [colors]);

  const handleEntrar = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      await solicitarToken(email, senha);
      setMostrarModalToken(true);
    } catch (error) {
      Alert.alert('Erro no Login', error.message || "Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidarToken = (userData) => {
    login(userData);
  };

  const stylesLogin = useMemo(() => ({
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  }), [colors, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >

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
            />
          </View>

          <View style={dynamicStyles.linhaSeparadora} />

          <TouchableOpacity
            style={dynamicStyles.botaoEntrar}
            onPress={handleEntrar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={dynamicStyles.textoBotaoEntrar}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.rodape}>
          <Text style={dynamicStyles.textoPoliticas}>
            Ao começar declara estar de acordo com a nossa{' '}
            <Text
              style={{ color: colors.primary, textDecorationLine: 'underline' }}
              onPress={() => setMostrarModal(true)}
            >
              Política de privacidade
            </Text>
            {' '}e com o nosso{' '}
            <Text
              style={{ color: colors.primary, textDecorationLine: 'underline' }}
              onPress={() => setMostrarModal(true)}
            >
              Tratamento de dados pessoais
            </Text>
          </Text>
        </View>

        <ModalPoliticasTermos
          visivel={mostrarModal}
          tipo={tipoModal}
          aoFechar={() => setMostrarModal(false)}
          aoConcordar={() => setMostrarModal(false)}
          aoAbrirPoliticas={() => setMostrarCardPoliticas(true)}
          aoAbrirTermos={() => setMostrarCardTermos(true)}
        />

        <ModalToken
          visible={mostrarModalToken}
          onClose={() => setMostrarModalToken(false)}
          onValidate={handleValidarToken}
          email={email}
        />

        {mostrarCardPoliticas && (
          <View style={stylesLogin.cardOverlay}>{/* conteúdo original aqui */}</View>
        )}
        {mostrarCardTermos && (
          <View style={stylesLogin.cardOverlay}>{/* conteúdo original aqui */}</View>
        )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TelaLogin;
