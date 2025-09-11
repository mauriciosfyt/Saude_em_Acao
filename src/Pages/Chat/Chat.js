import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image, // Importe o componente Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

// --- Componente do Cabeçalho Customizado ---
const CustomHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => alert('Botão Voltar pressionado!')}>
        <Icon name="arrow-left" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
      
      <View style={styles.headerTitleContainer}>
        <Image
          // IMPORTANTE: Substitua pelo caminho correto do seu logo
          source={require('../../../assets/icons/logo_dia.png')} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Chats de Mídias</Text>
      </View>
      
      <TouchableOpacity onPress={() => alert('Botão Menu pressionado!')}>
        <Icon name="menu" size={24} color={COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
};

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
const Chat = () => {
  // Função para renderizar cada item da lista de mensagens
  const renderItem = ({ item }) => {
    const isSender = item.sender === 'me';
    
    // 1. Renderiza o separador de data
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparatorContainer}>
          <Text style={styles.dateSeparatorText}>{item.date}</Text>
        </View>
      );
    }
    
    // 2. Renderiza mensagens de áudio
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
            <Icon name="microphone" size={24} color={iconColor} />
            <Waveform />
            {!isSender && <View style={{width: 24}} />}
          </View>
        </View>
      );
    }

    // 3. Renderiza mensagens de texto (padrão)
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
      {/* Cabeçalho customizado adicionado aqui */}
      <CustomHeader />
      
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
  
  // Estilos do Cabeçalho (ADICIONADO)
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderBottomColor: COLORS.lightGray,
    height: 150,
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 60,
    height: 60,
    marginBottom: 1,

  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  
  // Estilos da Lista de Mensagens
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'column-reverse',
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

  // Estilos dos Balões de Mensagem
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
  
  // Estilos de Áudio e Data
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

  // Estilos do Input de Mensagem
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