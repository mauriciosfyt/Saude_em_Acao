import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

import { COLORS, SPACING, FONTS, BORDERS } from '../constants/constants';
import stylesModal from '../Styles/stylesModal'
import { useTheme } from '../context/ThemeContext';


const { height: alturaTela } = Dimensions.get('window');

const ModalPoliticasTermos = ({ visivel, tipo, aoFechar, aoConcordar, aoAbrirPoliticas, aoAbrirTermos }) => {
  const { colors, isDark } = useTheme();
  const animacaoSubida = useRef(new Animated.Value(alturaTela)).current;
  const animacaoOpacidade = useRef(new Animated.Value(0)).current;
  const [view, setView] = useState(tipo || 'selection');

  // evita usar driver nativo na web
  const useNative = Platform.OS !== 'web';

  // refs para controlar/limpar animações em andamento
  const animationsRef = useRef([]);
  const timeoutRef = useRef(null);

  // Sincroniza view quando o modal abre com um tipo específico
  useEffect(() => {
    if (visivel && tipo) {
      setView(tipo);
    }
  }, [visivel, tipo]);

  // Reset view quando o modal fechar
  useEffect(() => {
    return () => {
      // cleanup ao desmontar: parar animações e limpar timeouts
      animationsRef.current.forEach(anim => {
        if (anim && typeof anim.stop === 'function') {
          anim.stop();
        }
      });
      animationsRef.current = [];
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Controla animações de entrada/saída
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    animationsRef.current.forEach(a => {
      if (a && typeof a.stop === 'function') a.stop();
    });
    animationsRef.current = [];

    if (visivel) {
      // Animação de entrada
      const a1 = Animated.timing(animacaoSubida, { 
        toValue: 0, 
        duration: 300, 
        useNativeDriver: useNative 
      });
      const a2 = Animated.timing(animacaoOpacidade, { 
        toValue: 1, 
        duration: 300, 
        useNativeDriver: useNative 
      });
      animationsRef.current = [a1, a2];
      Animated.parallel([a1, a2]).start();
    } else {
      // Animação de saída
      const a1 = Animated.timing(animacaoSubida, { 
        toValue: alturaTela, 
        duration: 300, 
        useNativeDriver: useNative 
      });
      const a2 = Animated.timing(animacaoOpacidade, { 
        toValue: 0, 
        duration: 300, 
        useNativeDriver: useNative 
      });
      animationsRef.current = [a1, a2];
      Animated.parallel([a1, a2]).start(() => {
        animationsRef.current = [];
      });
      // Reset view após modal fechar
      setView(tipo || 'selection');
    }
  }, [visivel]);


  const renderizarConteudo = () => {
    // Tela de seleção inicial (aparece quando view === 'selection')
    if (view === 'selection') {
      return (
        <View style={stylesModal.selecaoContainer}>
          <TouchableOpacity 
            style={[
              stylesModal.botaoSelecao,
              { backgroundColor: colors.surface, borderColor: colors.primary }
            ]}
            onPress={() => setView('politicas')}
          >
            <Text style={[stylesModal.textoBotaoSelecao, { color: colors.primary }]}>Política de privacidade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[stylesModal.botaoSelecao, { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => setView('termos')}
          >
            <Text style={[stylesModal.textoBotaoSelecao, { color: colors.onPrimary || '#fff' }]}>Termos</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // se view === 'politicas' ou 'termos', renderizar conteúdo completo abaixo (handled outside)
    return null;
  };

  const [logoError, setLogoError] = React.useState(false);

  const renderPoliticas = () => (
    <ScrollView 
      key="politicas-scroll"
      style={{ flex: 1, backgroundColor: 'transparent' }}
      contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {!logoError ? (
          <Image
            source={isDark ? require('../../assets/icons/Logo_Prata.png') : require('../../assets/icons/logo_dia.png')}
            style={stylesModal.logoTopo}
            resizeMode="contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <Text style={[stylesModal.titulo, { fontSize: 18, marginBottom: 14, color: colors.textSecondary }]}>Equipe Saúde em Ação</Text>
        )}
      </View>
      <Text style={[stylesModal.titulo, { color: colors.textPrimary }]}>Política de Privacidade</Text>

      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }] }>
        A sua privacidade é importante para nós. Esta política explica como coletamos, usamos, armazenamos e
        protegemos seus dados ao utilizar a plataforma da equipe saúde em ação.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Coleta de dados</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Coletamos informações que você fornece ao criar uma conta, como nome, e-mail, telefone, cpf e dados de
        pagamento (se aplicável). Também podemos coletar dados de navegação, como ip, tipo de dispositivo e
        interações com a plataforma.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Uso das informações</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Seus dados são utilizados para:
      </Text>
      <Text style={[stylesModal.itemLista, { color: colors.textSecondary }]}>• Fornecer e melhorar nossos serviços;</Text>
      <Text style={[stylesModal.itemLista, { color: colors.textSecondary }]}>• Personalizar sua experiência na plataforma;</Text>
      <Text style={[stylesModal.itemLista, { color: colors.textSecondary }]}>• Processar pagamentos e reservas;</Text>
      <Text style={[stylesModal.itemLista, { color: colors.textSecondary }]}>• Enviar notificações e comunicados;</Text>
      <Text style={[stylesModal.itemLista, { color: colors.textSecondary }]}>• Cumprir obrigações legais.</Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Compartilhamento de dados</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Não vendemos seus dados. Prestadores de serviço de tecnologia e autoridades legais podem ter acesso quando
        necessário e conforme a lei.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Segurança</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Implementamos medidas para proteger suas informações, mas o usuário também deve manter sua conta segura,
        evitando compartilhar sua senha.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Armazenamento e retenção</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Seus dados são armazenados em servidores seguros e mantidos pelo tempo necessário para cumprir os propósitos
        desta política ou exigências legais.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Direitos do usuário</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Você pode solicitar acesso, correção ou exclusão dos seus dados, bem como limitar ou contestar seu uso.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Cookies e tecnologias semelhantes</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências no navegador.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Alterações na política</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Podemos atualizar esta política de privacidade periodicamente. O uso contínuo da plataforma indica sua
        aceitação das mudanças.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Contato</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Se tiver dúvidas sobre esta política, entre em contato pelo e-mail: otavio.personal@hotmail.com
      </Text>
    </ScrollView>
  );

  const renderTermos = () => (
    <ScrollView 
      key="termos-scroll"
      style={{ flex: 1, backgroundColor: 'transparent' }}
      contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {!logoError ? (
          <Image
            source={isDark ? require('../../assets/icons/Logo_Prata.png') : require('../../assets/icons/logo_dia.png')}
            style={stylesModal.logoTopo}
            resizeMode="contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <Text style={[stylesModal.titulo, { fontSize: 18, marginBottom: 14, color: colors.textSecondary }]}>Equipe Saúde em Ação</Text>
        )}
      </View>
      <Text style={[stylesModal.titulo, { color: colors.textPrimary }]}>Termos de Uso</Text>

      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Ao usar nosso app Equipe Saúde em Ação, você concorda com os seguintes termos:
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Aceitação</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }] }>
        Ao acessar a plataforma, você concorda com estes Termos de Uso. Caso não concorde, não utilize a aplicação.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Uso da Aplicação</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        A plataforma oferece serviços relacionados a treinos, agendamento de aulas e acompanhamento de desempenho. Use-a apenas para fins pessoais e dentro da lei.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Cadastro e Conta</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Para algumas funcionalidades, será necessário criar uma conta. Você é responsável pela segurança da sua conta.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Privacidade</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Seus dados são protegidos conforme nossa Política de Privacidade.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Responsabilidades do Usuário</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Não use a aplicação para fins ilegais, ofensivos ou prejudiciais.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Modificações</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Podemos alterar ou descontinuar funcionalidades da aplicação a qualquer momento.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Isenção de Responsabilidade</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Não nos responsabilizamos por danos à saúde ou problemas técnicos decorrentes do uso da plataforma.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Terminação da Conta</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Podemos suspender ou encerrar sua conta em caso de violação dos Termos.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Propriedade Intelectual</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        O conteúdo da aplicação é protegido por direitos autorais. Não é permitido utilizá-lo sem autorização.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Limitação de Responsabilidade</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Não somos responsáveis por danos indiretos ou incidentais relacionados ao uso da aplicação.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Alterações</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Podemos atualizar os Termos de Uso periodicamente. O uso contínuo da aplicação após as alterações implica sua aceitação.
      </Text>

      <Text style={[stylesModal.subtitulo, { color: colors.textPrimary }]}>Lei Aplicável</Text>
      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Este acordo segue as leis do Brasil e qualquer disputa será resolvida no foro de São Paulo.
      </Text>

      <Text style={[stylesModal.paragrafo, { color: colors.textSecondary }]}>
        Para dúvidas, entre em contato: otavio.personal@hotmail.com
      </Text>
    </ScrollView>
  );

  const overlayColor = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.6)';

  // estilos dinâmicos baseados no tema (mesclados com stylesModal)
  const dynamic = {
    overlay: { backgroundColor: overlayColor },
    modalContainer: { backgroundColor: colors.surface },
    modalContent: { backgroundColor: colors.surface },
    headerModal: { backgroundColor: colors.surface },
    tituloHeader: { color: colors.textPrimary },
    iconeFechar: { color: colors.textPrimary },
    conteudoContainer: { backgroundColor: colors.surface },
    botaoSelecaoPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
    botaoSelecaoTextPrimary: { color: colors.onPrimary || '#fff' },
    botaoSelecaoText: { color: colors.primary },
    botaoConcordar: { backgroundColor: colors.primary },
    textoBotaoConcordar: { color: colors.onPrimary || '#fff' },
  };

  return (
    <Modal
      transparent={true}
      visible={visivel}
      onRequestClose={aoFechar}
      animationType="none"
    >
      <View style={stylesModal.container}>
        {/* Overlay com animação de opacidade */}
        <Animated.View 
          style={[
            stylesModal.overlay,
            dynamic.overlay,
            { opacity: animacaoOpacidade }
          ]}
        >
          <TouchableOpacity 
            style={stylesModal.overlayTouchable}
            onPress={aoFechar}
            activeOpacity={1}
          />
        </Animated.View>

        {/* Modal com animação de subida da parte inferior */}
        <Animated.View
          style={[
            stylesModal.modalContainer,
            dynamic.modalContainer,
            {
              transform: [{ translateY: animacaoSubida }],
              maxHeight: view === 'selection' ? '50%' : '98%',
              minHeight: view === 'selection' ? '35%' : '85%'
            }
          ]}
        >
          <SafeAreaView style={[stylesModal.modalContent, dynamic.modalContent]}>
            {/* Header do Modal */}
            <View style={[stylesModal.headerModal, dynamic.headerModal]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {view !== 'selection' ? (
                  <TouchableOpacity onPress={() => setView('selection')} style={{ paddingRight: 10 }}>
                    <Text style={[stylesModal.iconeFechar, dynamic.iconeFechar]}>{'‹'}</Text>
                  </TouchableOpacity>
                ) : null}
                <Text style={[stylesModal.tituloHeader, dynamic.tituloHeader]}>
                  {view === 'politicas' ? 'Política e Privacidade' : view === 'termos' ? 'Termos' : 'Políticas e termos'}
                </Text>
              </View>

              <TouchableOpacity 
                style={stylesModal.botaoFechar}
                onPress={aoFechar}
              >
                <Text style={[stylesModal.iconeFechar, dynamic.iconeFechar]}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Modal */}
            {view === 'politicas' ? (
              renderPoliticas()
            ) : view === 'termos' ? (
              renderTermos()
            ) : (
              <View style={[stylesModal.conteudoContainer, dynamic.conteudoContainer, { flex: 1 }]}>
                {renderizarConteudo()}
              </View>
            )}

            {/* Botão de concordar (aparece quando estiver visualizando conteúdo) */}
            {view !== 'selection' && (
              <View style={stylesModal.botaoConcordarContainer}>
                <TouchableOpacity
                  style={[stylesModal.botaoConcordar, dynamic.botaoConcordar]}
                  onPress={() => {
                    // Chamar callbacks e depois fechar o modal
                    if (aoConcordar) aoConcordar();
                    if (aoFechar) aoFechar();
                  }}
                >
                  <Text style={[stylesModal.textoBotaoConcordar, dynamic.textoBotaoConcordar]}>Li, Concordo</Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};


export default ModalPoliticasTermos;
