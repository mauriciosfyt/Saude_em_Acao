import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../Styles/MeuTreinoStyle';

const MeuTreino = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Dados dos treinos para cada dia da semana
  const treinos = [
    {
      id: 1,
      dia: 'Segunda-Feira',
      grupos: '• Peito • Tríceps',
      imagem: require('../../../assets/banner_whey.png'),
    },
    {
      id: 2,
      dia: 'Terça-Feira',
      grupos: '• Costas • Bíceps',
      imagem: require('../../../assets/banner_creatina.png'),
    },
    {
      id: 3,
      dia: 'Quarta-Feira',
      grupos: '• Perna completo',
      imagem: require('../../../assets/banner_vitaminas.png'),
    },
    {
      id: 4,
      dia: 'Quinta-Feira',
      grupos: '• Cardio • Ombro',
      imagem: require('../../../assets/banner_roupas.jpg'),
    },
    {
      id: 5,
      dia: 'Sexta-Feira',
      grupos: '• Abdômen • Costas',
      imagem: require('../../../assets/banner_camisas.png'),
    },
  ];

  // Função para obter a data atual formatada
  const getCurrentDate = () => {
    const today = new Date();
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    
    return `${dayName} Feira, ${day} de ${month}`;
  };

  const handleIniciarTreino = (treino) => {
    console.log(`Iniciando treino: ${treino.dia}`);
    // Navegar para a tela de exercícios específica baseada no dia
    if (treino.dia === 'Segunda-Feira') {
      navigation.navigate('TreinoSegunda');
    } else {
      console.log(`Treino para ${treino.dia} ainda não implementado`);
    }
  };

  // Funções de controle do menu
  const handleAbrirMenu = () => {
    setMenuVisivel(true);
  };

  const handleFecharMenu = () => {
    setMenuVisivel(false);
  };

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header Azul */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Meus Treinos</Text>
          
          <TouchableOpacity style={styles.menuButton} onPress={handleAbrirMenu}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Olá Heleno!</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* Lista de Treinos */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {treinos.map((treino) => (
          <View key={treino.id} style={styles.treinoCard}>
            <Image source={treino.imagem} style={styles.treinoImage} />
            
            <View style={styles.treinoInfo}>
              <Text style={styles.treinoDia}>{treino.dia}</Text>
              <Text style={styles.treinoGrupos}>{treino.grupos}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.iniciarButton}
              onPress={() => handleIniciarTreino(treino)}
            >
              <Text style={styles.iniciarButtonText}>Iniciar</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal do Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>

            {/* Itens do Menu */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("MainTabs")}
            >
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Desempenho</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemAtivo]}
              onPress={() => handleNavegar("MeuTreino")}
            >
              <Ionicons name="fitness-outline" size={24} color="#405CBA" />
              <Text style={[styles.menuItemText, styles.menuItemTextAtivo]}>Meus Treinos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Mensalidades")}
            >
              <Ionicons name="card-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Mensalidades</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default MeuTreino;
