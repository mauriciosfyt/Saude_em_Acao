import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import HeaderChat from '../../Components/header_chat/header_Chat';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  obterHistoricoChat,
  enviarMensagemChat,
  enviarImagemChat,
  setAuthToken,
  apagarMensagemChat,
  apagarHistoricoChat,
} from '../../Services/api';
import * as SecureStore from 'expo-secure-store';

export const __FILE_ORIGIN = 'CHAT';
export const __FILE_PATH = 'src/Pages/Chat/Chat.js';
console.log(`[FILE] Loaded ${__FILE_ORIGIN} (${__FILE_PATH})`);

const MOCK_MESSAGES = [
  { id: '1', type: 'text', text: 'Olá, tudo bem?', sender: 'me' },
  { id: '2', type: 'text', text: 'Como você está?', sender: 'me' },
  { id: '3', type: 'text', text: 'Tudo ótimo, e você?', sender: 'other' },
  { id: '4', type: 'date', date: 'Quarta-Feira' },
  { id: '5', type: 'text', text: 'Estou bem também, obrigado por perguntar!', sender: 'other' },
  { id: '6', type: 'text', text: 'Podemos falar sobre o projeto?', sender: 'other' },
];

// --- Componente de Entrada de Mensagem ---
const MessageInput = ({ colors, onSendMessage, onSendImage, onClearAll, onClearMine, enviando, canSend }) => {
  const [mensagem, setMensagem] = useState('');

  const handleSend = () => {
    if (mensagem.trim() && !enviando) {
      onSendMessage(mensagem.trim());
      setMensagem('');
    }
  };

  const solicitarPermissoes = async () => {
    if (!canSend) {
      Alert.alert('Permissão negada', 'Apenas usuários com papel ADMIN ou PERSONAL podem enviar mensagens neste chat.');
      return;
    }
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de permissão para acessar suas fotos!',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const selecionarImagem = async () => {
    const temPermissao = await solicitarPermissoes();
    if (!temPermissao) return;

    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        const imagem = resultado.assets[0];
        onSendImage(imagem.uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const tirarFoto = async () => {
    if (!canSend) {
      Alert.alert('Permissão negada', 'Apenas usuários com papel ADMIN ou PERSONAL podem enviar imagens neste chat.');
      return;
    }
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de permissão para acessar a câmera!',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    try {
      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        const imagem = resultado.assets[0];
        onSendImage(imagem.uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const handleClearPress = () => {
    Alert.alert(
      'Limpar mensagens',
      'Escolha as mensagens a apagar:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar minhas mensagens',
          onPress: () => {
            if (typeof onClearMine === 'function') onClearMine();
          },
        },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: () => {
            if (typeof onClearAll === 'function') onClearAll();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: colors.background, borderTopColor: colors.border },
      ]}
    >
      <TouchableOpacity style={styles.iconButton} onPress={tirarFoto} disabled={enviando || !canSend}>
        <Icon name="camera-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={selecionarImagem} disabled={enviando || !canSend}>
        <Icon name="image-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        placeholder="Digite uma mensagem..."
        placeholderTextColor={colors.textSecondary}
        value={mensagem}
        onChangeText={setMensagem}
        onSubmitEditing={handleSend}
        editable={!enviando}
      />
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleSend}
        disabled={!canSend || !mensagem.trim() || enviando}
      >
        {enviando ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Icon
            name="send"
            size={24}
            color={mensagem.trim() ? colors.primary : colors.textSecondary}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={handleClearPress} disabled={enviando || !canSend}>
        <Icon name="trash-can-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

// --- Componente Principal da Tela de Chat ---
const Chat = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  // Determina se o usuário atual tem permissão de chat
  // Agora a regra é baseada na Role da API: 'ADMIN' e 'PERSONAL' podem enviar e apagar mensagens
  const hasChatPermissionByRole = (u) => {
    if (!u) return false;

    const allowed = ['ADMIN', 'PERSONAL'];

    // 1) campo único 'role' (string)
    const roleField = u?.role || u?.perfil || u?.tipo || u?.profile;
    if (roleField && typeof roleField === 'string') {
      const role = roleField.trim().toUpperCase();
      if (allowed.includes(role)) return true;
    }

    // 2) campo 'roles' ou 'perfis' que pode ser array
    if (Array.isArray(u?.roles)) {
      if (u.roles.some(r => allowed.includes(String(r).trim().toUpperCase()))) return true;
    }
    if (Array.isArray(u?.perfis)) {
      if (u.perfis.some(r => allowed.includes(String(r).trim().toUpperCase()))) return true;
    }

    // 3) flags booleanas (compatibilidade com versões antigas)
    if (typeof u?.isAdmin === 'boolean' && u.isAdmin) return true;
    if (typeof u?.admin === 'boolean' && u.admin) return true;

    // nenhum critério encontrou correspondência
    return false;
  };

  const canSend = hasChatPermissionByRole(user);
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const flatListRef = useRef(null);
  const primeiraCargaRef = useRef(true);
  const deletedIdsRef = useRef(new Set());
  const chatId = route?.params?.chatId || 1;
  // --- Normalização e carregamento de mensagens ---
  const normalizeMessage = (raw) => {
    if (!raw) return null;

    // extração de id e conteúdo compatível com várias formas da API
    const id = extractServerId(raw) ?? String(raw?.id ?? raw?._id ?? Date.now());
    const createdAt = raw?.createdAt || raw?.data || raw?.date || raw?.timestamp || null;
    const conteudo = raw?.conteudo ?? raw?.text ?? raw?.mensagem ?? raw?.message ?? raw?.body ?? '';

    // tipagem simples: date | image | text
    let type = raw?.type ?? 'text';
    if (!type) type = 'text';
    const lower = String(conteudo).toLowerCase();
    if (!type || type === 'text') {
      // Detect common image URI formats: http(s) to images, data URIs, file:// (local), content:// (Android), or paths with image extensions
      const isHttpImage = lower.startsWith('http') && (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.includes('image'));
      const isDataImage = lower.startsWith('data:image');
      const isFileImage = lower.startsWith('file:') || lower.startsWith('content:');
      const hasImageExt = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(raw?.conteudo || raw?.text || '');
      if (isHttpImage || isDataImage || isFileImage || hasImageExt) {
        type = 'image';
      }
    }

    // determinar remetente
    const sender = isMessageFromUser(raw, user) ? 'me' : raw?.sender ?? raw?.remetente ?? 'other';

    // detectar se a mensagem foi enviada por um STAFF (ADMIN / PERSONAL)
    let isFromStaff = false;
    try {
      const remetente = raw?.remetente ?? raw?.from ?? raw?.autor ?? raw?.sender ?? null;
      const roleField =
        (remetente && (remetente.role || remetente.perfil || remetente.tipo)) || raw?.role || raw?.perfil || null;
      if (roleField && typeof roleField === 'string') {
        const r = roleField.trim().toUpperCase();
        if (['ADMIN', 'PERSONAL'].includes(r)) isFromStaff = true;
      } else if (Array.isArray(roleField)) {
        if (roleField.some(r => ['ADMIN', 'PERSONAL'].includes(String(r).trim().toUpperCase()))) isFromStaff = true;
      }
    } catch (e) {
      // não falhar por causa de formato inesperado
      isFromStaff = false;
    }

    return {
      id: String(id),
      type,
      text: conteudo || '',
      image: type === 'image' ? conteudo : undefined,
      createdAt,
      sender,
      isFromStaff,
      raw,
    };
  };

  const loadHistory = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) setAuthToken(token);

      const data = await obterHistoricoChat(chatId);

      // A API pode retornar várias formas: array direto ou objeto com propriedade
      let items = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data?.mensagens)) items = data.mensagens;
      else if (Array.isArray(data?.messages)) items = data.messages;
      else if (Array.isArray(data?.historico)) items = data.historico;
      else if (Array.isArray(data?.items)) items = data.items;

      if (!items || items.length === 0) {
        // fallback: usar mocks para facilitar o desenvolvimento
        setMensagens(MOCK_MESSAGES);
      } else {
        const normalized = items.map(normalizeMessage).filter(Boolean);
        
        // Ordenar mensagens por data: mais antigas primeiro, mais recentes por último
        const sorted = normalized.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (a.raw?.timestamp || 0);
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (b.raw?.timestamp || 0);
          
          // Se ambos têm datas, ordena por data
          if (dateA && dateB) {
            return dateA - dateB; // Mais antiga primeiro
          }
          
          // Se só um tem data, ele vem primeiro
          if (dateA && !dateB) return -1;
          if (!dateA && dateB) return 1;
          
          // Se nenhum tem data, mantém ordem original (ou por ID se disponível)
          return 0;
        });
        
        setMensagens(sorted);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico do chat:', err);
      setErro(err?.message || String(err));
      // fallback minimal
      setMensagens(MOCK_MESSAGES);
    } finally {
      setCarregando(false);
      primeiraCargaRef.current = false;
    }
  };

  useEffect(() => {
    // carregar histórico na primeira montagem e ao mudar de chatId
    loadHistory();
    // não adicionar 'user' nas deps para evitar loops caso user contenha token mutável
  }, [chatId]);

  // --- Render, envio e ações ---
  const renderItem = ({ item }) => {
    if (!item) return null;

    if (item.type === 'date') {
      return (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.date || item.text}</Text>
        </View>
      );
    }

    const fromMe = item.sender === 'me' || isMessageFromUser(item.raw, user);
    const isStaffMessage = !!item.isFromStaff;
    const viewerIsStaff = !!canSend; // usuário atual tem papel ADMIN/PERSONAL?

    const rowStyle = [styles.messageRow, fromMe ? styles.receiverRow : styles.senderRow];

    // Regra de cor: mensagens do próprio usuário usam colors.primary; mensagens de STAFF
    // (ADMIN/PERSONAL) devem aparecer em azul (colors.primary) para alunos (viewerIsStaff === false).
    const shouldShowStaffBlue = !fromMe && isStaffMessage && !viewerIsStaff;

    const bubbleStyle = [
      styles.textBubble,
      { backgroundColor: fromMe || shouldShowStaffBlue ? colors.primary : colors.surface },
    ];

    if (item.type === 'image' && item.image) {
      return (
        <TouchableOpacity
          onLongPress={() => (fromMe || canSend) && handleApagarMensagem(item)}
          activeOpacity={0.8}
          style={rowStyle}
          key={item.id}
        >
          <View style={[styles.imageBubble, { backgroundColor: fromMe || shouldShowStaffBlue ? colors.primary : colors.surface }]}> 
            <Image source={{ uri: item.image }} style={styles.messageImage} resizeMode="cover" />
            {item.uploading && (
              <View style={styles.imageOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
            {item.uploadError && (
              <TouchableOpacity style={styles.imageOverlay} onPress={() => handleEnviarImagem(item.raw?.localUri || item.image)}>
                <Icon name="alert-circle" size={36} color="#ff5252" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onLongPress={() => (fromMe || canSend) && handleApagarMensagem(item)}
        activeOpacity={0.8}
        style={rowStyle}
        key={String(item.id)}
      >
        <View style={bubbleStyle}>
          <Text style={{ color: fromMe || shouldShowStaffBlue ? '#fff' : colors.textPrimary }}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleEnviarMensagem = async (texto) => {
    if (!canSend) {
      Alert.alert('Permissão', 'Apenas usuários com papel ADMIN ou PERSONAL podem enviar mensagens.');
      return;
    }
    if (!texto || !texto.trim()) return;
    if (enviando) return;

    setEnviando(true);
    try {
      const usuarioNome = user?.email || user?.nome || 'Usuário';
      const resp = await enviarMensagemChat(chatId, texto, usuarioNome);

      // A resposta pode variar => normalizar
      const nova = resp?.message || resp?.mensagem || resp || { id: Date.now(), conteudo: texto };
      let normalized = normalizeMessage(nova);
      if (!normalized) {
        normalized = {
          id: String(Date.now()),
          type: 'text',
          text: texto,
          sender: 'me',
          createdAt: new Date().toISOString(),
          raw: nova,
        };
      }

      // Garantir que a mensagem enviada localmente aparece como 'me' (cor do bubble)
      normalized.sender = 'me';

      // Adiciona a nova mensagem no final (embaixo)
      setMensagens((prev) => {
        const updated = [...prev, normalized];
        // Garante ordenação após adicionar (mais antigas primeiro, mais recentes por último)
        return updated.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (a.raw?.timestamp || 0);
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (b.raw?.timestamp || 0);
          return dateA - dateB; // Ordem crescente: antigas primeiro
        });
      });

      // Scroll para o final após adicionar a mensagem (novas mensagens ficam embaixo)
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    } catch (err) {
      console.error('Erro enviando mensagem:', err);
      Alert.alert('Erro', err?.message ? String(err.message) : 'Não foi possível enviar a mensagem.');
      setErro(err?.message || String(err));
    } finally {
      setEnviando(false);
    }
  };

  const handleEnviarImagem = async (uri) => {
    if (!canSend) {
      Alert.alert('Permissão', 'Apenas usuários com papel ADMIN ou PERSONAL podem enviar imagens.');
      return;
    }
    if (!uri) return;
    // Cria mensagem local do tipo 'image' para mostrar imediatamente no chat
    const localMsg = {
      id: String(Date.now()),
      type: 'image',
      image: uri,
      text: '',
      sender: 'me',
      createdAt: new Date().toISOString(),
      raw: { localUri: uri },
    };

    // adiciona mensagem local com estado de upload
    setMensagens((prev) => {
      const updated = [...prev, { ...localMsg, uploading: true }];
      return updated.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (a.raw?.timestamp || 0);
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (b.raw?.timestamp || 0);
        return dateA - dateB;
      });
    });

    // Scroll para o fim para mostrar a imagem
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);

    // Enviar para API em background: dependendo da API, pode precisar de upload multipart
    // Aqui enviamos a URI como fallback (a API deve tratar upload se suportado)
    try {
      const usuarioNome = user?.email || user?.nome || 'Usuário';
      // Tenta enviar como upload multipart (se a API suportar)
      const resp = await enviarImagemChat(chatId, uri, usuarioNome);

      // normaliza resposta do servidor para atualizar a mensagem local
      const servidorMsg = resp?.message || resp?.mensagem || resp || null;
      if (servidorMsg) {
        const normalized = normalizeMessage(servidorMsg) || {
          id: String(Date.now()),
          type: 'image',
          image: typeof servidorMsg === 'string' ? servidorMsg : (servidorMsg.conteudo || servidorMsg.image || servidorMsg.url),
          text: servidorMsg.conteudo || servidorMsg.text || '',
          sender: 'me',
          createdAt: servidorMsg.createdAt || new Date().toISOString(),
          raw: servidorMsg,
        };

        // substitui a mensagem local (procurando pelo id localMsg.id)
        setMensagens((prev) => prev.map((m) => (m.id === localMsg.id ? normalized : m)));
      } else {
        // se não retornou um objeto esperado, apenas remove o flag de uploading
        setMensagens((prev) => prev.map((m) => (m.id === localMsg.id ? { ...m, uploading: false } : m)));
      }
    } catch (e) {
      console.error('Erro ao enviar imagem para API:', e);
      // fallback: tenta enviar como texto/uri
      try {
        const usuarioNome = user?.email || user?.nome || 'Usuário';
        const resp = await enviarMensagemChat(chatId, uri, usuarioNome);
        const servidorMsg = resp?.message || resp?.mensagem || resp || null;
        if (servidorMsg) {
          const normalized = normalizeMessage(servidorMsg) || {
            id: String(Date.now()),
            type: 'image',
            image: typeof servidorMsg === 'string' ? servidorMsg : (servidorMsg.conteudo || servidorMsg.image || servidorMsg.url),
            text: servidorMsg.conteudo || servidorMsg.text || '',
            sender: 'me',
            createdAt: servidorMsg.createdAt || new Date().toISOString(),
            raw: servidorMsg,
          };
          setMensagens((prev) => prev.map((m) => (m.id === localMsg.id ? normalized : m)));
        } else {
          setMensagens((prev) => prev.map((m) => (m.id === localMsg.id ? { ...m, uploading: false } : m)));
        }
      } catch (err) {
        if (__DEV__) console.warn('[handleEnviarImagem] fallback enviarMensagemChat falhou', err?.message || err);
        // marca erro na mensagem local para permitir retry manual
        setMensagens((prev) => prev.map((m) => (m.id === localMsg.id ? { ...m, uploading: false, uploadError: true } : m)));
      }
    }
    return;
  };

  const handleLimparMensagens = async () => {
    try {
      await apagarHistoricoChat(chatId);
      setMensagens([]);
      Alert.alert('Sucesso', 'Histórico apagado');
    } catch (err) {
      console.error('Erro ao apagar histórico:', err);
      Alert.alert('Erro', err?.message ? String(err.message) : 'Falha ao apagar histórico');
    }
  };

  const handleLimparMinhasMensagens = async () => {
    // Remove localmente as mensagens do usuário
    const filtered = mensagens.filter((m) => !isMessageFromUser(m.raw || m, user));
    setMensagens(filtered);
  };

  // --- Apagar mensagem individual ---
  const handleApagarMensagem = async (item) => {
    if (!item) return;

    // só permite apagar se for autor ou se o usuário atual for admin (canSend)
    const serverId = extractServerId(item.raw || item) || item.id;
    const isAuthor = isMessageFromUser(item.raw || item, user);
    if (!isAuthor && !canSend) {
      Alert.alert('Permissão', 'Apenas usuários com papel ADMIN ou PERSONAL podem apagar mensagens de outros usuários.');
      return;
    }

    Alert.alert(
      'Apagar mensagem',
      'Deseja apagar esta mensagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              // chamada API
              await apagarMensagemChat(chatId, serverId);

              // atualizar UI local (remover todas as ocorrências com o mesmo serverId ou id)
              setMensagens((prev) =>
                prev.filter((m) => {
                  const sid = extractServerId(m.raw || m) || m.id;
                  return String(sid) !== String(serverId) && String(m.id) !== String(item.id);
                })
              );

              // feedback
              Alert.alert('Sucesso', 'Mensagem apagada');
            } catch (err) {
              console.error('Erro ao apagar mensagem:', err);
              Alert.alert('Erro', err?.message ? String(err.message) : 'Não foi possível apagar a mensagem.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  // ...

  // --- RENDERIZAÇÃO FINAL AJUSTADA ---
  if (carregando && mensagens.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderChat chatTitle="Equipe de Suporte" onBackPress={() => navigation.goBack()} navigation={navigation} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.textSecondary }}>Carregando mensagens...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderChat chatTitle="Equipe de Suporte" onBackPress={() => navigation.goBack()} navigation={navigation} />

      {erro && (
        <View style={{ padding: 10, backgroundColor: '#ffebee', margin: 10, borderRadius: 8 }}>
          <Text style={{ color: '#c62828', textAlign: 'center', fontSize: 12 }}>
            ⚠️ {erro} (Usando dados locais)
          </Text>
        </View>
      )}

      {/* ✅ Ajuste de teclado aplicado */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : Platform.OS === 'android' ? Math.max(insets.bottom + 20, 50) : 0}
      >
        <View style={styles.chatBody}>
          <FlatList
            ref={flatListRef}
            data={mensagens}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.messageListContent,
              // Mensagens antigas em cima, novas embaixo
              { flexGrow: 1, justifyContent: mensagens && mensagens.length > 0 ? 'flex-start' : 'center', paddingTop: 12, paddingBottom: 12 },
            ]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            inverted={false}
            ListEmptyComponent={
              <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  Nenhuma mensagem ainda.{'\n'}Inicie a conversa!
                </Text>
              </View>
            }
          />
        </View>

        {/* Campo de entrada fixo acima do teclado */}
        <View style={{ 
          backgroundColor: colors.background,
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom + 10, 20) : 0
        }}>
          {canSend ? (
            <MessageInput
              colors={colors}
              onSendMessage={handleEnviarMensagem}
              onSendImage={handleEnviarImagem}
              canSend={canSend}
              onClearAll={handleLimparMensagens}
              onClearMine={handleLimparMinhasMensagens}
              enviando={enviando}
            />
          ) : (
            <View style={{ padding: 12, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                Você está visualizando este chat. Apenas usuários com papel ADMIN ou PERSONAL podem enviar mensagens.
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Estilos originais (inalterados) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { flex: 1, paddingHorizontal: 10 },
  messageListContent: { paddingBottom: 16 },
  chatBody: { flex: 1 },
  messageRow: { marginVertical: 5, maxWidth: '80%' },
  senderRow: { alignSelf: 'flex-start' },
  receiverRow: { alignSelf: 'flex-end' },
  textBubble: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  imageBubble: { borderRadius: 20, overflow: 'hidden', maxWidth: 250, maxHeight: 300 },
  messageImage: { width: '100%', height: 200, borderRadius: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 16 : 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  iconButton: { padding: 5 },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});

const extractServerId = (msg) =>
  msg?.id ??
  msg?._id ??
  msg?.messageId ??
  msg?._messageId ??
  msg?.mensagemId ??
  msg?._mensagemId ??
  msg?.message_id ??
  msg?.uuid ??
  msg?.serverId;

const isMessageFromUser = (msg, user) => {
  if (!msg || !user) return false;
  const remetente =
    msg?.remetenteId ??
    msg?.from ??
    msg?.senderId ??
    msg?.remetente?._id ??
    msg?.remetente ??
    msg?.userId ??
    msg?.autorId;

  const candidates = [
    user?.id,
    user?._id,
    user?.userId,
    user?.usuarioId,
    user?.email,
    user?.nome,
    user?.cpf,
  ]
    .filter(Boolean)
    .map(String);

  if (remetente === undefined || remetente === null) return false;
  return candidates.includes(String(remetente));
};

export default Chat;
