import { scheduleNotification } from '../../Components/Notifications';
import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { playSuccessSound, TestSoundButton, setSoundEnabled } from '../../Components/Sounds';
import { useAuth } from '../../context/AuthContext';
import { deleteAdminAccount, obterMeuPerfil, API_BASE_URL } from '../../Services/api';
import * as FileSystem from 'expo-file-system';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../../Styles/PerfilStyles';

const Perfil = ({ navigation }) => {
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [notificacoes, setNotificacoes] = useState(false);
  const [som, setSom] = useState(false);
  const [vibracao, setVibracao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { isDark, colors, toggleTheme } = useTheme();
  const { user, logout, loading: authLoading } = useAuth();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  // Dados do usuário
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    email: '',
    idade: 0,
    peso: 0,
    altura: 0,
    objetivo: '',
    nivelAtividade: 'Iniciante',
  });

  // URL da foto do perfil (pode ser null)
  const [fotoUrl, setFotoUrl] = useState(null);
  const [localImageUri, setLocalImageUri] = useState(null);
  const [triedProtectedDownload, setTriedProtectedDownload] = useState(false);

  // Dados temporários para edição
  const [dadosEditaveis, setDadosEditaveis] = useState({});

  // Carregar dados do perfil quando o componente monta
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setCarregando(true);
        // Garante que temos um token (AuthContext configura o axios)
        if (!user || !user.token) {
          console.warn('Perfil: sem usuário/tokem no contexto — pulando requisição');
          setCarregando(false);
          return;
        }

        const dados = await obterMeuPerfil();
        
        // Mapeando os dados da API para o estado local
        setDadosUsuario({
          nome: dados.nome || 'Usuário',
          email: dados.email || '',
          idade: dados.idade || 0,
          peso: dados.peso || 0,
          altura: dados.altura || 0,
          objetivo: dados.objetivo || '',
          nivelAtividade: dados.nivelAtividade || 'Iniciante',
        });

        // Normaliza a URL da foto quando disponível (prioriza `fotoPerfil`)
        const possiblePhoto =
          dados.fotoPerfil || dados.foto || dados.avatar || dados.img || dados.imageUrl || dados.urlFoto || dados.imagem || null;

        const normalizePhoto = (p) => {
          if (!p) return null;
          if (p.startsWith('data:')) return p;
          // preserve http/https for now
          if (p.startsWith('http')) return p;
          if (p.startsWith('/')) return API_BASE_URL + p;
          return API_BASE_URL + '/' + p;
        };
        let normalized = normalizePhoto(possiblePhoto);

        console.log('Perfil: campo de foto cru ->', possiblePhoto);
        console.log('Perfil: foto normalizada (antes)->', normalized);

        // Forçar https quando possível (Cloudinary normalmente suporta https)
        if (normalized && normalized.startsWith('http:')) {
          normalized = normalized.replace(/^http:/, 'https:');
          console.log('Perfil: foto normalizada (forçada https)->', normalized);
        }

        setFotoUrl(normalized);
        
        console.log('✅ Dados do perfil carregados com sucesso:', dados);
      } catch (error) {
        console.error('❌ Erro ao carregar perfil:', error);
        // Se a API respondeu 401, limpamos sessão e direcionamos para login
        if (error?.response?.status === 401) {
          console.warn('Perfil: não autorizado (401). Efetuando logout local.');
          try {
            await logout();
            navigation.navigate('Inicial');
          } catch (e) {
            console.error('Erro ao fazer logout após 401:', e);
          }
        }
        // Mantém os dados mockados em caso de erro
      } finally {
        setCarregando(false);
      }
    };

    // Só carregar quando a checagem de autenticação terminar
    if (!authLoading) {
      carregarPerfil();
    }
  }, [authLoading]);

const handleVoltar = () => {
  navigation.navigate('Home');
};


  const handleEditarPerfil = () => {
    // Copia os dados atuais para edição
    setDadosEditaveis({ ...dadosUsuario });
    setEditModalVisible(true);
  };

  const handleSalvarPerfil = () => {
    // Validação básica
    if (!dadosEditaveis.nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    if (!dadosEditaveis.email.trim()) {
      Alert.alert('Erro', 'O email é obrigatório');
      return;
    }

    if (dadosEditaveis.idade < 1 || dadosEditaveis.idade > 120) {
      Alert.alert('Erro', 'A idade deve estar entre 1 e 120 anos');
      return;
    }

    if (dadosEditaveis.peso < 20 || dadosEditaveis.peso > 300) {
      Alert.alert('Erro', 'O peso deve estar entre 20 e 300 kg');
      return;
    }

    if (dadosEditaveis.altura < 100 || dadosEditaveis.altura > 250) {
      Alert.alert('Erro', 'A altura deve estar entre 100 e 250 cm');
      return;
    }

    // Atualiza os dados do usuário
    setDadosUsuario(dadosEditaveis);
    setEditModalVisible(false);

    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleCancelarEdicao = () => {
    setEditModalVisible(false);
    setDadosEditaveis({});
  };

  const handleConfiguracoes = () => {
    setConfigModalVisible(true);
  };

  const handleFecharConfig = () => {
    setConfigModalVisible(false);
  };

  const handleSairConta = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Logout cancelado'),
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              setConfigModalVisible(false);
              await logout();
                  const dados = await obterMeuPerfil();
                  console.log('Refresh: dados completos do perfil ->', dados);
              console.log('✅ Logout realizado com sucesso');
            } catch (error) {
              console.error('❌ Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao sair da conta. Tente novamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação é irreversível.',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Exclusão cancelada'),
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              if (!user || !user.email) {
                Alert.alert('Erro', 'Informações de usuário não encontradas');
                return;
              }

              // Extrai o ID do email ou usa outro identificador disponível
              // Se você tiver um user ID armazenado no context, use-o
              const adminId = user.email; // ou user.id se tiver

              await deleteAdminAccount(adminId);
              
              Alert.alert(
                'Sucesso',
                'Sua conta foi excluída com sucesso.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      setConfigModalVisible(false);
                      await logout();
                      navigation.navigate('Inicial');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert(
                'Erro',
                error.message || 'Erro ao excluir a conta. Tente novamente.'
              );
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handlePrivacidade = () => {
    // Lógica para configurações de privacidade
    console.log('Configurações de privacidade');
  };

  const handleSobre = () => {
    // Lógica para informações sobre o app
    console.log('Sobre o app');
  };

  const renderEditField = (label, value, key, placeholder, keyboardType = 'default') => (
    <View style={styles.editFieldContainer}>
      <Text style={styles.editFieldLabel}>{label}</Text>
      <TextInput
        style={styles.editFieldInput}
        value={dadosEditaveis[key]?.toString() || ''}
        onChangeText={(text) => setDadosEditaveis({
          ...dadosEditaveis,
          [key]: keyboardType === 'numeric' ? parseInt(text) || 0 : text
        })}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );

  const renderEditFieldSelect = (label, value, key, options) => (
    <View style={styles.editFieldContainer}>
      <Text style={styles.editFieldLabel}>{label}</Text>
      <View style={styles.selectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.selectOption,
              dadosEditaveis[key] === option && styles.selectOptionSelected
            ]}
            onPress={() => setDadosEditaveis({
              ...dadosEditaveis,
              [key]: option
            })}
          >
            <Text style={[
              styles.selectOptionText,
              dadosEditaveis[key] === option && styles.selectOptionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A69BD" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleConfiguracoes}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {carregando ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 }}>
            <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 16 }}>
              Carregando perfil...
            </Text>
          </View>
        ) : (
          <>
            {/* Foto e Informações Básicas */}
            <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {fotoUrl ? (
                  <Image
                    source={{ uri: localImageUri || fotoUrl }}
                    style={styles.avatarImage}
                    onError={async (e) => {
                      console.warn('Imagem do perfil falhou ao carregar:', e.nativeEvent?.error || e);

                      // Se ainda não tentamos baixar com o token, tentamos baixar para cache
                      if (!triedProtectedDownload && user?.token && fotoUrl) {
                        setTriedProtectedDownload(true);
                        try {
                          const fileName = `profile_${(user.email || 'me').replace(/[^a-z0-9]/gi, '_')}.jpg`;
                          const dest = FileSystem.cacheDirectory + fileName;
                          console.log('Tentando baixar imagem protegida para', dest);
                          const downloadRes = await FileSystem.downloadAsync(fotoUrl, dest, {
                            headers: { Authorization: `Bearer ${user.token}` },
                          });
                          console.log('Download concluído:', downloadRes.uri);
                          setLocalImageUri(downloadRes.uri);
                        } catch (err) {
                          console.error('Erro ao baixar imagem protegida:', err);
                        }
                      }
                    }}
                  />
                ) : (
                  <Ionicons name="person" size={60} color={isDark ? "#FFFFFF" : "#405CBA"} />
                )}
              </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{dadosUsuario.nome}</Text>
          <Text style={styles.userEmail}>{dadosUsuario.email}</Text>

          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditarPerfil}>
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Informações Detalhadas */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="calendar-outline" size={20} color={isDark ? "#FFFFFF" : "#405CBA"} />
              <Text style={styles.profileInfoLabel}>Idade</Text>
            </View>
            <Text style={styles.profileInfoValue}>{dadosUsuario.idade} anos</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="scale-outline" size={20} color={isDark ? "#FFFFFF" : "#405CBA"} />
              <Text style={styles.profileInfoLabel}>Peso</Text>
            </View>
            <Text style={styles.profileInfoValue}>{dadosUsuario.peso} kg</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="resize-outline" size={20} color={isDark ? "#FFFFFF" : "#405CBA"} />
              <Text style={styles.profileInfoLabel}>Altura</Text>
            </View>
            <Text style={styles.profileInfoValue}>{dadosUsuario.altura} cm</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="flag-outline" size={20} color={isDark ? "#FFFFFF" : "#405CBA"} />
              <Text style={styles.profileInfoLabel}>Objetivo</Text>
            </View>
            <Text style={styles.profileInfoValue}>{dadosUsuario.objetivo}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="fitness-outline" size={20} color={isDark ? "#FFFFFF" : "#405CBA"} />
              <Text style={styles.profileInfoLabel}>Nível de Atividade</Text>
            </View>
            <Text style={styles.profileInfoValue}>{dadosUsuario.nivelAtividade}</Text>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>-</Text>
              <Text style={styles.statLabel}>Treinos Completos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>-</Text>
              <Text style={styles.statLabel}>Dias Ativos</Text>
            </View>
          </View>
        </View>
            </>
        )}
      </ScrollView>

      {/* Modal de Edição de Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={handleCancelarEdicao}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header do Modal de Edição */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={handleCancelarEdicao}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Modal de Edição */}
            <ScrollView style={styles.editContent}>
              {renderEditField('Nome', dadosEditaveis.nome, 'nome', 'Digite seu nome')}
              {renderEditField('Email', dadosEditaveis.email, 'email', 'Digite seu email')}
              {renderEditField('Idade', dadosEditaveis.idade, 'idade', 'Digite sua idade', 'numeric')}
              {renderEditField('Peso (kg)', dadosEditaveis.peso, 'peso', 'Digite seu peso', 'numeric')}
              {renderEditField('Altura (cm)', dadosEditaveis.altura, 'altura', 'Digite sua altura', 'numeric')}
              {renderEditField('Objetivo', dadosEditaveis.objetivo, 'objetivo', 'Digite seu objetivo')}

              {renderEditFieldSelect(
                'Nível de Atividade',
                dadosEditaveis.nivelAtividade,
                'nivelAtividade',
                ['Iniciante', 'Intermediário', 'Avançado']
              )}

              {/* Botões de Ação */}
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelarEdicao}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSalvarPerfil}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Configurações */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={configModalVisible}
        onRequestClose={handleFecharConfig}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurações</Text>
              <TouchableOpacity onPress={handleFecharConfig}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Lista de Configurações */}
            <ScrollView style={styles.configList}>
              {/* Notificações */}
              <View style={styles.configItem}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="notifications-outline" size={24} color="#4A69BD" />
                  <Text style={styles.configItemText}>Notificações</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    value={notificacoes}
                    onValueChange={async (value) => {
                      setNotificacoes(value);

                      // Solicita permissão e registra token quando ativar notificações
                      if (value) {
                        try {
                          await registerForPushNotificationsAsync();
                        } catch (error) {
                          console.log('Erro ao registrar notificações:', error);
                        }
                      }
                    }}
                    trackColor={{ false: '#e5e7eb', true: '#4A69BD' }}
                    thumbColor={notificacoes ? '#ffffff' : '#f3f4f6'}
                  />

                  {/* 🔹 Botão de teste só aparece no modo DEV e quando o switch estiver ativo */}
                  {__DEV__ && notificacoes && (
                    <TouchableOpacity
                      style={{
                        marginLeft: 10,
                        padding: 6,
                        backgroundColor: '#dbeafe',
                        borderRadius: 6,
                      }}
                      onPress={async () => {
                        try {
                          await scheduleNotification();
                        } catch (error) {
                          console.log('Erro ao disparar notificação:', error);
                        }
                      }}
                    >
                      <Ionicons name="notifications" size={22} color="#4A69BD" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>





{/* Som */}
<View style={styles.configItem}>
  <View style={styles.configItemLeft}>
    <Ionicons name="volume-high-outline" size={24} color="#4A69BD" />
    <Text style={styles.configItemText}>Som</Text>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Switch
      value={som}
      onValueChange={(v) => { setSom(v); setSoundEnabled(v); }}
      trackColor={{ false: '#e5e7eb', true: '#4A69BD' }}
      thumbColor={som ? '#ffffff' : '#f3f4f6'}
    />

    {/* Botão de teste (DEV) */}
    {__DEV__ && som && (
      <TestSoundButton soundFunction={playSuccessSound} label="Testar Som" />
    )}
  </View>
</View>


              {/* Vibração */}
              <View style={styles.configItem}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="phone-portrait-outline" size={24} color="#4A69BD" />
                  <Text style={styles.configItemText}>Vibração</Text>
                </View>
                <Switch
                  value={vibracao}
                  onValueChange={setVibracao}
                  trackColor={{ false: '#e5e7eb', true: '#4A69BD' }}
                  thumbColor={vibracao ? '#ffffff' : '#f3f4f6'}
                />
              </View>

              {/* Modo Escuro */}
              <View style={styles.configItem}>
                <View style={styles.configItemLeft}>
                  <Ionicons name={isDark ? 'moon' : 'moon-outline'} size={24} color="#4A69BD" />
                  <Text style={styles.configItemText}>Modo Escuro</Text>
                </View>
                <Switch
                  value={!!isDark}
                  onValueChange={(v) => toggleTheme()}
                  trackColor={{ false: '#e5e7eb', true: '#4A69BD' }}
                  thumbColor={isDark ? '#ffffff' : '#f3f4f6'}
                />
              </View>

              {/* Privacidade */}
              <TouchableOpacity style={styles.configItem} onPress={handlePrivacidade}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="shield-outline" size={24} color="#4A69BD" />
                  <Text style={styles.configItemText}>Privacidade</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              {/* Sobre */}
              <TouchableOpacity style={styles.configItem} onPress={handleSobre}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="information-circle-outline" size={24} color="#4A69BD" />
                  <Text style={styles.configItemText}>Sobre</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              {/* Divisor */}
              <View style={styles.configDivider} />

              {/* Sair da Conta */}
              <TouchableOpacity style={styles.configItem} onPress={handleSairConta}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                  <Text style={[styles.configItemText, styles.dangerText]}>Sair da Conta</Text>
                </View>
              </TouchableOpacity>

              {/* Excluir Conta */}
              <TouchableOpacity style={styles.configItem} onPress={handleExcluirConta}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="trash-outline" size={24} color="#ef4444" />
                  <Text style={[styles.configItemText, styles.dangerText]}>Excluir Conta</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Perfil;