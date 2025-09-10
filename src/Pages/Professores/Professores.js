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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../Styles/ProfessoresStyles';

// Seus dados de professores (sem alterações)
const professores = [
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.blueShape} />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/icons/logo_dia.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={{width: 40}} />
        </View>

        <Text style={styles.pageTitle}>Equipe Saúde em Ação</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.gridContainer}>
            {professores.map((prof) => (
              <View key={prof.id} style={styles.card}>
                <Image source={prof.foto} style={styles.profileImage} />
                <Text style={styles.professorName}>{prof.nome}</Text>
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

