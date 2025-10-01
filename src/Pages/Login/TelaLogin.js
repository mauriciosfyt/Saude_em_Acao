import React, { useState } from 'react';
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
  Image
} from 'react-native';
import { COLORS, SPACING, FONTS, BORDERS } from '../../constants/constants';
import stylesLogin from '../../Styles/stylesLogin';
import ModalPoliticasTermos from '../../Components/ModalPoliticasTermos';
import { Ionicons } from '@expo/vector-icons';

// CORREÇÃO #1: Adicione { navigation } aqui para receber o controle de navegação
const TelaLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('politicas');
  const [mostrarCardPoliticas, setMostrarCardPoliticas] = useState(false);
  const [mostrarCardTermos, setMostrarCardTermos] = useState(false);

  const handleEntrar = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    console.log('Tentativa de login:', { email, senha });

    // CORREÇÃO #2: Adicione esta linha para navegar para a Home
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

  return (
    <SafeAreaView style={stylesLogin.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={stylesLogin.keyboardView}
      >
        {/* Header */}
        <View style={stylesLogin.header}>
          {/* CORREÇÃO #3: Adicione o onPress para o botão voltar */}
          <TouchableOpacity style={stylesLogin.botaoVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* O resto do seu código permanece idêntico */}
        <View style={stylesLogin.conteudo}>
          <Text style={stylesLogin.titulo}>Login</Text>
          
          <View style={stylesLogin.campoContainer}>
            <Text style={stylesLogin.label}>Email:</Text>
            <TextInput
              style={stylesLogin.campo}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={stylesLogin.campoContainer}>
            <Text style={stylesLogin.label}>Senha:</Text>
            <TextInput
              style={stylesLogin.campo}
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={stylesLogin.linhaSeparadora} />

          <TouchableOpacity 
            style={stylesLogin.botaoEntrar}
            onPress={handleEntrar}
          >
            <Text style={stylesLogin.textoBotaoEntrar}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={stylesLogin.rodape}>
          <Text style={stylesLogin.textoPoliticas}>
            Ao começar declara estar de acordo com a nossa{' '}
            <Text 
              style={stylesLogin.linkPoliticas}
              onPress={abrirModalPoliticas}
            >
              Política de privacidade
            </Text>
            {' '}e com o nosso{' '}
            <Text 
              style={stylesLogin.linkPoliticas}
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

        {mostrarCardPoliticas && (
          <View style={stylesLogin.cardOverlay}>
            <View style={stylesLogin.cardCenter}>
              <View style={stylesLogin.cardHeader}>
                <TouchableOpacity 
                  style={stylesLogin.botaoVoltarCard}
                  onPress={() => setMostrarCardPoliticas(false)}
                >
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Image source={require('../../../assets/icons/logo_dia.png')} style={stylesLogin.logoHeader} />
              </View>
              <Text style={stylesLogin.tituloCard}>Política e Privacidade</Text>
              <ScrollView style={stylesLogin.cardContent} showsVerticalScrollIndicator={false}>
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
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Image source={require('../../../assets/icons/logo_dia.png')} style={stylesLogin.logoHeader} />
              </View>
              <Text style={stylesLogin.tituloCard}>Termos</Text>
              <ScrollView style={stylesLogin.cardContent} showsVerticalScrollIndicator={false}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TelaLogin;