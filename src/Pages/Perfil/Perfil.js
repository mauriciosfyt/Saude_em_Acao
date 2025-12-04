import React, { useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { setSoundEnabled, playClickSound } from '../../Components/Sounds';
import { useAuth } from '../../context/AuthContext';
import { obterMeuPerfil, obterDesempenhoSemanal, obterHistoricoAnualExercicios } from '../../Services/api';

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
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../../Styles/PerfilStyles';

const Perfil = ({ navigation }) => {
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [som, setSom] = useState(false);
  const [vibracao, setVibracao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { isDark, colors, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const IS_DEV = typeof __DEV__ !== 'undefined' && __DEV__;

  // Estado específico para a foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState(null);

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

  // Dados temporários para edição
  const [dadosEditaveis, setDadosEditaveis] = useState({});

  // Estatísticas (buscar da mesma API de desempenho semanal/historico anual)
  const [stats, setStats] = useState({ treinosCompletos: 0, diasAtivos: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // Carregar dados do perfil quando o componente monta
  // Carregar preferências de som e vibração ao montar
  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const somSalvo = await AsyncStorage.getItem('perfil_som');
        const vibracaoSalva = await AsyncStorage.getItem('perfil_vibracao');
        if (somSalvo !== null) setSom(somSalvo === 'true');
        if (vibracaoSalva !== null) setVibracao(vibracaoSalva === 'true');
      } catch (e) {}
    };
    carregarPreferencias();

    const carregarPerfil = async () => {
      try {
        setCarregando(true);
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

        // Lógica trazida do Web para encontrar a imagem de perfil
        const possibleImage =
            dados.fotoPerfil ||
            dados.foto ||
            dados.imagem ||
            dados.img ||
            dados.imageUrl ||
            dados.avatar ||
            dados.profilePicture ||
            dados.photo ||
            dados.urlFoto ||
            dados.usuario?.foto ||
            dados.user?.foto ||
            dados.user?.avatar ||
            null;

        if (possibleImage) {
            // Se a imagem for um caminho relativo, o componente Image pode precisar do domínio base.
            // Assumindo que o backend retorna a URL ou que o componente Image tratará a URI.
            setFotoPerfil(possibleImage);
        }
        
        
      } catch (error) {
        
        // Mantém os dados mockados em caso de erro
      } finally {
        setCarregando(false);
      }
    };

    carregarPerfil();
    // Buscar também estatísticas agregadas (mesmo GETs usados em Home)
    const carregarEstatisticas = async () => {
      try {
        setLoadingStats(true);
        const resp = await obterDesempenhoSemanal();
        

        let treinos = 0;
        let dias = 0;

        if (Array.isArray(resp)) {
          // Pode ser array de { dia, realizado } ou array de treinos com datas
          if (resp.length > 0 && (resp[0].dia !== undefined || resp[0].realizado !== undefined)) {
            // array de desempenho semanal (realizado)
            resp.forEach(item => {
              if (item.realizado) treinos += 1;
            });
            dias = resp.filter(item => item.realizado).length;
          } else {
            // array de treinos: contar total e dias ativos (datas distintas)
            treinos = resp.length;
            const diasAtivosSet = new Set();
            resp.forEach(t => {
              const dataStr = t.data || t.date || t.dataRealizacao || t.createdAt || t.dataRegistro || t;
              if (!dataStr) return;
              const d = new Date(dataStr);
              if (!isNaN(d)) diasAtivosSet.add(d.toDateString());
            });
            dias = diasAtivosSet.size;
          }
        } else if (resp && typeof resp === 'object') {
          // Pode ser objeto com chaves seg/ter/... ou objeto de estatísticas
          const diasKeys = ['seg','ter','qua','qui','sex'];
          const hasDays = diasKeys.some(k => k in resp);
          if (hasDays) {
            treinos = diasKeys.reduce((acc, k) => acc + (Number(resp[k]) || 0), 0);
            dias = diasKeys.reduce((acc, k) => acc + ((Number(resp[k]) || 0) > 0 ? 1 : 0), 0);
          } else {
            treinos = Number(resp.treinosRealizadosMesAtual) || 0;
            dias = Number(resp.diasAtivosConsecutivos) || 0;
          }
        }

        setStats({ treinosCompletos: treinos, diasAtivos: dias });
        
      } catch (err) {
        
      } finally {
        setLoadingStats(false);
      }
    };

    carregarEstatisticas();
  }, []);

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

  // Persistir preferências ao alterar

  const handleSomChange = async (v) => {
    setSom(v);
    setSoundEnabled(v);
    try {
      await AsyncStorage.setItem('perfil_som', v ? 'true' : 'false');
    } catch (e) {}
    if (v && typeof playClickSound === 'function') {
      playClickSound(); // Toca um som ao ativar
    }
  };

  const handleVibracaoChange = async (v) => {
    setVibracao(v);
    try {
      await AsyncStorage.setItem('perfil_vibracao', v ? 'true' : 'false');
    } catch (e) {}
    if (v) {
      Vibration.vibrate(200); // Vibra por 200ms ao ativar
      if (som && typeof playClickSound === 'function') {
        playClickSound(); // Se som também estiver ativo, toca o som
      }
    }
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
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              setConfigModalVisible(false);
              await logout();
              navigation.navigate('Inicial');
              
            } catch (error) {
              
              Alert.alert('Erro', 'Erro ao sair da conta. Tente novamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
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
            {/* INÍCIO DA ALTERAÇÃO: Renderização Condicional da Foto */}
            <View style={styles.avatar}>
              {fotoPerfil ? (
                <Image 
                  source={{ uri: fotoPerfil }} 
                  style={{ width: '100%', height: '100%', borderRadius: 100 }}
                  resizeMode="cover"
                />
              ) : (
                ActivityIndicator,
                <Ionicons name="person" size={60} color={isDark ? "#FFFFFF" : "#405CBA"} />
              )}
            </View>
            {/* FIM DA ALTERAÇÃO */}
            
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
              {loadingStats ? (
                <ActivityIndicator size="small" color="#405CBA" />
              ) : (
                <Text style={styles.statNumber}>{String(stats.treinosCompletos)}</Text>
              )}
              <Text style={styles.statLabel}>Treinos Completos</Text>
            </View>

            <View style={styles.statCard}>
              {loadingStats ? (
                <ActivityIndicator size="small" color="#405CBA" />
              ) : (
                <Text style={styles.statNumber}>{String(stats.diasAtivos)}</Text>
              )}
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
              {/* Notificações removidas */}





{/* Som */}
<View style={styles.configItem}>
  <View style={styles.configItemLeft}>
    <Ionicons name="volume-high-outline" size={24} color="#4A69BD" />
    <Text style={styles.configItemText}>Som</Text>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Switch
      value={som}
      onValueChange={handleSomChange}
      trackColor={{ false: '#e5e7eb', true: '#4A69BD' }}
      thumbColor={som ? '#ffffff' : '#f3f4f6'}
    />

    {/* (Removido) Botão de teste de som no modal de configurações */}
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
                  onValueChange={handleVibracaoChange}
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

              {/* Privacidade e Sobre removidos */}

              {/* Divisor */}
              <View style={styles.configDivider} />

              {/* Sair da Conta */}
              <TouchableOpacity style={styles.configItem} onPress={handleSairConta}>
                <View style={styles.configItemLeft}>
                  <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                  <Text style={[styles.configItemText, styles.dangerText]}>Sair da Conta</Text>
                </View>
              </TouchableOpacity>

              {/* Excluir Conta removida */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Perfil;