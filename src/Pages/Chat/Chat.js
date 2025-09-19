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

// --- Constantes de Cores e Dados ---
const COLORS = {
  primary: '#3F51B5',
  lightBlue: '#A8C5FF',
  background: '#FFFFFF',
  textLight: '#FFFFFF',
  textDark: '#333333',
  gray: '#B0B0B0',
  lightGray: '#F0F0F0',
  dateBackground: '#E1E9F6',
};

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
const MessageInput = () => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="camera-outline" size={24} color={COLORS.gray} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="image-outline" size={24} color={COLORS.gray} />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="Digite uma mensagem..."
        placeholderTextColor={COLORS.gray}
      />
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="microphone" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );
};

// --- Componente Principal da Tela de Chat ---
// 2. A tela agora recebe 'navigation' como propriedade
const Chat = ({ navigation }) => {
  const renderItem = ({ item }) => {
    const isSender = item.sender === 'me';
    
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparatorContainer}>
          <Text style={styles.dateSeparatorText}>{item.date}</Text>
        </View>
      );
    }
    
    if (item.type === 'audio') {
      const iconColor = isSender ? COLORS.textLight : COLORS.textDark;
      const Waveform = () => (
        <View style={styles.waveformContainer}>
          {[0.6, 0.8, 0.7, 0.9, 0.5, 1, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
            <View key={i} style={[styles.wavebar, { height: `${h * 100}%`, backgroundColor: iconColor }]} />
          ))}
        </View>
      );

      return (
        <View style={[styles.messageRow, isSender ? styles.senderRow : styles.receiverRow]}>
          <View style={[styles.audioBubble, isSender ? styles.senderBubble : styles.receiverBubble]}>
            <Text>🎤</Text>
            <Waveform />
            {!isSender && <View style={{width: 24}} />}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, isSender ? styles.senderRow : styles.receiverRow]}>
        <View style={[styles.textBubble, isSender ? styles.senderBubble : styles.receiverBubble]}>
          <Text style={isSender ? styles.senderText : styles.receiverText}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
      
      <MessageInput />
    </SafeAreaView>
  );
};

// --- Folha de Estilos Unificada ---
const styles = StyleSheet.create({
  // Estilos Gerais
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 5,
  },
  receiverBubble: {
    backgroundColor: COLORS.lightBlue,
    borderTopRightRadius: 5,
  },
  senderText: {
    color: COLORS.textLight,
  },
  receiverText: {
    color: COLORS.textDark,
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
    backgroundColor: COLORS.dateBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  dateSeparatorText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  iconButton: {
    padding: 5,
  },
});

export default Chat;