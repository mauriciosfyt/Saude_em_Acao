import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../../Styles/ProfessoresStyles';
import { useTheme } from '../../context/ThemeContext';
import { obterProfessores } from '../../Services/api';

// 1. Importando o novo componente de header
import HeaderProfessores from '../../Components/header_professores/HeaderProfessores'; // Ajuste o caminho se necessário

// Dados de fallback caso a API não retorne dados
const professoresFallback = [
  {
    id: 1,
    nome: 'Carlos Moura',
    foto: require('../../../assets/professoresImg/prof1.jpeg'),
    whatsapp: '',
  },
  {
    id: 2,
    nome: 'Ana Schmidt',
    foto: require('../../../assets/professoresImg/prof2.jpeg'),
    whatsapp: '',
  },
  {
    id: 3,
    nome: 'Ricardo Lima',
    foto: require('../../../assets/professoresImg/prof3.jpeg'),
    whatsapp: '',
  },
  {
    id: 4,
    nome: 'Bruno Alves',
    foto: require('../../../assets/professoresImg/prof4.jpeg'),
    whatsapp: '',
  },
  {
    id: 5,
    nome: 'Juliana Costa',
    foto: require('../../../assets/professoresImg/prof5.jpeg'),
    whatsapp: '',
  },
  {
    id: 6,
    nome: 'Fernando Dias',
    foto: require('../../../assets/professoresImg/prof6.jpeg'),
    whatsapp: '',
  },
];

const Professores = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { isDark, colors } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  
  // Estados para dados e loading
  const [professores, setProfessores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Carregar professores da API
  useEffect(() => {
    let mounted = true;

    const carregarProfessores = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const dados = await obterProfessores();
        
        if (!mounted) return;

        if (Array.isArray(dados) && dados.length > 0) {
          // Mapear resposta da API para o formato esperado pela UI
          const professoresMapeados = dados.map((prof, idx) => {
            // Mapear foto da API ou usar fallback local
            let foto = null;
            if (prof.foto || prof.imagem) {
              // Se a API retornar URL da imagem
              foto = { uri: prof.foto || prof.imagem };
            } else {
              // Usar imagens locais como fallback baseado no índice
              const fotosLocais = [
                require('../../../assets/professoresImg/prof1.jpeg'),
                require('../../../assets/professoresImg/prof2.jpeg'),
                require('../../../assets/professoresImg/prof3.jpeg'),
                require('../../../assets/professoresImg/prof4.jpeg'),
                require('../../../assets/professoresImg/prof5.jpeg'),
                require('../../../assets/professoresImg/prof6.jpeg'),
              ];
              foto = fotosLocais[idx % fotosLocais.length];
            }

            return {
              id: prof.id || idx + 1,
              nome: prof.nome || `Professor ${idx + 1}`,
              foto: foto,
              whatsapp: prof.whatsapp || prof.telefone || prof.contato || '',
            };
          });

          setProfessores(professoresMapeados);
        } else {
          // Se não houver dados da API, usar fallback
          setProfessores(professoresFallback);
        }
      } catch (error) {
        setErro(error.message || 'Erro ao carregar professores');
        // Em caso de erro, usar dados de fallback
        setProfessores(professoresFallback);
      } finally {
        if (mounted) {
          setCarregando(false);
        }
      }
    };

    carregarProfessores();
    
    return () => {
      mounted = false;
    };
  }, []);
  // Função para abrir o WhatsApp
  const openWhatsApp = async (numero) => {
    if (!numero || numero.trim() === '') {
      Alert.alert('Aviso', 'Número de WhatsApp não disponível para este professor.');
      return;
    }

    try {
      // Formatar número: remover espaços, parênteses, hífens e outros caracteres
      // Manter apenas dígitos e o sinal de +
      let numeroFormatado = numero.replace(/[^\d+]/g, '');
      
      // Se não começar com +, assumir que é número brasileiro e adicionar +55
      if (!numeroFormatado.startsWith('+')) {
        // Se começar com 0, remover o 0
        if (numeroFormatado.startsWith('0')) {
          numeroFormatado = numeroFormatado.substring(1);
        }
        // Se começar com 55, adicionar +
        if (numeroFormatado.startsWith('55')) {
          numeroFormatado = '+' + numeroFormatado;
        } else {
          // Assumir número brasileiro sem código do país
          numeroFormatado = '+55' + numeroFormatado;
        }
      }

      // Remover o + para o formato do WhatsApp
      const numeroWhatsApp = numeroFormatado.replace('+', '');
      
      // URLs para diferentes plataformas
      const urlAndroid = `whatsapp://send?phone=${numeroWhatsApp}`;
      const urlIOS = `https://wa.me/${numeroWhatsApp}`;
      const urlWeb = `https://wa.me/${numeroWhatsApp}`;
      
      // Tentar abrir no Android primeiro
      const supported = await Linking.canOpenURL(urlAndroid);
      
      if (supported) {
        await Linking.openURL(urlAndroid);
      } else {
        // Se não funcionar no Android, tentar formato iOS/Web
        const supportedIOS = await Linking.canOpenURL(urlIOS);
        if (supportedIOS) {
          await Linking.openURL(urlIOS);
        } else {
          // Última tentativa: formato web
          await Linking.openURL(urlWeb);
        }
      }
    } catch (error) {
      // tentar formato alternativo em caso de erro
      try {
        const numeroLimpo = numero.replace(/[^\d]/g, '');
        const numeroFinal = numeroLimpo.startsWith('55') ? numeroLimpo : '55' + numeroLimpo;
        const urlAlternativa = `https://wa.me/${numeroFinal}`;
        await Linking.openURL(urlAlternativa);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.');
      }
    }
  };

  // Renderizar loading
  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#4A69BD" />
        <View style={styles.blueShape} />
        <View style={styles.container}>
          <HeaderProfessores
            title="Equipe Saúde em Ação"
            onBackPress={() => navigation.goBack()}
            navigation={navigation}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={{ marginTop: 10, color: isDark ? '#FFF' : '#000' }}>
              Carregando professores...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A69BD" />
      
      <View style={styles.blueShape} />

      <View style={styles.container}>
        
        {/* 2. Usando o novo componente de header */}
        <HeaderProfessores
          title="Equipe Saúde em Ação"
          onBackPress={() => navigation.goBack()}
          navigation={navigation} // <-- VOCÊ PRECISA PASSAR A PROP AQUI
        />

        {/* O código JSX do header e do título que estavam aqui foram movidos para o componente */}

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {erro && (
            <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8, margin: 16 }}>
              <Text style={{ color: '#c62828', textAlign: 'center' }}>
                ⚠️ {erro} (Usando dados locais)
              </Text>
            </View>
          )}
          
          <View style={styles.gridContainer}>
            {professores.length > 0 ? (
              professores.map((prof) => (
                <View key={prof.id} style={styles.card}>
                  <Image source={prof.foto} style={styles.profileImage} />
                  <Text style={styles.professorName}>{prof.nome}</Text>
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={() => openWhatsApp(prof.whatsapp)}>
                    <Image
                      source={require('../../../assets/icons/icone_whats.png')}
                      style={styles.whatsappIcon}
                      tintColor="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>Conversar</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: isDark ? '#FFF' : '#000' }}>
                  Nenhum professor encontrado.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Professores;