import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 1. Importando o novo componente HeaderChat
import HeaderChat from '../../Components/header_chat/header_Chat';
import { useTheme } from '../../context/ThemeContext';

// --- Dados Mock ---

const MOCK_MESSAGES = [
  { id: '1', type: 'text', text: 'Olá, tudo bem?', sender: 'me' },
  { id: '2', type: 'text', text: 'Como você está?', sender: 'me' },
  { id: '3', type: 'text', text: 'Tudo ótimo, e você?', sender: 'other' },
  { id: '4', type: 'date', date: 'Quarta-Feira' },
  { id: '5', type: 'text', text: 'Estou bem também, obrigado por perguntar!', sender: 'other' },
  { id: '6', type: 'text', text: 'Podemos falar sobre o projeto?', sender: 'other' },
  { id: '7', type: 'audio', sender: 'me' },
  { id: '8', type: 'audio', sender: 'other' },
];

// O antigo componente 'CustomHeader' foi removido daqui.

// --- Componente de Entrada de Mensagem ---
const MessageInput = ({ colors }) => {
  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="camera-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="image-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <TextInput
        style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Digite uma mensagem..."
        placeholderTextColor={colors.textSecondary}
      />
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="microphone" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

// --- Componente Principal da Tela de Chat ---
// 2. A tela agora recebe 'navigation' como propriedade
const Chat = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  const renderItem = ({ item }) => {
    const isSender = item.sender === 'me';
    
    if (item.type === 'date') {
      return (
        <View style={[styles.dateSeparatorContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.dateSeparatorText, { color: colors.primary }]}>{item.date}</Text>
        </View>
      );
    }
    
    if (item.type === 'audio') {
      const iconColor = isSender ? '#FFFFFF' : colors.textPrimary;
      const Waveform = () => (
        <View style={styles.waveformContainer}>
          {[0.6, 0.8, 0.7, 0.9, 0.5, 1, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
            <View key={i} style={[styles.wavebar, { height: `${h * 100}%`, backgroundColor: iconColor }]} />
          ))}
        </View>
      );

      return (
        <View style={[styles.messageRow, isSender ? styles.senderRow : styles.receiverRow]}>
          <View style={[
            styles.audioBubble, 
            isSender ? [styles.senderBubble, { backgroundColor: colors.primary }] : 
            [styles.receiverBubble, { backgroundColor: isDark ? '#3A3A3A' : '#E3F2FD' }]
          ]}>
            <Text>🎤</Text>
            <Waveform />
            {!isSender && <View style={{width: 24}} />}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, isSender ? styles.senderRow : styles.receiverRow]}>
        <View style={[
          styles.textBubble, 
          isSender ? [styles.senderBubble, { backgroundColor: colors.primary }] : 
          [styles.receiverBubble, { backgroundColor: isDark ? '#3A3A3A' : '#E3F2FD' }]
        ]}>
          <Text style={[
            isSender ? styles.senderText : styles.receiverText,
            { color: isSender ? '#FFFFFF' : colors.textPrimary }
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 3. Usando o novo HeaderChat e passando as props necessárias */}
      <HeaderChat
        chatTitle="Equipe de Suporte"
        onBackPress={() => navigation.goBack()}
        navigation={navigation}
      />
      
      <FlatList
        data={MOCK_MESSAGES.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
      />
      
      <MessageInput colors={colors} />
    </SafeAreaView>
  );
};

// --- Folha de Estilos Unificada ---
const styles = StyleSheet.create({
  // Estilos Gerais
  container: {
    flex: 1,
  },
  
  // 4. Os estilos do header antigo (headerContainer, etc.) foram removidos.
  
  // Estilos da Lista de Mensagens
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageRow: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  senderRow: {
    alignSelf: 'flex-start',
  },
  receiverRow: {
    alignSelf: 'flex-end',
  },
  textBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  audioBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '60%',
  },
  senderBubble: {
    borderTopLeftRadius: 5,
  },
  receiverBubble: {
    borderTopRightRadius: 5,
  },
  senderText: {
    color: '#FFFFFF',
  },
  receiverText: {
    color: '#333333',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginHorizontal: 10,
  },
  wavebar: {
    width: 3,
    borderRadius: 3,
    marginHorizontal: 1.5,
  },
  dateSeparatorContainer: {
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  iconButton: {
    padding: 5,
  },
});

export default Chat;