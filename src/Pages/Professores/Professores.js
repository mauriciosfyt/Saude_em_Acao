import React from 'react';
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
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../Styles/ProfessoresStyles';
import { useThemePreference } from '../../context/ThemeContext';

// 1. Importando o novo componente de header
import HeaderProfessores from '../../Components/header_professores/HeaderProfessores'; // Ajuste o caminho se necessário

// Seus dados de professores
const professores = [
  {
    id: 1,
    nome: 'Carlos Moura',
    foto: require('../../../assets/professoresImg/prof1.jpeg'),
    whatsapp: '', // Lembre-se de adicionar os números de telefone aqui
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
  const { isDark: forcedDark } = useThemePreference();
  const isDark = forcedDark === undefined ? colorScheme === 'dark' : forcedDark;
  // Sua função para abrir o WhatsApp
  const openWhatsApp = (numero) => {
    const url = `whatsapp://send?phone=${numero}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Erro', 'O WhatsApp não está instalado no seu dispositivo.');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Ocorreu um erro ao abrir o WhatsApp', err));
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: '#2B2B2B' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#2B2B2B' : '#FFFFFF'} />
      
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
          <View style={styles.gridContainer}>
            {professores.map((prof) => (
              <View key={prof.id} style={[styles.card, isDark && { backgroundColor: '#2B2B2B' }]}>
                <Image source={prof.foto} style={styles.profileImage} />
                <Text style={[styles.professorName, isDark && { color: '#FFFFFF' }]}>{prof.nome}</Text>
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() => openWhatsApp(prof.whatsapp)}>
                  <Image
                    source={require('../../../assets/icons/icone_whats.png')}
                    style={styles.whatsappIcon}
                  />
                  <Text style={styles.buttonText}>Conversar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Professores;