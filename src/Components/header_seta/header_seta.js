// Arquivo: src/components/CabecalhoPadrao.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Importe suas constantes de tema
import { COLORS, SPACING } from '../../constants/constants'; // <-- Atenção: ajuste o caminho para o seu arquivo!

/**
 * Um header padronizado com uma seta de voltar automática.
 * @param {object} props
 * @param {React.ReactNode} props.children - Permite adicionar ícones ou botões no lado direito.
 */
const CabecalhoPadrao = ({ children }) => {
  // Este hook da React Navigation nos dá acesso ao controle de navegação
  const navigation = useNavigation();

  return (
    <View style={estilos.container}>
      {/* Seta de Voltar (Lado Esquerdo) */}
      <TouchableOpacity
        style={estilos.botao}
        onPress={() => navigation.goBack()} // A mágica acontece aqui!
      >
        <Icon name="arrow-back" size={24} color={COLORS.escuro} />
      </TouchableOpacity>

      {/* Conteúdo Extra (Lado Direito) */}
      <View style={estilos.ladoDireito}>
        {children}
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: SPACING.pequeno,
    paddingHorizontal: SPACING.medio, // Adicionado padding horizontal para não colar nas bordas
  },
  botao: {
    padding: SPACING.pequeno, // Aumenta a área de toque do botão
  },
  ladoDireito: {
    // Este container ajuda a alinhar os itens que você adicionar
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CabecalhoPadrao;