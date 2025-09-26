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
  const [treinosConcluidos, setTreinosConcluidos] = useState(new Set());
  const [modalConcluido, setModalConcluido] = useState({ visivel: false, dia: '' });

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
    // Verificar se o treino já foi concluído
    if (treinosConcluidos.has(treino.dia)) {
      setModalConcluido({ visivel: true, dia: treino.dia });
      return;
    }

    console.log('DEBUG: handleIniciarTreino chamado para', treino.dia);
    console.log('DEBUG: navigation object', navigation);
    if (treino.dia === 'Segunda-Feira') {
      console.log('DEBUG: Navegando para TreinoSegunda');
      navigation.navigate('TreinoSegunda', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Terça-Feira') {
      console.log('DEBUG: Navegando para TreinoTerca');
      navigation.navigate('TreinoTerca', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Quarta-Feira') {
      console.log('DEBUG: Navegando para TreinoQuarta');
      navigation.navigate('TreinoQuarta', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Quinta-Feira') {
      console.log('DEBUG: Navegando para TreinoQuinta');
      navigation.navigate('TreinoQuinta', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Sexta-Feira') {
      navigation.navigate('TreinoSexta', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else {
      console.log(`Treino para ${treino.dia} ainda não implementado`);
    }
  };

  // Função para marcar treino como concluído
  const marcarTreinoComoConcluido = (dia) => {
    setTreinosConcluidos(prev => new Set([...prev, dia]));
  };

  // Função para fechar modal de aviso
  const fecharModalConcluido = () => {
    setModalConcluido({ visivel: false, dia: '' });
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
          <Text style={styles.greeting}>Olá Aluno!</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* Lista de Treinos */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {treinos.map((treino) => (
          <View key={treino.id} style={styles.treinoCard}>
            <Image source={treino.imagem} style={styles.treinoImage} />
            
            <View style={styles.treinoInfo}>
              <View style={styles.treinoDiaContainer}>
                <Text style={styles.treinoDia}>{treino.dia}</Text>
              </View>
              <Text style={styles.treinoGrupos}>{treino.grupos}</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.iniciarButton,
                treinosConcluidos.has(treino.dia) && styles.concluidoButton
              ]}
              onPress={() => {
                if (!treinosConcluidos.has(treino.dia)) {
                  console.log('DEBUG: Botão clicado para', treino.dia);
                  handleIniciarTreino(treino);
                }
              }}
              disabled={treinosConcluidos.has(treino.dia)} // Desabilita o botão se concluído
            >
              <Text style={[
                styles.iniciarButtonText,
                treinosConcluidos.has(treino.dia) && styles.concluidoButtonText
              ]}>
                {treinosConcluidos.has(treino.dia) ? 'Concluído' : 'Iniciar'}
              </Text>
              <Ionicons 
                name={treinosConcluidos.has(treino.dia) ? "checkmark-circle" : "arrow-forward"} 
                size={16} 
                color="white" 
              />
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

      {/* Modal de Aviso - Treino Já Concluído */}
      <Modal
        visible={modalConcluido.visivel}
        animationType="fade"
        transparent={true}
        onRequestClose={fecharModalConcluido}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', width: 300 }}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
              Treino Concluído!
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              O treino de {modalConcluido.dia} já foi finalizado hoje.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#405CBA', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, width: '100%' }}
              onPress={fecharModalConcluido}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MeuTreino;
