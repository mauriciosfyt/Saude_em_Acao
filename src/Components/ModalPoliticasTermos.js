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
  Image
} from 'react-native';

import { COLORS, SPACING, FONTS, BORDERS } from '../constants/constants';
import stylesModal from '../Styles/stylesModal'
import { useColorScheme } from 'react-native';


const { height: alturaTela } = Dimensions.get('window');

const ModalPoliticasTermos = ({ visivel, tipo, aoFechar, aoConcordar, aoAbrirPoliticas, aoAbrirTermos }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const animacaoSubida = useRef(new Animated.Value(alturaTela)).current;
  const animacaoOpacidade = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (visivel) {
      // Animação de entrada - modal sobe da parte inferior
      Animated.parallel([
        Animated.timing(animacaoSubida, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animacaoOpacidade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animação de saída - modal desce para a parte inferior
      Animated.parallel([
        Animated.timing(animacaoSubida, {
          toValue: alturaTela,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animacaoOpacidade, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

    }
  }, [visivel]);



  const renderizarConteudo = () => {
    // Tela de seleção inicial
    return (
      <View style={stylesModal.selecaoContainer}>
        
        <TouchableOpacity 
          style={stylesModal.botaoSelecao}
          onPress={() => {
            aoFechar();
            aoAbrirPoliticas();
          }}
        >
          <Text style={[stylesModal.textoBotaoSelecao, { color: '#000' }]}>Política de privacidade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[stylesModal.botaoSelecao, { backgroundColor: '#405CBA', borderColor: '#405CBA' }]}
          onPress={() => {
            aoFechar();
            aoAbrirTermos && aoAbrirTermos();
          }}
        >
          <Text style={[stylesModal.textoBotaoSelecao, { color: '#fff' }]}>Termos</Text>
        </TouchableOpacity>
      </View>
    );
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
            {
              transform: [{ translateY: animacaoSubida }]
            }
          ]}
        >
          <SafeAreaView style={[stylesModal.modalContent, isDark && { backgroundColor: '#2B2B2B' }]}>
            {/* Header do Modal */}
            <View style={[stylesModal.headerModal, isDark && { backgroundColor: '#2B2B2B' }]}>
              <Text style={[stylesModal.tituloHeader, isDark && { color: '#FFFFFF' }]}>Políticas e termos</Text>
              <TouchableOpacity 
                style={stylesModal.botaoFechar}
                onPress={aoFechar}
              >
                <Text style={[stylesModal.iconeFechar, isDark && { color: '#FFFFFF' }]}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Modal */}
            <View style={[stylesModal.conteudoContainer, isDark && { backgroundColor: '#2B2B2B' }]}>
              {renderizarConteudo()}
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};


export default ModalPoliticasTermos;
