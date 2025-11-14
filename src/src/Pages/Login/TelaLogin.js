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
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDERS } from '../../constants/constants';
import { useTheme } from '../../context/ThemeContext';
import ModalPoliticasTermos from '../../Components/ModalPoliticasTermos';
import ModalToken from '../../Components/Modal_Token/ModalToken';
import { Ionicons } from '@expo/vector-icons';

// CORREÇÃO #1: Adicione { navigation } aqui para receber o controle de navegação
const TelaLogin = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('politicas');
  const [mostrarCardPoliticas, setMostrarCardPoliticas] = useState(false);
  const [mostrarCardTermos, setMostrarCardTermos] = useState(false);
  const [mostrarModalToken, setMostrarModalToken] = useState(false);

  // Criar estilos dinâmicos baseados no tema
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

  const handleEntrar = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    console.log('Tentativa de login:', { email, senha });

    // Mostrar modal de token
    setMostrarModalToken(true);
  };

  const handleValidarToken = (token) => {
    console.log('Token validado:', token);
    // Navegar para Home após validar o token
    navigation.replace('Home');
  };

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

  // Estilos específicos para os cards de Política/Termos (usa as cores do tema)
  const overlayColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)';
  const stylesLogin = useMemo(() => ({
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // overlay adaptado ao tema
      backgroundColor: overlayColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    cardCenter: {
      width: '100%',
      // limitar altura do card para deixar espaço ao redor e permitir scroll interno
      maxHeight: '90%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      // sombra sutil para destacar o card em ambos os temas
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
      // garantir que o conteúdo possa crescer e ser rolável
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

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          {/* CORREÇÃO #3: Adicione o onPress para o botão voltar */}
          <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* O resto do seu código permanece idêntico */}
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
          >
            <Text style={dynamicStyles.textoBotaoEntrar}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.rodape}>
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
        />

        {mostrarCardPoliticas && (
          <View style={stylesLogin.cardOverlay}>
            <View style={stylesLogin.cardCenter}>
              <View style={stylesLogin.cardHeader}>
                <TouchableOpacity 
                  style={stylesLogin.botaoVoltarCard}
                  onPress={() => setMostrarCardPoliticas(false)}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Image source={require('../../../assets/icons/logo_dia.png')} style={stylesLogin.logoHeader} resizeMode="contain" />
              </View>
              <Text style={stylesLogin.tituloCard}>Política e Privacidade</Text>
              <ScrollView style={stylesLogin.cardContent} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'handled'}>
                <Text style={stylesLogin.textoCard}>
                A sua privacidade é importante para nós. Esta política explica como coletamos, usamos, armazenamos e protegemos seus dados ao utilizar a plataforma da equipe saúde em ação.

Coleta de dados
coletamos informações que você fornece ao criar uma conta, como nome, e-mail, telefone, cpf e dados de pagamento (se aplicável). Também podemos coletar dados de navegação, como ip, tipo de dispositivo e interações com a plataforma.

Uso das informações
seus dados são utilizados para:
• Fornecer e melhorar nossos serviços;
• Personalizar sua experiência na plataforma;
• Processar pagamentos e reservas;
• Enviar notificações e comunicados;
• Cumprir obrigações legais.

Compartilhamento de dados
não vendemos seus dados. Prestadores de serviço de tecnologia e autoridades legais, quando necessário.

Segurança
implementamos medidas para proteger suas informações, mas o usuário também deve manter sua conta segura, evitando compartilhar sua senha.

Armazenamento e retenção
seus dados são armazenados em servidores seguros e mantidos pelo tempo necessário para cumprir os propósitos desta política ou exigências legais.

Direitos do usuário
você pode solicitar acesso, correção ou exclusão dos seus dados, bem como limitar ou contestar seu uso.

Cookies e tecnologias semelhantes
utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências no navegador.

Alterações na política
podemos atualizar esta política de privacidade periodicamente. o uso contínuo da plataforma indica sua aceitação das mudanças.

Contato
se tiver dúvidas sobre esta política, entre em contato pelo e-mail: otavio.personal@hotmail.com
                </Text>
              </ScrollView>
              <View style={stylesLogin.cardButtonContainer}>
                <TouchableOpacity style={stylesLogin.cardButton} onPress={() => setMostrarCardPoliticas(false)}>
                  <Text style={stylesLogin.cardButtonText}>Li, Concordo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {mostrarCardTermos && (
          <View style={stylesLogin.cardOverlay}>
            <View style={stylesLogin.cardCenter}>
              <View style={stylesLogin.cardHeader}>
                <TouchableOpacity 
                  style={stylesLogin.botaoVoltarCard}
                  onPress={() => setMostrarCardTermos(false)}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Image source={require('../../../assets/icons/logo_dia.png')} style={stylesLogin.logoHeader} resizeMode="contain" />
              </View>
              <Text style={stylesLogin.tituloCard}>Termos</Text>
              <ScrollView style={stylesLogin.cardContent} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'handled'}>
                <Text style={stylesLogin.textoCard}>
            Ao usar nosso app Equipe Saúde em Ação, você concorda com os seguintes termos:

Aceitação: Ao acessar a plataforma, você concorda com estes Termos de Uso. Caso não concorde, não utilize a aplicação.

Uso da Aplicação: A plataforma oferece serviços relacionados a treinos, agendamento de aulas e acompanhamento de desempenho. Use-a apenas para fins pessoais e dentro da lei.

Cadastro e Conta: Para algumas funcionalidades, será necessário criar uma conta. Você é responsável pela segurança da sua conta.

Privacidade: Seus dados são protegidos conforme nossa Política de Privacidade.

Responsabilidades do Usuário: Não use a aplicação para fins ilegais, ofensivos ou prejudiciais.

Modificações: Podemos alterar ou descontinuar funcionalidades da aplicação a qualquer momento.

Isenção de Responsabilidade: Não nos responsabilizamos por danos à saúde ou problemas técnicos decorrentes do uso da plataforma.

Terminação da Conta: Podemos suspender ou encerrar sua conta em caso de violação dos Termos.

Propriedade Intelectual: O conteúdo da aplicação é protegido por direitos autorais. Não é permitido utilizá-lo sem autorização.

Limitação de Responsabilidade: Não somos responsáveis por danos indiretos ou incidentais relacionados ao uso da aplicação.

Alterações: Podemos atualizar os Termos de Uso periodicamente. O uso contínuo da aplicação após as alterações implica sua aceitação.

Lei Aplicável: Este acordo segue as leis do Brasil e qualquer disputa será resolvida no foro de São Paulo.

Para dúvidas, entre em contato: otavio.personal@hotmail.com
                </Text>
              </ScrollView>
              <View style={stylesLogin.cardButtonContainer}>
                <TouchableOpacity style={stylesLogin.cardButton} onPress={() => setMostrarCardTermos(false)}>
                  <Text style={stylesLogin.cardButtonText}>Li, Concordo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TelaLogin;