import React , { useState, useEffect } from 'react';
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
import { useTreinos } from '../../context/TreinosContext';

const MeuTreino = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalConcluido, setModalConcluido] = useState({ visivel: false, dia: '' });
  const { treinosConcluidos, marcarTreinoComoConcluido } = useTreinos();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('DEBUG: Tela MeuTreino ganhou foco');
    });
    return unsubscribe;
  }, [navigation]);

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
    if (treinosConcluidos.has(treino.dia)) {
      setModalConcluido({ visivel: true, dia: treino.dia });
      return;
    }
    if (treino.dia === 'Segunda-Feira') {
      navigation.navigate('TreinoSegunda', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Terça-Feira') {
      navigation.navigate('TreinoTerca', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Quarta-Feira') {
      navigation.navigate('TreinoQuarta', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Quinta-Feira') {
      navigation.navigate('TreinoQuinta', { onTreinoConcluido: marcarTreinoComoConcluido });
    } else if (treino.dia === 'Sexta-Feira') {
      navigation.navigate('TreinoSexta', { onTreinoConcluido: marcarTreinoComoConcluido });
    }
  };

  const fecharModalConcluido = () => {
    setModalConcluido({ visivel: false, dia: '' });
  };

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  return (
    <SafeAreaView style={styles?.container || { flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      {/* Header */}
      <View style={styles?.header || { backgroundColor: '#4A90E2', padding: 16 }}>
        <View style={styles?.headerContent || { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles?.headerTitle || { color: 'white', fontSize: 20, fontWeight: 'bold' }}>Meus Treinos</Text>
          <TouchableOpacity onPress={handleAbrirMenu}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles?.greetingSection || { marginTop: 8 }}>
          <Text style={styles?.greeting || { color: 'white', fontSize: 16 }}>Olá Aluno!</Text>
          <Text style={styles?.date || { color: 'white', fontSize: 14 }}>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* Lista de Treinos */}
      <ScrollView style={styles?.content || { flex: 1, padding: 16 }}>
        {treinos.map((treino) => (
          <View key={treino.id} style={styles?.treinoCard || { backgroundColor: '#eee', borderRadius: 8, marginBottom: 16, padding: 16 }}>
            <Image source={treino.imagem} style={styles?.treinoImage || { width: '100%', height: 120, borderRadius: 8 }} />
            <View style={styles?.treinoInfo || { marginTop: 8 }}>
              <Text style={styles?.treinoDia || { fontSize: 18, fontWeight: 'bold' }}>{treino.dia}</Text>
              <Text style={styles?.treinoGrupos || { fontSize: 16 }}>{treino.grupos}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles?.iniciarButton || { backgroundColor: '#405CBA', borderRadius: 8, padding: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
                treinosConcluidos.has(treino.dia) && (styles?.concluidoButton || { backgroundColor: '#4CAF50' })
              ]}
              onPress={() => !treinosConcluidos.has(treino.dia) && handleIniciarTreino(treino)}
              disabled={treinosConcluidos.has(treino.dia)}
            >
              <Text style={[
                styles?.iniciarButtonText || { color: 'white', fontWeight: 'bold', marginRight: 8 },
                treinosConcluidos.has(treino.dia) && (styles?.concluidoButtonText || { color: '#fff' })
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
          style={styles?.menuOverlay || { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={styles?.menuContent || { backgroundColor: 'white', borderRadius: 16, padding: 24, margin: 32 }}>
            <Text style={styles?.menuTitle || { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Menu</Text>
            <TouchableOpacity style={styles?.menuItem || { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={() => handleNavegar("MainTabs")}>
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={styles?.menuItemText || { marginLeft: 8 }}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles?.menuItem || { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={() => handleNavegar("Perfil")}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles?.menuItemText || { marginLeft: 8 }}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles?.menuItem || { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={() => handleNavegar("Chat")}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
              <Text style={styles?.menuItemText || { marginLeft: 8 }}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles?.menuItem || { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={() => handleNavegar("Desempenho")}>
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles?.menuItemText || { marginLeft: 8 }}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles?.menuItem || { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }, styles?.menuItemAtivo || {}]} onPress={() => handleNavegar("MeuTreino")}>
              <Ionicons name="fitness-outline" size={24} color="#405CBA" />
              <Text style={[styles?.menuItemText || { marginLeft: 8 }, styles?.menuItemTextAtivo || { color: '#405CBA', fontWeight: 'bold' }]}>Meus Treinos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles?.menuItem || { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={() => handleNavegar("Mensalidades")}>
              <Ionicons name="card-outline" size={24} color="#333" />
              <Text style={styles?.menuItemText || { marginLeft: 8 }}>Mensalidades</Text>
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
