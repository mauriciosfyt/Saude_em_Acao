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

// Importando o componente de header
import HeaderProfessores from '../../Components/header_professores/HeaderProfessores';

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

        // Lógica alinhada com o index.jsx (Web)
        // Verifica se é array direto ou se vem dentro de 'content' (paginação Spring Boot, etc)
        const listaBruta = Array.isArray(dados) ? dados : (dados.content || []);

        if (listaBruta.length > 0) {
          const professoresMapeados = listaBruta.map((prof, idx) => {
            
            // Prioriza fotoPerfil (igual web), fallback para avatar ou foto
            let urlFoto = prof.fotoPerfil || prof.avatar || prof.foto || prof.imagem;
            
            // Correção de URL (Http -> Https) se necessário, similar ao fixImageUrl da web
            if (urlFoto && urlFoto.startsWith('http://')) {
              urlFoto = urlFoto.replace('http://', 'https://');
            }

            return {
              id: prof.id || idx,
              // Prioriza nome, fallback para username
              nome: prof.nome || prof.username || `Professor ${idx + 1}`,
              // Se tiver URL, monta objeto uri. Se não, null (tratado no render)
              foto: urlFoto ? { uri: urlFoto } : null,
              // Prioriza telefone (web), fallback para whatsapp/phone
              whatsapp: prof.telefone || prof.whatsapp || prof.phone || prof.contato || '',
            };
          });

          setProfessores(professoresMapeados);
        } else {
          setProfessores([]);
        }
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
        setErro(error.message || 'Erro ao carregar professores');
        setProfessores([]);
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
      // Formatar número: remover caracteres não numéricos
      let numeroFormatado = numero.replace(/[^\d+]/g, '');
      
      // Lógica para garantir DDI +55 se não houver
      if (!numeroFormatado.startsWith('+')) {
        if (numeroFormatado.startsWith('0')) {
          numeroFormatado = numeroFormatado.substring(1);
        }
        if (!numeroFormatado.startsWith('55')) {
           // Assume Brasil se não tiver código de país
          numeroFormatado = '+55' + numeroFormatado;
        } else {
           // Se já começa com 55 mas não tem +, adiciona +
          numeroFormatado = '+' + numeroFormatado;
        }
      }

      const numeroWhatsApp = numeroFormatado.replace('+', '');
      const urlAndroid = `whatsapp://send?phone=${numeroWhatsApp}`;
      const urlIOS = `https://wa.me/${numeroWhatsApp}`;
      
      const supported = await Linking.canOpenURL(urlAndroid);
      
      if (supported) {
        await Linking.openURL(urlAndroid);
      } else {
        await Linking.openURL(urlIOS);
      }
    } catch (error) {
      // Tentativa final genérica
      try {
        const numeroLimpo = numero.replace(/[^\d]/g, '');
        const numeroFinal = numeroLimpo.startsWith('55') ? numeroLimpo : '55' + numeroLimpo;
        await Linking.openURL(`https://wa.me/${numeroFinal}`);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
      }
    }
  };

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
        
        <HeaderProfessores
          title="Equipe Saúde em Ação"
          onBackPress={() => navigation.goBack()}
          navigation={navigation}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {erro && (
            <View style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8, margin: 16 }}>
              <Text style={{ color: '#c62828', textAlign: 'center' }}>
                ⚠️ {erro}
              </Text>
            </View>
          )}
          
          <View style={styles.gridContainer}>
            {professores.length > 0 ? (
              professores.map((prof) => (
                <View key={prof.id} style={styles.card}>
                  <Image 
                    // Se tiver foto da API usa, senão usa um placeholder genérico (prof1 como padrão)
                    source={prof.foto ? prof.foto : require('../../../assets/professoresImg/prof1.jpeg')} 
                    style={styles.profileImage} 
                    resizeMode="cover"
                  />
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
              !erro && (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: isDark ? '#FFF' : '#000' }}>
                    Nenhum professor encontrado.
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Professores;