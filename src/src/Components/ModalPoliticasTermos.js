import React, { useEffect, useRef, useState } from 'react';
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
  const [internalVisible, setInternalVisible] = useState(visivel);

  // evita usar driver nativo na web
  const useNative = Platform.OS !== 'web';

  // refs para controlar/limpar animações em andamento
  const animationsRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      // cleanup ao desmontar: parar animações pendentes e evitar setState
      mountedRef.current = false;
      animationsRef.current.forEach(anim => anim && typeof anim.stop === 'function' && anim.stop());
      animationsRef.current = [];
    };
  }, []);

  // Controla montagem do Modal: mantém montado enquanto animações de saída rodam
  useEffect(() => {
    // limpar animações anteriores
    animationsRef.current.forEach(a => a && typeof a.stop === 'function' && a.stop());
    animationsRef.current = [];

    if (visivel) {
      // montar antes de animar entrada
      setInternalVisible(true);
      const a1 = Animated.timing(animacaoSubida, { toValue: 0, duration: 300, useNativeDriver: useNative });
      const a2 = Animated.timing(animacaoOpacidade, { toValue: 1, duration: 300, useNativeDriver: useNative });
      animationsRef.current = [a1, a2];
      Animated.parallel([a1, a2]).start(() => {
        animationsRef.current = [];
      });
    } else if (internalVisible) {
      // animação de saída: só desmonta quando terminar
      const a1 = Animated.timing(animacaoSubida, { toValue: alturaTela, duration: 300, useNativeDriver: useNative });
      const a2 = Animated.timing(animacaoOpacidade, { toValue: 0, duration: 300, useNativeDriver: useNative });
      animationsRef.current = [a1, a2];
      Animated.parallel([a1, a2]).start(() => {
        animationsRef.current = [];
        if (mountedRef.current) setInternalVisible(false);
      });
    }
  }, [visivel]);



  const renderizarConteudo = () => {
    // Tela de seleção inicial
    return (
      <View style={stylesModal.selecaoContainer}>
        
        <TouchableOpacity 
          style={[
            stylesModal.botaoSelecao,
            { backgroundColor: colors.surface, borderColor: colors.primary }
          ]}
          onPress={() => {
            aoFechar();
            aoAbrirPoliticas();
          }}
        >
          <Text style={[stylesModal.textoBotaoSelecao, { color: colors.primary }]}>Política de privacidade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[stylesModal.botaoSelecao, dynamic.botaoSelecaoPrimary]}
          onPress={() => {
            aoFechar();
            aoAbrirTermos && aoAbrirTermos();
          }}
        >
          <Text style={[stylesModal.textoBotaoSelecao, dynamic.botaoSelecaoTextPrimary]}>Termos</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
      visible={internalVisible}
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
              transform: [{ translateY: animacaoSubida }]
            }
          ]}
        >
          <SafeAreaView style={[stylesModal.modalContent, dynamic.modalContent]}>
            {/* Header do Modal */}
            <View style={[stylesModal.headerModal, dynamic.headerModal]}>
              <Text style={[stylesModal.tituloHeader, dynamic.tituloHeader]}>Políticas e termos</Text>
              <TouchableOpacity 
                style={stylesModal.botaoFechar}
                onPress={aoFechar}
              >
                <Text style={[stylesModal.iconeFechar, dynamic.iconeFechar]}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Modal */}
            <View style={[stylesModal.conteudoContainer, dynamic.conteudoContainer]}>
              {renderizarConteudo()}
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};


export default ModalPoliticasTermos;
